// backend/src/modules/bookings/bookings.routes.ts
import { Router } from "express"
import * as bookingsController from "./bookings.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// Semua rute booking butuh autentikasi (harus login)
router.use(authenticate)

// Hanya pengguna Mobile (CUSTOMER) yang bisa membuat pesanan baru
router.post("/", authorize("CUSTOMER"), bookingsController.createBooking)

// Customer & Vendor bisa melihat daftar pesanan mereka masing-masing
router.get("/", bookingsController.getMyBookings)

// Customer bisa batalkan pesanan, Vendor bisa ubah status (CONFIRMED, COMPLETED, dll)
router.patch("/:id/status", bookingsController.updateStatus)

export default router