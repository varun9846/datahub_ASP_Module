This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
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
- Files matching these patterns are excluded: *.test.ts, docs/**, node_modules/**, **/*.png, **/*.jpg, **/*.jpeg, **/*.gif, **/*.svg
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.gitignore
datahubnew.md
Dockerfile
ecosystem.config.cjs
package.json
repomix.config.json
scripts/call_sessions_api.sh
scripts/call_vlan_sms_sync_api.sh
src/app.js
src/asp/aspSessions.paged.service.js
src/asp/aspSessions.service.js
src/ASPHelper/Apis.js
src/config.js
src/db/pgPool.js
src/db/session.repository.js
src/db/vlanSms.repository.js
src/logger.js
src/routes/sessions.route.js
src/routes/vlanSmsSync.route.js
src/server.js
src/services/session.service.js
src/services/sessionRangePaged.service.js
src/services/vlanSmsSync.service.js
src/SQHelper/mysqlClient.js
src/SQHelper/vlanSmsSync.helper.js
src/SQHelper/vlanSmsSync.mapper.js
src/SQHelper/vlanSmsSync.schemaDrift.js
src/SQL/setup-mysql.sql
src/SQL/setup-postgres.sql
src/utils/sessionMerger.js
src/utils/sessionNormalizer.js
src/utils/utils.js
```

# Files

## File: datahubnew.md
````markdown
   1: This file is a merged representation of the entire codebase, combined into a single document by Repomix.
   2: 
   3: # File Summary
   4: 
   5: ## Purpose
   6: This file contains a packed representation of the entire repository's contents.
   7: It is designed to be easily consumable by AI systems for analysis, code review,
   8: or other automated processes.
   9: 
  10: ## File Format
  11: The content is organized as follows:
  12: 1. This summary section
  13: 2. Repository information
  14: 3. Directory structure
  15: 4. Repository files (if enabled)
  16: 5. Multiple file entries, each consisting of:
  17:   a. A header with the file path (## File: path/to/file)
  18:   b. The full contents of the file in a code block
  19: 
  20: ## Usage Guidelines
  21: - This file should be treated as read-only. Any changes should be made to the
  22:   original repository files, not this packed version.
  23: - When processing this file, use the file path to distinguish
  24:   between different files in the repository.
  25: - Be aware that this file may contain sensitive information. Handle it with
  26:   the same level of security as you would the original repository.
  27: 
  28: ## Notes
  29: - Some files may have been excluded based on .gitignore rules and Repomix's configuration
  30: - Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
  31: - Files matching patterns in .gitignore are excluded
  32: - Files matching default ignore patterns are excluded
  33: - Files are sorted by Git change count (files with more changes are at the bottom)
  34: 
  35: # Directory Structure
  36: ```
  37: .gitignore
  38: Dockerfile
  39: ecosystem.config.cjs
  40: package.json
  41: scripts/call_sessions_api.sh
  42: src/app.js
  43: src/asp/aspSessions.paged.service.js
  44: src/asp/aspSessions.service.js
  45: src/ASPHelper/Apis.js
  46: src/config.js
  47: src/db/pgPool.js
  48: src/db/session.repository.js
  49: src/logger.js
  50: src/routes/sessions.route.js
  51: src/server.js
  52: src/services/session.service.js
  53: src/services/sessionRangePaged.service.js
  54: src/utils/sessionMerger.js
  55: src/utils/sessionNormalizer.js
  56: src/utils/utils.js
  57: ```
  58: 
  59: # Files
  60: 
  61: ## File: .gitignore
  62: ```
  63: .env
  64: ```
  65: 
  66: ## File: Dockerfile
  67: ```dockerfile
  68: FROM node:20-alpine
  69: 
  70: WORKDIR /app
  71: 
  72: COPY package*.json ./
  73: RUN npm install
  74: 
  75: COPY . .
  76: 
  77: EXPOSE 9091
  78: 
  79: CMD ["npm", "start"]
  80: ```
  81: 
  82: ## File: ecosystem.config.cjs
  83: ```javascript
  84: module.exports = {
  85:   apps: [
  86:     {
  87:       name: "datahub_api",
  88: 
  89:       script: "npm",
  90:       args: "run start",
  91: 
  92:       instances: 1,
  93:       exec_mode: "fork",
  94: 
  95:       autorestart: true,
  96:       watch: false,
  97:       max_memory_restart: "1G",
  98: 
  99:       error_file: "/var/log/datahub_api/pm2/err.log",
 100:       out_file: "/var/log/datahub_api/pm2/out.log",
 101:       log_date_format: "YYYY-MM-DD HH:mm:ss"
 102:     }
 103:   ]
 104: };
 105: ```
 106: 
 107: ## File: package.json
 108: ```json
 109: {
 110:   "name": "datahub_api",
 111:   "version": "1.0.0",
 112:   "description": "Server 2 API service for incremental data fetching and storage using Timescaledb, Express, and secure logging.",
 113:   "main": "src/server.js",
 114:   "type": "module",
 115:   "scripts": {
 116:     "dev": "nodemon src/server.js",
 117:     "start": "node src/server.js",
 118:     "lint": "eslint ."
 119:   },
 120:   "dependencies": {
 121:     "@prisma/client": "^6.16.3",
 122:     "axios": "^1.7.2",
 123:     "cors": "^2.8.5",
 124:     "dotenv": "^16.3.1",
 125:     "express": "^4.19.2",
 126:     "helmet": "^7.1.0",
 127:     "node-cron": "^3.0.3",
 128:     "winston": "^3.11.0",
 129:     "zod": "^3.23.8",
 130:     "moment": "^2.29.4",
 131:     "moment-duration-format": "^2.3.2",
 132:     "moment-timezone": "^0.6.0",
 133:     "pg": "^8.11.5"
 134:   },
 135:   "devDependencies": {
 136:     "nodemon": "^3.1.0",
 137:     "eslint": "^9.13.0",
 138:     "eslint-config-prettier": "^9.1.0",
 139:     "eslint-plugin-node": "^11.1.0"
 140:   },
 141:   "engines": {
 142:     "node": ">=20.0.0"
 143:   },
 144:   "keywords": [
 145:     "express",
 146:     "api",
 147:     "data-fetcher",
 148:     "nodejs",
 149:     "logging",
 150:     "security",
 151:     "zod"
 152:   ],
 153:   "author": "Salman Channa",
 154:   "license": "MIT"
 155: }
 156: ```
 157: 
 158: ## File: scripts/call_sessions_api.sh
 159: ```bash
 160: #!/bin/bash
 161: 
 162: URL="http://localhost:3010/api/sessions"
 163: LOG_FILE="/var/log/datahub_api/curl_sessions.log"
 164: 
 165: curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
 166: echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"
 167: 
 168: 
 169: crontab -e
 170: */10 * * * * /data/scripts/call_sessions_api.sh
 171: ```
 172: 
 173: ## File: src/app.js
 174: ```javascript
 175: import express from "express"
 176: import cors from "cors";
 177: import helmet from "helmet";
 178: import logger from "./logger.js";
 179: import sessionRoutes from "./routes/sessions.route.js"
 180: import { cfg } from "./config.js";
 181: 
 182: const app = express()
 183: 
 184: app.use(cors());
 185: app.use(helmet());
 186: 
 187: app.use(express.json());
 188: app.use(express.urlencoded({ extended: true }));
 189: 
 190: // Request logging
 191: // Log requests
 192: app.use((req, res, next) => {
 193:   const start = process.hrtime.bigint();
 194: 
 195:   // 1) log immediately when request arrives
 196:   logger.info("Incoming request", {
 197:     method: req.method,
 198:     url: req.originalUrl,
 199:   });
 200: 
 201:   // 2) log when response finishes
 202:   res.on("finish", () => {
 203:     const end = process.hrtime.bigint();
 204:     const durationMs = Number(end - start) / 1e6;
 205: 
 206:     if (cfg.IS_PROD) {
 207:       logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, { durationMs });
 208:     } else {
 209:       logger.info("Request completed", {
 210:         method: req.method,
 211:         url: req.originalUrl,
 212:         status: res.statusCode,
 213:         durationMs,
 214:         body: req.body,
 215:       });
 216:     }
 217:   });
 218: 
 219:   next();
 220: });
 221: 
 222: // // if (cfg.IS_PROD) {
 223: // //   app.use('/api', (req, res, next) => {
 224: // //     const apiKey = req.header('x-api-key');
 225: // //     const ua = req.headers['user-agent'] || '';
 226: // //     const allowedIps = ['111.22.33.44'];
 227: 
 228: // //     const isBrowser = /(Mozilla|Chrome|Safari|Firefox)/i.test(ua);
 229: // //     const clientIp = req.ip.replace('::ffff:', '');
 230: 
 231: // //     if (!apiKey || apiKey !== process.env.API_KEY) return res.status(403).json({ error: 'Forbidden' });
 232: // //     if (isBrowser) return res.status(403).json({ error: 'Forbidden' });
 233: // //     if (!allowedIps.includes(clientIp)) return res.status(403).json({ error: 'Forbidden' });
 234: 
 235: // //     next();
 236: // //   });
 237: // // }
 238: 
 239: 
 240: app.use("/api/sessions", sessionRoutes)
 241: 
 242: // 404 handler
 243: app.use((req, res) => {
 244:   res.status(404).json({ error: 'Not Found' });
 245: });
 246: 
 247: // Log errors globally
 248: app.use((err, req, res, next) => {
 249:   logger.error("Unhandled error", { error: err, url: req.url, method: req.method });
 250:   res.status(500).json({ error: "Internal server error" });
 251: });
 252: 
 253: 
 254: // --- Startup logs ---
 255: async function logStartupInfo() {
 256:   try {
 257:     logger.info("====================================================");
 258:     logger.info("Server Startup Information");
 259:     logger.info("====================================================");
 260:     logger.info(`Environment      : ${cfg.IS_PROD ? "Production" : "Development"}`);
 261:     logger.info(`Log Level        : ${cfg.LOG_LEVEL}`);
 262:     logger.info(`Log Directory    : ${cfg.LOG_PATH}`);
 263:     logger.info(`Server Port      : ${cfg.PORT}`);
 264:     // logger.info(`Cron Schedule    : ${cfg.CRON_SCHEDULE}`);
 265:     logger.info(`Database URL     : ${cfg.DATABASE_URL.replace(/\/\/.*@/, "//****:****@")}`); // hide creds
 266:     logger.info("====================================================");
 267:   } catch (err) {
 268:     logger.error("Error while logging server info on startup", { error: err });
 269:   }
 270: }
 271: 
 272: await logStartupInfo();
 273: 
 274: export default app
 275: ```
 276: 
 277: ## File: src/asp/aspSessions.paged.service.js
 278: ```javascript
 279: import logger from "../logger.js";
 280: import { getSessions } from "../ASPHelper/Apis.js";
 281: 
 282: function sleep(ms) {
 283:   return new Promise((r) => setTimeout(r, ms));
 284: }
 285: 
 286: function safeSessionArray(resp) {
 287:   return resp?.data?.session ?? [];
 288: }
 289: 
 290: function safeResultCode(resp) {
 291:   return resp?.resultCode;
 292: }
 293: 
 294: function safeResult(resp) {
 295:   return resp?.result;
 296: }
 297: 
 298: function safeTotalCount(resp) {
 299:   const n = Number(resp?.count);
 300:   return Number.isFinite(n) ? n : null;
 301: }
 302: 
 303: /**
 304:  * Fetch ALL pages for a single query (start/stop/updated window).
 305:  * Notes:
 306:  * - Your ASP paging is 0-based (page starts from 0).
 307:  * - Uses resp.count (total matched records) to compute total pages when available.
 308:  * - Falls back to items.length < limit if count is missing/unreliable.
 309:  * - maxPages is only a safety guard.
 310:  */
 311: export async function fetchAllPages(paramsBase, scope, opts = {}) {
 312:   const limit = Number(paramsBase.limit ?? 10000);
 313:   const pageDelayMs = Number(opts.pageDelayMs ?? 200);
 314:   const maxPages = Number(opts.maxPages ?? 2000);
 315:   const logCtx = opts.logCtx ?? {};
 316: 
 317:   let page = 0; // 0-based
 318:   let total = 0;
 319:   const all = [];
 320: 
 321:   let totalCount = null; // from ASP "count"
 322:   let totalPages = null; // computed from count
 323:   let stopReason = null;
 324: 
 325:   while (true) {
 326:     if (page > maxPages) {
 327:       stopReason = "maxPages_reached";
 328:       logger.warn("ASP pagination stopped (safety)", {
 329:         ...logCtx,
 330:         stopReason,
 331:         page,
 332:         maxPages,
 333:         runningTotal: total,
 334:         totalCount,
 335:         totalPages,
 336:       });
 337:       break;
 338:     }
 339: 
 340:     const params = { ...paramsBase, page, limit };
 341: 
 342:     // logger.debug("ASP page fetch started", { ...logCtx, page, limit });
 343: 
 344:     const resp = await getSessions(params, scope);
 345:     const items = safeSessionArray(resp);
 346: 
 347:     // Establish plan from first response if count is total
 348:     if (totalCount === null) {
 349:       totalCount = safeTotalCount(resp);
 350: 
 351:       if (totalCount !== null) {
 352:         totalPages = Math.ceil(totalCount / limit);
 353: 
 354:         // logger.info("ASP pagination plan", {
 355:         //   ...logCtx,
 356:         //   totalCount,
 357:         //   totalPages,
 358:         //   limit,
 359:         // });
 360: 
 361:         // Explicit log for "no data" based on count
 362:         if (totalCount === 0) {
 363:           // stopReason = "count_zero_no_data";
 364:           // logger.info("ASP pagination stopped (no data by count)", {
 365:           //   ...logCtx,
 366:           //   stopReason,
 367:           //   page,
 368:           //   totalCount,
 369:           //   totalPages,
 370:           // });
 371:           break;
 372:         }
 373:       } else {
 374:         logger.warn("ASP response missing numeric count; using fallback stop", {
 375:           ...logCtx,
 376:           page,
 377:           count: resp?.count,
 378:         });
 379:       }
 380:     }
 381: 
 382:     all.push(...items);
 383:     total += items.length;
 384: 
 385:     // logger.info("ASP page fetch completed", {
 386:     //   ...logCtx,
 387:     //   page,
 388:     //   received: items.length,
 389:     //   runningTotal: total,
 390:     //   resultCode: safeResultCode(resp),
 391:     //   result: safeResult(resp),
 392:     //   totalCount,
 393:     //   totalPages,
 394:     // });
 395: 
 396:     // Explicit stop logs when items are empty
 397:     if (items.length === 0) {
 398:       // stopReason = "items_zero_no_more_data";
 399:       // logger.info("ASP pagination stopped (empty page)", {
 400:       //   ...logCtx,
 401:       //   stopReason,
 402:       //   page,
 403:       //   received: 0,
 404:       //   runningTotal: total,
 405:       //   totalCount,
 406:       //   totalPages,
 407:       // });
 408:       break;
 409:     }
 410: 
 411:     // Stop conditions:
 412:     // 1) If totalPages known (0-based): last page index is totalPages-1
 413:     // 2) Else fallback: last page is short (< limit)
 414:     if (totalPages !== null) {
 415:       if (page >= (totalPages - 1)) {
 416:         // stopReason = "reached_last_page_by_count";
 417:         // logger.info("ASP pagination stopped (last page by count)", {
 418:         //   ...logCtx,
 419:         //   stopReason,
 420:         //   page,
 421:         //   totalPages,
 422:         //   runningTotal: total,
 423:         //   totalCount,
 424:         // });
 425:         break;
 426:       }
 427:     } else {
 428:       if (items.length < limit) {
 429:         // stopReason = "last_page_short_by_length";
 430:         // logger.info("ASP pagination stopped (last page by length)", {
 431:         //   ...logCtx,
 432:         //   stopReason,
 433:         //   page,
 434:         //   received: items.length,
 435:         //   limit,
 436:         //   runningTotal: total,
 437:         // });
 438:         break;
 439:       }
 440:     }
 441: 
 442:     page += 1;
 443: 
 444:     if (pageDelayMs > 0) {
 445:       // logger.debug("ASP pagination delay", { ...logCtx, pageDelayMs, nextPage: page });
 446:       await sleep(pageDelayMs);
 447:     }
 448:   }
 449: 
 450:   // logger.info("ASP pagination completed", {
 451:   //   ...logCtx,
 452:   //   stopReason,
 453:   //   pagesFetched: page + 1, // inclusive pages count since 0-based
 454:   //   totalReturned: total,
 455:   //   totalCount,
 456:   //   totalPages,
 457:   // });
 458: 
 459:   return all;
 460: }
 461: 
 462: /**
 463:  * Fetch sessions for a window using pagination:
 464:  * - start sessions (sessionStartDateTimeStart/End)
 465:  * - end sessions (sessionStopDateTimeStart/End)
 466:  */
 467: export async function fetchSessionsByWindowPaged({
 468:   window,
 469:   baseParams,
 470:   scope = "all",
 471:   pageDelayMs = 200,
 472:   maxPages = 2000,
 473: }) {
 474:   const common = { ...baseParams };
 475: 
 476:   const startParams = {
 477:     ...common,
 478:     sessionStartDateTimeStart: window.from,
 479:     sessionStartDateTimeEnd: window.to,
 480:   };
 481: 
 482:   const stopParams = {
 483:     ...common,
 484:     sessionStopDateTimeStart: window.from,
 485:     sessionStopDateTimeEnd: window.to,
 486:   };
 487: 
 488:   const logBase = { scope, window };
 489: 
 490:   const [startArr, endArr] = await Promise.all([
 491:     fetchAllPages(startParams, scope, {
 492:       pageDelayMs,
 493:       maxPages,
 494:       logCtx: { ...logBase, type: "start" },
 495:     }),
 496:     fetchAllPages(stopParams, scope, {
 497:       pageDelayMs,
 498:       maxPages,
 499:       logCtx: { ...logBase, type: "stop" },
 500:     }),
 501:   ]);
 502: 
 503:   return { startArr, endArr };
 504: }
 505: ```
 506: 
 507: ## File: src/asp/aspSessions.service.js
 508: ```javascript
 509: import { getSessions } from "../ASPHelper/Apis.js";
 510: 
 511: export function extractSessions(resp) {
 512:   return resp?.data?.session ?? [];
 513: }
 514: 
 515: export async function fetchSessionsByWindow(dateTimeRange, baseParams) {
 516:   const startParams = {
 517:     ...baseParams,
 518:     sessionStartDateTimeStart: dateTimeRange.from,
 519:     sessionStartDateTimeEnd: dateTimeRange.to,
 520:   };
 521: 
 522:   const endParams = {
 523:     ...baseParams,
 524:     sessionStopDateTimeStart: dateTimeRange.from,
 525:     sessionStopDateTimeEnd: dateTimeRange.to,
 526:   };
 527: 
 528:   const [startResp, endResp] = await Promise.all([
 529:     getSessions(startParams, "all"),
 530:     getSessions(endParams, "all"),
 531:   ]);
 532: 
 533:   return {
 534:     startResp,
 535:     endResp,
 536:     startArr: extractSessions(startResp),
 537:     endArr: extractSessions(endResp),
 538:   };
 539: }
 540: ```
 541: 
 542: ## File: src/ASPHelper/Apis.js
 543: ```javascript
 544: import axios from "axios";
 545: import { cfg } from "../config.js";
 546: import https from "https";
 547: 
 548: const insecureHttpsAgent = new https.Agent({
 549:   rejectUnauthorized: false
 550: });
 551: 
 552: const ASP_URL = cfg.ASP_API_BASE_URL;
 553: 
 554: export async function getToken() {
 555:   try {
 556:     const res = await axios.post(
 557:       `${ASP_URL}/auth/token`,
 558:       null,
 559:       {
 560:         httpsAgent: insecureHttpsAgent,
 561:         params: {
 562:           orgId: cfg.ASP_API_ORGID,
 563:           userId: cfg.ASP_API_USERNAME,
 564:           password: cfg.ASP_API_PASSWORD
 565:         }
 566:       }
 567:     );
 568: 
 569:     return res.data?.token ?? null;
 570: 
 571:   } catch (error) {
 572:     console.error("Failed to create ASP token", error?.cause || error);
 573:     return null;
 574:   }
 575: }
 576: 
 577: export async function getSessions(params, siteToken = "all") {
 578:   try {
 579:     const tokenValue = await getToken();
 580:     if (!tokenValue) return null;
 581: 
 582:     const res = await axios.get(
 583:       `${ASP_URL}/sites/${siteToken}/sessions`,
 584:       {
 585:         httpsAgent: insecureHttpsAgent,
 586:         params,
 587:         headers: {
 588:           Authorization: tokenValue,
 589:           "Content-Type": "application/json;charset=utf-8"
 590:         }
 591:       }
 592:     );
 593: 
 594:     return res.data;
 595: 
 596:   } catch (error) {
 597:     console.error("Failed to get data", error?.cause || error);
 598:     return null;
 599:   }
 600: }
 601: ```
 602: 
 603: ## File: src/config.js
 604: ```javascript
 605: import dotenv from "dotenv";
 606: import { z } from "zod";
 607: import path from "path";
 608: 
 609: dotenv.config();
 610: 
 611: const schema = z.object({
 612:   PORT: z.coerce.number().default(3000),
 613:   DATABASE_URL: z.string(),
 614:   ASP_API_BASE_URL: z.string(),
 615:   ASP_API_USERNAME: z.string(),
 616:   ASP_API_PASSWORD: z.string(),
 617:   ASP_API_ORGID: z.string(),
 618:   LOG_LEVEL: z.string().default("info"),
 619:   LOG_PATH: z.string().default(path.join(process.cwd(), "logs")),
 620:   IS_PROD: z.boolean().default(false),
 621: });
 622: 
 623: const env = {
 624:   ...process.env,
 625:   IS_PROD: (process.env.IS_PROD == "true")
 626: }
 627: const cfg = schema.parse(env);
 628: export {cfg};
 629: ```
 630: 
 631: ## File: src/db/pgPool.js
 632: ```javascript
 633: import pg from "pg";
 634: import { cfg } from "../config.js";
 635: 
 636: const { Pool } = pg;
 637: 
 638: const pool = new Pool({
 639:   connectionString: cfg.DATABASE_URL,
 640: });
 641: 
 642: export default pool;
 643: ```
 644: 
 645: ## File: src/db/session.repository.js
 646: ```javascript
 647: const UPSERT_SQL = `
 648: WITH data AS (
 649:   SELECT *
 650:   FROM jsonb_to_recordset($1::jsonb) AS d(
 651:     site_token text,
 652:     session_id text,
 653:     local_id text,
 654:     nas_ip_address text,
 655:     vlan text,
 656:     duration int,
 657:     download_bytes text,
 658:     upload_bytes text,
 659:     mac_address text,
 660:     ip_address text,
 661:     device text,
 662:     browser text,
 663:     os text,
 664:     terminate_cause text,
 665:     session_start timestamptz,
 666:     session_stop timestamptz,
 667:     session_updated timestamptz
 668:   )
 669: ),
 670: updated AS (
 671:   UPDATE session s
 672:   SET
 673:     duration        = d.duration,
 674:     download_bytes  = NULLIF(d.download_bytes, '')::bigint,
 675:     upload_bytes    = NULLIF(d.upload_bytes, '')::bigint,
 676:     terminate_cause = d.terminate_cause,
 677:     session_stop    = d.session_stop
 678:   FROM data d
 679:   WHERE s.session_id = d.session_id
 680:     AND s.session_start = d.session_start
 681:   RETURNING s.session_id
 682: )
 683: INSERT INTO session (
 684:   site_token,
 685:   session_id,
 686:   local_id,
 687:   nas_ip_address,
 688:   vlan,
 689:   duration,
 690:   download_bytes,
 691:   upload_bytes,
 692:   mac_address,
 693:   ip_address,
 694:   device,
 695:   browser,
 696:   os,
 697:   terminate_cause,
 698:   session_start,
 699:   session_stop,
 700:   session_updated
 701: )
 702: SELECT
 703:   d.site_token,
 704:   d.session_id,
 705:   d.local_id,
 706:   d.nas_ip_address,
 707:   d.vlan,
 708:   d.duration,
 709:   NULLIF(d.download_bytes, '')::bigint,
 710:   NULLIF(d.upload_bytes, '')::bigint,
 711:   d.mac_address,
 712:   d.ip_address,
 713:   d.device,
 714:   d.browser,
 715:   d.os,
 716:   d.terminate_cause,
 717:   d.session_start,
 718:   d.session_stop,
 719:   d.session_updated
 720: FROM data d
 721: WHERE NOT EXISTS (
 722:   SELECT 1 FROM session s
 723:   WHERE s.session_id = d.session_id
 724:     AND s.session_start = d.session_start
 725: 
 726: );
 727: `;
 728: 
 729: export async function upsertSessions(client, sessions) {
 730:   if (!sessions?.length) return 0;
 731:   await client.query(UPSERT_SQL, [JSON.stringify(sessions)]);
 732:   return sessions.length;
 733: }
 734: ```
 735: 
 736: ## File: src/logger.js
 737: ```javascript
 738: import fs from "fs";
 739: import path from "path";
 740: import winston from "winston";
 741: import { cfg } from "./config.js";
 742: 
 743: const logDir = cfg.LOG_PATH;
 744: if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
 745: 
 746: // Use JSON format with timestamp and pretty printing for console
 747: const jsonFormat = winston.format.combine(
 748:   winston.format.timestamp(),
 749:   winston.format.errors({ stack: true }), // include stack traces for errors
 750:   winston.format.splat(), // for printf-style
 751:   winston.format.json()
 752: );
 753: 
 754: const consoleFormat = winston.format.combine(
 755:   winston.format.colorize(),
 756:   winston.format.timestamp(),
 757:   winston.format.printf(({ timestamp, level, message, ...meta }) => {
 758:     const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
 759:     return `[${timestamp}] ${level}: ${message} ${metaString}`;
 760:   })
 761: );
 762: 
 763: const logger = winston.createLogger({
 764:   level: cfg.LOG_LEVEL,
 765:   format: jsonFormat,
 766:   transports: [
 767:     new winston.transports.File({
 768:       filename: path.join(logDir, "error.log"),
 769:       level: "error",
 770:       maxsize: 10 * 1024 * 1024, // 10MB
 771:       maxFiles: 5,
 772:       tailable: true,
 773:     }),
 774:     new winston.transports.File({
 775:       filename: path.join(logDir, "combined.log"),
 776:       level: cfg.IS_PROD ? "warn" : "info", // minimal logs in production
 777:       maxsize: 50 * 1024 * 1024,
 778:       maxFiles: 5,
 779:       tailable: true,
 780:     }),
 781:     new winston.transports.Console({
 782:       format: consoleFormat,
 783:       silent: cfg.IS_PROD, // optionally hide console in production
 784:     }),
 785:   ],
 786:   exceptionHandlers: [
 787:     new winston.transports.File({ filename: path.join(logDir, "exceptions.log") }),
 788:   ],
 789:   rejectionHandlers: [
 790:     new winston.transports.File({ filename: path.join(logDir, "rejections.log") }),
 791:   ],
 792: });
 793: 
 794: export default logger;
 795: ```
 796: 
 797: ## File: src/routes/sessions.route.js
 798: ```javascript
 799: import express from "express";
 800: import { getWindow10MinBack1Day } from "../utils/utils.js";
 801: import { pullAndStoreSessions } from "../services/session.service.js";
 802: import { pullAndStoreSessionsRangePaged } from "../services/sessionRangePaged.service.js";
 803: import logger from "../logger.js";
 804: 
 805: const router = express.Router();
 806: 
 807: router.post("/", async (req, res) => {
 808:   try {
 809: 
 810:     const window = getWindow10MinBack1Day();
 811:     const baseParams = { page: 0, limit: 10000 };
 812: 
 813:     const result = await pullAndStoreSessions(window, baseParams);
 814: 
 815:     // logger.success(`Session Pull for range from ${window.from} to ${window.to} Success Total records stored ${result.stored} and merged ${result.merged}`);
 816:     logger.info(
 817:       "Session pull succeeded",
 818:       {
 819:         window,
 820:         result
 821:       }
 822:     );
 823: 
 824:     res.json({
 825:       status: "ok",
 826:       window,
 827:       ...result,
 828:     });
 829: 
 830:   } catch (err) {
 831:     logger.error("Session pull failed:", err);
 832:     res.status(500).json({ status: "error", message: err.message });
 833:   }
 834: });
 835: 
 836: /**
 837:  * POST /sessions/range
 838:  * Body example:
 839:  * {
 840:  *   "from": "2026-01-19 00:00:00",
 841:  *   "to":   "2026-01-20 00:00:00",
 842:  *   "chunkMinutes": 60,
 843:  *   "windowDelayMs": 500,
 844:  *   "pageDelayMs": 200,
 845:  *   "maxPages": 2000
 846:  * }
 847:  */
 848: router.post("/range", async (req, res) => {
 849:   try {
 850:     const { from, to } = req.body;
 851: 
 852:     if (!from || !to) {
 853:       return res.status(400).json({
 854:         status: "error",
 855:         message: "from and to are required in format YYYY-MM-DD HH:mm:ss (UTC)",
 856:       });
 857:     }
 858: 
 859:     const chunkMinutes = Number(req.body?.chunkMinutes ?? 60);
 860:     const windowDelayMs = Number(req.body?.windowDelayMs ?? 500);
 861:     const pageDelayMs = Number(req.body?.pageDelayMs ?? 200);
 862:     const maxPages = Number(req.body?.maxPages ?? 2000);
 863: 
 864:     // keep your existing API defaults
 865:     const baseParams = { page: 0, limit: 10000 };
 866: 
 867:     const window = { from, to };
 868: 
 869:     // logger.info("Custom range request received", {
 870:     //   window,
 871:     //   chunkMinutes,
 872:     //   windowDelayMs,
 873:     //   pageDelayMs,
 874:     //   maxPages,
 875:     //   limit: baseParams.limit,
 876:     // });
 877: 
 878:     const summary = await pullAndStoreSessionsRangePaged({
 879:       window,
 880:       baseParams,
 881:       chunkMinutes,
 882:       windowDelayMs,
 883:       pageDelayMs,
 884:       maxPages,
 885:       scope: "all",
 886:       // Optional: enable stable sorting only if you are sure API supports it well
 887:       // sort: "sessionId",
 888:       // order: "asc",
 889:     });
 890: 
 891:     res.json({ status: "ok", window, summary });
 892:   } catch (err) {
 893:     logger.error("Custom range pull failed", { error: err.message, stack: err.stack });
 894:     res.status(500).json({ status: "error", message: err.message });
 895:   }
 896: });
 897: 
 898: export default router;
 899: ```
 900: 
 901: ## File: src/server.js
 902: ```javascript
 903: import { cfg } from "./config.js";
 904: import app from "./app.js";
 905: import logger from "./logger.js";
 906: 
 907: app.listen(cfg.PORT, () => {
 908:   logger.info(`Datahub API running on port ${cfg.PORT}`);
 909: }).on('error', (err) => {
 910:   logger.error('Failed to start server', err);
 911: });
 912: ```
 913: 
 914: ## File: src/services/session.service.js
 915: ```javascript
 916: import pool from "../db/pgPool.js";
 917: import { fetchSessionsByWindow } from "../asp/aspSessions.service.js";
 918: import { mergeSessions } from "../utils/sessionMerger.js";
 919: import { upsertSessions } from "../db/session.repository.js";
 920: 
 921: export async function pullAndStoreSessions(dateTimeRange, baseParams) {
 922:   const client = await pool.connect();
 923: 
 924:   try {
 925:     const { startResp, endResp, startArr, endArr } =
 926:       await fetchSessionsByWindow(dateTimeRange, baseParams);
 927: 
 928:     const merged = mergeSessions(startArr, endArr);
 929: 
 930:     await client.query("BEGIN");
 931:     const stored = await upsertSessions(client, merged);
 932:     await client.query("COMMIT");
 933: 
 934:     return {
 935:       // startResp,
 936:       // endResp,
 937:       fetched: { start: startArr.length, end: endArr.length },
 938:       merged: merged.length,
 939:       stored,
 940:     };
 941:   } catch (err) {
 942:     await client.query("ROLLBACK");
 943:     throw err;
 944:   } finally {
 945:     client.release();
 946:   }
 947: }
 948: ```
 949: 
 950: ## File: src/services/sessionRangePaged.service.js
 951: ```javascript
 952: import logger from "../logger.js";
 953: import pool from "../db/pgPool.js";
 954: import { upsertSessions } from "../db/session.repository.js";
 955: import { mergeSessions } from "../utils/sessionMerger.js";
 956: import { fetchSessionsByWindowPaged } from "../asp/aspSessions.paged.service.js";
 957: 
 958: function sleep(ms) {
 959:   return new Promise((r) => setTimeout(r, ms));
 960: }
 961: 
 962: // Parse "YYYY-MM-DD HH:mm:ss" as UTC
 963: function toMs(dateStr) {
 964:   const iso = dateStr.replace(" ", "T") + "Z";
 965:   const ms = Date.parse(iso);
 966:   if (!Number.isFinite(ms)) throw new Error(`Invalid datetime: ${dateStr}`);
 967:   return ms;
 968: }
 969: 
 970: function msToWindowStr(ms) {
 971:   const d = new Date(ms);
 972:   const yyyy = d.getUTCFullYear();
 973:   const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
 974:   const dd = String(d.getUTCDate()).padStart(2, "0");
 975:   const hh = String(d.getUTCHours()).padStart(2, "0");
 976:   const mi = String(d.getUTCMinutes()).padStart(2, "0");
 977:   const ss = String(d.getUTCSeconds()).padStart(2, "0");
 978:   return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
 979: }
 980: 
 981: function buildChunks(window, chunkMinutes) {
 982:   const startMs = toMs(window.from);
 983:   const endMs = toMs(window.to);
 984: 
 985:   if (endMs <= startMs) throw new Error("to must be greater than from");
 986: 
 987:   const stepMs = chunkMinutes * 60 * 1000;
 988:   const chunks = [];
 989: 
 990:   let cur = startMs;
 991:   while (cur < endMs) {
 992:     const next = Math.min(cur + stepMs, endMs);
 993:     chunks.push({ from: msToWindowStr(cur), to: msToWindowStr(next) });
 994:     cur = next;
 995:   }
 996: 
 997:   return chunks;
 998: }
 999: 
