import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  ASP_API_BASE_URL: z.string(),
  ASP_API_USERNAME: z.string(),
  ASP_API_PASSWORD: z.string(),
  ASP_API_ORGID: z.string(),
  LOG_LEVEL: z.string().default("info"),
  LOG_PATH: z.string().default(path.join(process.cwd(), "logs")),
  IS_PROD: z.boolean().default(false),

  /**
   * ASP sync settings
   */
  ASP_SYNC_MODE: z.enum(["updated", "start_stop"]).default("start_stop"),

  ASP_SYNC_BATCH_SIZE: z.coerce.number().default(5000),
  ASP_SYNC_PAGE_LIMIT: z.coerce.number().default(5000),
  ASP_SYNC_MAX_PAGES: z.coerce.number().default(2000),
  ASP_SYNC_PAGE_DELAY_MS: z.coerce.number().default(200),

  /**
   * Used only when target table is empty.
   */
  ASP_SYNC_START_DATE: z.string().default("2024-01-01 00:00:00"),

  /**
   * Small overlap protects against boundary issues.
   * Example:
   * Last sync = 10:00:00
   * Next sync starts from 09:55:00
   * Duplicates are safely ignored/upserted.
   */
  ASP_SYNC_OVERLAP_MINUTES: z.coerce.number().default(5),
});

const env = {
  ...process.env,
  IS_PROD: (process.env.IS_PROD == "true")
}
const cfg = schema.parse(env);
export {cfg};