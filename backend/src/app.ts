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
import reviewRoutes from "./modules/reviews/reviews.routes.js"
import notificationRoutes from "./modules/notifications/notifications.routes.js"
import adminRoutes from "./modules/admin/admin.routes.js"
import uploadsRoutes from "./modules/uploads/uploads.routes.js"
import messagesRoutes from "./modules/messages/messages.routes.js"
import favoritesRoutes from "./modules/favorites/favorites.routes.js"

const app = express()

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (seperti mobile app native, curl, postman)
      if (!origin) return callback(null, true);
      
      const isLocalhost = origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
      if (origin === env.FRONTEND_URL || isLocalhost) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"))

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
app.use("/api/v1/bookings/:bookingId/messages", messagesRoutes)
app.use("/api/v1/payments", paymentsRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/notifications", notificationRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/uploads", uploadsRoutes)
app.use("/api/v1/favorites", favoritesRoutes)

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