1000: /**
1001:  * Custom range pull with:
1002:  * - chunking (default 60 minutes)
1003:  * - per-window pagination (page=1..N, limit=10000)
1004:  * - delay between pages and between windows
1005:  */
1006: export async function pullAndStoreSessionsRangePaged({
1007:   window,
1008:   baseParams = { page: 0, limit: 10000 }, // page ignored in paged fetch, but keep for compatibility
1009:   chunkMinutes = 60,
1010:   windowDelayMs = 500,
1011:   pageDelayMs = 200,
1012:   maxPages = 2000,
1013:   scope = "all",
1014:   // sort, // optional, only if you want stable ordering
1015:   // order, // optional
1016: }) {
1017:   const chunks = buildChunks(window, chunkMinutes);
1018: 
1019:   const summary = {
1020:     totalWindows: chunks.length,
1021:     completedWindows: 0,
1022:     totalFetchedStart: 0,
1023:     totalFetchedEnd: 0,
1024:     totalMerged: 0,
1025:     totalStored: 0,
1026:     windows: [],
1027:   };
1028: 
1029:   logger.info("Session range paged pull started", {
1030:     window,
1031:     chunkMinutes,
1032:     windowDelayMs,
1033:     pageDelayMs,
1034:     maxPages,
1035:     limit: baseParams.limit,
1036:     totalWindows: chunks.length,
1037:     scope,
1038:   });
1039: 
1040:   for (let i = 0; i < chunks.length; i++) {
1041:     const w = chunks[i];
1042:     const index = i + 1;
1043: 
1044:     logger.info("Range window started", { index, total: chunks.length, window: w });
1045: 
1046:     const t0 = Date.now();
1047: 
1048:     // 1) Fetch paginated from ASP
1049:     const { startArr, endArr } = await fetchSessionsByWindowPaged({
1050:       window: w,
1051:       baseParams: { ...baseParams, limit: baseParams.limit ?? 10000 },
1052:       scope,
1053:       pageDelayMs,
1054:       maxPages,
1055:     });
1056: 
1057:     // 2) Merge start+stop
1058:     const merged = mergeSessions(startArr, endArr);
1059: 
1060:     // logger.info("Range window merged", {
1061:     //   index,
1062:     //   window: w,
1063:     //   startCount: startArr.length,
1064:     //   endCount: endArr.length,
1065:     //   merged: merged.length,
1066:     // });
1067: 
1068:     // 3) Upsert into DB (single transaction per window)
1069:     const client = await pool.connect();
1070:     let stored = 0;
1071: 
1072:     try {
1073:       await client.query("BEGIN");
1074:       stored = await upsertSessions(client, merged);
1075:       await client.query("COMMIT");
1076:     } catch (err) {
1077:       try {
1078:         await client.query("ROLLBACK");
1079:       } catch (_) {}
1080:       logger.error("Range window DB transaction failed", {
1081:         index,
1082:         window: w,
1083:         error: err.message,
1084:         stack: err.stack,
1085:       });
1086:       throw err;
1087:     } finally {
1088:       client.release();
1089:     }
1090: 
1091:     const durationMs = Date.now() - t0;
1092: 
1093:     summary.completedWindows += 1;
1094:     summary.totalFetchedStart += startArr.length;
1095:     summary.totalFetchedEnd += endArr.length;
1096:     summary.totalMerged += merged.length;
1097:     summary.totalStored += stored;
1098: 
1099:     summary.windows.push({
1100:       index,
1101:       window: w,
1102:       fetched: { start: startArr.length, end: endArr.length },
1103:       merged: merged.length,
1104:       stored,
1105:       durationMs,
1106:     });
1107: 
1108:     // logger.info("Range window completed", {
1109:     //   index,
1110:     //   total: chunks.length,
1111:     //   window: w,
1112:     //   stored,
1113:     //   merged: merged.length,
1114:     //   durationMs,
1115:     // });
1116: 
1117:     // Delay between windows
1118:     if (i < chunks.length - 1 && windowDelayMs > 0) {
1119:       // logger.debug("Delaying before next window", { windowDelayMs });
1120:       await sleep(windowDelayMs);
1121:     }
1122:   }
1123: 
1124:   logger.info("Session range paged pull finished", { window, summary });
1125: 
1126:   return summary;
1127: }
1128: ```
1129: 
1130: ## File: src/utils/sessionMerger.js
1131: ```javascript
1132: import { normalizeSession } from "./sessionNormalizer.js";
1133: 
1134: function mergeTwo(a, b) {
1135:   const out = { ...a };
1136: 
1137:   if (b.session_stop) out.session_stop = b.session_stop;
1138: 
1139:   if (!out.session_updated && b.session_updated) {
1140:     out.session_updated = b.session_updated;
1141:   } else if (out.session_updated && b.session_updated) {
1142:     if (new Date(b.session_updated) > new Date(out.session_updated)) {
1143:       out.session_updated = b.session_updated;
1144:     }
1145:   }
1146: 
1147:   for (const k of Object.keys(out)) {
1148:     if ((out[k] === null || out[k] === "") && b[k] != null) {
1149:       out[k] = b[k];
1150:     }
1151:   }
1152: 
1153:   return out;
1154: }
1155: 
1156: export function mergeSessions(startArr = [], endArr = []) {
1157:   const map = new Map();
1158: 
1159:   for (const s of startArr) {
1160:     const row = normalizeSession(s);
1161:     if (!row.session_id) continue;
1162:     map.set(row.session_id, row);
1163:   }
1164: 
1165:   for (const s of endArr) {
1166:     const row = normalizeSession(s);
1167:     if (!row.session_id) continue;
1168: 
1169:     const existing = map.get(row.session_id);
1170:     map.set(row.session_id, existing ? mergeTwo(existing, row) : row);
1171:   }
1172: 
1173:   return [...map.values()];
1174: }
1175: ```
1176: 
1177: ## File: src/utils/sessionNormalizer.js
1178: ```javascript
1179: function epochToISO(ts) {
1180:   if (ts === null || ts === undefined) return null;
1181:   const n = Number(ts);
1182:   if (!Number.isFinite(n)) return null;
1183:   return new Date(n * 1000).toISOString();
1184: }
1185: 
1186: export function normalizeSession(s) {
1187:   return {
1188:     site_token: s.siteToken ?? null,
1189:     session_id: s.sessionId ?? null,
1190:     local_id: s.localId ?? null,
1191:     nas_ip_address: s.nasIpAddress ?? null,
1192:     vlan: s.vlan ?? null,
1193:     duration: Number.isFinite(Number(s.duration)) ? Number(s.duration) : null,
1194:     download_bytes: s.download ?? null,
1195:     upload_bytes: s.upload ?? null,
1196:     mac_address: s.macAddress ?? null,
1197:     ip_address: s.ipAddress ?? null,
1198:     device: s.device ?? null,
1199:     browser: s.browser ?? null,
1200:     os: s.os ?? null,
1201:     terminate_cause: s.terminateCause ?? null,
1202:     session_updated: epochToISO(s.sessionUpdatedDatetime?.timestamp),
1203:     session_start: epochToISO(s.sessionStartDatetime?.timestamp),
1204:     session_stop: epochToISO(s.sessionStopDatetime?.timestamp),
1205:   };
1206: }
1207: ```
1208: 
1209: ## File: src/utils/utils.js
1210: ```javascript
1211: import moment from "moment";
1212: 
1213: function getWindow10MinBack1Day(nowUtc = moment.utc()) {
1214:   const shifted = nowUtc.clone().subtract(1, "day"); // 24hrs old so that ASP can sync with vsg's (False sync control)
1215:   const from = shifted.clone().subtract(10, "minutes");
1216:   const toExclusive = shifted.clone();
1217: 
1218:   return {
1219:     from: from.format("YYYY-MM-DD HH:mm:ss"),
1220:     to: toExclusive.format("YYYY-MM-DD HH:mm:ss"), // exclusive
1221:   };
1222: }
1223: 
1224: export {getWindow10MinBack1Day};
1225: ```
````

## File: repomix.config.json
````json
 1: {
 2:     "output": {
 3:         "style": "markdown",
 4:         "removeComments": true,
 5:         "showLineNumbers": true,
 6:         "topFilesLength": 10
 7:     },
 8:     "ignore": {
 9:         "customPatterns": [
10:             "*.test.ts",
11:             "docs/**",
12:             "node_modules/**",
13:             "**/*.png",
14:             "**/*.jpg",
15:             "**/*.jpeg",
16:             "**/*.gif",
17:             "**/*.svg"
18:         ]
19:     }
20: }
````

## File: scripts/call_vlan_sms_sync_api.sh
````bash
1: URL="http://localhost:3010/api/vlan-sms-sync"
2: LOG_FILE="/var/log/datahub_api/curl_vlan_sms_sync.log"
3: 
4: curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
5: echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"
6: 
7: 
8: crontab -e
9: 0 * * * * /data/scripts/call_vlan_sms_sync_api.sh
````

## File: src/db/vlanSms.repository.js
````javascript
 1: const ENSURE_VLAN_SMS_TABLE_SQL = `
 2: CREATE TABLE IF NOT EXISTS vlan_sms (
 3:   id VARCHAR(50) PRIMARY KEY,
 4:   vlan_id INTEGER,
 5:   phone_number VARCHAR(20),
 6:   message TEXT,
 7:   "createdAt" TIMESTAMPTZ,
 8:   "updatedAt" TIMESTAMPTZ,
 9:   synced_at TIMESTAMPTZ DEFAULT NOW()
10: );
11: `;
12: 
13: const ENSURE_VLAN_SMS_INDEXES_SQL = `
14: CREATE INDEX IF NOT EXISTS idx_vlan_sms_vlan_id
15: ON vlan_sms(vlan_id);
16: 
17: CREATE INDEX IF NOT EXISTS idx_vlan_sms_createdat
18: ON vlan_sms("createdAt");
19: `;
20: 
21: const GET_LAST_SYNC_SQL = `
22: SELECT MAX("createdAt") AS last_sync
23: FROM vlan_sms;
24: `;
25: 
26: const INSERT_BATCH_SQL = `
27: WITH data AS (
28:   SELECT *
29:   FROM jsonb_to_recordset($1::jsonb) AS d(
30:     id text,
31:     vlan_id integer,
32:     phone_number text,
33:     message text,
34:     created_at timestamptz,
35:     updated_at timestamptz
36:   )
37: )
38: INSERT INTO vlan_sms (
39:   id,
40:   vlan_id,
41:   phone_number,
42:   message,
43:   "createdAt",
44:   "updatedAt"
45: )
46: SELECT
47:   d.id,
48:   d.vlan_id,
49:   d.phone_number,
50:   d.message,
51:   d.created_at,
52:   d.updated_at
53: FROM data d
54: ON CONFLICT (id) DO NOTHING;
55: `;
56: 
57: export async function ensureVlanSmsTable(pool) {
58:   await pool.query(ENSURE_VLAN_SMS_TABLE_SQL);
59:   await pool.query(ENSURE_VLAN_SMS_INDEXES_SQL);
60: }
61: 
62: export async function getLastVlanSmsSync(pool) {
63:   const result = await pool.query(GET_LAST_SYNC_SQL);
64:   return result.rows[0]?.last_sync ?? null;
65: }
66: 
67: export async function insertVlanSmsBatch(client, batch) {
68:   if (!batch?.length) return 0;
69: 
70:   const result = await client.query(INSERT_BATCH_SQL, [JSON.stringify(batch)]);
71: 
72:   return result.rowCount || 0;
73: }
````

## File: src/routes/vlanSmsSync.route.js
````javascript
 1: import express from "express";
 2: import logger from "../logger.js";
 3: import { runVlanSmsSync } from "../services/vlanSmsSync.service.js";
 4: 
 5: const router = express.Router();
 6: 
 7: 
 8: 
 9: 
10: 
11: 
12: router.post("/", async (req, res) => {
13:   try {
14:     const summary = await runVlanSmsSync();
15: 
16:     res.json({
17:       status: "ok",
18:       summary,
19:     });
20:   } catch (err) {
21:     const statusCode = err.statusCode || 500;
22: 
23:     logger.error("SQ VLAN SMS sync API failed", {
24:       statusCode,
25:       error: err.message,
26:       stack: err.stack,
27:       summary: err.summary,
28:     });
29: 
30:     res.status(statusCode).json({
31:       status: "error",
32:       message: err.message,
33:       summary: err.summary,
34:     });
35:   }
36: });
37: 
38: export default router;
````

## File: src/services/vlanSmsSync.service.js
````javascript
  1: import { cfg } from "../config.js";
  2: import logger from "../logger.js";
  3: import pool from "../db/pgPool.js";
  4: import {
  5:   ensureVlanSmsTable,
  6:   getLastVlanSmsSync,
  7:   insertVlanSmsBatch,
  8: } from "../db/vlanSms.repository.js";
  9: import {
 10:   closeSQMysqlConnection,
 11:   createSQMysqlConnection,
 12:   testSQMysqlConnection,
 13: } from "../SQHelper/mysqlClient.js";
 14: import { checkSQSchemaDrift } from "../SQHelper/vlanSmsSync.schemaDrift.js";
 15: import {
 16:   formatDateForMySQL,
 17:   streamSQVlanSmsRows,
 18: } from "../SQHelper/vlanSmsSync.helper.js";
 19: 
 20: let isRunning = false;
 21: 
 22: function logSyncSummary(status, summary, error = null) {
 23:   const log =
 24:     status === "SUCCESS"
 25:       ? logger.info.bind(logger)
 26:       : logger.error.bind(logger);
 27: 
 28:   log("====================================================");
 29:   log(
 30:     status === "SUCCESS"
 31:       ? "SQ VLAN SMS SYNC SUCCESS SUMMARY"
 32:       : "SQ VLAN SMS SYNC FAILED SUMMARY"
 33:   );
 34:   log("====================================================");
 35: 
 36:   log(`Fetched          : ${summary.fetched}`);
 37:   log(`Inserted         : ${summary.inserted}`);
 38:   log(`Skipped          : ${summary.skipped}`);
 39:   log(`Batches          : ${summary.batches}`);
 40:   log(`Batch Size       : ${summary.batchSize}`);
 41:   log(`Last Sync        : ${summary.lastSync}`);
 42:   log(`Duration Seconds : ${summary.durationSeconds}`);
 43: 
 44:   log(
 45:     `Schema Checked   : ${summary.schemaDrift?.checked ?? false}`
 46:   );
 47: 
 48:   log(
 49:     `New Columns      : ${
 50:       summary.schemaDrift?.newColumns?.length
 51:         ? summary.schemaDrift.newColumns.join(", ")
 52:         : "None"
 53:     }`
 54:   );
 55: 
 56:   if (error) {
 57:     log(`Error Message    : ${error.message}`);
 58:   }
 59: 
 60:   log("====================================================");
 61: }
 62: 
 63: 
 64: async function testPostgresConnection() {
 65:   await pool.query("SELECT 1 AS ok");
 66: }
 67: 
 68: async function insertBatchTransactionally(batch, batchNumber) {
 69:   const client = await pool.connect();
 70: 
 71:   try {
 72:     await client.query("BEGIN");
 73: 
 74:     const inserted = await insertVlanSmsBatch(client, batch);
 75: 
 76:     await client.query("COMMIT");
 77: 
 78:     return inserted;
 79:   } catch (err) {
 80:     try {
 81:       await client.query("ROLLBACK");
 82:     } catch (rollbackErr) {
 83:       logger.error("SQ batch rollback failed", {
 84:         batchNumber,
 85:         error: rollbackErr.message,
 86:         stack: rollbackErr.stack,
 87:       });
 88:     }
 89: 
 90:     logger.error("SQ batch insert failed", {
 91:       batchNumber,
 92:       batchSize: batch.length,
 93:       error: err.message,
 94:       stack: err.stack,
 95:     });
 96: 
 97:     throw err;
 98:   } finally {
 99:     client.release();
100:   }
101: }
102: 
103: export async function runVlanSmsSync() {
104:   if (isRunning) {
105:     const err = new Error("SQ VLAN SMS sync is already running");
106:     err.statusCode = 409;
107:     throw err;
108:   }
109: 
110:   isRunning = true;
111: 
112:   const startedAt = Date.now();
113:   const mysqlConn = createSQMysqlConnection();
114: 
115:   const summary = {
116:     fetched: 0,
117:     inserted: 0,
118:     skipped: 0,
119:     batches: 0,
120:     batchSize: cfg.SQ_VLAN_SMS_BATCH_SIZE,
121:     lastSync: null,
122:     durationSeconds: 0,
123:     schemaDrift: null,
124:   };
125: 
126:   try {
127:     logger.info("SQ VLAN SMS sync started", {
128:       batchSize: cfg.SQ_VLAN_SMS_BATCH_SIZE,
129:       startDate: cfg.SQ_VLAN_SMS_START_DATE,
130:     });
131: 
132:     await testSQMysqlConnection(mysqlConn);
133:     await testPostgresConnection();
134: 
135:     await ensureVlanSmsTable(pool);
136: 
137:     summary.schemaDrift = await checkSQSchemaDrift(mysqlConn, pool);
138: 
139:     const lastSyncFromDb = await getLastVlanSmsSync(pool);
140:     const lastSyncDate = lastSyncFromDb || new Date(cfg.SQ_VLAN_SMS_START_DATE);
141:     const lastSyncForMySQL = formatDateForMySQL(lastSyncDate);
142: 
143:     summary.lastSync = lastSyncForMySQL;
144: 
145:     logger.info("SQ high-water mark determined", {
146:       lastSyncFromDb,
147:       lastSyncForMySQL,
148:     });
149: 
150:     const streamResult = await streamSQVlanSmsRows({
151:       mysqlConn,
152:       lastSyncForMySQL,
153:       batchSize: cfg.SQ_VLAN_SMS_BATCH_SIZE,
154:       onBatch: async (batch, batchNumber, fetchedSoFar) => {
155:         const insertedInBatch = await insertBatchTransactionally(batch, batchNumber);
156: 
157:         summary.inserted += insertedInBatch;
158:         summary.batches = batchNumber;
159: 
160:         if (batchNumber === 1 || batchNumber % 5 === 0) {
161:           logger.info("SQ batch synced", {
162:             batchNumber,
163:             batchSize: batch.length,
164:             fetchedSoFar,
165:             insertedInBatch,
166:             insertedTotal: summary.inserted,
167:           });
168:         }
169:       },
170:     });
171: 
172:     summary.fetched = streamResult.fetchedCount;
173:     summary.batches = streamResult.batchNumber;
174:     summary.skipped = summary.fetched - summary.inserted;
175:     summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));
176: 
177:     logSyncSummary("SUCCESS", summary);
178: 
179:     logger.info("SQ VLAN SMS sync completed successfully", summary);
180: 
181:     return summary;
182:   } catch (err) {
183:     summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));
184:     summary.skipped = summary.fetched - summary.inserted;
185: 
186:     logSyncSummary("FAILED", summary, err);
187: 
188:     logger.error("SQ VLAN SMS sync failed", {
189:       error: err.message,
190:       stack: err.stack,
191:       summary,
192:     });
193: 
194:     err.summary = summary;
195:     throw err;
196:   } finally {
197:     const closeErr = await closeSQMysqlConnection(mysqlConn);
198: 
199:     if (closeErr) {
200:       logger.warn("SQ MySQL connection close returned an error", {
201:         error: closeErr.message,
202:       });
203:     }
204: 
205:     isRunning = false;
206:   }
207: }
````

## File: src/SQHelper/mysqlClient.js
````javascript
 1: import mysql from "mysql2";
 2: import { cfg } from "../config.js";
 3: 
 4: function assertSQMysqlConfig() {
 5:   const missing = [];
 6: 
 7:   if (!cfg.SQ_MYSQL_HOST) missing.push("SQ_MYSQL_HOST");
 8:   if (!cfg.SQ_MYSQL_USER) missing.push("SQ_MYSQL_USER");
 9:   if (!cfg.SQ_MYSQL_PASSWORD) missing.push("SQ_MYSQL_PASSWORD");
10:   if (!cfg.SQ_MYSQL_DATABASE) missing.push("SQ_MYSQL_DATABASE");
11: 
12:   if (missing.length > 0) {
13:     throw new Error(`Missing SQ MySQL environment variables: ${missing.join(", ")}`);
14:   }
15: }
16: 
17: export function createSQMysqlConnection() {
18:   assertSQMysqlConfig();
19: 
20:   return mysql.createConnection({
21:     host: cfg.SQ_MYSQL_HOST,
22:     port: cfg.SQ_MYSQL_PORT,
23:     user: cfg.SQ_MYSQL_USER,
24:     password: cfg.SQ_MYSQL_PASSWORD,
25:     database: cfg.SQ_MYSQL_DATABASE,
26: 
27: 
28:     timezone: "Z",
29: 
30:     connectTimeout: 60000,
31:   });
32: }
33: 
34: export function testSQMysqlConnection(mysqlConn) {
35:   return new Promise((resolve, reject) => {
36:     mysqlConn.query("SELECT 1 AS ok", (err) => {
37:       if (err) {
38:         reject(new Error(`SQ MySQL connection failed: ${err.message}`));
39:         return;
40:       }
41: 
42:       resolve(true);
43:     });
44:   });
45: }
46: 
47: export function closeSQMysqlConnection(mysqlConn) {
48:   return new Promise((resolve) => {
49:     if (!mysqlConn) return resolve();
50: 
51:     mysqlConn.end((err) => {
52: 
53:       resolve(err || null);
54:     });
55:   });
56: }
````

## File: src/SQHelper/vlanSmsSync.helper.js
````javascript
  1: import { cfg } from "../config.js";
  2: import logger from "../logger.js";
  3: import { mapVlanSmsRow } from "./vlanSmsSync.mapper.js";
  4: 
  5: export function formatDateForMySQL(value) {
  6:   const date = value instanceof Date ? value : new Date(value);
  7: 
  8:   if (Number.isNaN(date.getTime())) {
  9:     throw new Error(`Invalid date for MySQL high-water mark: ${value}`);
 10:   }
 11: 
 12:   const yyyy = date.getUTCFullYear();
 13:   const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
 14:   const dd = String(date.getUTCDate()).padStart(2, "0");
 15:   const hh = String(date.getUTCHours()).padStart(2, "0");
 16:   const mi = String(date.getUTCMinutes()).padStart(2, "0");
 17:   const ss = String(date.getUTCSeconds()).padStart(2, "0");
 18:   const ms = String(date.getUTCMilliseconds()).padStart(3, "0");
 19: 
 20:   return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ms}`;
 21: }
 22: 
 23: export function buildVlanSmsSyncQuery() {
 24:   return `
 25:     SELECT
 26:       v.ID AS id,
 27:       v.vlan_id,
 28:       s.phone_number,
 29:       s.message,
 30:       s.createdAt,
 31:       s.updatedAt
 32:     FROM vlan v
 33:     JOIN sent_SMS s ON v.message_id = s.ID
 34:     WHERE s.createdAt > ?
 35:     ORDER BY s.createdAt ASC, v.ID ASC
 36:   `;
 37: }
 38: 
 39: export async function streamSQVlanSmsRows({
 40:   mysqlConn,
 41:   lastSyncForMySQL,
 42:   onBatch,
 43:   batchSize = cfg.SQ_VLAN_SMS_BATCH_SIZE,
 44: }) {
 45:   const query = buildVlanSmsSyncQuery();
 46: 
 47:   let fetchedCount = 0;
 48:   let batchNumber = 0;
 49:   let batch = [];
 50: 
 51:   logger.info("SQ MySQL streaming started", {
 52:     lastSyncForMySQL,
 53:     batchSize,
 54:   });
 55: 
 56:   const stream = mysqlConn
 57:     .query(query, [lastSyncForMySQL])
 58:     .stream({
 59:       highWaterMark: batchSize,
 60:     });
 61: 
 62:   try {
 63:     for await (const row of stream) {
 64:       fetchedCount += 1;
 65: 
 66:       const mapped = mapVlanSmsRow(row);
 67: 
 68:       if (!mapped.id) {
 69:         logger.warn("SQ row skipped because id is missing", { row });
 70:         continue;
 71:       }
 72: 
 73:       batch.push(mapped);
 74: 
 75:       if (batch.length >= batchSize) {
 76:         batchNumber += 1;
 77: 
 78:         await onBatch(batch, batchNumber, fetchedCount);
 79: 
 80:         batch = [];
 81:       }
 82:     }
 83: 
 84:     if (batch.length > 0) {
 85:       batchNumber += 1;
 86: 
 87:       await onBatch(batch, batchNumber, fetchedCount);
 88:     }
 89: 
 90:     logger.info("SQ MySQL streaming completed", {
 91:       fetchedCount,
 92:       batchNumber,
 93:     });
 94: 
 95:     return {
 96:       fetchedCount,
 97:       batchNumber,
 98:     };
 99:   } catch (err) {
100:     logger.error("SQ MySQL streaming failed", {
101:       error: err.message,
102:       stack: err.stack,
103:       fetchedCount,
104:       batchNumber,
105:     });
106: 
107:     throw err;
108:   }
109: }
````

