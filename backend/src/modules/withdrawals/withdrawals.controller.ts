import type { Request, Response, NextFunction } from "express"
import { sendSuccess } from "../../utils/response.js"
import * as withdrawalsService from "./withdrawals.service.js"
import { createWithdrawalSchema, processWithdrawalSchema } from "./withdrawals.validation.js"
import { AppError } from "../../utils/error.js"
import { db } from "../../config/database.js"

export const requestWithdrawal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId
    if (!userId) throw new AppError("Unauthorized", 401)
    
    // Get vendorId from userId
    const vendor = await db.vendor.findUnique({ where: { userId } })
    if (!vendor) throw new AppError("Hanya vendor yang dapat melakukan penarikan", 403)

    const payload = createWithdrawalSchema.parse(req.body)
    const withdrawal = await withdrawalsService.createWithdrawal(vendor.id, payload)
    
    sendSuccess(res, withdrawal, "Pengajuan penarikan dana berhasil", 201)
  } catch (error) {
    next(error)
  }
}

export const getAllWithdrawals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.userRole
    const userId = req.userId
    
    let whereClause = {}
    
    // Jika VENDOR, hanya bisa melihat penarikan miliknya
    if (role === "VENDOR") {
      const vendor = await db.vendor.findUnique({ where: { userId } })
      if (!vendor) throw new AppError("Vendor tidak ditemukan", 404)
      whereClause = { vendorId: vendor.id }
    } else if (role !== "ADMIN") {
      throw new AppError("Akses ditolak", 403)
    }

    const withdrawals = await db.withdrawal.findMany({
      where: whereClause,
      include: {
        vendor: {
          select: { businessName: true, balance: true }
        }
      },
      orderBy: { createdAt: "desc" },
    })

    sendSuccess(res, { withdrawals }, "Data pencairan dana berhasil diambil")
  } catch (error) {
    next(error)
  }
}

export const processWithdrawalAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const payload = processWithdrawalSchema.parse(req.body)
    
    const withdrawal = await withdrawalsService.processWithdrawal(id as string, payload)
    
    sendSuccess(res, withdrawal, `Status pencairan berhasil diubah menjadi ${payload.status}`)
  } catch (error) {
    next(error)
  }
}
