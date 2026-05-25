This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
Dockerfile
ecosystem.config.cjs
package.json
scripts/call_sessions_api.sh
scripts/call_vlan_sync_api.sh
scripts/setup-vlan-sync.sql
src/app.js
src/asp/aspSessions.paged.service.js
src/asp/aspSessions.service.js
src/ASPHelper/Apis.js
src/config.js
src/db/pgPool.js
src/db/session.repository.js
src/db/vlanSync.repository.js
src/logger.js
src/routes/sessions.route.js
src/routes/vlanSync.route.js
src/server.js
src/services/session.service.js
src/services/sessionRangePaged.service.js
src/services/vlanSync.service.js
src/SQHelper/aspVlanSync.helper.js
src/utils/sessionMerger.js
src/utils/sessionNormalizer.js
src/utils/utils.js
src/utils/vlanSync.mapper.js
src/utils/vlanSync.schemaDrift.js
```

# Files

## File: scripts/call_vlan_sync_api.sh
```bash
#!/bin/bash

URL="http://localhost:3010/api/vlan-sync"
LOG_FILE="/var/log/datahub_api/curl_vlan_sync.log"

curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"
```

## File: Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9091

CMD ["npm", "start"]
```

## File: ecosystem.config.cjs
```javascript
module.exports = {
  apps: [
    {
      name: "datahub_api",

      script: "npm",
      args: "run start",

      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      watch: false,
      max_memory_restart: "1G",

      error_file: "/var/log/datahub_api/pm2/err.log",
      out_file: "/var/log/datahub_api/pm2/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};
```

## File: package.json
```json
{
  "name": "datahub_api",
  "version": "1.0.0",
  "description": "Server 2 API service for incremental data fetching and storage using Timescaledb, Express, and secure logging.",
  "main": "src/server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "lint": "eslint ."
  },
  "dependencies": {
    "@prisma/client": "^6.16.3",
    "axios": "^1.7.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.19.2",
    "helmet": "^7.1.0",
    "node-cron": "^3.0.3",
    "winston": "^3.11.0",
    "zod": "^3.23.8",
    "moment": "^2.29.4",
    "moment-duration-format": "^2.3.2",
    "moment-timezone": "^0.6.0",
    "pg": "^8.11.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "eslint": "^9.13.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-node": "^11.1.0"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "keywords": [
    "express",
    "api",
    "data-fetcher",
    "nodejs",
    "logging",
    "security",
    "zod"
  ],
  "author": "Salman Channa",
  "license": "MIT"
}
```

## File: scripts/call_sessions_api.sh
```bash
#!/bin/bash

URL="http://localhost:3010/api/sessions"
LOG_FILE="/var/log/datahub_api/curl_sessions.log"

curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"


crontab -e
*/10 * * * * /data/scripts/call_sessions_api.sh
```

## File: scripts/setup-vlan-sync.sql
```sql
---POSTGRESQL SETUP SCRIPT FOR VLAN SESSION SYNC TABLE
DROP TABLE IF EXISTS vlan_session_sync;

CREATE TABLE vlan_session_sync (
    id BIGSERIAL PRIMARY KEY,

    site_token TEXT,

    session_id TEXT NOT NULL,
    local_id TEXT,
    nas_ip_address TEXT,

    vlan TEXT,

    duration INTEGER,
    download_bytes BIGINT,
    upload_bytes BIGINT,

    mac_address TEXT,
    ip_address TEXT,

    device TEXT,
    browser TEXT,
    os TEXT,

    terminate_cause TEXT,

    session_start TIMESTAMPTZ NOT NULL,
    session_stop TIMESTAMPTZ,
    session_updated TIMESTAMPTZ,

    raw_payload JSONB,

    synced_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT uq_vlan_session_sync UNIQUE (session_id, session_start)
);

CREATE INDEX idx_vlan_session_sync_session_updated
ON vlan_session_sync(session_updated);

CREATE INDEX idx_vlan_session_sync_session_start
ON vlan_session_sync(session_start);

CREATE INDEX idx_vlan_session_sync_session_stop
ON vlan_session_sync(session_stop);

CREATE INDEX idx_vlan_session_sync_vlan
ON vlan_session_sync(vlan);

CREATE INDEX idx_vlan_session_sync_synced_at
ON vlan_session_sync(synced_at);
```