## File: src/SQHelper/vlanSmsSync.mapper.js
````javascript
 1: function toNullableString(value) {
 2:   if (value === undefined || value === null) return null;
 3:   return String(value);
 4: }
 5: 
 6: function toNullableNumber(value) {
 7:   if (value === undefined || value === null || value === "") return null;
 8: 
 9:   const n = Number(value);
10:   return Number.isFinite(n) ? n : null;
11: }
12: 
13: function toIsoOrNull(value) {
14:   if (value === undefined || value === null || value === "") return null;
15: 
16:   if (value instanceof Date) {
17:     return Number.isNaN(value.getTime()) ? null : value.toISOString();
18:   }
19: 
20:   const date = new Date(value);
21:   return Number.isNaN(date.getTime()) ? null : date.toISOString();
22: }
23: 
24: export function mapVlanSmsRow(row) {
25:   return {
26:     id: toNullableString(row.id),
27:     vlan_id: toNullableNumber(row.vlan_id),
28:     phone_number: toNullableString(row.phone_number),
29:     message: row.message ?? null,
30:     created_at: toIsoOrNull(row.createdAt),
31:     updated_at: toIsoOrNull(row.updatedAt),
32:   };
33: }
````

## File: src/SQHelper/vlanSmsSync.schemaDrift.js
````javascript
 1: import logger from "../logger.js";
 2: 
 3: function queryMysql(mysqlConn, sql, params = []) {
 4:   return new Promise((resolve, reject) => {
 5:     mysqlConn.query(sql, params, (err, rows) => {
 6:       if (err) return reject(err);
 7:       resolve(rows || []);
 8:     });
 9:   });
10: }
11: 
12: export async function checkSQSchemaDrift(mysqlConn, pgPool) {
13:   logger.info("SQ schema drift check started");
14: 
15:   try {
16:     const [smsColumns, vlanColumns, pgResult] = await Promise.all([
17:       queryMysql(mysqlConn, "SHOW COLUMNS FROM sent_SMS"),
18:       queryMysql(mysqlConn, "SHOW COLUMNS FROM vlan"),
19:       pgPool.query(
20:         `
21:         SELECT column_name
22:         FROM information_schema.columns
23:         WHERE table_name = 'vlan_sms'
24:         `
25:       ),
26:     ]);
27: 
28:     const mysqlColumnNames = [
29:       ...smsColumns.map((col) => col.Field),
30:       ...vlanColumns.map((col) => col.Field),
31:     ];
32: 
33:     const expectedSourceColumns = [
34:       "ID",
35:       "vlan_id",
36:       "message_id",
37:       "phone_number",
38:       "message",
39:       "createdAt",
40:       "updatedAt",
41:     ];
42: 
43:     const pgColumnNames = pgResult.rows.map((row) => row.column_name.toLowerCase());
44: 
45:     const newColumns = mysqlColumnNames.filter((columnName) => {
46:       return (
47:         !expectedSourceColumns.includes(columnName) &&
48:         !pgColumnNames.includes(columnName.toLowerCase())
49:       );
50:     });
51: 
52:     if (newColumns.length > 0) {
53:       logger.warn("SQ schema drift detected", {
54:         newColumns,
55:         action:
56:           "Review whether these MySQL columns must be added to PostgreSQL vlan_sms and mapper/repository.",
57:       });
58:     } else {
59:       logger.info("SQ schema drift check passed");
60:     }
61: 
62:     return {
63:       checked: true,
64:       newColumns,
65:     };
66:   } catch (err) {
67: 
68: 
69:     logger.warn("SQ schema drift check failed; continuing sync", {
70:       error: err.message,
71:       stack: err.stack,
72:     });
73: 
74:     return {
75:       checked: false,
76:       error: err.message,
77:       newColumns: [],
78:     };
79:   }
80: }
````

