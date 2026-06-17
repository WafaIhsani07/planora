import type { Request, Response } from "express"
import * as adminService from "./admin.service.js"
import * as vendorService from "../vendors/vendors.service.js"
import * as usersService from "../users/users.service.js"
import {
  adminGetAllBookingsQuerySchema,
  adminGetAllPaymentsQuerySchema,
  getDashboardStatsQuerySchema,
} from "./admin.validation.js"
import { getUsersQuerySchema, updateUserStatusSchema } from "../users/users.validation.js"
import { rejectVendorSchema } from "../vendors/vendors.validation.js"
import { sendSuccess, sendValidationError } from "../../utils/response.js"

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardStats = async (req: Request, res: Response) => {
  const parsed = getDashboardStatsQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await adminService.getDashboardStats()
  sendSuccess(res, result, "Berhasil mengambil statistik dashboard")
}

// ─── Users Management ─────────────────────────────────────────────────────────
export const getAllUsers = async (req: Request, res: Response) => {
  const parsed = getUsersQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await usersService.getAllUsers(parsed.data)
  sendSuccess(res, result, "Berhasil mengambil daftar user")
}

export const getUserById = async (req: Request, res: Response) => {
  const result = await usersService.getUserById(req.params.id as string)
  sendSuccess(res, result, "Berhasil mengambil detail user")
}

export const updateUserStatus = async (req: Request, res: Response) => {
  const parsed = updateUserStatusSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await usersService.updateUserStatus(req.params.id as string, parsed.data)
  sendSuccess(res, result, "Berhasil mengupdate status user")
}

// ─── Vendors Verification ─────────────────────────────────────────────────────
export const getPendingVendors = async (req: Request, res: Response) => {
  const result = await vendorService.getPendingVendors()
  sendSuccess(res, result, "Berhasil mengambil daftar vendor pending")
}

export const verifyVendor = async (req: Request, res: Response) => {
  const result = await vendorService.verifyVendor(req.params.id as string)
  sendSuccess(res, result, "Vendor berhasil diverifikasi")
}

export const rejectVendor = async (req: Request, res: Response) => {
  const parsed = rejectVendorSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await vendorService.rejectVendor(req.params.id as string, parsed.data)
  sendSuccess(res, result, "Vendor ditolak")
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const getAllBookings = async (req: Request, res: Response) => {
  const parsed = adminGetAllBookingsQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await adminService.getAllBookings(parsed.data)
  sendSuccess(res, result, "Berhasil mengambil daftar pesanan")
}

export const getBookingDetail = async (req: Request, res: Response) => {
  const result = await adminService.getBookingDetail(req.params.id as string)
  sendSuccess(res, result, "Berhasil mengambil detail pesanan")
}

// ─── Monitoring / Payments ────────────────────────────────────────────────────
export const getMonitoringStats = async (req: Request, res: Response) => {
  const result = await adminService.getMonitoringStats()
  sendSuccess(res, result, "Berhasil mengambil statistik monitoring")
}

export const getAllPayments = async (req: Request, res: Response) => {
  const parsed = adminGetAllPaymentsQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await adminService.getAllPayments(parsed.data)
  sendSuccess(res, result, "Berhasil mengambil daftar pembayaran")
}

// ─── Settings / Configuration ──────────────────────────────────────────────────
export const getSettings = async (req: Request, res: Response) => {
  const result = await adminService.getSettings()
  sendSuccess(res, result, "Berhasil mengambil pengaturan sistem")
}

export const updateSettings = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    sendValidationError(res, { body: ["Invalid settings payload"] })
    return
  }
  const result = await adminService.updateSettings(req.body)
  sendSuccess(res, result, "Berhasil memperbarui pengaturan sistem")
}

export const updateAdminPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body
  if (!newPassword || newPassword.length < 6) {
    sendValidationError(res, { newPassword: ["Password baru minimal 6 karakter"] })
    return
  }
  
  // Asumsi req.user di-inject dari auth middleware
  const userId = (req as any).user?.id
  if (!userId) {
    res.status(401).json({ success: false, error: { message: "Unauthorized" } })
    return
  }

  const result = await adminService.updateAdminPassword(userId, newPassword)
  sendSuccess(res, result, "Berhasil memperbarui kata sandi admin")
}

