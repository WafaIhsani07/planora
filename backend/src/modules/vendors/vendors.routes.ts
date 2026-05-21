import { Router } from "express"
import * as vendorsController from "./vendors.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// ─── Public ───────────────────────────────────────────────────────────────────
router.get("/", vendorsController.getAllVendors)

// ─── Vendor — SPESIFIK DULU sebelum /:id ─────────────────────────────────────
router.get("/me", authenticate, authorize("VENDOR"), vendorsController.getMyVendorProfile)
router.post("/profile", authenticate, authorize("VENDOR"), vendorsController.createVendorProfile)
router.put("/profile", authenticate, authorize("VENDOR"), vendorsController.updateVendorProfile)
router.get("/me/layanan", authenticate, authorize("VENDOR"), vendorsController.getMyLayanan)
router.post("/me/layanan", authenticate, authorize("VENDOR"), vendorsController.createLayanan)
router.put("/me/layanan/:id", authenticate, authorize("VENDOR"), vendorsController.updateLayanan)
router.delete("/me/layanan/:id", authenticate, authorize("VENDOR"), vendorsController.deleteLayanan)
router.get("/me/portfolio", authenticate, authorize("VENDOR"), vendorsController.getMyPortfolio)
router.post("/me/portfolio", authenticate, authorize("VENDOR"), vendorsController.createPortfolio)
router.delete("/me/portfolio/:id", authenticate, authorize("VENDOR"), vendorsController.deletePortfolio)

// ─── Admin — SPESIFIK DULU sebelum /:id ──────────────────────────────────────
router.get("/pending", authenticate, authorize("ADMIN"), vendorsController.getPendingVendors)
router.patch("/:id/verify", authenticate, authorize("ADMIN"), vendorsController.verifyVendor)
router.patch("/:id/reject", authenticate, authorize("ADMIN"), vendorsController.rejectVendor)

// ─── Public — /:id PALING BAWAH ──────────────────────────────────────────────
router.get("/:id", vendorsController.getVendorById)

export default router