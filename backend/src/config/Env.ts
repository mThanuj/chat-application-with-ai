import dotenv from "dotenv";
import { envSchema } from "../utils/types/Env";
import { resolve } from "path";

const current_env = process.env.NODE_ENV || "development";
const envPath = resolve(process.cwd(), `.env.${current_env}`);

dotenv.config({ path: envPath });

const result = envSchema.safeParse(process.env);
if (!result.success) {
  console.error("Invalid ENV Variables", result.error.format());
  process.exit(1);
}

export const env = result.data;
