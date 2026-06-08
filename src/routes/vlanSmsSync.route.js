import express from "express";
import logger from "../logger.js";
import { runVlanSmsSync } from "../services/vlanSmsSync.service.js";

const router = express.Router();

/**
 * POST /api/vlan-sms-sync
 *
 * Syncs Send Quick MySQL vlan + sent_SMS data into PostgreSQL vlan_sms.
 */
router.post("/", async (req, res) => {
  try {
    const summary = await runVlanSmsSync();

    res.json({
      status: "ok",
      summary,
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;

    logger.error("SQ VLAN SMS sync API failed", {
      statusCode,
      error: err.message,
      stack: err.stack,
      summary: err.summary,
    });

    res.status(statusCode).json({
      status: "error",
      message: err.message,
      summary: err.summary,
    });
  }
});

export default router;