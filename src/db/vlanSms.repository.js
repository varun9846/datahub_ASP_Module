const ENSURE_VLAN_SMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS vlan_sms (
  id VARCHAR(50) PRIMARY KEY,
  vlan_id INTEGER,
  phone_number VARCHAR(20),
  message TEXT,
  "createdAt" TIMESTAMPTZ,
  "updatedAt" TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const ENSURE_VLAN_SMS_INDEXES_SQL = `
CREATE INDEX IF NOT EXISTS idx_vlan_sms_vlan_id
ON vlan_sms(vlan_id);

CREATE INDEX IF NOT EXISTS idx_vlan_sms_createdat
ON vlan_sms("createdAt");
`;

const GET_LAST_SYNC_SQL = `
SELECT MAX("createdAt") AS last_sync
FROM vlan_sms;
`;

const INSERT_BATCH_SQL = `
WITH data AS (
  SELECT *
  FROM jsonb_to_recordset($1::jsonb) AS d(
    id text,
    vlan_id integer,
    phone_number text,
    message text,
    created_at timestamptz,
    updated_at timestamptz
  )
)
INSERT INTO vlan_sms (
  id,
  vlan_id,
  phone_number,
  message,
  "createdAt",
  "updatedAt"
)
SELECT
  d.id,
  d.vlan_id,
  d.phone_number,
  d.message,
  d.created_at,
  d.updated_at
FROM data d
ON CONFLICT (id) DO NOTHING;
`;

export async function ensureVlanSmsTable(pool) {
  await pool.query(ENSURE_VLAN_SMS_TABLE_SQL);
  await pool.query(ENSURE_VLAN_SMS_INDEXES_SQL);
}

export async function getLastVlanSmsSync(pool) {
  const result = await pool.query(GET_LAST_SYNC_SQL);
  return result.rows[0]?.last_sync ?? null;
}

export async function insertVlanSmsBatch(client, batch) {
  if (!batch?.length) return 0;

  const result = await client.query(INSERT_BATCH_SQL, [JSON.stringify(batch)]);

  return result.rowCount || 0;
}