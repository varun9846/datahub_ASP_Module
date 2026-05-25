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