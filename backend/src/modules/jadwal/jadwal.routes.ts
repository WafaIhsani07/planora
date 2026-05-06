// backend/src/modules/jadwal/jadwal.routes.ts
import { Router } from "express"
import * as jadwalController from "./jadwal.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// ─── Rute Public (Bisa diakses Customer di Mobile) ────────────────────────
// Dapatkan jadwal vendor tertentu. Bisa pakai query ?startDate=...&endDate=...
router.get("/vendor/:vendorId", jadwalController.getJadwalByVendorId)

// ─── Rute Protected (Hanya VENDOR yang sudah login) ───────────────────────
router.use(authenticate)
router.use(authorize("VENDOR")) // Asumsi middleware ini ada

router.get("/me", jadwalController.getMyJadwal)
router.post("/", jadwalController.setJadwal)

export default router