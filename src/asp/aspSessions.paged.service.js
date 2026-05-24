import logger from "../logger.js";
import { getSessions } from "../ASPHelper/Apis.js";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function safeSessionArray(resp) {
  return resp?.data?.session ?? [];
}

function safeResultCode(resp) {
  return resp?.resultCode;
}

function safeResult(resp) {
  return resp?.result;
}

function safeTotalCount(resp) {
  const n = Number(resp?.count);
  return Number.isFinite(n) ? n : null;
}

/**
 * Fetch ALL pages for a single query (start/stop/updated window).
 * Notes:
 * - Your ASP paging is 0-based (page starts from 0).
 * - Uses resp.count (total matched records) to compute total pages when available.
 * - Falls back to items.length < limit if count is missing/unreliable.
 * - maxPages is only a safety guard.
 */
export async function fetchAllPages(paramsBase, scope, opts = {}) {
  const limit = Number(paramsBase.limit ?? 10000);
  const pageDelayMs = Number(opts.pageDelayMs ?? 200);
  const maxPages = Number(opts.maxPages ?? 2000);
  const logCtx = opts.logCtx ?? {};

  let page = 0; // 0-based
  let total = 0;
  const all = [];

  let totalCount = null; // from ASP "count"
  let totalPages = null; // computed from count
  let stopReason = null;

  while (true) {
    if (page > maxPages) {
      stopReason = "maxPages_reached";
      logger.warn("ASP pagination stopped (safety)", {
        ...logCtx,
        stopReason,
        page,
        maxPages,
        runningTotal: total,
        totalCount,
        totalPages,
      });
      break;
    }

    const params = { ...paramsBase, page, limit };

    // logger.debug("ASP page fetch started", { ...logCtx, page, limit });

    const resp = await getSessions(params, scope);
    const items = safeSessionArray(resp);

    // Establish plan from first response if count is total
    if (totalCount === null) {
      totalCount = safeTotalCount(resp);

      if (totalCount !== null) {
        totalPages = Math.ceil(totalCount / limit);

        // logger.info("ASP pagination plan", {
        //   ...logCtx,
        //   totalCount,
        //   totalPages,
        //   limit,
        // });

        // Explicit log for "no data" based on count
        if (totalCount === 0) {
          // stopReason = "count_zero_no_data";
          // logger.info("ASP pagination stopped (no data by count)", {
          //   ...logCtx,
          //   stopReason,
          //   page,
          //   totalCount,
          //   totalPages,
          // });
          break;
        }
      } else {
        logger.warn("ASP response missing numeric count; using fallback stop", {
          ...logCtx,
          page,
          count: resp?.count,
        });
      }
    }

    all.push(...items);
    total += items.length;

    // logger.info("ASP page fetch completed", {
    //   ...logCtx,
    //   page,
    //   received: items.length,
    //   runningTotal: total,
    //   resultCode: safeResultCode(resp),
    //   result: safeResult(resp),
    //   totalCount,
    //   totalPages,
    // });

    // Explicit stop logs when items are empty
    if (items.length === 0) {
      // stopReason = "items_zero_no_more_data";
      // logger.info("ASP pagination stopped (empty page)", {
      //   ...logCtx,
      //   stopReason,
      //   page,
      //   received: 0,
      //   runningTotal: total,
      //   totalCount,
      //   totalPages,
      // });
      break;
    }

    // Stop conditions:
    // 1) If totalPages known (0-based): last page index is totalPages-1
    // 2) Else fallback: last page is short (< limit)
    if (totalPages !== null) {
      if (page >= (totalPages - 1)) {
        // stopReason = "reached_last_page_by_count";
        // logger.info("ASP pagination stopped (last page by count)", {
        //   ...logCtx,
        //   stopReason,
        //   page,
        //   totalPages,
        //   runningTotal: total,
        //   totalCount,
        // });
        break;
      }
    } else {
      if (items.length < limit) {
        // stopReason = "last_page_short_by_length";
        // logger.info("ASP pagination stopped (last page by length)", {
        //   ...logCtx,
        //   stopReason,
        //   page,
        //   received: items.length,
        //   limit,
        //   runningTotal: total,
        // });
        break;
      }
    }

    page += 1;

    if (pageDelayMs > 0) {
      // logger.debug("ASP pagination delay", { ...logCtx, pageDelayMs, nextPage: page });
      await sleep(pageDelayMs);
    }
  }

  // logger.info("ASP pagination completed", {
  //   ...logCtx,
  //   stopReason,
  //   pagesFetched: page + 1, // inclusive pages count since 0-based
  //   totalReturned: total,
  //   totalCount,
  //   totalPages,
  // });

  return all;
}

/**
 * Fetch sessions for a window using pagination:
 * - start sessions (sessionStartDateTimeStart/End)
 * - end sessions (sessionStopDateTimeStart/End)
 */
export async function fetchSessionsByWindowPaged({
  window,
  baseParams,
  scope = "all",
  pageDelayMs = 200,
  maxPages = 2000,
}) {
  const common = { ...baseParams };

  const startParams = {
    ...common,
    sessionStartDateTimeStart: window.from,
    sessionStartDateTimeEnd: window.to,
  };

  const stopParams = {
    ...common,
    sessionStopDateTimeStart: window.from,
    sessionStopDateTimeEnd: window.to,
  };

  const logBase = { scope, window };

  const [startArr, endArr] = await Promise.all([
    fetchAllPages(startParams, scope, {
      pageDelayMs,
      maxPages,
      logCtx: { ...logBase, type: "start" },
    }),
    fetchAllPages(stopParams, scope, {
      pageDelayMs,
      maxPages,
      logCtx: { ...logBase, type: "stop" },
    }),
  ]);

  return { startArr, endArr };
}
