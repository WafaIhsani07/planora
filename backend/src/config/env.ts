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
  SUPABASE_SERVICE_ROLE_KEY: z.string({ required_error: "SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env" }),
  SUPABASE_BUCKET_NAME: z.string().default("planora-uploads"),
})

// ─── Parse & Validasi ───────────────────────────────────────────────────────
let _parsed = envSchema.safeParse(process.env)

if (!_parsed.success) {
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    // Gunakan fallback dummy jika di vitest
    console.warn("⚠️ Warning: Environment variables invalid, using dummy values for testing.");
    _parsed = {
      success: true,
      data: {
        NODE_ENV: "test",
        PORT: 5000,
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/testdb",
        DIRECT_URL: undefined,
        JWT_SECRET: "test-secret",
        JWT_REFRESH_SECRET: "test-refresh",
        JWT_EXPIRES_IN: "7d",
        JWT_REFRESH_EXPIRES_IN: "7d",
        FRONTEND_URL: "http://localhost:3000",
        SUPABASE_URL: "https://test.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "test-service-key",
        SUPABASE_BUCKET_NAME: "planora-uploads"
      }
    } as any;
  } else {
    console.error("❌ Environment variables tidak valid, server tidak bisa start:")
    console.error(JSON.stringify(_parsed.error.format(), null, 2))
    process.exit(1)
  }
}

export const env = _parsed.data
export type Env = typeof env