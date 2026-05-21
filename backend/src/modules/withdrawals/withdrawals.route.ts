import { Router } from "express"
import { requestWithdrawal, getAllWithdrawals, processWithdrawalAdmin } from "./withdrawals.controller"
import { protect, restrictTo } from "../../middlewares/auth"

const router = Router()

// Semua route di sini butuh autentikasi
router.use(protect)

// GET /withdrawals: Admin melihat semua pencairan, Vendor melihat miliknya
router.get("/", restrictTo("ADMIN", "VENDOR"), getAllWithdrawals)

// POST /withdrawals: Khusus Vendor mengajukan pencairan
router.post("/", restrictTo("VENDOR"), requestWithdrawal)

// PATCH /withdrawals/:id/process: Khusus Admin untuk proses/tolak/selesai pencairan
router.patch("/:id/process", restrictTo("ADMIN"), processWithdrawalAdmin)

export default router
