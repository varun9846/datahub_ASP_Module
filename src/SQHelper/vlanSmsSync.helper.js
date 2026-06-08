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

export function buildVlanSmsSyncQuery() {
  return `
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
  `;
}

export async function streamSQVlanSmsRows({
  mysqlConn,
  lastSyncForMySQL,
  onBatch,
  batchSize = cfg.SQ_VLAN_SMS_BATCH_SIZE,
}) {
  const query = buildVlanSmsSyncQuery();

  let fetchedCount = 0;
  let batchNumber = 0;
  let batch = [];

  logger.info("SQ MySQL streaming started", {
    lastSyncForMySQL,
    batchSize,
  });

  const stream = mysqlConn
    .query(query, [lastSyncForMySQL])
    .stream({
      highWaterMark: batchSize,
    });

  try {
    for await (const row of stream) {
      fetchedCount += 1;

      const mapped = mapVlanSmsRow(row);

      if (!mapped.id) {
        logger.warn("SQ row skipped because id is missing", { row });
        continue;
      }

      batch.push(mapped);

      if (batch.length >= batchSize) {
        batchNumber += 1;

        await onBatch(batch, batchNumber, fetchedCount);

        batch = [];
      }
    }

    if (batch.length > 0) {
      batchNumber += 1;

      await onBatch(batch, batchNumber, fetchedCount);
    }

    logger.info("SQ MySQL streaming completed", {
      fetchedCount,
      batchNumber,
    });

    return {
      fetchedCount,
      batchNumber,
    };
  } catch (err) {
    logger.error("SQ MySQL streaming failed", {
      error: err.message,
      stack: err.stack,
      fetchedCount,
      batchNumber,
    });

    throw err;
  }
}