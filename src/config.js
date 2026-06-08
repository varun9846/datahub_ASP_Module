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

  // SQHelper / Send Quick MySQL source DB.
  // Optional at startup so the existing app can boot even before SQ env is configured.
  // The SQ module validates these values when /api/vlan-sms-sync is called.
  SQ_MYSQL_HOST: z.string().optional(),
  SQ_MYSQL_PORT: z.coerce.number().default(3306),
  SQ_MYSQL_USER: z.string().optional(),
  SQ_MYSQL_PASSWORD: z.string().optional(),
  SQ_MYSQL_DATABASE: z.string().optional(),

  SQ_VLAN_SMS_BATCH_SIZE: z.coerce.number().default(5000),
  SQ_VLAN_SMS_START_DATE: z.string().default("2024-01-01"),
});

const env = {
  ...process.env,
  IS_PROD: (process.env.IS_PROD == "true")
}
const cfg = schema.parse(env);
export {cfg};