## File: src/app.js
```javascript
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
```

## File: src/asp/aspSessions.paged.service.js
```javascript
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
```

## File: src/asp/aspSessions.service.js
```javascript
import { getSessions } from "../ASPHelper/Apis.js";

export function extractSessions(resp) {
  return resp?.data?.session ?? [];
}

export async function fetchSessionsByWindow(dateTimeRange, baseParams) {
  const startParams = {
    ...baseParams,
    sessionStartDateTimeStart: dateTimeRange.from,
    sessionStartDateTimeEnd: dateTimeRange.to,
  };

  const endParams = {
    ...baseParams,
    sessionStopDateTimeStart: dateTimeRange.from,
    sessionStopDateTimeEnd: dateTimeRange.to,
  };

  const [startResp, endResp] = await Promise.all([
    getSessions(startParams, "all"),
    getSessions(endParams, "all"),
  ]);

  return {
    startResp,
    endResp,
    startArr: extractSessions(startResp),
    endArr: extractSessions(endResp),
  };
}
```

## File: src/ASPHelper/Apis.js
```javascript
import axios from "axios";
import { cfg } from "../config.js";
import https from "https";

const insecureHttpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const ASP_URL = cfg.ASP_API_BASE_URL;

export async function getToken() {
  try {
    const res = await axios.post(
      `${ASP_URL}/auth/token`,
      null,
      {
        httpsAgent: insecureHttpsAgent,
        params: {
          orgId: cfg.ASP_API_ORGID,
          userId: cfg.ASP_API_USERNAME,
          password: cfg.ASP_API_PASSWORD
        }
      }
    );

    return res.data?.token ?? null;

  } catch (error) {
    console.error("Failed to create ASP token", error?.cause || error);
    return null;
  }
}

export async function getSessions(params, siteToken = "all") {
  try {
    const tokenValue = await getToken();
    if (!tokenValue) return null;

    const res = await axios.get(
      `${ASP_URL}/sites/${siteToken}/sessions`,
      {
        httpsAgent: insecureHttpsAgent,
        params,
        headers: {
          Authorization: tokenValue,
          "Content-Type": "application/json;charset=utf-8"
        }
      }
    );

    return res.data;

  } catch (error) {
    console.error("Failed to get data", error?.cause || error);
    return null;
  }
}
```

## File: src/config.js
```javascript
import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  ASP_API_BASE_URL: z.string(),
  ASP_API_USERNAME: z.string(),
  ASP_API_PASSWORD: z.string(),
  ASP_API_ORGID: z.string(),
  LOG_LEVEL: z.string().default("info"),
  LOG_PATH: z.string().default(path.join(process.cwd(), "logs")),
  IS_PROD: z.boolean().default(false),

  /**
   * ASP sync settings
   */
  ASP_SYNC_MODE: z.enum(["updated", "start_stop"]).default("start_stop"),

  ASP_SYNC_BATCH_SIZE: z.coerce.number().default(5000),
  ASP_SYNC_PAGE_LIMIT: z.coerce.number().default(5000),
  ASP_SYNC_MAX_PAGES: z.coerce.number().default(2000),
  ASP_SYNC_PAGE_DELAY_MS: z.coerce.number().default(200),

  /**
   * Used only when target table is empty.
   */
  ASP_SYNC_START_DATE: z.string().default("2024-01-01 00:00:00"),

  /**
   * Small overlap protects against boundary issues.
   * Example:
   * Last sync = 10:00:00
   * Next sync starts from 09:55:00
   * Duplicates are safely ignored/upserted.
   */
  ASP_SYNC_OVERLAP_MINUTES: z.coerce.number().default(5),
});

const env = {
  ...process.env,
  IS_PROD: (process.env.IS_PROD == "true")
}
const cfg = schema.parse(env);
export {cfg};
```

## File: src/db/pgPool.js
```javascript
import pg from "pg";
import { cfg } from "../config.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: cfg.DATABASE_URL,
});

export default pool;
```