## File: src/SQL/setup-mysql.sql
````sql
 1: DROP TABLE IF EXISTS vlan;
 2: DROP TABLE IF EXISTS sent_sms;
 3: 
 4: 
 5: CREATE TABLE sent_sms (
 6:     ID VARCHAR(50) PRIMARY KEY,
 7:     phone_number VARCHAR(20),
 8:     message TEXT,
 9:     createdAt DATETIME(3),
10:     updatedAt DATETIME(3)
11: );
12: 
13: 
14: CREATE TABLE vlan (
15:     ID VARCHAR(50) PRIMARY KEY,
16:     vlan_id INT,
17:     message_id VARCHAR(50),
18:     createdAt DATETIME(3),
19:     updatedAt DATETIME(3),
20:     FOREIGN KEY (message_id) REFERENCES sent_sms(ID)
21: );
22: 
23: SELECT '✅ Tables created successfully!' as status;
24: 
25: 
26: CREATE INDEX idx_sent_sms_createdat ON sent_sms(createdAt);
````

## File: src/SQL/setup-postgres.sql
````sql
 1: CREATE TABLE IF NOT EXISTS vlan_sms (
 2:   id VARCHAR(50) PRIMARY KEY,
 3:   vlan_id INTEGER,
 4:   phone_number VARCHAR(20),
 5:   message TEXT,
 6:   "createdAt" TIMESTAMPTZ,
 7:   "updatedAt" TIMESTAMPTZ,
 8:   synced_at TIMESTAMPTZ DEFAULT NOW()
 9: );
