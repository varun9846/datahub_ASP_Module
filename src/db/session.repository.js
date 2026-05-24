const UPSERT_SQL = `
WITH data AS (
  SELECT *
  FROM jsonb_to_recordset($1::jsonb) AS d(
    site_token text,
    session_id text,
    local_id text,
    nas_ip_address text,
    vlan text,
    duration int,
    download_bytes text,
    upload_bytes text,
    mac_address text,
    ip_address text,
    device text,
    browser text,
    os text,
    terminate_cause text,
    session_start timestamptz,
    session_stop timestamptz,
    session_updated timestamptz
  )
),
updated AS (
  UPDATE session s
  SET
    duration        = d.duration,
    download_bytes  = NULLIF(d.download_bytes, '')::bigint,
    upload_bytes    = NULLIF(d.upload_bytes, '')::bigint,
    terminate_cause = d.terminate_cause,
    session_stop    = d.session_stop
  FROM data d
  WHERE s.session_id = d.session_id
    AND s.session_start = d.session_start
  RETURNING s.session_id
)
INSERT INTO session (
  site_token,
  session_id,
  local_id,
  nas_ip_address,
  vlan,
  duration,
  download_bytes,
  upload_bytes,
  mac_address,
  ip_address,
  device,
  browser,
  os,
  terminate_cause,
  session_start,
  session_stop,
  session_updated
)
SELECT
  d.site_token,
  d.session_id,
  d.local_id,
  d.nas_ip_address,
  d.vlan,
  d.duration,
  NULLIF(d.download_bytes, '')::bigint,
  NULLIF(d.upload_bytes, '')::bigint,
  d.mac_address,
  d.ip_address,
  d.device,
  d.browser,
  d.os,
  d.terminate_cause,
  d.session_start,
  d.session_stop,
  d.session_updated
FROM data d
WHERE NOT EXISTS (
  SELECT 1 FROM session s
  WHERE s.session_id = d.session_id
    AND s.session_start = d.session_start

);
`;

export async function upsertSessions(client, sessions) {
  if (!sessions?.length) return 0;
  await client.query(UPSERT_SQL, [JSON.stringify(sessions)]);
  return sessions.length;
}