## File: src/db/session.repository.js
```javascript
const UPSERT_SQL = `
WITH data AS (
  SELECT *
  FROM jsonb_to_recordset($1::jsonb) AS d(
    site_token text,
    session_id text,
    local_id text,
    nas_ip_address text,
    vlan text,
    duration int,
    download_bytes text,
    upload_bytes text,
    mac_address text,
    ip_address text,
    device text,
    browser text,
    os text,
    terminate_cause text,
    session_start timestamptz,
    session_stop timestamptz,
    session_updated timestamptz
  )
),
updated AS (
  UPDATE session s
  SET
    duration        = d.duration,
    download_bytes  = NULLIF(d.download_bytes, '')::bigint,
    upload_bytes    = NULLIF(d.upload_bytes, '')::bigint,
    terminate_cause = d.terminate_cause,
    session_stop    = d.session_stop
  FROM data d
  WHERE s.session_id = d.session_id
    AND s.session_start = d.session_start
  RETURNING s.session_id
)
INSERT INTO session (
  site_token,
  session_id,
  local_id,
  nas_ip_address,
  vlan,
  duration,
  download_bytes,
  upload_bytes,
  mac_address,
  ip_address,
  device,
  browser,
  os,
  terminate_cause,
  session_start,
  session_stop,
  session_updated
)
SELECT
  d.site_token,
  d.session_id,
  d.local_id,
  d.nas_ip_address,
  d.vlan,
  d.duration,
  NULLIF(d.download_bytes, '')::bigint,
  NULLIF(d.upload_bytes, '')::bigint,
  d.mac_address,
  d.ip_address,
  d.device,
  d.browser,
  d.os,
  d.terminate_cause,
  d.session_start,
  d.session_stop,
  d.session_updated
FROM data d
WHERE NOT EXISTS (
  SELECT 1 FROM session s
  WHERE s.session_id = d.session_id
    AND s.session_start = d.session_start

);
`;

export async function upsertSessions(client, sessions) {
  if (!sessions?.length) return 0;
  await client.query(UPSERT_SQL, [JSON.stringify(sessions)]);
  return sessions.length;
}
```

## File: src/db/vlanSync.repository.js
```javascript
import pool from "./pgPool.js";
import logger from "../logger.js";
import { cfg } from "../config.js";

export async function testPGConnection() {
  await pool.query("SELECT 1 AS ok");
  logger.info("PostgreSQL connection healthy");
  return true;
}

export async function checkTargetTableSchema() {
  const result = await pool.query(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'vlan_session_sync'
    `
  );

  const actual = new Set(result.rows.map((row) => row.column_name));

  const required = [
    "session_id",
    "session_start",
    "session_updated",
    "vlan",
    "synced_at",
  ];

  const missing = required.filter((column) => !actual.has(column));

  if (missing.length > 0) {
    throw new Error(
      `PostgreSQL schema check failed. Missing columns in vlan_session_sync: ${missing.join(
        ", "
      )}`
    );
  }

  logger.info("PostgreSQL schema check passed", {
    table: "vlan_session_sync",
  });
}

function subtractOverlap(date, overlapMinutes) {
  const d = new Date(date);
  d.setUTCMinutes(d.getUTCMinutes() - overlapMinutes);
  return d;
}

