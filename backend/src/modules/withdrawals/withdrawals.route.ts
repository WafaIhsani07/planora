import { Router } from "express"
import { requestWithdrawal, getAllWithdrawals, processWithdrawalAdmin } from "./withdrawals.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// Semua route di sini butuh autentikasi
router.use(authenticate)

// GET /withdrawals: Admin melihat semua pencairan, Vendor melihat miliknya
router.get("/", authorize("ADMIN", "VENDOR"), getAllWithdrawals)

// POST /withdrawals: Khusus Vendor mengajukan pencairan
router.post("/", authorize("VENDOR"), requestWithdrawal)

// PATCH /withdrawals/:id/process: Khusus Admin untuk proses/tolak/selesai pencairan
router.patch("/:id/process", authorize("ADMIN"), processWithdrawalAdmin)

export default router
