import express from "express";
import { getWindow10MinBack1Day } from "../utils/utils.js";
import { pullAndStoreSessions } from "../services/session.service.js";
import { pullAndStoreSessionsRangePaged } from "../services/sessionRangePaged.service.js";
import logger from "../logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const window = getWindow10MinBack1Day();
    const baseParams = { page: 0, limit: 10000 };

    const result = await pullAndStoreSessions(window, baseParams);

    // logger.success(`Session Pull for range from ${window.from} to ${window.to} Success Total records stored ${result.stored} and merged ${result.merged}`);
    logger.info(
      "Session pull succeeded",
      {
        window,
        result
      }
    );

    res.json({
      status: "ok",
      window,
      ...result,
    });

  } catch (err) {
    logger.error("Session pull failed:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

/**
 * POST /sessions/range
 * Body example:
 * {
 *   "from": "2026-01-19 00:00:00",
 *   "to":   "2026-01-20 00:00:00",
 *   "chunkMinutes": 60,
 *   "windowDelayMs": 500,
 *   "pageDelayMs": 200,
 *   "maxPages": 2000
 * }
 */
router.post("/range", async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        status: "error",
        message: "from and to are required in format YYYY-MM-DD HH:mm:ss (UTC)",
      });
    }

    const chunkMinutes = Number(req.body?.chunkMinutes ?? 60);
    const windowDelayMs = Number(req.body?.windowDelayMs ?? 500);
    const pageDelayMs = Number(req.body?.pageDelayMs ?? 200);
    const maxPages = Number(req.body?.maxPages ?? 2000);

    // keep your existing API defaults
    const baseParams = { page: 0, limit: 10000 };

    const window = { from, to };

    // logger.info("Custom range request received", {
    //   window,
    //   chunkMinutes,
    //   windowDelayMs,
    //   pageDelayMs,
    //   maxPages,
    //   limit: baseParams.limit,
    // });

    const summary = await pullAndStoreSessionsRangePaged({
      window,
      baseParams,
      chunkMinutes,
      windowDelayMs,
      pageDelayMs,
      maxPages,
      scope: "all",
      // Optional: enable stable sorting only if you are sure API supports it well
      // sort: "sessionId",
      // order: "asc",
    });

    res.json({ status: "ok", window, summary });
  } catch (err) {
    logger.error("Custom range pull failed", { error: err.message, stack: err.stack });
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
