// backend/src/modules/jadwal/jadwal.service.ts
import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type { SetJadwalInput } from "./jadwal.validation.js"

// ─── Dapatkan Vendor ID dari User ID ──────────────────────────────────────
const getVendorIdByUserId = async (userId: string) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor) throw new AppError("Profil Vendor tidak ditemukan", 404)
  return vendor.id
}

// ─── Set Jadwal (Upsert) ──────────────────────────────────────────────────
export const setJadwal = async (userId: string, input: SetJadwalInput) => {
  const vendorId = await getVendorIdByUserId(userId)
  
  // Konversi string YYYY-MM-DD ke objek Date untuk Prisma
  const dateObj = new Date(input.date)

  const jadwal = await db.jadwal.upsert({
    where: {
      vendorId_date: {
        vendorId,
        date: dateObj,
      },
    },
    update: {
      isAvailable: input.isAvailable,
      note: input.note ?? null,
    },
    create: {
      vendorId,
      date: dateObj,
      isAvailable: input.isAvailable,
      note: input.note ?? null,
    },
  })

  return jadwal
}

// ─── Get Jadwal Vendor (Public/Customer & Vendor Sendiri) ─────────────────
export const getVendorJadwal = async (vendorId: string, startDate?: string, endDate?: string) => {
  const whereClause: any = { vendorId }

  if (startDate || endDate) {
    whereClause.date = {}
    if (startDate) whereClause.date.gte = new Date(startDate)
    if (endDate) whereClause.date.lte = new Date(endDate)
  }

  const jadwal = await db.jadwal.findMany({
    where: whereClause,
    orderBy: { date: "asc" },
  })

  return jadwal
}

// ─── Get Jadwal Saya (Berdasarkan Token User) ─────────────────────────────
export const getMyJadwal = async (userId: string, startDate?: string, endDate?: string) => {
  const vendorId = await getVendorIdByUserId(userId)
  return getVendorJadwal(vendorId, startDate, endDate)
}