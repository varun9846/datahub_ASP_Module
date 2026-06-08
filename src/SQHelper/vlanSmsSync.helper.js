import { cfg } from "../config.js";
import logger from "../logger.js";
import { mapVlanSmsRow } from "./vlanSmsSync.mapper.js";

export function formatDateForMySQL(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date for MySQL high-water mark: ${value}`);
  }

  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  const ms = String(date.getUTCMilliseconds()).padStart(3, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ms}`;
}

export async function getVlanSmsRecordCount({
  mysqlConn,
  lastSyncForMySQL,
}) {
  return new Promise((resolve, reject) => {
    const countQuery = `
      SELECT COUNT(*) AS total_records
      FROM vlan v
      JOIN sent_SMS s ON v.message_id = s.ID
      WHERE s.createdAt > ?
    `;

    mysqlConn.query(countQuery, [lastSyncForMySQL], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]?.total_records || 0);
    });
  });
}

export async function fetchVlanSmsBatch({
  mysqlConn,
  lastSyncForMySQL,
  offset,
  limit,
}) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        v.ID AS id,
        v.vlan_id,
        s.phone_number,
        s.message,
        s.createdAt,
        s.updatedAt
      FROM vlan v
      JOIN sent_SMS s ON v.message_id = s.ID
      WHERE s.createdAt > ?
      ORDER BY s.createdAt ASC, v.ID ASC
      LIMIT ? OFFSET ?
    `;

    mysqlConn.query(query, [lastSyncForMySQL, limit, offset], (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

export async function syncSQVlanSmsRowsByBatch({
  mysqlConn,
  lastSyncForMySQL,
  onBatch,
  totalRecords,
}) {
  // Calculate dynamic batch size: 1/10th of total records, minimum 100
  const optimalBatchSize = Math.max(100, Math.ceil(totalRecords / 10));

  let fetchedCount = 0;
  let batchNumber = 0;
  let offset = 0;

  logger.info("SQ MySQL batch sync started", {
    lastSyncForMySQL,
    totalRecords,
    optimalBatchSize,
  });

  try {
    while (offset < totalRecords) {
      const rows = await fetchVlanSmsBatch({
        mysqlConn,
        lastSyncForMySQL,
        offset,
        limit: optimalBatchSize,
      });

      if (rows.length === 0) break;

      const batch = rows
        .map(mapVlanSmsRow)
        .filter((mapped) => {
          if (!mapped.id) {
            logger.warn("SQ row skipped because id is missing", { mapped });
            return false;
          }
          return true;
        });

      fetchedCount += rows.length;
      batchNumber += 1;

      if (batch.length > 0) {
        await onBatch(batch, batchNumber, fetchedCount);
      }

      offset += optimalBatchSize;
    }

    logger.info("SQ MySQL batch sync completed", {
      fetchedCount,
      batchNumber,
      totalRecords,
    });

    return {
      fetchedCount,
      batchNumber,
    };
  } catch (err) {
    logger.error("SQ MySQL batch sync failed", {
      error: err.message,
      stack: err.stack,
      fetchedCount,
      batchNumber,
    });

    throw err;
  }
}