10: 
11: CREATE INDEX IF NOT EXISTS idx_vlan_sms_vlan_id
12: ON vlan_sms(vlan_id);
13: 
14: CREATE INDEX IF NOT EXISTS idx_vlan_sms_createdat
15: ON vlan_sms("createdAt");
````

## File: .gitignore
````
1: .env
2: .env*
3: 
4: node_modules/
````

## File: Dockerfile
````dockerfile
 1: FROM node:20-alpine
 2: 
 3: WORKDIR /app
 4: 
 5: COPY package*.json ./
 6: RUN npm install
 7: 
 8: COPY . .
 9: 
10: EXPOSE 9091
11: 
12: CMD ["npm", "start"]
````

## File: ecosystem.config.cjs
````javascript
 1: module.exports = {
 2:   apps: [
 3:     {
 4:       name: "datahub_api",
 5: 
 6:       script: "npm",
 7:       args: "run start",
 8: 
 9:       instances: 1,
10:       exec_mode: "fork",
11: 
12:       autorestart: true,
13:       watch: false,
14:       max_memory_restart: "1G",
15: 
16:       error_file: "/var/log/datahub_api/pm2/err.log",
17:       out_file: "/var/log/datahub_api/pm2/out.log",
18:       log_date_format: "YYYY-MM-DD HH:mm:ss"
19:     }
20:   ]
21: };
````

