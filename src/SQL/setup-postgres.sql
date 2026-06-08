--POSTGRESQL

CREATE TABLE IF NOT EXISTS vlan_sms (
  id VARCHAR(50) PRIMARY KEY,
  vlan_id INTEGER,
  phone_number VARCHAR(20),
  message TEXT,
  "createdAt" TIMESTAMPTZ,
  "updatedAt" TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vlan_sms_vlan_id
ON vlan_sms(vlan_id);

CREATE INDEX IF NOT EXISTS idx_vlan_sms_createdat
ON vlan_sms("createdAt");