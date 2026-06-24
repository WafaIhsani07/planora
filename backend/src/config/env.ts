import "dotenv/config"
import { z } from "zod"

// ─── Schema Validasi ────────────────────────────────────────────────────────
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  // Database
  DATABASE_URL: z.string({ required_error: "DATABASE_URL wajib diisi di .env" }),
  DIRECT_URL: z.string().optional(),

  // JWT
  JWT_SECRET: z.string({ required_error: "JWT_SECRET wajib diisi di .env" }),
  JWT_REFRESH_SECRET: z.string({
    required_error: "JWT_REFRESH_SECRET wajib diisi di .env",
  }),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Frontend (untuk CORS)
  FRONTEND_URL: z.string().default("http://localhost:3000"),

  // Supabase Storage
  SUPABASE_URL: z.string({ required_error: "SUPABASE_URL wajib diisi di .env" }),
  SUPABASE_ANON_KEY: z.string({ required_error: "SUPABASE_ANON_KEY wajib diisi di .env" }),
  SUPABASE_BUCKET_NAME: z.string().default("planora-uploads"),
})

// ─── Parse & Validasi ───────────────────────────────────────────────────────
const _parsed = envSchema.safeParse(process.env)

if (!_parsed.success) {
  console.error("❌ Environment variables tidak valid, server tidak bisa start:")
  console.error(JSON.stringify(_parsed.error.format(), null, 2))
  process.exit(1)
}

export const env = _parsed.data
export type Env = typeof env