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
});

const env = {
  ...process.env,
  IS_PROD: (process.env.IS_PROD == "true")
}
const cfg = schema.parse(env);
export {cfg};