## File: package.json
````json
 1: {
 2:   "name": "datahub_api",
 3:   "version": "1.0.0",
 4:   "description": "Server 2 API service for incremental data fetching and storage using Timescaledb, Express, and secure logging.",
 5:   "main": "src/server.js",
 6:   "type": "module",
 7:   "scripts": {
 8:     "dev": "nodemon src/server.js",
 9:     "start": "node src/server.js",
10:     "lint": "eslint ."
11:   },
12:   "dependencies": {
13:     "@prisma/client": "^6.16.3",
14:     "axios": "^1.7.2",
15:     "cors": "^2.8.5",
16:     "dotenv": "^16.3.1",
17:     "express": "^4.19.2",
18:     "helmet": "^7.1.0",
19:     "moment": "^2.29.4",
20:     "moment-duration-format": "^2.3.2",
21:     "moment-timezone": "^0.6.0",
22:     "mysql2": "^3.22.3",
23:     "node-cron": "^3.0.3",
24:     "pg": "^8.11.5",
25:     "winston": "^3.11.0",
26:     "zod": "^3.25.76"
27:   },
28:   "devDependencies": {
29:     "eslint": "^9.13.0",
30:     "eslint-config-prettier": "^9.1.0",
31:     "eslint-plugin-node": "^11.1.0",
32:     "nodemon": "^3.1.0"
33:   },
34:   "engines": {
35:     "node": ">=20.0.0"
36:   },
37:   "keywords": [
38:     "express",
39:     "api",
40:     "data-fetcher",
41:     "nodejs",
42:     "logging",
43:     "security",
44:     "zod"
45:   ],
46:   "author": "Salman Channa",
47:   "license": "MIT"
48: }
````

## File: scripts/call_sessions_api.sh
````bash
1: URL="http://localhost:3010/api/sessions"
2: LOG_FILE="/var/log/datahub_api/curl_sessions.log"
3: 
4: curl -s -X POST "$URL" >> "$LOG_FILE" 2>&1
5: echo "---- $(date '+%Y-%m-%d %H:%M:%S') ----" >> "$LOG_FILE"
6: 
7: 
8: crontab -e
9: */10 * * * * /data/scripts/call_sessions_api.sh
````

## File: src/app.js
````javascript
  1: import express from "express"
  2: import cors from "cors";
  3: import helmet from "helmet";
  4: import logger from "./logger.js";
  5: import sessionRoutes from "./routes/sessions.route.js"
  6: import { cfg } from "./config.js";
  7: import vlanSmsSyncRoutes from "./routes/vlanSmsSync.route.js";
  8: 
  9: const app = express()
 10: 
 11: app.use(cors());
 12: app.use(helmet());
 13: 
 14: app.use(express.json());
 15: app.use(express.urlencoded({ extended: true }));
 16: 
 17: 
 18: 
 19: app.use((req, res, next) => {
 20:   const start = process.hrtime.bigint();
 21: 
 22: 
 23:   logger.info("Incoming request", {
 24:     method: req.method,
 25:     url: req.originalUrl,
 26:   });
 27: 
 28: 
 29:   res.on("finish", () => {
 30:     const end = process.hrtime.bigint();
 31:     const durationMs = Number(end - start) / 1e6;
 32: 
 33:     if (cfg.IS_PROD) {
 34:       logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, { durationMs });
 35:     } else {
 36:       logger.info("Request completed", {
 37:         method: req.method,
 38:         url: req.originalUrl,
 39:         status: res.statusCode,
 40:         durationMs,
 41:         body: req.body,
 42:       });
 43:     }
 44:   });
 45: 
 46:   next();
 47: });
 48: 
 49: 
 50: 
 51: 
 52: 
 53: 
 54: 
 55: 
 56: 
 57: 
 58: 
 59: 
 60: 
 61: 
 62: 
 63: 
 64: 
 65: 
 66: 
 67: app.use("/api/sessions", sessionRoutes)
 68: 
 69: 
 70: app.use("/api/vlan-sms-sync", vlanSmsSyncRoutes);
 71: 
 72: 
 73: app.use((req, res) => {
 74:   res.status(404).json({ error: 'Not Found' });
 75: });
 76: 
 77: 
 78: app.use((err, req, res, next) => {
 79:   logger.error("Unhandled error", { error: err, url: req.url, method: req.method });
 80:   res.status(500).json({ error: "Internal server error" });
 81: });
 82: 
 83: 
 84: 
 85: async function logStartupInfo() {
 86:   try {
 87:     logger.info("====================================================");
 88:     logger.info("Server Startup Information");
 89:     logger.info("====================================================");
 90:     logger.info(`Environment      : ${cfg.IS_PROD ? "Production" : "Development"}`);
 91:     logger.info(`Log Level        : ${cfg.LOG_LEVEL}`);
 92:     logger.info(`Log Directory    : ${cfg.LOG_PATH}`);
 93:     logger.info(`Server Port      : ${cfg.PORT}`);
 94: 
 95:     logger.info(`Database URL     : ${cfg.DATABASE_URL.replace(/\/\/.*@/, "//****:****@")}`);
 96:     logger.info("====================================================");
 97:   } catch (err) {
 98:     logger.error("Error while logging server info on startup", { error: err });
 99:   }
100: }
101: 
102: await logStartupInfo();
103: 
104: export default app
````