function formatForASP(date) {
  const d = new Date(date);

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

/**
 * High-water mark.
 *
 * In updated mode:
 *   Uses max(session_updated)
 *
 * In start_stop mode:
 *   Uses max(synced_at) as operational progress marker,
 *   then applies overlap to avoid missed sessions.
 */
export async function getHighWaterMark() {
  const column =
    cfg.ASP_SYNC_MODE === "updated" ? "session_updated" : "synced_at";

  const result = await pool.query(`
    SELECT MAX(${column}) AS last_sync
    FROM vlan_session_sync
  `);

  const lastSync = result.rows[0]?.last_sync;

  const rawFrom = lastSync || cfg.ASP_SYNC_START_DATE;

  const fromWithOverlap = subtractOverlap(
    rawFrom,
    cfg.ASP_SYNC_OVERLAP_MINUTES
  );

  const from = formatForASP(fromWithOverlap);
  const to = formatForASP(new Date());

  logger.info("High-water mark determined", {
    syncMode: cfg.ASP_SYNC_MODE,
    column,
    lastSync,
    from,
    to,
    overlapMinutes: cfg.ASP_SYNC_OVERLAP_MINUTES,
  });

  return {
    lastSync,
    from,
    to,
  };
}

export async function upsertVlanSessionBatch(client, batch) {
  if (!batch.length) return 0;

  const columnsPerRow = 18;
  const values = [];
  const placeholders = [];

  batch.forEach((row, index) => {
    const offset = index * columnsPerRow;

    placeholders.push(`
      (
        $${offset + 1},
        $${offset + 2},
        $${offset + 3},
        $${offset + 4},
        $${offset + 5},
        $${offset + 6},
        NULLIF($${offset + 7}, '')::BIGINT,
        NULLIF($${offset + 8}, '')::BIGINT,
        $${offset + 9},
        $${offset + 10},
        $${offset + 11},
        $${offset + 12},
        $${offset + 13},
        $${offset + 14},
        $${offset + 15},
        $${offset + 16},
        $${offset + 17},
        $${offset + 18}::jsonb
      )
    `);

    values.push(
      row.site_token ?? null,
      row.session_id,
      row.local_id ?? null,
      row.nas_ip_address ?? null,

      row.vlan ?? null,

      row.duration ?? null,
      row.download_bytes ?? null,
      row.upload_bytes ?? null,

      row.mac_address ?? null,
      row.ip_address ?? null,

      row.device ?? null,
      row.browser ?? null,
      row.os ?? null,

      row.terminate_cause ?? null,

      row.session_start,
      row.session_stop,
      row.session_updated,

      JSON.stringify(row.raw_payload ?? {})
    );
  });

  const sql = `
    INSERT INTO vlan_session_sync (
      site_token,
      session_id,
      local_id,
      nas_ip_address,
      vlan,
      duration,
      download_bytes,
      upload_bytes,
      mac_address,
      ip_address,
      device,
      browser,
      os,
      terminate_cause,
      session_start,
      session_stop,
      session_updated,
      raw_payload
    )
    VALUES ${placeholders.join(",")}
    ON CONFLICT (session_id, session_start)
    DO UPDATE SET
      site_token       = EXCLUDED.site_token,
      local_id         = EXCLUDED.local_id,
      nas_ip_address   = EXCLUDED.nas_ip_address,
      vlan             = EXCLUDED.vlan,
      duration         = EXCLUDED.duration,
      download_bytes   = EXCLUDED.download_bytes,
      upload_bytes     = EXCLUDED.upload_bytes,
      mac_address      = EXCLUDED.mac_address,
      ip_address       = EXCLUDED.ip_address,
      device           = EXCLUDED.device,
      browser          = EXCLUDED.browser,
      os               = EXCLUDED.os,
      terminate_cause  = EXCLUDED.terminate_cause,
      session_stop     = EXCLUDED.session_stop,
      session_updated  = EXCLUDED.session_updated,
      raw_payload      = EXCLUDED.raw_payload,
      synced_at        = NOW()
  `;

  const result = await client.query(sql, values);

  return result.rowCount || 0;
}

export async function insertBatchInTransaction(batch, batchNumber) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const affected = await upsertVlanSessionBatch(client, batch);

    await client.query("COMMIT");

    return affected;
  } catch (error) {
    await client.query("ROLLBACK");

    logger.error("Batch insert failed", {
      batchNumber,
      batchSize: batch.length,
      error: error.message,
      stack: error.stack,
    });

    throw error;
  } finally {
    client.release();
  }
}
```

## File: src/logger.js
```javascript
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
```

## File: src/routes/sessions.route.js
```javascript
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
```

## File: src/routes/vlanSync.route.js
```javascript
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
```

## File: src/server.js
```javascript
import { cfg } from "./config.js";
import app from "./app.js";
import logger from "./logger.js";

app.listen(cfg.PORT, () => {
  logger.info(`Datahub API running on port ${cfg.PORT}`);
}).on('error', (err) => {
  logger.error('Failed to start server', err);
});
```

## File: src/services/session.service.js
```javascript
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
```

## File: src/services/sessionRangePaged.service.js
```javascript
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
```

## File: src/services/vlanSync.service.js
```javascript
import logger from "../logger.js";
import { cfg } from "../config.js";

import {
  testASPConnection,
  processASPWindowByPages,
} from "../SQHelper/aspVlanSync.helper.js";

import {
  testPGConnection,
  checkTargetTableSchema,
  getHighWaterMark,
  insertBatchInTransaction,
} from "../db/vlanSync.repository.js";

