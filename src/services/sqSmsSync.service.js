import { cfg } from "../config.js";
import logger from "../logger.js";
import pool from "../db/pgPool.js";
import {
  ensureSmsDataTable,
  getLastSmsDataSync,
  upsertSmsDataBatch,
} from "../db/smsdata.repository.js";
import {
  closeSQMysqlConnection,
  createSQMysqlConnection,
  testSQMysqlConnection,
} from "../SQSMSHelper/mysqlClient.js";
import { checkSQSmsSchemaDrift } from "../SQSMSHelper/sqSmsSync.schemaDrift.js";
import {
  formatDateForMySQL,
  getSmsDataRecordCount,
  syncSQSmsRowsByBatch,
} from "../SQSMSHelper/sqSmsSync.helper.js";

let isRunning = false;

function getStartDateFallback() {
  return process.env.SQ_SMS_START_DATE ?? "2026-01-01";
}

function logSyncSummary(status, summary, error = null) {
  const log = status === "SUCCESS" ? logger.info.bind(logger) : logger.error.bind(logger);

  log("====================================================");
  log(status === "SUCCESS" ? "SQ SMS SYNC SUCCESS SUMMARY" : "SQ SMS SYNC FAILED SUMMARY");
  log("====================================================");
  log(`Fetched          : ${summary.fetched}`);
  log(`Stored           : ${summary.stored}`);
  log(`Skipped          : ${summary.skipped}`);
  log(`Batches          : ${summary.batches}`);
  log(`Batch Size       : ${summary.batchSize}`);
  log(`Last Sync        : ${summary.lastSync}`);
  log(`Duration Seconds : ${summary.durationSeconds}`);
  // log(`Schema Checked   : ${summary.schemaDrift?.checked ?? false}`);
  // log(`New Columns      : ${summary.schemaDrift?.newColumns?.length? summary.schemaDrift.newColumns.join(", "): "None"}`);
  // log(`Missing PG Cols   : ${summary.schemaDrift?.missingPgColumns?.length? summary.schemaDrift.missingPgColumns.join(", "): "None"}`);

  if (error) {
    log(`Error Message    : ${error.message}`);
  }

  log("====================================================");
}

async function testPostgresConnection() {
  await pool.query("SELECT 1 AS ok");
}

async function upsertBatchTransactionally(batch, batchNumber) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const stored = await upsertSmsDataBatch(client, batch);
    await client.query("COMMIT");
    return stored;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      logger.error("SQ SMS batch rollback failed", {
        batchNumber,
        error: rollbackErr.message,
        stack: rollbackErr.stack,
      });
    }

    logger.error("SQ SMS batch upsert failed", {
      batchNumber,
      batchSize: batch.length,
      error: err.message,
      stack: err.stack,
    });

    throw err;
  } finally {
    client.release();
  }
}

export async function runSQSmsSync() {
  if (isRunning) {
    const err = new Error("SQ SMS sync is already running");
    err.statusCode = 409;
    throw err;
  }

  isRunning = true;

  const startedAt = Date.now();
  let mysqlConn = null;

  const summary = {
    fetched: 0,
    stored: 0,
    skipped: 0,
    batches: 0,
    batchSize: 0,
    lastSync: null,
    durationSeconds: 0,
    schemaDrift: null,
  };

  try {
    mysqlConn = createSQMysqlConnection();

    logger.info("SQ SMS sync started", {
      startDate: getStartDateFallback(),
    });

    await testPostgresConnection();
    await testSQMysqlConnection(mysqlConn);
    await ensureSmsDataTable(pool);

    // summary.schemaDrift = await checkSQSmsSchemaDrift(mysqlConn, pool);

    const dbLastSync = await getLastSmsDataSync(pool);
    const lastSyncSource = dbLastSync ?? getStartDateFallback();
    const lastSync = formatDateForMySQL(lastSyncSource);
    summary.lastSync = lastSync;

    const totalRecords = await getSmsDataRecordCount(mysqlConn, lastSync);

    logger.info("SQ SMS records available for sync", {
      lastSync,
      totalRecords,
    });

    if (totalRecords === 0) {
      summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));
      logSyncSummary("SUCCESS", summary);
      return summary;
    }

    const batchResult = await syncSQSmsRowsByBatch({
      mysqlConn,
      lastSync,
      totalRecords,
      onBatch: upsertBatchTransactionally,
    });

    summary.fetched = batchResult.fetched;
    summary.stored = batchResult.inserted;
    summary.skipped = batchResult.skipped;
    summary.batches = batchResult.batches;
    summary.batchSize = batchResult.batchSize;
    summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));

    logSyncSummary("SUCCESS", summary);
    return summary;
  } catch (err) {
    summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));
    err.summary = summary;

    logSyncSummary("FAILED", summary, err);
    throw err;
  } finally {
    isRunning = false;
    await closeSQMysqlConnection(mysqlConn);
  }
}
