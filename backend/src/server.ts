import app from "./app.js"
import { env } from "./config/env.js"
import "./jobs/cron.js"

// ─── Cegah server crash dari error koneksi database yang tidak tertangani ────
process.on("unhandledRejection", (reason) => {
  console.error("[Server] Unhandled Promise Rejection:", reason)
  // Jangan exit — biarkan server tetap berjalan
})

process.on("uncaughtException", (err) => {
  console.error("[Server] Uncaught Exception:", err.message)
  // Jangan exit — biarkan server tetap berjalan
})

app.listen(env.PORT, () => {
  console.log(`🚀 Server running  → http://localhost:${env.PORT}`)
  console.log(`📦 Environment     → ${env.NODE_ENV}`)
  console.log(`🗄️  Database        → ${env.DATABASE_URL.split("@").at(-1) ?? "connected"}`)
})