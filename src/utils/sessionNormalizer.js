function epochToISO(ts) {
  if (ts === null || ts === undefined) return null;
  const n = Number(ts);
  if (!Number.isFinite(n)) return null;
  return new Date(n * 1000).toISOString();
}

export function normalizeSession(s) {
  return {
    site_token: s.siteToken ?? null,
    session_id: s.sessionId ?? null,
    local_id: s.localId ?? null,
    nas_ip_address: s.nasIpAddress ?? null,
    vlan: s.vlan ?? null,
    duration: Number.isFinite(Number(s.duration)) ? Number(s.duration) : null,
    download_bytes: s.download ?? null,
    upload_bytes: s.upload ?? null,
    mac_address: s.macAddress ?? null,
    ip_address: s.ipAddress ?? null,
    device: s.device ?? null,
    browser: s.browser ?? null,
    os: s.os ?? null,
    terminate_cause: s.terminateCause ?? null,
    session_updated: epochToISO(s.sessionUpdatedDatetime?.timestamp),
    session_start: epochToISO(s.sessionStartDatetime?.timestamp),
    session_stop: epochToISO(s.sessionStopDatetime?.timestamp),
  };
}
