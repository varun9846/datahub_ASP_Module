import { cfg } from "../config.js";
import logger from "../logger.js";
import pool from "../db/pgPool.js";
import {
  ensureVlanSmsTable,
  getLastVlanSmsSync,
  insertVlanSmsBatch,
} from "../db/vlanSms.repository.js";
import {
  closeSQMysqlConnection,
  createSQMysqlConnection,
  testSQMysqlConnection,
} from "../SQHelper/mysqlClient.js";
import { checkSQSchemaDrift } from "../SQHelper/vlanSmsSync.schemaDrift.js";
import {
  formatDateForMySQL,
  getVlanSmsRecordCount,
  syncSQVlanSmsRowsByBatch,
} from "../SQHelper/vlanSmsSync.helper.js";

let isRunning = false;

function logSyncSummary(status, summary, error = null) {
  const log =
    status === "SUCCESS"
      ? logger.info.bind(logger)
      : logger.error.bind(logger);

  log("====================================================");
  log(
    status === "SUCCESS"
      ? "SQ VLAN SMS SYNC SUCCESS SUMMARY"
      : "SQ VLAN SMS SYNC FAILED SUMMARY"
  );
  log("====================================================");

  log(`Fetched          : ${summary.fetched}`);
  log(`Inserted         : ${summary.inserted}`);
  log(`Skipped          : ${summary.skipped}`);
  log(`Batches          : ${summary.batches}`);
  log(`Last Sync        : ${summary.lastSync}`);
  log(`Duration Seconds : ${summary.durationSeconds}`);

  log(
    `Schema Checked   : ${summary.schemaDrift?.checked ?? false}`
  );

  log(
    `New Columns      : ${
      summary.schemaDrift?.newColumns?.length
        ? summary.schemaDrift.newColumns.join(", ")
        : "None"
    }`
  );

  if (error) {
    log(`Error Message    : ${error.message}`);
  }

  log("====================================================");
}


async function testPostgresConnection() {
  await pool.query("SELECT 1 AS ok");
}

async function insertBatchTransactionally(batch, batchNumber) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const inserted = await insertVlanSmsBatch(client, batch);

    await client.query("COMMIT");

    return inserted;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      logger.error("SQ batch rollback failed", {
        batchNumber,
        error: rollbackErr.message,
        stack: rollbackErr.stack,
      });
    }

    logger.error("SQ batch insert failed", {
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

export async function runVlanSmsSync() {
  if (isRunning) {
    const err = new Error("SQ VLAN SMS sync is already running");
    err.statusCode = 409;
    throw err;
  }

  isRunning = true;

  const startedAt = Date.now();
  const mysqlConn = createSQMysqlConnection();

  const summary = {
    fetched: 0,
    inserted: 0,
    skipped: 0,
    batches: 0,
    lastSync: null,
    durationSeconds: 0,
    schemaDrift: null,
  };

  try {
    logger.info("SQ VLAN SMS sync started", {
      startDate: cfg.SQ_VLAN_SMS_START_DATE,
    });

    await testSQMysqlConnection(mysqlConn);
    await testPostgresConnection();

    await ensureVlanSmsTable(pool);

    summary.schemaDrift = await checkSQSchemaDrift(mysqlConn, pool);

    const lastSyncFromDb = await getLastVlanSmsSync(pool);
    const lastSyncDate = lastSyncFromDb || new Date(cfg.SQ_VLAN_SMS_START_DATE);
    const lastSyncForMySQL = formatDateForMySQL(lastSyncDate);

    summary.lastSync = lastSyncForMySQL;

    logger.info("SQ high-water mark determined", {
      lastSyncFromDb,
      lastSyncForMySQL,
    });

    // Get total record count
    const totalRecords = await getVlanSmsRecordCount({
      mysqlConn,
      lastSyncForMySQL,
    });

    logger.info("SQ total records fetched", {
      totalRecords,
      lastSyncForMySQL,
    });

    if (totalRecords === 0) {
      logger.info("SQ no records to sync");
      summary.fetched = 0;
      summary.batches = 0;
      summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));

      logSyncSummary("SUCCESS", summary);
      return summary;
    }

    const syncResult = await syncSQVlanSmsRowsByBatch({
      mysqlConn,
      lastSyncForMySQL,
      totalRecords,
      onBatch: async (batch, batchNumber, fetchedSoFar) => {
        const insertedInBatch = await insertBatchTransactionally(batch, batchNumber);

        summary.inserted += insertedInBatch;
        summary.batches = batchNumber;

        if (batchNumber === 1 || batchNumber % 5 === 0) {
          logger.info("SQ batch synced", {
            batchNumber,
            batchSize: batch.length,
            fetchedSoFar,
            insertedInBatch,
            insertedTotal: summary.inserted,
          });
        }
      },
    });

    summary.fetched = syncResult.fetchedCount;
    summary.batches = syncResult.batchNumber;
    summary.skipped = summary.fetched - summary.inserted;
    summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));
    
    logSyncSummary("SUCCESS", summary);

    logger.info("SQ VLAN SMS sync completed successfully", summary);

    return summary;
  } catch (err) {
    summary.durationSeconds = Number(((Date.now() - startedAt) / 1000).toFixed(2));
    summary.skipped = summary.fetched - summary.inserted;

    logSyncSummary("FAILED", summary, err);

    logger.error("SQ VLAN SMS sync failed", {
      error: err.message,
      stack: err.stack,
      summary,
    });

    err.summary = summary;
    throw err;
  } finally {
    const closeErr = await closeSQMysqlConnection(mysqlConn);

    if (closeErr) {
      logger.warn("SQ MySQL connection close returned an error", {
        error: closeErr.message,
      });
    }

    isRunning = false;
  }
}