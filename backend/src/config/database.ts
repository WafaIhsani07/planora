import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import { env } from "./env.js"

// ─── Prisma v7 — pg.Pool dengan keepAlive untuk Supabase Session Mode ────────
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 2,                          // 2 koneksi aman untuk Supabase free tier
  connectionTimeoutMillis: 10000,  // Timeout menunggu koneksi dari pool
  idleTimeoutMillis: 30000,        // Putus koneksi idle setelah 30 detik
  allowExitOnIdle: false,          // Jangan exit proses saat pool idle
  ssl: env.DATABASE_URL.includes("supabase.com") || env.DATABASE_URL.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : undefined,
})

// ─── Tangani error koneksi yang tiba-tiba putus (Supabase drops idle conn) ───
pool.on("error", (err) => {
  console.error("[pg.Pool] Koneksi terputus dari pool:", err.message)
  // Jangan crash — pool akan otomatis membuat koneksi baru saat dibutuhkan
})

const adapter = new PrismaPg(pool)

export const db = new PrismaClient({
  adapter,
  log:
    env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"] // Aktifkan query, info, warn, dan error log di development untuk debugging
      : ["error"],
})
