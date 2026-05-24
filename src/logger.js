import fs from "fs";
import path from "path";
import winston from "winston";
import { cfg } from "./config.js";

const logDir = cfg.LOG_PATH;
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Use JSON format with timestamp and pretty printing for console
const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // include stack traces for errors
  winston.format.splat(), // for printf-style
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `[${timestamp}] ${level}: ${message} ${metaString}`;
  })
);

const logger = winston.createLogger({
  level: cfg.LOG_LEVEL,
  format: jsonFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      level: cfg.IS_PROD ? "warn" : "info", // minimal logs in production
      maxsize: 50 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.Console({
      format: consoleFormat,
      silent: cfg.IS_PROD, // optionally hide console in production
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, "exceptions.log") }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, "rejections.log") }),
  ],
});

export default logger;
