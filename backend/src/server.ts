import app from "./app.js"
import { env } from "./config/env.js"
import "./jobs/cron.js"

app.listen(env.PORT, () => {
  console.log(`🚀 Server running  → http://localhost:${env.PORT}`)
  console.log(`📦 Environment     → ${env.NODE_ENV}`)
  console.log(`🗄️  Database        → ${env.DATABASE_URL.split("@").at(-1) ?? "connected"}`)
})
// Reload trigger for Prisma client update