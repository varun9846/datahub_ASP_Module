import express from "express";
import logger from "../logger.js";
import { runSQSmsSync } from "../services/sqSmsSync.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const summary = await runSQSmsSync();

    res.json({
      status: "ok",
      summary,
    });
  } catch (err) {
    const statusCode = err.statusCode || 500;

    logger.error("SQ SMS sync API failed", {
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