import { normalizeASPSessions } from "../utils/vlanSync.mapper.js";
import { checkASPSchemaDrift } from "../utils/vlanSync.schemaDrift.js";

function chunkArray(items, size) {
  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

function uniqueBySessionKey(rows) {
  const map = new Map();

  for (const row of rows) {
    const key = `${row.session_id}::${new Date(row.session_start).toISOString()}`;

    map.set(key, row);
  }

  return Array.from(map.values());
}

async function processRowsPage({
  rows,
  type,
  page,
  metrics,
}) {
  if (!rows.length) return;

  if (!metrics.schemaChecked) {
    checkASPSchemaDrift(rows[0]);
    metrics.schemaChecked = true;
  }

  metrics.fetched += rows.length;

  const { normalized, skipped } = normalizeASPSessions(rows);

  metrics.skippedInvalid += skipped;

  const uniqueRows = uniqueBySessionKey(normalized);

  metrics.duplicatesInsidePage += normalized.length - uniqueRows.length;

  const batches = chunkArray(uniqueRows, cfg.ASP_SYNC_BATCH_SIZE);

  for (const batch of batches) {
    metrics.batchNumber += 1;

    const affected = await insertBatchInTransaction(
      batch,
      metrics.batchNumber
    );

    metrics.insertedOrUpdated += affected;

    if (metrics.batchNumber === 1 || metrics.batchNumber % 5 === 0) {
      logger.info("ASP sync batch completed", {
        type,
        page,
        batchNumber: metrics.batchNumber,
        batchSize: batch.length,
        affected,
        fetched: metrics.fetched,
        insertedOrUpdated: metrics.insertedOrUpdated,
      });
    }
  }
}

/**
 * Production sync.
 *
 * Key behavior:
 * - tests ASP and PG connections first
 * - checks PG schema
 * - determines high-water mark
 * - fetches ASP page-by-page
 * - never stores all pages in memory
 * - inserts using batch transactions
 * - uses ON CONFLICT for idempotency
 * - logs clear success/failure metrics
 */
export async function runVlanIncrementalSync() {
  const startedAt = Date.now();

  const metrics = {
    fetched: 0,
    insertedOrUpdated: 0,
    skippedInvalid: 0,
    duplicatesInsidePage: 0,
    batchNumber: 0,
    schemaChecked: false,
    windowsProcessed: [],
  };

  try {
    logger.info("Starting ASP VLAN incremental sync", {
      syncMode: cfg.ASP_SYNC_MODE,
      batchSize: cfg.ASP_SYNC_BATCH_SIZE,
      pageLimit: cfg.ASP_SYNC_PAGE_LIMIT,
      pageDelayMs: cfg.ASP_SYNC_PAGE_DELAY_MS,
      maxPages: cfg.ASP_SYNC_MAX_PAGES,
    });

    await testASPConnection();
    await testPGConnection();
    await checkTargetTableSchema();

    const { from, to, lastSync } = await getHighWaterMark();

    if (cfg.ASP_SYNC_MODE === "updated") {
      const summary = await processASPWindowByPages({
        from,
        to,
        type: "updated",
        onPage: async ({ rows, page, type }) => {
          await processRowsPage({
            rows,
            type,
            page,
            metrics,
          });
        },
      });

      metrics.windowsProcessed.push(summary);
    } else {
      /**
       * Fallback mode:
       * Fetch sessions created in window and sessions stopped in window.
       *
       * This is compatible with your current ASP code, which already uses
       * sessionStartDateTimeStart/End and sessionStopDateTimeStart/End.
       */
      const startSummary = await processASPWindowByPages({
        from,
        to,
        type: "start",
        onPage: async ({ rows, page, type }) => {
          await processRowsPage({
            rows,
            type,
            page,
            metrics,
          });
        },
      });

      const stopSummary = await processASPWindowByPages({
        from,
        to,
        type: "stop",
        onPage: async ({ rows, page, type }) => {
          await processRowsPage({
            rows,
            type,
            page,
            metrics,
          });
        },
      });

      metrics.windowsProcessed.push(startSummary, stopSummary);
    }

    const durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));

    const result = {
      status: "success",
      syncMode: cfg.ASP_SYNC_MODE,
      lastSync,
      from,
      to,
      fetched: metrics.fetched,
      insertedOrUpdated: metrics.insertedOrUpdated,
      skippedInvalid: metrics.skippedInvalid,
      duplicatesInsidePage: metrics.duplicatesInsidePage,
      batchesProcessed: metrics.batchNumber,
      windowsProcessed: metrics.windowsProcessed,
      durationSeconds,
    };

    logger.info("ASP VLAN SYNC COMPLETED SUCCESSFULLY", result);

    return result;
  } catch (error) {
    const durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));

    logger.error("ASP VLAN SYNC FAILED", {
      error: error.message,
      stack: error.stack,
      fetched: metrics.fetched,
      insertedOrUpdated: metrics.insertedOrUpdated,
      skippedInvalid: metrics.skippedInvalid,
      duplicatesInsidePage: metrics.duplicatesInsidePage,
      batchesProcessed: metrics.batchNumber,
      durationSeconds,
      note: "Next run will resume using high-water mark plus overlap. Already committed batches remain safe.",
    });

    throw error;
  }
}
```

## File: src/SQHelper/aspVlanSync.helper.js
```javascript
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
```

## File: src/utils/sessionMerger.js
```javascript
import { normalizeSession } from "./sessionNormalizer.js";

