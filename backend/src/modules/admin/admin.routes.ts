import { Router } from "express"
import * as adminController from "./admin.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// Semua route admin membutuhkan autentikasi dan role ADMIN
router.use(authenticate, authorize("ADMIN"))

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get("/dashboard/stats", adminController.getDashboardStats)

// ─── Users Management ─────────────────────────────────────────────────────────
router.get("/users", adminController.getAllUsers)
router.get("/users/:id", adminController.getUserById)
router.patch("/users/:id/status", adminController.updateUserStatus)

// ─── Vendors Verification ─────────────────────────────────────────────────────
router.get("/vendors/pending", adminController.getPendingVendors)
router.patch("/vendors/:id/verify", adminController.verifyVendor)
router.patch("/vendors/:id/reject", adminController.rejectVendor)

// ─── Bookings ─────────────────────────────────────────────────────────────────
router.get("/bookings", adminController.getAllBookings)
router.get("/bookings/:id", adminController.getBookingDetail)

// ─── Monitoring / Payments ────────────────────────────────────────────────────
router.get("/monitoring/stats", adminController.getMonitoringStats)
router.get("/payments", adminController.getAllPayments)

// ─── Settings / Configuration ──────────────────────────────────────────────────
router.get("/settings", adminController.getSettings)
router.patch("/settings", adminController.updateSettings)
router.patch("/password", adminController.updateAdminPassword)

export default router