## File: src/asp/aspSessions.paged.service.js
````javascript
  1: import logger from "../logger.js";
  2: import { getSessions } from "../ASPHelper/Apis.js";
  3: 
  4: function sleep(ms) {
  5:   return new Promise((r) => setTimeout(r, ms));
  6: }
  7: 
  8: function safeSessionArray(resp) {
  9:   return resp?.data?.session ?? [];
 10: }
 11: 
 12: function safeResultCode(resp) {
 13:   return resp?.resultCode;
 14: }
 15: 
 16: function safeResult(resp) {
 17:   return resp?.result;
 18: }
 19: 
 20: function safeTotalCount(resp) {
 21:   const n = Number(resp?.count);
 22:   return Number.isFinite(n) ? n : null;
 23: }
 24: 
 25: 
 26: 
 27: 
 28: 
 29: 
 30: 
 31: 
 32: 
 33: export async function fetchAllPages(paramsBase, scope, opts = {}) {
 34:   const limit = Number(paramsBase.limit ?? 10000);
 35:   const pageDelayMs = Number(opts.pageDelayMs ?? 200);
 36:   const maxPages = Number(opts.maxPages ?? 2000);
 37:   const logCtx = opts.logCtx ?? {};
 38: 
 39:   let page = 0;
 40:   let total = 0;
 41:   const all = [];
 42: 
 43:   let totalCount = null;
 44:   let totalPages = null;
 45:   let stopReason = null;
 46: 
 47:   while (true) {
 48:     if (page > maxPages) {
 49:       stopReason = "maxPages_reached";
 50:       logger.warn("ASP pagination stopped (safety)", {
 51:         ...logCtx,
 52:         stopReason,
 53:         page,
 54:         maxPages,
 55:         runningTotal: total,
 56:         totalCount,
 57:         totalPages,
 58:       });
 59:       break;
 60:     }
 61: 
 62:     const params = { ...paramsBase, page, limit };
 63: 
 64: 
 65: 
 66:     const resp = await getSessions(params, scope);
 67:     const items = safeSessionArray(resp);
 68: 
 69: 
 70:     if (totalCount === null) {
 71:       totalCount = safeTotalCount(resp);
 72: 
 73:       if (totalCount !== null) {
 74:         totalPages = Math.ceil(totalCount / limit);
 75: 
 76: 
 77: 
 78: 
 79: 
 80: 
 81: 
 82: 
 83: 
 84:         if (totalCount === 0) {
 85: 
 86: 
 87: 
 88: 
 89: 
 90: 
 91: 
 92: 
 93:           break;
 94:         }
 95:       } else {
 96:         logger.warn("ASP response missing numeric count; using fallback stop", {
 97:           ...logCtx,
 98:           page,
 99:           count: resp?.count,
100:         });
101:       }
102:     }
103: 
104:     all.push(...items);
105:     total += items.length;
106: 
107: 
108: 
109: 
110: 
111: 
112: 
113: 
114: 
115: 
116: 
117: 
118: 
119:     if (items.length === 0) {
120: 
121: 
122: 
123: 
124: 
125: 
126: 
127: 
128: 
129: 
130:       break;
131:     }
132: 
133: 
134: 
135: 
136:     if (totalPages !== null) {
137:       if (page >= (totalPages - 1)) {
138: 
139: 
140: 
141: 
142: 
143: 
144: 
145: 
146: 
147:         break;
148:       }
149:     } else {
150:       if (items.length < limit) {
151: 
152: 
153: 
154: 
155: 
156: 
157: 
158: 
159: 
160:         break;
161:       }
162:     }
163: 
164:     page += 1;
165: 
166:     if (pageDelayMs > 0) {
167: 
168:       await sleep(pageDelayMs);
169:     }
170:   }
171: 
172: 
173: 
174: 
175: 
176: 
177: 
178: 
179: 
180: 
181:   return all;
182: }
183: 
184: 
185: 
186: 
187: 
188: 
189: export async function fetchSessionsByWindowPaged({
190:   window,
191:   baseParams,
192:   scope = "all",
193:   pageDelayMs = 200,
194:   maxPages = 2000,
195: }) {
196:   const common = { ...baseParams };
197: 
198:   const startParams = {
199:     ...common,
200:     sessionStartDateTimeStart: window.from,
201:     sessionStartDateTimeEnd: window.to,
202:   };
203: 
204:   const stopParams = {
205:     ...common,
206:     sessionStopDateTimeStart: window.from,
207:     sessionStopDateTimeEnd: window.to,
208:   };
209: 
210:   const logBase = { scope, window };
211: 
212:   const [startArr, endArr] = await Promise.all([
213:     fetchAllPages(startParams, scope, {
214:       pageDelayMs,
215:       maxPages,
216:       logCtx: { ...logBase, type: "start" },
217:     }),
218:     fetchAllPages(stopParams, scope, {
219:       pageDelayMs,
220:       maxPages,
221:       logCtx: { ...logBase, type: "stop" },
222:     }),
223:   ]);
224: 
225:   return { startArr, endArr };
226: }
````

## File: src/asp/aspSessions.service.js
````javascript
 1: import { getSessions } from "../ASPHelper/Apis.js";
 2: 
 3: export function extractSessions(resp) {
 4:   return resp?.data?.session ?? [];
 5: }
 6: 
 7: export async function fetchSessionsByWindow(dateTimeRange, baseParams) {
 8:   const startParams = {
 9:     ...baseParams,
10:     sessionStartDateTimeStart: dateTimeRange.from,
11:     sessionStartDateTimeEnd: dateTimeRange.to,
12:   };
13: 
14:   const endParams = {
15:     ...baseParams,
16:     sessionStopDateTimeStart: dateTimeRange.from,
17:     sessionStopDateTimeEnd: dateTimeRange.to,
18:   };
19: 
20:   const [startResp, endResp] = await Promise.all([
21:     getSessions(startParams, "all"),
22:     getSessions(endParams, "all"),
23:   ]);
24: 
25:   return {
26:     startResp,
27:     endResp,
28:     startArr: extractSessions(startResp),
29:     endArr: extractSessions(endResp),
30:   };
31: }
````

## File: src/ASPHelper/Apis.js
````javascript
 1: import axios from "axios";
 2: import { cfg } from "../config.js";
 3: import https from "https";
 4: 
 5: const insecureHttpsAgent = new https.Agent({
 6:   rejectUnauthorized: false
 7: });
 8: 
 9: const ASP_URL = cfg.ASP_API_BASE_URL;
10: 
11: export async function getToken() {
12:   try {
13:     const res = await axios.post(
14:       `${ASP_URL}/auth/token`,
15:       null,
16:       {
17:         httpsAgent: insecureHttpsAgent,
18:         params: {
19:           orgId: cfg.ASP_API_ORGID,
20:           userId: cfg.ASP_API_USERNAME,
21:           password: cfg.ASP_API_PASSWORD
22:         }
23:       }
24:     );
25: 
26:     return res.data?.token ?? null;
27: 
28:   } catch (error) {
29:     console.error("Failed to create ASP token", error?.cause || error);
30:     return null;
31:   }
32: }
33: 
34: export async function getSessions(params, siteToken = "all") {
35:   try {
36:     const tokenValue = await getToken();
37:     if (!tokenValue) return null;
38: 
39:     const res = await axios.get(
40:       `${ASP_URL}/sites/${siteToken}/sessions`,
41:       {
42:         httpsAgent: insecureHttpsAgent,
43:         params,
44:         headers: {
45:           Authorization: tokenValue,
46:           "Content-Type": "application/json;charset=utf-8"
47:         }
48:       }
49:     );
50: 
51:     return res.data;
52: 
53:   } catch (error) {
54:     console.error("Failed to get data", error?.cause || error);
55:     return null;
56:   }
57: }
````

## File: src/config.js
````javascript
 1: import dotenv from "dotenv";
 2: import { z } from "zod";
 3: import path from "path";
 4: 
 5: dotenv.config();
 6: 
 7: const schema = z.object({
 8:   PORT: z.coerce.number().default(3000),
 9:   DATABASE_URL: z.string(),
10:   ASP_API_BASE_URL: z.string(),
11:   ASP_API_USERNAME: z.string(),
12:   ASP_API_PASSWORD: z.string(),
13:   ASP_API_ORGID: z.string(),
14:   LOG_LEVEL: z.string().default("info"),
15:   LOG_PATH: z.string().default(path.join(process.cwd(), "logs")),
16:   IS_PROD: z.boolean().default(false),
17: 
18: 
19: 
20: 
21:   SQ_MYSQL_HOST: z.string().optional(),
22:   SQ_MYSQL_PORT: z.coerce.number().default(3306),
23:   SQ_MYSQL_USER: z.string().optional(),
24:   SQ_MYSQL_PASSWORD: z.string().optional(),
25:   SQ_MYSQL_DATABASE: z.string().optional(),
26: 
27:   SQ_VLAN_SMS_BATCH_SIZE: z.coerce.number().default(5000),
28:   SQ_VLAN_SMS_START_DATE: z.string().default("2024-01-01"),
29: });
30: 
31: const env = {
32:   ...process.env,
33:   IS_PROD: (process.env.IS_PROD == "true")
34: }
35: const cfg = schema.parse(env);
36: export {cfg};
````

## File: src/db/pgPool.js
````javascript
 1: import pg from "pg";
 2: import { cfg } from "../config.js";
 3: 
 4: const { Pool } = pg;
 5: 
 6: const pool = new Pool({
 7:   connectionString: cfg.DATABASE_URL,
 8: });
 9: 
10: export default pool;
````

## File: src/db/session.repository.js
````javascript
 1: const UPSERT_SQL = `
 2: WITH data AS (
 3:   SELECT *
 4:   FROM jsonb_to_recordset($1::jsonb) AS d(
 5:     site_token text,
 6:     session_id text,
 7:     local_id text,
 8:     nas_ip_address text,
 9:     vlan text,
10:     duration int,
11:     download_bytes text,
12:     upload_bytes text,
13:     mac_address text,
14:     ip_address text,
15:     device text,
16:     browser text,
17:     os text,
18:     terminate_cause text,
19:     session_start timestamptz,
20:     session_stop timestamptz,
21:     session_updated timestamptz
22:   )
23: ),
24: updated AS (
25:   UPDATE session s
26:   SET
27:     duration        = d.duration,
28:     download_bytes  = NULLIF(d.download_bytes, '')::bigint,
29:     upload_bytes    = NULLIF(d.upload_bytes, '')::bigint,
30:     terminate_cause = d.terminate_cause,
31:     session_stop    = d.session_stop
32:   FROM data d
33:   WHERE s.session_id = d.session_id
34:     AND s.session_start = d.session_start
35:   RETURNING s.session_id
36: )
37: INSERT INTO session (
38:   site_token,
39:   session_id,
40:   local_id,
41:   nas_ip_address,
42:   vlan,
43:   duration,
44:   download_bytes,
45:   upload_bytes,
46:   mac_address,
47:   ip_address,
48:   device,
49:   browser,
50:   os,
51:   terminate_cause,
52:   session_start,
53:   session_stop,
54:   session_updated
55: )
56: SELECT
57:   d.site_token,
58:   d.session_id,
59:   d.local_id,
60:   d.nas_ip_address,
61:   d.vlan,
62:   d.duration,
63:   NULLIF(d.download_bytes, '')::bigint,
64:   NULLIF(d.upload_bytes, '')::bigint,
65:   d.mac_address,
66:   d.ip_address,
67:   d.device,
68:   d.browser,
69:   d.os,
70:   d.terminate_cause,
71:   d.session_start,
72:   d.session_stop,
73:   d.session_updated
74: FROM data d
75: WHERE NOT EXISTS (
76:   SELECT 1 FROM session s
77:   WHERE s.session_id = d.session_id
78:     AND s.session_start = d.session_start
79: 
80: );
81: `;
82: 
83: export async function upsertSessions(client, sessions) {
84:   if (!sessions?.length) return 0;
85:   await client.query(UPSERT_SQL, [JSON.stringify(sessions)]);
86:   return sessions.length;
87: }
````

## File: src/logger.js
````javascript
 1: import fs from "fs";
 2: import path from "path";
 3: import winston from "winston";
 4: import { cfg } from "./config.js";
 5: 
 6: const logDir = cfg.LOG_PATH;
 7: if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
 8: 
 9: 
10: const jsonFormat = winston.format.combine(
11:   winston.format.timestamp(),
12:   winston.format.errors({ stack: true }),
13:   winston.format.splat(),
14:   winston.format.json()
15: );
16: 
17: const consoleFormat = winston.format.combine(
18:   winston.format.colorize(),
19:   winston.format.timestamp(),
20:   winston.format.printf(({ timestamp, level, message, ...meta }) => {
21:     const metaString = Object.keys(meta).length ? JSON.stringify(meta) : "";
22:     return `[${timestamp}] ${level}: ${message} ${metaString}`;
23:   })
24: );
25: 
26: const logger = winston.createLogger({
27:   level: cfg.LOG_LEVEL,
28:   format: jsonFormat,
29:   transports: [
30:     new winston.transports.File({
31:       filename: path.join(logDir, "error.log"),
32:       level: "error",
33:       maxsize: 10 * 1024 * 1024,
34:       maxFiles: 5,
35:       tailable: true,
36:     }),
37:     new winston.transports.File({
38:       filename: path.join(logDir, "combined.log"),
39:       level: cfg.IS_PROD ? "warn" : "info",
40:       maxsize: 50 * 1024 * 1024,
41:       maxFiles: 5,
42:       tailable: true,
43:     }),
44:     new winston.transports.Console({
45:       format: consoleFormat,
46:       silent: cfg.IS_PROD,
47:     }),
48:   ],
49:   exceptionHandlers: [
50:     new winston.transports.File({ filename: path.join(logDir, "exceptions.log") }),
51:   ],
52:   rejectionHandlers: [
53:     new winston.transports.File({ filename: path.join(logDir, "rejections.log") }),
54:   ],
55: });
56: 
57: export default logger;
````

