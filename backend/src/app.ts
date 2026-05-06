import express, { type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import { env } from "./config/env.js"
import { AppError } from "./utils/error.js"
import { sendError } from "./utils/response.js"

// ─── Import Routes ────────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes.js"
import usersRoutes from "./modules/users/users.routes.js"   
import vendorsRoutes from "./modules/vendors/vendors.routes.js"       
import kategoriRoutes from "./modules/kategori/kategori.routes.js" 
import jadwalRoutes from "./modules/jadwal/jadwal.routes.js"
import bookingsRoutes from "./modules/bookings/bookings.routes.js"
import paymentsRoutes from "./modules/payments/payments.routes.js"

const app = express()

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Planora API running",
    version: "1.0.0",
    env: env.NODE_ENV,
  })
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", usersRoutes) 
app.use("/api/v1/vendors",  vendorsRoutes)    
app.use("/api/v1/kategori", kategoriRoutes)   
app.use("/api/v1/jadwal", jadwalRoutes)
app.use("/api/v1/bookings", bookingsRoutes)
app.use("/api/v1/payments", paymentsRoutes)
// app.use("/api/v1/reviews",  reviewRoutes)  ← TASK 9
// app.use("/api/v1/admin",    adminRoutes)   ← TASK 11

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  sendError(res, `Route ${req.method} ${req.path} tidak ditemukan`, 404)
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode)
    return
  }

  const message = err instanceof Error ? err.message : "Internal Server Error"
  console.error("[Unhandled Error]", err)
  sendError(res, message, 500)
})

export default app