import { Router } from "express"
import * as paymentsController from "./payments.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// Semua rute membutuhkan login
router.use(authenticate)

// Customer (Mobile) submit detail pembayaran
router.post("/", authorize("CUSTOMER"), paymentsController.createPayment)

// Customer / Vendor / Admin bisa melihat detail pembayaran
router.get("/booking/:bookingId", paymentsController.getPayment)

// Hanya Vendor (Web) atau Admin yang bisa memverifikasi uang masuk
router.patch("/:id/verify", authorize("VENDOR", "ADMIN"), paymentsController.verifyPayment)

export default router