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

CREATE INDEX IF NOT EXISTS idx_smsdata_vlan_id
ON smsdata(vlan_id);

CREATE INDEX IF NOT EXISTS idx_smsdata_created_dtm
ON smsdata(created_dtm);

CREATE INDEX IF NOT EXISTS idx_smsdata_delivery_status
ON smsdata(delivery_status);