## File: src/routes/sessions.route.js
````javascript
  1: import express from "express";
  2: import { getWindow10MinBack1Day } from "../utils/utils.js";
  3: import { pullAndStoreSessions } from "../services/session.service.js";
  4: import { pullAndStoreSessionsRangePaged } from "../services/sessionRangePaged.service.js";
  5: import logger from "../logger.js";
  6: 
  7: const router = express.Router();
  8: 
  9: router.post("/", async (req, res) => {
 10:   try {
 11: 
 12:     const window = getWindow10MinBack1Day();
 13:     const baseParams = { page: 0, limit: 10000 };
 14: 
 15:     const result = await pullAndStoreSessions(window, baseParams);
 16: 
 17: 
 18:     logger.info(
 19:       "Session pull succeeded",
 20:       {
 21:         window,
 22:         result
 23:       }
 24:     );
 25: 
 26:     res.json({
 27:       status: "ok",
 28:       window,
 29:       ...result,
 30:     });
 31: 
 32:   } catch (err) {
 33:     logger.error("Session pull failed:", err);
 34:     res.status(500).json({ status: "error", message: err.message });
 35:   }
 36: });
 37: 
 38: 
 39: 
 40: 
 41: 
 42: 
 43: 
 44: 
 45: 
 46: 
 47: 
 48: 
 49: 
 50: router.post("/range", async (req, res) => {
 51:   try {
 52:     const { from, to } = req.body;
 53: 
 54:     if (!from || !to) {
 55:       return res.status(400).json({
 56:         status: "error",
 57:         message: "from and to are required in format YYYY-MM-DD HH:mm:ss (UTC)",
 58:       });
 59:     }
 60: 
 61:     const chunkMinutes = Number(req.body?.chunkMinutes ?? 60);
 62:     const windowDelayMs = Number(req.body?.windowDelayMs ?? 500);
 63:     const pageDelayMs = Number(req.body?.pageDelayMs ?? 200);
 64:     const maxPages = Number(req.body?.maxPages ?? 2000);
 65: 
 66: 
 67:     const baseParams = { page: 0, limit: 10000 };
 68: 
 69:     const window = { from, to };
 70: 
 71: 
 72: 
 73: 
 74: 
 75: 
 76: 
 77: 
 78: 
 79: 
 80:     const summary = await pullAndStoreSessionsRangePaged({
 81:       window,
 82:       baseParams,
 83:       chunkMinutes,
 84:       windowDelayMs,
 85:       pageDelayMs,
 86:       maxPages,
 87:       scope: "all",
 88: 
 89: 
 90: 
 91:     });
 92: 
 93:     res.json({ status: "ok", window, summary });
 94:   } catch (err) {
 95:     logger.error("Custom range pull failed", { error: err.message, stack: err.stack });
 96:     res.status(500).json({ status: "error", message: err.message });
 97:   }
 98: });
 99: 
100: export default router;
````

## File: src/server.js
````javascript
1: import { cfg } from "./config.js";
2: import app from "./app.js";
3: import logger from "./logger.js";
4: 
5: app.listen(cfg.PORT, () => {
6:   logger.info(`Datahub API running on port ${cfg.PORT}`);
7: }).on('error', (err) => {
8:   logger.error('Failed to start server', err);
9: });
````

## File: src/services/session.service.js
````javascript
 1: import pool from "../db/pgPool.js";
 2: import { fetchSessionsByWindow } from "../asp/aspSessions.service.js";
 3: import { mergeSessions } from "../utils/sessionMerger.js";
 4: import { upsertSessions } from "../db/session.repository.js";
 5: 
 6: export async function pullAndStoreSessions(dateTimeRange, baseParams) {
 7:   const client = await pool.connect();
 8: 
 9:   try {
10:     const { startResp, endResp, startArr, endArr } =
11:       await fetchSessionsByWindow(dateTimeRange, baseParams);
12: 
13:     const merged = mergeSessions(startArr, endArr);
14: 
15:     await client.query("BEGIN");
16:     const stored = await upsertSessions(client, merged);
17:     await client.query("COMMIT");
18: 
19:     return {
20: 
21: 
22:       fetched: { start: startArr.length, end: endArr.length },
23:       merged: merged.length,
24:       stored,
25:     };
26:   } catch (err) {
27:     await client.query("ROLLBACK");
28:     throw err;
29:   } finally {
30:     client.release();
31:   }
32: }
````

## File: src/services/sessionRangePaged.service.js
````javascript
  1: import logger from "../logger.js";
  2: import pool from "../db/pgPool.js";
  3: import { upsertSessions } from "../db/session.repository.js";
  4: import { mergeSessions } from "../utils/sessionMerger.js";
  5: import { fetchSessionsByWindowPaged } from "../asp/aspSessions.paged.service.js";
  6: 
  7: function sleep(ms) {
  8:   return new Promise((r) => setTimeout(r, ms));
  9: }
 10: 
 11: 
 12: function toMs(dateStr) {
 13:   const iso = dateStr.replace(" ", "T") + "Z";
 14:   const ms = Date.parse(iso);
 15:   if (!Number.isFinite(ms)) throw new Error(`Invalid datetime: ${dateStr}`);
 16:   return ms;
 17: }
 18: 
 19: function msToWindowStr(ms) {
 20:   const d = new Date(ms);
 21:   const yyyy = d.getUTCFullYear();
 22:   const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
 23:   const dd = String(d.getUTCDate()).padStart(2, "0");
 24:   const hh = String(d.getUTCHours()).padStart(2, "0");
 25:   const mi = String(d.getUTCMinutes()).padStart(2, "0");
 26:   const ss = String(d.getUTCSeconds()).padStart(2, "0");
 27:   return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
 28: }
 29: 
 30: function buildChunks(window, chunkMinutes) {
 31:   const startMs = toMs(window.from);
 32:   const endMs = toMs(window.to);
 33: 
 34:   if (endMs <= startMs) throw new Error("to must be greater than from");
 35: 
 36:   const stepMs = chunkMinutes * 60 * 1000;
 37:   const chunks = [];
 38: 
 39:   let cur = startMs;
 40:   while (cur < endMs) {
 41:     const next = Math.min(cur + stepMs, endMs);
 42:     chunks.push({ from: msToWindowStr(cur), to: msToWindowStr(next) });
 43:     cur = next;
 44:   }
 45: 
 46:   return chunks;
 47: }
 48: 
 49: 
 50: 
 51: 
 52: 
 53: 
 54: 
 55: export async function pullAndStoreSessionsRangePaged({
 56:   window,
 57:   baseParams = { page: 0, limit: 10000 },
 58:   chunkMinutes = 60,
 59:   windowDelayMs = 500,
 60:   pageDelayMs = 200,
 61:   maxPages = 2000,
 62:   scope = "all",
 63: 
 64: 
 65: }) {
 66:   const chunks = buildChunks(window, chunkMinutes);
 67: 
 68:   const summary = {
 69:     totalWindows: chunks.length,
 70:     completedWindows: 0,
 71:     totalFetchedStart: 0,
 72:     totalFetchedEnd: 0,
 73:     totalMerged: 0,
 74:     totalStored: 0,
 75:     windows: [],
 76:   };
 77: 
 78:   logger.info("Session range paged pull started", {
 79:     window,
 80:     chunkMinutes,
 81:     windowDelayMs,
 82:     pageDelayMs,
 83:     maxPages,
 84:     limit: baseParams.limit,
 85:     totalWindows: chunks.length,
 86:     scope,
 87:   });
 88: 
 89:   for (let i = 0; i < chunks.length; i++) {
 90:     const w = chunks[i];
 91:     const index = i + 1;
 92: 
 93:     logger.info("Range window started", { index, total: chunks.length, window: w });
 94: 
 95:     const t0 = Date.now();
 96: 
 97: 
 98:     const { startArr, endArr } = await fetchSessionsByWindowPaged({
 99:       window: w,
100:       baseParams: { ...baseParams, limit: baseParams.limit ?? 10000 },
101:       scope,
102:       pageDelayMs,
103:       maxPages,
104:     });
105: 
106: 
107:     const merged = mergeSessions(startArr, endArr);
108: 
109: 
110: 
111: 
112: 
113: 
114: 
115: 
116: 
117: 
118:     const client = await pool.connect();
119:     let stored = 0;
120: 
121:     try {
122:       await client.query("BEGIN");
123:       stored = await upsertSessions(client, merged);
124:       await client.query("COMMIT");
125:     } catch (err) {
126:       try {
127:         await client.query("ROLLBACK");
128:       } catch (_) {}
129:       logger.error("Range window DB transaction failed", {
130:         index,
131:         window: w,
132:         error: err.message,
133:         stack: err.stack,
134:       });
135:       throw err;
136:     } finally {
137:       client.release();
138:     }
139: 
140:     const durationMs = Date.now() - t0;
141: 
142:     summary.completedWindows += 1;
143:     summary.totalFetchedStart += startArr.length;
144:     summary.totalFetchedEnd += endArr.length;
145:     summary.totalMerged += merged.length;
146:     summary.totalStored += stored;
147: 
148:     summary.windows.push({
149:       index,
150:       window: w,
151:       fetched: { start: startArr.length, end: endArr.length },
152:       merged: merged.length,
153:       stored,
154:       durationMs,
155:     });
156: 
157: 
158: 
159: 
160: 
161: 
162: 
163: 
164: 
165: 
166: 
167:     if (i < chunks.length - 1 && windowDelayMs > 0) {
168: 
169:       await sleep(windowDelayMs);
170:     }
171:   }
172: 
173:   logger.info("Session range paged pull finished", { window, summary });
174: 
175:   return summary;
176: }
````

## File: src/utils/sessionMerger.js
````javascript
 1: import { normalizeSession } from "./sessionNormalizer.js";
 2: 
 3: function mergeTwo(a, b) {
 4:   const out = { ...a };
 5: 
 6:   if (b.session_stop) out.session_stop = b.session_stop;
 7: 
 8:   if (!out.session_updated && b.session_updated) {
 9:     out.session_updated = b.session_updated;
10:   } else if (out.session_updated && b.session_updated) {
11:     if (new Date(b.session_updated) > new Date(out.session_updated)) {
12:       out.session_updated = b.session_updated;
13:     }
14:   }
15: 
16:   for (const k of Object.keys(out)) {
17:     if ((out[k] === null || out[k] === "") && b[k] != null) {
18:       out[k] = b[k];
19:     }
20:   }
21: 
22:   return out;
23: }
24: 
25: export function mergeSessions(startArr = [], endArr = []) {
26:   const map = new Map();
27: 
28:   for (const s of startArr) {
29:     const row = normalizeSession(s);
30:     if (!row.session_id) continue;
31:     map.set(row.session_id, row);
32:   }
33: 
34:   for (const s of endArr) {
35:     const row = normalizeSession(s);
36:     if (!row.session_id) continue;
37: 
38:     const existing = map.get(row.session_id);
39:     map.set(row.session_id, existing ? mergeTwo(existing, row) : row);
40:   }
41: 
42:   return [...map.values()];
43: }
````

## File: src/utils/sessionNormalizer.js
````javascript
 1: function epochToISO(ts) {
 2:   if (ts === null || ts === undefined) return null;
 3:   const n = Number(ts);
 4:   if (!Number.isFinite(n)) return null;
 5:   return new Date(n * 1000).toISOString();
 6: }
 7: 
 8: export function normalizeSession(s) {
 9:   return {
10:     site_token: s.siteToken ?? null,
11:     session_id: s.sessionId ?? null,
12:     local_id: s.localId ?? null,
13:     nas_ip_address: s.nasIpAddress ?? null,
14:     vlan: s.vlan ?? null,
15:     duration: Number.isFinite(Number(s.duration)) ? Number(s.duration) : null,
16:     download_bytes: s.download ?? null,
17:     upload_bytes: s.upload ?? null,
18:     mac_address: s.macAddress ?? null,
19:     ip_address: s.ipAddress ?? null,
20:     device: s.device ?? null,
21:     browser: s.browser ?? null,
22:     os: s.os ?? null,
23:     terminate_cause: s.terminateCause ?? null,
24:     session_updated: epochToISO(s.sessionUpdatedDatetime?.timestamp),
25:     session_start: epochToISO(s.sessionStartDatetime?.timestamp),
26:     session_stop: epochToISO(s.sessionStopDatetime?.timestamp),
27:   };
28: }
````

## File: src/utils/utils.js
````javascript
 1: import moment from "moment";
 2: 
 3: function getWindow10MinBack1Day(nowUtc = moment.utc()) {
 4:   const shifted = nowUtc.clone().subtract(1, "day");
 5:   const from = shifted.clone().subtract(10, "minutes");
 6:   const toExclusive = shifted.clone();
 7: 
 8:   return {
 9:     from: from.format("YYYY-MM-DD HH:mm:ss"),
10:     to: toExclusive.format("YYYY-MM-DD HH:mm:ss"),
11:   };
12: }
13: 
14: export {getWindow10MinBack1Day};
````
