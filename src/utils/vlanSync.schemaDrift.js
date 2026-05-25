import logger from "../logger.js";

const EXPECTED_ASP_FIELDS = new Set([
  "site_token",
  "siteToken",
  "site",

  "session_id",
  "sessionId",
  "sessionID",
  "id",

  "local_id",
  "localId",

  "nas_ip_address",
  "nasIpAddress",

  "vlan",
  "vlan_id",
  "vlanId",

  "duration",
  "sessionDuration",

  "download_bytes",
  "downloadBytes",
  "download",

  "upload_bytes",
  "uploadBytes",
  "upload",

  "mac_address",
  "macAddress",
  "mac",

  "ip_address",
  "ipAddress",
  "ip",

  "device",
  "browser",
  "os",

  "terminate_cause",
  "terminateCause",
  "stopReason",

  "session_start",
  "sessionStart",
  "sessionStartDateTime",
  "startTime",

  "session_stop",
  "sessionStop",
  "sessionStopDateTime",
  "stopTime",

  "session_updated",
  "sessionUpdated",
  "sessionUpdatedDateTime",
  "updatedAt",
  "updateTime",
]);

export function checkASPSchemaDrift(sampleRow) {
  if (!sampleRow || typeof sampleRow !== "object") return;

  const receivedFields = Object.keys(sampleRow);

  const newFields = receivedFields.filter(
    (field) => !EXPECTED_ASP_FIELDS.has(field)
  );

  if (newFields.length > 0) {
    logger.warn("ASP SCHEMA DRIFT DETECTED", {
      newFields,
      action:
        "Review whether these fields should be added to vlan_session_sync or mapper.",
    });
  } else {
    logger.info("ASP schema drift check passed");
  }
}