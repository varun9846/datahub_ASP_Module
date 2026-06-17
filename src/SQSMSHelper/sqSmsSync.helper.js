import logger from "../logger.js";
import { mapSQSmsRow } from "./sqSmsSync.mapper.js";

function queryMysql(mysqlConn, sql, params = []) {
  return new Promise((resolve, reject) => {
    mysqlConn.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

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

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

const COUNT_SQL = `
SELECT COUNT(*) AS total_records
FROM (
  SELECT l.msg_id
  FROM outbox o
  JOIN antlabs_log l ON l.msg_id = o.msgid
  WHERE o.created_dtm > ?

  UNION ALL

  SELECT l.msg_id
  FROM unsent u
  JOIN antlabs_log l ON l.msg_id = u.msgid
  WHERE u.created_dtm > ?
) AS sq_sms_rows;
`;

const FETCH_BATCH_SQL = `
SELECT *
FROM (
  SELECT
    l.msg_id AS id,
    l.vlan_id AS vlan_id,
    o.msg_type AS msg_type,
    o.created_dtm AS created_dtm,
    o.completed_dtm AS completed_dtm,
    o.mobile_numb AS mobile_numb,
    o.delivery_dtm AS delivery_dtm,
    o.delivery_status AS delivery_status,
    NULL AS fail_remark
  FROM outbox o
  JOIN antlabs_log l ON l.msg_id = o.msgid
  WHERE o.created_dtm > ?

  UNION ALL

  SELECT
    l.msg_id AS id,
    l.vlan_id AS vlan_id,
    u.msg_type AS msg_type,
    u.created_dtm AS created_dtm,
    u.completed_dtm AS completed_dtm,
    u.mobile_numb AS mobile_numb,
    NULL AS delivery_dtm,
    NULL AS delivery_status,
    u.remark AS fail_remark
  FROM unsent u
  JOIN antlabs_log l ON l.msg_id = u.msgid
  WHERE u.created_dtm > ?
) AS sq_sms_rows
ORDER BY created_dtm ASC, id ASC
LIMIT ? OFFSET ?;
`;

export async function getSmsDataRecordCount(mysqlConn, lastSync) {
  const rows = await queryMysql(mysqlConn, COUNT_SQL, [lastSync, lastSync]);
  const total = Number(rows[0]?.total_records ?? 0);
  return Number.isFinite(total) ? total : 0;
}

export async function fetchSmsDataBatch(mysqlConn, lastSync, limit, offset) {
  const rows = await queryMysql(mysqlConn, FETCH_BATCH_SQL, [lastSync, lastSync, limit, offset]);
  return rows.map(mapSQSmsRow).filter((row) => row.id && row.created_dtm);
}

function getMinimumBatchSize() {
  const value = Number(process.env.SQ_SMS_MIN_BATCH_SIZE ?? 100);
  return Number.isFinite(value) && value > 0 ? value : 100;
}

export async function syncSQSmsRowsByBatch({
  mysqlConn,
  lastSync,
  totalRecords,
  onBatch,
}) {
  if (!Number.isFinite(totalRecords) || totalRecords <= 0) {
    return { fetched: 0, inserted: 0, skipped: 0, batches: 0, batchSize: 0 };
  }

  const batchSize = Math.max(getMinimumBatchSize(), Math.ceil(totalRecords / 10));
  const totalBatches = Math.ceil(totalRecords / batchSize);

  let fetched = 0;
  let inserted = 0;
  let skipped = 0;
  let batches = 0;

  logger.info("SQ SMS batch sync started", {
    lastSync,
    totalRecords,
    batchSize,
    totalBatches,
  });

  for (let offset = 0; offset < totalRecords; offset += batchSize) {
    const batchNumber = batches + 1;
    const batch = await fetchSmsDataBatch(mysqlConn, lastSync, batchSize, offset);

    if (batch.length === 0) {
      logger.warn("SQ SMS batch returned no rows", { batchNumber, offset, batchSize });
      break;
    }

    const batchInserted = await onBatch(batch, batchNumber);

    fetched += batch.length;
    inserted += batchInserted;
    skipped += Math.max(0, batch.length - batchInserted);
    batches += 1;

    logger.info("SQ SMS batch synced", {
      batchNumber,
      fetched: batch.length,
      inserted: batchInserted,
      offset,
      batchSize,
    });
  }

  return { fetched, inserted, skipped, batches, batchSize };
}
