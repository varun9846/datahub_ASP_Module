function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function toIntegerOrNull(value) {
  if (value === undefined || value === null || value === "") return null;

  const num = Number(value);

  return Number.isFinite(num) ? Math.trunc(num) : null;
}

function toBigIntTextOrNull(value) {
  if (value === undefined || value === null || value === "") return null;

  return String(value);
}

function toDateOrNull(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export function normalizeASPSession(row) {
  const sessionId = firstDefined(
    row.session_id,
    row.sessionId,
    row.id,
    row.sessionID
  );

  const sessionStart = firstDefined(
    row.session_start,
    row.sessionStart,
    row.sessionStartDateTime,
    row.startTime
  );

  const sessionStop = firstDefined(
    row.session_stop,
    row.sessionStop,
    row.sessionStopDateTime,
    row.stopTime
  );

  const sessionUpdated = firstDefined(
    row.session_updated,
    row.sessionUpdated,
    row.sessionUpdatedDateTime,
    row.updatedAt,
    row.updateTime,
    sessionStop,
    sessionStart
  );

  if (!sessionId || !sessionStart) {
    return null;
  }

  return {
    site_token: firstDefined(row.site_token, row.siteToken, row.site),
    session_id: String(sessionId),
    local_id: firstDefined(row.local_id, row.localId),
    nas_ip_address: firstDefined(row.nas_ip_address, row.nasIpAddress),

    vlan: firstDefined(row.vlan, row.vlan_id, row.vlanId),

    duration: toIntegerOrNull(firstDefined(row.duration, row.sessionDuration)),

    download_bytes: toBigIntTextOrNull(
      firstDefined(row.download_bytes, row.downloadBytes, row.download)
    ),

    upload_bytes: toBigIntTextOrNull(
      firstDefined(row.upload_bytes, row.uploadBytes, row.upload)
    ),

    mac_address: firstDefined(row.mac_address, row.macAddress, row.mac),
    ip_address: firstDefined(row.ip_address, row.ipAddress, row.ip),

    device: firstDefined(row.device),
    browser: firstDefined(row.browser),
    os: firstDefined(row.os),

    terminate_cause: firstDefined(
      row.terminate_cause,
      row.terminateCause,
      row.stopReason
    ),

    session_start: toDateOrNull(sessionStart),
    session_stop: toDateOrNull(sessionStop),
    session_updated: toDateOrNull(sessionUpdated),

    raw_payload: row,
  };
}

export function normalizeASPSessions(rows) {
  const normalized = [];
  let skipped = 0;

  for (const row of rows) {
    const item = normalizeASPSession(row);

    if (!item) {
      skipped += 1;
      continue;
    }

    normalized.push(item);
  }

  return {
    normalized,
    skipped,
  };
}