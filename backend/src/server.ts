import app from "./app.js"
import { env } from "./config/env.js"
import "./jobs/cron.js"
import { Logger } from "./utils/logger.js"

const logger = new Logger("Server")

// ─── Cegah server crash dari error koneksi database yang tidak tertangani ────
process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason}`)
  // Jangan exit — biarkan server tetap berjalan
})

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  // Jangan exit — biarkan server tetap berjalan
})

app.listen(env.PORT, "0.0.0.0", () => {
  logger.log(`🚀 Server running  → http://localhost:${env.PORT}`)
  logger.debug(`📦 Environment     → ${env.NODE_ENV}`)
  logger.log(`🗄️  Database        → ${env.DATABASE_URL.split("@").at(-1) ?? "connected"}`)
})