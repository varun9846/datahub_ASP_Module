import mysql from "mysql2";
import { cfg } from "../config.js";

function assertSQMysqlConfig() {
  const missing = [];

  if (!cfg.SQ_MYSQL_HOST) missing.push("SQ_MYSQL_HOST");
  if (!cfg.SQ_MYSQL_USER) missing.push("SQ_MYSQL_USER");
  if (!cfg.SQ_MYSQL_PASSWORD) missing.push("SQ_MYSQL_PASSWORD");
  if (!cfg.SQ_MYSQL_DATABASE) missing.push("SQ_MYSQL_DATABASE");

  if (missing.length > 0) {
    throw new Error(`Missing SQ MySQL environment variables: ${missing.join(", ")}`);
  }
}

export function createSQMysqlConnection() {
  assertSQMysqlConfig();

  return mysql.createConnection({
    host: cfg.SQ_MYSQL_HOST,
    port: cfg.SQ_MYSQL_PORT,
    user: cfg.SQ_MYSQL_USER,
    password: cfg.SQ_MYSQL_PASSWORD,
    database: cfg.SQ_MYSQL_DATABASE,
    timezone: "Z",
    connectTimeout: 60000,
  });
}

export function testSQMysqlConnection(mysqlConn) {
  return new Promise((resolve, reject) => {
    mysqlConn.query("SELECT 1 AS ok", (err) => {
      if (err) {
        reject(new Error(`SQ MySQL connection failed: ${err.message}`));
        return;
      }

      resolve(true);
    });
  });
}

export function closeSQMysqlConnection(mysqlConn) {
  return new Promise((resolve) => {
    if (!mysqlConn) return resolve();

    mysqlConn.end((err) => {
      resolve(err || null);
    });
  });
}
