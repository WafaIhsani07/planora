// backend/src/modules/jadwal/jadwal.controller.ts
import type { Request, Response, NextFunction } from "express"
import * as jadwalService from "./jadwal.service.js"
import { setJadwalSchema, getJadwalQuerySchema } from "./jadwal.validation.js"
import { sendSuccess, sendValidationError } from "../../utils/response.js"

// ─── Set Jadwal (Khusus Vendor) ───────────────────────────────────────────
export const setJadwal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = setJadwalSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await jadwalService.setJadwal(req.userId, parsed.data)
  sendSuccess(res, result, "Jadwal berhasil disimpan")
}

// ─── Get Jadwal Saya (Khusus Vendor) ──────────────────────────────────────
export const getMyJadwal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsedQuery = getJadwalQuerySchema.safeParse(req.query)
  if (!parsedQuery.success) {
    sendValidationError(res, parsedQuery.error.flatten().fieldErrors)
    return
  }

  const { startDate, endDate } = parsedQuery.data
  const result = await jadwalService.getMyJadwal(req.userId, startDate, endDate)
  sendSuccess(res, result, "Jadwal berhasil diambil")
}

// ─── Get Jadwal By Vendor ID (Untuk Aplikasi Mobile / Public) ─────────────
export const getJadwalByVendorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
 const vendorId = req.params.vendorId as string
  const parsedQuery = getJadwalQuerySchema.safeParse(req.query)
  if (!parsedQuery.success) {
    sendValidationError(res, parsedQuery.error.flatten().fieldErrors)
    return
  }

  const { startDate, endDate } = parsedQuery.data
  const result = await jadwalService.getVendorJadwal(vendorId, startDate, endDate)
  sendSuccess(res, result, "Jadwal vendor berhasil diambil")
}