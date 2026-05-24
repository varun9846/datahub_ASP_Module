import pool from "../db/pgPool.js";
import { fetchSessionsByWindow } from "../asp/aspSessions.service.js";
import { mergeSessions } from "../utils/sessionMerger.js";
import { upsertSessions } from "../db/session.repository.js";

export async function pullAndStoreSessions(dateTimeRange, baseParams) {
  const client = await pool.connect();

  try {
    const { startResp, endResp, startArr, endArr } =
      await fetchSessionsByWindow(dateTimeRange, baseParams);

    const merged = mergeSessions(startArr, endArr);

    await client.query("BEGIN");
    const stored = await upsertSessions(client, merged);
    await client.query("COMMIT");

    return {
      // startResp,
      // endResp,
      fetched: { start: startArr.length, end: endArr.length },
      merged: merged.length,
      stored,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