function mergeTwo(a, b) {
  const out = { ...a };

  if (b.session_stop) out.session_stop = b.session_stop;

  if (!out.session_updated && b.session_updated) {
    out.session_updated = b.session_updated;
  } else if (out.session_updated && b.session_updated) {
    if (new Date(b.session_updated) > new Date(out.session_updated)) {
      out.session_updated = b.session_updated;
    }
  }

  for (const k of Object.keys(out)) {
    if ((out[k] === null || out[k] === "") && b[k] != null) {
      out[k] = b[k];
    }
  }

  return out;
}

export function mergeSessions(startArr = [], endArr = []) {
  const map = new Map();

  for (const s of startArr) {
    const row = normalizeSession(s);
    if (!row.session_id) continue;
    map.set(row.session_id, row);
  }

  for (const s of endArr) {
    const row = normalizeSession(s);
    if (!row.session_id) continue;

    const existing = map.get(row.session_id);
    map.set(row.session_id, existing ? mergeTwo(existing, row) : row);
  }

  return [...map.values()];
}
```

## File: src/utils/sessionNormalizer.js
```javascript
function epochToISO(ts) {
  if (ts === null || ts === undefined) return null;
  const n = Number(ts);
  if (!Number.isFinite(n)) return null;
  return new Date(n * 1000).toISOString();
}

export function normalizeSession(s) {
  return {
    site_token: s.siteToken ?? null,
    session_id: s.sessionId ?? null,
    local_id: s.localId ?? null,
    nas_ip_address: s.nasIpAddress ?? null,
    vlan: s.vlan ?? null,
    duration: Number.isFinite(Number(s.duration)) ? Number(s.duration) : null,
    download_bytes: s.download ?? null,
    upload_bytes: s.upload ?? null,
    mac_address: s.macAddress ?? null,
    ip_address: s.ipAddress ?? null,
    device: s.device ?? null,
    browser: s.browser ?? null,
    os: s.os ?? null,
    terminate_cause: s.terminateCause ?? null,
    session_updated: epochToISO(s.sessionUpdatedDatetime?.timestamp),
    session_start: epochToISO(s.sessionStartDatetime?.timestamp),
    session_stop: epochToISO(s.sessionStopDatetime?.timestamp),
  };
}
```

## File: src/utils/utils.js
```javascript
import moment from "moment";

function getWindow10MinBack1Day(nowUtc = moment.utc()) {
  const shifted = nowUtc.clone().subtract(1, "day"); // 24hrs old so that ASP can sync with vsg's (False sync control)
  const from = shifted.clone().subtract(10, "minutes");
  const toExclusive = shifted.clone();

  return {
    from: from.format("YYYY-MM-DD HH:mm:ss"),
    to: toExclusive.format("YYYY-MM-DD HH:mm:ss"), // exclusive
  };
}

export {getWindow10MinBack1Day};
```

## File: src/utils/vlanSync.mapper.js
```javascript
function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function toIntegerOrNull(value) {
  if (value === undefined || value === null || value === "") return null;

  const num = Number(value);

  return Number.isFinite(num) ? Math.trunc(num) : null;
}

