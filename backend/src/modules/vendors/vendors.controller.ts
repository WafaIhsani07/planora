import type { Request, Response, NextFunction } from "express"
import * as vendorsService from "./vendors.service.js"
import {
  createVendorProfileSchema,
  updateVendorProfileSchema,
  rejectVendorSchema,
  createLayananSchema,
  updateLayananSchema,
  getVendorsQuerySchema,
  createPortfolioSchema,
} from "./vendors.validation.js"
import { sendSuccess, sendCreated, sendValidationError } from "../../utils/response.js"

// ─── Get All Vendors (Public) ─────────────────────────────────────────────────
export const getAllVendors = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const parsed = getVendorsQuerySchema.safeParse(req.query)
  if (!parsed.success) { sendValidationError(res, parsed.error.flatten().fieldErrors); return }

  const result = await vendorsService.getAllVendors(parsed.data)
  sendSuccess(res, result, "Data vendor berhasil diambil")
}

// ─── Get Vendor By ID (Public) ────────────────────────────────────────────────
export const getVendorById = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const vendor = await vendorsService.getVendorById(String(req.params["id"] ?? ""))
  sendSuccess(res, vendor, "Data vendor berhasil diambil")
}

// ─── Get My Vendor Profile ────────────────────────────────────────────────────
export const getMyVendorProfile = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const vendor = await vendorsService.getMyVendorProfile(req.userId)
  sendSuccess(res, vendor, "Profil vendor berhasil diambil")
}

// ─── Create Vendor Profile ────────────────────────────────────────────────────
export const createVendorProfile = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const parsed = createVendorProfileSchema.safeParse(req.body)
  if (!parsed.success) { sendValidationError(res, parsed.error.flatten().fieldErrors); return }

  const vendor = await vendorsService.createVendorProfile(req.userId, parsed.data)
  sendCreated(res, vendor, "Profil vendor berhasil dibuat")
}

// ─── Update Vendor Profile ────────────────────────────────────────────────────
export const updateVendorProfile = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const parsed = updateVendorProfileSchema.safeParse(req.body)
  if (!parsed.success) { sendValidationError(res, parsed.error.flatten().fieldErrors); return }

  const vendor = await vendorsService.updateVendorProfile(req.userId, parsed.data)
  sendSuccess(res, vendor, "Profil vendor berhasil diperbarui")
}

// ─── Get My Layanan ───────────────────────────────────────────────────────────
export const getMyLayanan = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const layanan = await vendorsService.getMyLayanan(req.userId)
  sendSuccess(res, layanan, "Data layanan berhasil diambil")
}

// ─── Create Layanan ───────────────────────────────────────────────────────────
export const createLayanan = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const parsed = createLayananSchema.safeParse(req.body)
  if (!parsed.success) { sendValidationError(res, parsed.error.flatten().fieldErrors); return }

  const layanan = await vendorsService.createLayanan(req.userId, parsed.data)
  sendCreated(res, layanan, "Layanan berhasil ditambahkan")
}

// ─── Update Layanan ───────────────────────────────────────────────────────────
export const updateLayanan = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const parsed = updateLayananSchema.safeParse(req.body)
  if (!parsed.success) { sendValidationError(res, parsed.error.flatten().fieldErrors); return }

  const layanan = await vendorsService.updateLayanan(
    req.userId,
    String(req.params["id"] ?? ""),
    parsed.data
  )
  sendSuccess(res, layanan, "Layanan berhasil diperbarui")
}

// ─── Delete Layanan ───────────────────────────────────────────────────────────
export const deleteLayanan = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  await vendorsService.deleteLayanan(req.userId, String(req.params["id"] ?? ""))
  sendSuccess(res, null, "Layanan berhasil dinonaktifkan")
}

// ─── Get Pending Vendors (Admin) ──────────────────────────────────────────────
export const getPendingVendors = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const vendors = await vendorsService.getPendingVendors()
  sendSuccess(res, vendors, "Data vendor pending berhasil diambil")
}

// ─── Verify Vendor (Admin) ────────────────────────────────────────────────────
export const verifyVendor = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const vendor = await vendorsService.verifyVendor(String(req.params["id"] ?? ""))
  sendSuccess(res, vendor, "Vendor berhasil diverifikasi")
}

// ─── Reject Vendor (Admin) ────────────────────────────────────────────────────
export const rejectVendor = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const parsed = rejectVendorSchema.safeParse(req.body)
  if (!parsed.success) { sendValidationError(res, parsed.error.flatten().fieldErrors); return }

  const vendor = await vendorsService.rejectVendor(
    String(req.params["id"] ?? ""),
    parsed.data
  )
  sendSuccess(res, vendor, "Vendor berhasil ditolak")
}

// ─── Get My Portfolio ─────────────────────────────────────────────────────────
export const getMyPortfolio = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const portfolio = await vendorsService.getMyPortfolio(req.userId)
  sendSuccess(res, portfolio, "Data portofolio berhasil diambil")
}

// ─── Create Portfolio ──────────────────────────────────────────────────────────
export const createPortfolio = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  const parsed = createPortfolioSchema.safeParse(req.body)
  if (!parsed.success) { sendValidationError(res, parsed.error.flatten().fieldErrors); return }

  const portfolio = await vendorsService.createPortfolio(req.userId, parsed.data)
  sendCreated(res, portfolio, "Item portofolio berhasil ditambahkan")
}

// ─── Delete Portfolio ──────────────────────────────────────────────────────────
export const deletePortfolio = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  await vendorsService.deletePortfolio(req.userId, String(req.params["id"] ?? ""))
  sendSuccess(res, null, "Item portofolio berhasil dihapus")
}