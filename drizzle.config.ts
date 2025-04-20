import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "src/lib/db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
