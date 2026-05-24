import logger from "../logger.js";
import pool from "../db/pgPool.js";
import { upsertSessions } from "../db/session.repository.js";
import { mergeSessions } from "../utils/sessionMerger.js";
import { fetchSessionsByWindowPaged } from "../asp/aspSessions.paged.service.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Parse "YYYY-MM-DD HH:mm:ss" as UTC
function toMs(dateStr) {
  const iso = dateStr.replace(" ", "T") + "Z";
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) throw new Error(`Invalid datetime: ${dateStr}`);
  return ms;
}

function msToWindowStr(ms) {
  const d = new Date(ms);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function buildChunks(window, chunkMinutes) {
  const startMs = toMs(window.from);
  const endMs = toMs(window.to);

  if (endMs <= startMs) throw new Error("to must be greater than from");

  const stepMs = chunkMinutes * 60 * 1000;
  const chunks = [];

  let cur = startMs;
  while (cur < endMs) {
    const next = Math.min(cur + stepMs, endMs);
    chunks.push({ from: msToWindowStr(cur), to: msToWindowStr(next) });
    cur = next;
  }

  return chunks;
}

/**
 * Custom range pull with:
 * - chunking (default 60 minutes)
 * - per-window pagination (page=1..N, limit=10000)
 * - delay between pages and between windows
 */
export async function pullAndStoreSessionsRangePaged({
  window,
  baseParams = { page: 0, limit: 10000 }, // page ignored in paged fetch, but keep for compatibility
  chunkMinutes = 60,
  windowDelayMs = 500,
  pageDelayMs = 200,
  maxPages = 2000,
  scope = "all",
  // sort, // optional, only if you want stable ordering
  // order, // optional
}) {
  const chunks = buildChunks(window, chunkMinutes);

  const summary = {
    totalWindows: chunks.length,
    completedWindows: 0,
    totalFetchedStart: 0,
    totalFetchedEnd: 0,
    totalMerged: 0,
    totalStored: 0,
    windows: [],
  };

  logger.info("Session range paged pull started", {
    window,
    chunkMinutes,
    windowDelayMs,
    pageDelayMs,
    maxPages,
    limit: baseParams.limit,
    totalWindows: chunks.length,
    scope,
  });

  for (let i = 0; i < chunks.length; i++) {
    const w = chunks[i];
    const index = i + 1;

    logger.info("Range window started", { index, total: chunks.length, window: w });

    const t0 = Date.now();

    // 1) Fetch paginated from ASP
    const { startArr, endArr } = await fetchSessionsByWindowPaged({
      window: w,
      baseParams: { ...baseParams, limit: baseParams.limit ?? 10000 },
      scope,
      pageDelayMs,
      maxPages,
    });

    // 2) Merge start+stop
    const merged = mergeSessions(startArr, endArr);

    // logger.info("Range window merged", {
    //   index,
    //   window: w,
    //   startCount: startArr.length,
    //   endCount: endArr.length,
    //   merged: merged.length,
    // });

    // 3) Upsert into DB (single transaction per window)
    const client = await pool.connect();
    let stored = 0;

    try {
      await client.query("BEGIN");
      stored = await upsertSessions(client, merged);
      await client.query("COMMIT");
    } catch (err) {
      try {
        await client.query("ROLLBACK");
      } catch (_) {}
      logger.error("Range window DB transaction failed", {
        index,
        window: w,
        error: err.message,
        stack: err.stack,
      });
      throw err;
    } finally {
      client.release();
    }

    const durationMs = Date.now() - t0;

    summary.completedWindows += 1;
    summary.totalFetchedStart += startArr.length;
    summary.totalFetchedEnd += endArr.length;
    summary.totalMerged += merged.length;
    summary.totalStored += stored;

    summary.windows.push({
      index,
      window: w,
      fetched: { start: startArr.length, end: endArr.length },
      merged: merged.length,
      stored,
      durationMs,
    });

    // logger.info("Range window completed", {
    //   index,
    //   total: chunks.length,
    //   window: w,
    //   stored,
    //   merged: merged.length,
    //   durationMs,
    // });

    // Delay between windows
    if (i < chunks.length - 1 && windowDelayMs > 0) {
      // logger.debug("Delaying before next window", { windowDelayMs });
      await sleep(windowDelayMs);
    }
  }

  logger.info("Session range paged pull finished", { window, summary });

  return summary;
}
