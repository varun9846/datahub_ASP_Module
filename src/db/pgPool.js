import pg from "pg";
import { cfg } from "../config.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: cfg.DATABASE_URL,
});

export default pool;