function toBigIntTextOrNull(value) {
  if (value === undefined || value === null || value === "") return null;

  return String(value);
}

function toDateOrNull(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export function normalizeASPSession(row) {
  const sessionId = firstDefined(
    row.session_id,
    row.sessionId,
    row.id,
    row.sessionID
  );

  const sessionStart = firstDefined(
    row.session_start,
    row.sessionStart,
    row.sessionStartDateTime,
    row.startTime
  );

  const sessionStop = firstDefined(
    row.session_stop,
    row.sessionStop,
    row.sessionStopDateTime,
    row.stopTime
  );

  const sessionUpdated = firstDefined(
    row.session_updated,
    row.sessionUpdated,
    row.sessionUpdatedDateTime,
    row.updatedAt,
    row.updateTime,
    sessionStop,
    sessionStart
  );

  if (!sessionId || !sessionStart) {
    return null;
  }

  return {
    site_token: firstDefined(row.site_token, row.siteToken, row.site),
    session_id: String(sessionId),
    local_id: firstDefined(row.local_id, row.localId),
    nas_ip_address: firstDefined(row.nas_ip_address, row.nasIpAddress),

    vlan: firstDefined(row.vlan, row.vlan_id, row.vlanId),

    duration: toIntegerOrNull(firstDefined(row.duration, row.sessionDuration)),

    download_bytes: toBigIntTextOrNull(
      firstDefined(row.download_bytes, row.downloadBytes, row.download)
    ),

    upload_bytes: toBigIntTextOrNull(
      firstDefined(row.upload_bytes, row.uploadBytes, row.upload)
    ),

    mac_address: firstDefined(row.mac_address, row.macAddress, row.mac),
    ip_address: firstDefined(row.ip_address, row.ipAddress, row.ip),

    device: firstDefined(row.device),
    browser: firstDefined(row.browser),
    os: firstDefined(row.os),

    terminate_cause: firstDefined(
      row.terminate_cause,
      row.terminateCause,
      row.stopReason
    ),

    session_start: toDateOrNull(sessionStart),
    session_stop: toDateOrNull(sessionStop),
    session_updated: toDateOrNull(sessionUpdated),

    raw_payload: row,
  };
}

export function normalizeASPSessions(rows) {
  const normalized = [];
  let skipped = 0;

  for (const row of rows) {
    const item = normalizeASPSession(row);

    if (!item) {
      skipped += 1;
      continue;
    }

    normalized.push(item);
  }

  return {
    normalized,
    skipped,
  };
}
```

## File: src/utils/vlanSync.schemaDrift.js
```javascript
import logger from "../logger.js";

const EXPECTED_ASP_FIELDS = new Set([
  "site_token",
  "siteToken",
  "site",

  "session_id",
  "sessionId",
  "sessionID",
  "id",

  "local_id",
  "localId",

  "nas_ip_address",
  "nasIpAddress",

  "vlan",
  "vlan_id",
  "vlanId",

  "duration",
  "sessionDuration",

  "download_bytes",
  "downloadBytes",
  "download",

  "upload_bytes",
  "uploadBytes",
  "upload",

  "mac_address",
  "macAddress",
  "mac",

  "ip_address",
  "ipAddress",
  "ip",

  "device",
  "browser",
  "os",

  "terminate_cause",
  "terminateCause",
  "stopReason",

  "session_start",
  "sessionStart",
  "sessionStartDateTime",
  "startTime",

  "session_stop",
  "sessionStop",
  "sessionStopDateTime",
  "stopTime",

  "session_updated",
  "sessionUpdated",
  "sessionUpdatedDateTime",
  "updatedAt",
  "updateTime",
]);

export function checkASPSchemaDrift(sampleRow) {
  if (!sampleRow || typeof sampleRow !== "object") return;

  const receivedFields = Object.keys(sampleRow);

  const newFields = receivedFields.filter(
    (field) => !EXPECTED_ASP_FIELDS.has(field)
  );

  if (newFields.length > 0) {
    logger.warn("ASP SCHEMA DRIFT DETECTED", {
      newFields,
      action:
        "Review whether these fields should be added to vlan_session_sync or mapper.",
    });
  } else {
    logger.info("ASP schema drift check passed");
  }
}
```

## File: .gitignore
```
.env*
```
