const ENSURE_SMSDATA_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS smsdata (
  id VARCHAR(50) PRIMARY KEY,
  vlan_id TEXT,
  msg_type CHAR(1),
  created_dtm TIMESTAMPTZ,
  completed_dtm TIMESTAMPTZ,
  mobile_numb VARCHAR(20),
  delivery_dtm TIMESTAMPTZ,
  delivery_status CHAR(1),
  fail_remark TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const ENSURE_SMSDATA_INDEXES_SQL = `
CREATE INDEX IF NOT EXISTS idx_smsdata_vlan_id
ON smsdata(vlan_id);

CREATE INDEX IF NOT EXISTS idx_smsdata_created_dtm
ON smsdata(created_dtm);

CREATE INDEX IF NOT EXISTS idx_smsdata_delivery_status
ON smsdata(delivery_status);
`;

const GET_LAST_SYNC_SQL = `
SELECT MAX(created_dtm) AS last_sync
FROM smsdata;
`;

const UPSERT_BATCH_SQL = `
WITH data AS (
  SELECT *
  FROM jsonb_to_recordset($1::jsonb) AS d(
    id text,
    vlan_id text,
    msg_type text,
    created_dtm timestamptz,
    completed_dtm timestamptz,
    mobile_numb text,
    delivery_dtm timestamptz,
    delivery_status text,
    fail_remark text
  )
),
deduped AS (
  SELECT DISTINCT ON (id) *
  FROM data
  WHERE id IS NOT NULL
  ORDER BY id, created_dtm DESC NULLS LAST
)
INSERT INTO smsdata (
  id,
  vlan_id,
  msg_type,
  created_dtm,
  completed_dtm,
  mobile_numb,
  delivery_dtm,
  delivery_status,
  fail_remark
)
SELECT
  d.id,
  d.vlan_id,
  LEFT(d.msg_type, 1),
  d.created_dtm,
  d.completed_dtm,
  d.mobile_numb,
  d.delivery_dtm,
  LEFT(d.delivery_status, 1),
  d.fail_remark
FROM deduped d
ON CONFLICT (id) DO UPDATE SET
  vlan_id = EXCLUDED.vlan_id,
  msg_type = EXCLUDED.msg_type,
  created_dtm = EXCLUDED.created_dtm,
  completed_dtm = EXCLUDED.completed_dtm,
  mobile_numb = EXCLUDED.mobile_numb,
  delivery_dtm = EXCLUDED.delivery_dtm,
  delivery_status = EXCLUDED.delivery_status,
  fail_remark = EXCLUDED.fail_remark,
  synced_at = NOW();
`;

export async function ensureSmsDataTable(pool) {
  await pool.query(ENSURE_SMSDATA_TABLE_SQL);
  await pool.query(ENSURE_SMSDATA_INDEXES_SQL);
}

export async function getLastSmsDataSync(pool) {
  const result = await pool.query(GET_LAST_SYNC_SQL);
  return result.rows[0]?.last_sync ?? null;
}

export async function upsertSmsDataBatch(client, batch) {
  if (!batch?.length) return 0;

  const result = await client.query(UPSERT_BATCH_SQL, [JSON.stringify(batch)]);
  return result.rowCount || 0;
}
