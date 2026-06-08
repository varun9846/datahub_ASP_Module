import logger from "../logger.js";

function queryMysql(mysqlConn, sql, params = []) {
  return new Promise((resolve, reject) => {
    mysqlConn.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

export async function checkSQSchemaDrift(mysqlConn, pgPool) {
  logger.info("SQ schema drift check started");

  try {
    const [smsColumns, vlanColumns, pgResult] = await Promise.all([
      queryMysql(mysqlConn, "SHOW COLUMNS FROM sent_SMS"),
      queryMysql(mysqlConn, "SHOW COLUMNS FROM vlan"),
      pgPool.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'vlan_sms'
        `
      ),
    ]);

    const mysqlColumnNames = [
      ...smsColumns.map((col) => col.Field),
      ...vlanColumns.map((col) => col.Field),
    ];

    const expectedSourceColumns = [
      "ID",
      "vlan_id",
      "message_id",
      "phone_number",
      "message",
      "createdAt",
      "updatedAt",
    ];

    const pgColumnNames = pgResult.rows.map((row) => row.column_name.toLowerCase());

    const newColumns = mysqlColumnNames.filter((columnName) => {
      return (
        !expectedSourceColumns.includes(columnName) &&
        !pgColumnNames.includes(columnName.toLowerCase())
      );
    });

    if (newColumns.length > 0) {
      logger.warn("SQ schema drift detected", {
        newColumns,
        action:
          "Review whether these MySQL columns must be added to PostgreSQL vlan_sms and mapper/repository.",
      });
    } else {
      logger.info("SQ schema drift check passed");
    }

    return {
      checked: true,
      newColumns,
    };
  } catch (err) {
    // Keep sync running even if drift check fails.
    // This matches the standalone script behavior: warn, do not block.
    logger.warn("SQ schema drift check failed; continuing sync", {
      error: err.message,
      stack: err.stack,
    });

    return {
      checked: false,
      error: err.message,
      newColumns: [],
    };
  }
}