import pool from "./pgPool.js";
import logger from "../logger.js";
import { cfg } from "../config.js";

export async function testPGConnection() {
  await pool.query("SELECT 1 AS ok");
  logger.info("PostgreSQL connection healthy");
  return true;
}

export async function checkTargetTableSchema() {
  const result = await pool.query(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'vlan_session_sync'
    `
  );

  const actual = new Set(result.rows.map((row) => row.column_name));

  const required = [
    "session_id",
    "session_start",
    "session_updated",
    "vlan",
    "synced_at",
  ];

  const missing = required.filter((column) => !actual.has(column));

  if (missing.length > 0) {
    throw new Error(
      `PostgreSQL schema check failed. Missing columns in vlan_session_sync: ${missing.join(
        ", "
      )}`
    );
  }

  logger.info("PostgreSQL schema check passed", {
    table: "vlan_session_sync",
  });
}

function subtractOverlap(date, overlapMinutes) {
  const d = new Date(date);
  d.setUTCMinutes(d.getUTCMinutes() - overlapMinutes);
  return d;
}

function formatForASP(date) {
  const d = new Date(date);

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

/**
 * High-water mark.
 *
 * In updated mode:
 *   Uses max(session_updated)
 *
 * In start_stop mode:
 *   Uses max(synced_at) as operational progress marker,
 *   then applies overlap to avoid missed sessions.
 */
export async function getHighWaterMark() {
  const column =
    cfg.ASP_SYNC_MODE === "updated" ? "session_updated" : "synced_at";

  const result = await pool.query(`
    SELECT MAX(${column}) AS last_sync
    FROM vlan_session_sync
  `);

  const lastSync = result.rows[0]?.last_sync;

  const rawFrom = lastSync || cfg.ASP_SYNC_START_DATE;

  const fromWithOverlap = subtractOverlap(
    rawFrom,
    cfg.ASP_SYNC_OVERLAP_MINUTES
  );

  const from = formatForASP(fromWithOverlap);
  const to = formatForASP(new Date());

  logger.info("High-water mark determined", {
    syncMode: cfg.ASP_SYNC_MODE,
    column,
    lastSync,
    from,
    to,
    overlapMinutes: cfg.ASP_SYNC_OVERLAP_MINUTES,
  });

  return {
    lastSync,
    from,
    to,
  };
}

export async function upsertVlanSessionBatch(client, batch) {
  if (!batch.length) return 0;

  const columnsPerRow = 18;
  const values = [];
  const placeholders = [];

  batch.forEach((row, index) => {
    const offset = index * columnsPerRow;

    placeholders.push(`
      (
        $${offset + 1},
        $${offset + 2},
        $${offset + 3},
        $${offset + 4},
        $${offset + 5},
        $${offset + 6},
        NULLIF($${offset + 7}, '')::BIGINT,
        NULLIF($${offset + 8}, '')::BIGINT,
        $${offset + 9},
        $${offset + 10},
        $${offset + 11},
        $${offset + 12},
        $${offset + 13},
        $${offset + 14},
        $${offset + 15},
        $${offset + 16},
        $${offset + 17},
        $${offset + 18}::jsonb
      )
    `);

    values.push(
      row.site_token ?? null,
      row.session_id,
      row.local_id ?? null,
      row.nas_ip_address ?? null,

      row.vlan ?? null,

      row.duration ?? null,
      row.download_bytes ?? null,
      row.upload_bytes ?? null,

      row.mac_address ?? null,
      row.ip_address ?? null,

      row.device ?? null,
      row.browser ?? null,
      row.os ?? null,

      row.terminate_cause ?? null,

      row.session_start,
      row.session_stop,
      row.session_updated,

      JSON.stringify(row.raw_payload ?? {})
    );
  });

  const sql = `
    INSERT INTO vlan_session_sync (
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
      session_updated,
      raw_payload
    )
    VALUES ${placeholders.join(",")}
    ON CONFLICT (session_id, session_start)
    DO UPDATE SET
      site_token       = EXCLUDED.site_token,
      local_id         = EXCLUDED.local_id,
      nas_ip_address   = EXCLUDED.nas_ip_address,
      vlan             = EXCLUDED.vlan,
      duration         = EXCLUDED.duration,
      download_bytes   = EXCLUDED.download_bytes,
      upload_bytes     = EXCLUDED.upload_bytes,
      mac_address      = EXCLUDED.mac_address,
      ip_address       = EXCLUDED.ip_address,
      device           = EXCLUDED.device,
      browser          = EXCLUDED.browser,
      os               = EXCLUDED.os,
      terminate_cause  = EXCLUDED.terminate_cause,
      session_stop     = EXCLUDED.session_stop,
      session_updated  = EXCLUDED.session_updated,
      raw_payload      = EXCLUDED.raw_payload,
      synced_at        = NOW()
  `;

  const result = await client.query(sql, values);

  return result.rowCount || 0;
}

export async function insertBatchInTransaction(batch, batchNumber) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const affected = await upsertVlanSessionBatch(client, batch);

    await client.query("COMMIT");

    return affected;
  } catch (error) {
    await client.query("ROLLBACK");

    logger.error("Batch insert failed", {
      batchNumber,
      batchSize: batch.length,
      error: error.message,
      stack: error.stack,
    });

    throw error;
  } finally {
    client.release();
  }
}