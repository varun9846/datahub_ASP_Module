import logger from "../logger.js";
import { cfg } from "../config.js";
import { getToken, getSessions } from "../ASPHelper/Apis.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function testASPConnection() {
  const token = await getToken();

  if (!token) {
    throw new Error("ASP connection failed: token was not returned");
  }

  logger.info("ASP connection healthy");

  return true;
}

export function getSessionsFromResponse(resp) {
  return resp?.data?.session ?? [];
}

export function getTotalCountFromResponse(resp) {
  const count = Number(resp?.count);
  return Number.isFinite(count) ? count : null;
}

/**
 * This supports two modes:
 *
 * 1. updated:
 *    Best production mode if ASP supports:
 *    sessionUpdatedDateTimeStart / sessionUpdatedDateTimeEnd
 *
 * 2. start_stop:
 *    Compatible with your existing code.
 *    Fetches sessions by start window and stop window.
 */
export async function fetchASPPage({
  from,
  to,
  page,
  limit,
  type = "updated",
  scope = "all",
}) {
  let params;

  if (type === "updated") {
    params = {
      page,
      limit,
      sessionUpdatedDateTimeStart: from,
      sessionUpdatedDateTimeEnd: to,
    };
  } else if (type === "start") {
    params = {
      page,
      limit,
      sessionStartDateTimeStart: from,
      sessionStartDateTimeEnd: to,
    };
  } else if (type === "stop") {
    params = {
      page,
      limit,
      sessionStopDateTimeStart: from,
      sessionStopDateTimeEnd: to,
    };
  } else {
    throw new Error(`Unsupported ASP fetch type: ${type}`);
  }

  const resp = await getSessions(params, scope);

  if (!resp) {
    throw new Error(`ASP returned empty response for type=${type}, page=${page}`);
  }

  return resp;
}

/**
 * Page-by-page processor.
 *
 * Important:
 * This DOES NOT collect all records into memory.
 * It fetches one page, sends it to caller, then forgets it.
 *
 * This is the ASP equivalent of MySQL streaming from sync-vlan-sms.js.
 */
export async function processASPWindowByPages({
  from,
  to,
  type,
  scope = "all",
  pageLimit = cfg.ASP_SYNC_PAGE_LIMIT,
  maxPages = cfg.ASP_SYNC_MAX_PAGES,
  pageDelayMs = cfg.ASP_SYNC_PAGE_DELAY_MS,
  onPage,
}) {
  let page = 0;
  let totalFetched = 0;
  let totalCount = null;
  let totalPages = null;

  while (true) {
    if (page > maxPages) {
      throw new Error(
        `ASP pagination safety limit reached. type=${type}, page=${page}, maxPages=${maxPages}`
      );
    }

    const resp = await fetchASPPage({
      from,
      to,
      page,
      limit: pageLimit,
      type,
      scope,
    });

    const rows = getSessionsFromResponse(resp);

    if (totalCount === null) {
      totalCount = getTotalCountFromResponse(resp);

      if (totalCount !== null) {
        totalPages = Math.ceil(totalCount / pageLimit);

        logger.info("ASP pagination plan", {
          type,
          totalCount,
          totalPages,
          pageLimit,
          from,
          to,
        });

        if (totalCount === 0) {
          break;
        }
      } else {
        logger.warn("ASP response missing numeric count; using fallback stop logic", {
          type,
          page,
          count: resp?.count,
        });
      }
    }

    if (!rows.length) {
      logger.info("ASP pagination stopped: empty page", {
        type,
        page,
        totalFetched,
      });
      break;
    }

    totalFetched += rows.length;

    await onPage({
      rows,
      page,
      type,
      totalFetched,
      totalCount,
      totalPages,
    });

    if (totalPages !== null) {
      if (page >= totalPages - 1) {
        break;
      }
    } else if (rows.length < pageLimit) {
      break;
    }

    page += 1;

    if (pageDelayMs > 0) {
      await sleep(pageDelayMs);
    }
  }

  return {
    type,
    totalFetched,
    totalCount,
    totalPages,
  };
}