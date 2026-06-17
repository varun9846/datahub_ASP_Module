import logger from "../logger.js";

function queryMysql(mysqlConn, sql, params = []) {
  return new Promise((resolve, reject) => {
    mysqlConn.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

export async function checkSQSmsSchemaDrift(mysqlConn, pgPool) {
  logger.info("SQ SMS schema drift check started");

  try {
    const [outboxColumns, unsentColumns, antlabsColumns, pgResult] = await Promise.all([
      queryMysql(mysqlConn, "SHOW COLUMNS FROM outbox"),
      queryMysql(mysqlConn, "SHOW COLUMNS FROM unsent"),
      queryMysql(mysqlConn, "SHOW COLUMNS FROM antlabs_log"),
      pgPool.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'smsdata'
        `
      ),
    ]);

    const mysqlColumnNames = [
      ...outboxColumns.map((col) => `outbox.${col.Field}`),
      ...unsentColumns.map((col) => `unsent.${col.Field}`),
      ...antlabsColumns.map((col) => `antlabs_log.${col.Field}`),
    ];

    const expectedSourceColumns = [
      "outbox.msgid",
      "outbox.msg_type",
      "outbox.created_dtm",
      "outbox.completed_dtm",
      "outbox.mobile_numb",
      "outbox.delivery_dtm",
      "outbox.delivery_status",
      "unsent.msgid",
      "unsent.msg_type",
      "unsent.created_dtm",
      "unsent.completed_dtm",
      "unsent.mobile_numb",
      "unsent.remark",
      "antlabs_log.msg_id",
      "antlabs_log.vlan_id",
    ];

    const pgColumnNames = pgResult.rows.map((row) => row.column_name.toLowerCase());
    const expectedPgColumns = [
      "id",
      "vlan_id",
      "msg_type",
      "created_dtm",
      "completed_dtm",
      "mobile_numb",
      "delivery_dtm",
      "delivery_status",
      "fail_remark",
      "synced_at",
    ];

    const newColumns = mysqlColumnNames.filter((columnName) => {
      return !expectedSourceColumns.includes(columnName);
    });

    const missingPgColumns = expectedPgColumns.filter((columnName) => {
      return !pgColumnNames.includes(columnName.toLowerCase());
    });

    if (newColumns.length > 0 || missingPgColumns.length > 0) {
      logger.warn("SQ SMS schema drift detected", {
        newColumns,
        missingPgColumns,
        action: "Review whether mapper/repository need to be updated.",
      });
    } else {
      logger.info("SQ SMS schema drift check passed");
    }

    return {
      checked: true,
      newColumns,
      missingPgColumns,
    };
  } catch (err) {
    logger.warn("SQ SMS schema drift check failed; continuing sync", {
      error: err.message,
      stack: err.stack,
    });

    return {
      checked: false,
      error: err.message,
      newColumns: [],
      missingPgColumns: [],
    };
  }
}
