import express from "express"
import cors from "cors";
import helmet from "helmet";
import logger from "./logger.js";
import sessionRoutes from "./routes/sessions.route.js"
import { cfg } from "./config.js";
import vlanSyncRoutes from "./routes/vlanSync.route.js";

const app = express()

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
// Log requests
app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  // 1) log immediately when request arrives
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
  });

  // 2) log when response finishes
  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    if (cfg.IS_PROD) {
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, { durationMs });
    } else {
      logger.info("Request completed", {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs,
        body: req.body,
      });
    }
  });

  next();
});

// // if (cfg.IS_PROD) {
// //   app.use('/api', (req, res, next) => {
// //     const apiKey = req.header('x-api-key');
// //     const ua = req.headers['user-agent'] || '';
// //     const allowedIps = ['111.22.33.44'];

// //     const isBrowser = /(Mozilla|Chrome|Safari|Firefox)/i.test(ua);
// //     const clientIp = req.ip.replace('::ffff:', '');

// //     if (!apiKey || apiKey !== process.env.API_KEY) return res.status(403).json({ error: 'Forbidden' });
// //     if (isBrowser) return res.status(403).json({ error: 'Forbidden' });
// //     if (!allowedIps.includes(clientIp)) return res.status(403).json({ error: 'Forbidden' });

// //     next();
// //   });
// // }


app.use("/api/sessions", sessionRoutes)
app.use("/api/vlan-sync", vlanSyncRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Log errors globally
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { error: err, url: req.url, method: req.method });
  res.status(500).json({ error: "Internal server error" });
});


// --- Startup logs ---
async function logStartupInfo() {
  try {
    logger.info("====================================================");
    logger.info("Server Startup Information");
    logger.info("====================================================");
    logger.info(`Environment      : ${cfg.IS_PROD ? "Production" : "Development"}`);
    logger.info(`Log Level        : ${cfg.LOG_LEVEL}`);
    logger.info(`Log Directory    : ${cfg.LOG_PATH}`);
    logger.info(`Server Port      : ${cfg.PORT}`);
    // logger.info(`Cron Schedule    : ${cfg.CRON_SCHEDULE}`);
    logger.info(`Database URL     : ${cfg.DATABASE_URL.replace(/\/\/.*@/, "//****:****@")}`); // hide creds
    logger.info("====================================================");
  } catch (err) {
    logger.error("Error while logging server info on startup", { error: err });
  }
}

await logStartupInfo();

export default app
