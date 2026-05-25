import express from "express";
import logger from "../logger.js";
import { runVlanIncrementalSync } from "../services/vlanSync.service.js";

const router = express.Router();

/**
 * POST /api/vlan-sync
 *
 * Runs incremental ASP -> PostgreSQL sync.
 */
router.post("/", async (req, res) => {
  try {
    const result = await runVlanIncrementalSync();

    res.json(result);
  } catch (error) {
    logger.error("VLAN sync route failed", {
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

export default router;