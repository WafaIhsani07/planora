import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type { Prisma } from "@prisma/client"

export const createWithdrawal = async (vendorId: string, payload: { amount: number }) => {
  const vendor = await db.vendor.findUnique({ where: { id: vendorId } })
  if (!vendor) throw new AppError("Vendor tidak ditemukan", 404)

  if (!vendor.bankName || !vendor.bankAccount || !vendor.bankHolder) {
    throw new AppError("Harap lengkapi data rekening bank di profil Anda terlebih dahulu", 400)
  }

  if (Number(vendor.balance) < payload.amount) {
    throw new AppError("Saldo tidak mencukupi untuk melakukan penarikan", 400)
  }

  // Lakukan dalam transaction agar aman
  return await db.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Potong saldo vendor
    await tx.vendor.update({
      where: { id: vendorId },
      data: { balance: { decrement: payload.amount } },
    })

    // 2. Buat record withdrawal
    return await tx.withdrawal.create({
      data: {
        vendorId,
        amount: payload.amount,
        status: "PENDING",
        bankName: vendor.bankName!,
        bankAccount: vendor.bankAccount!,
        bankHolder: vendor.bankHolder!,
      },
    })
  })
}

export const processWithdrawal = async (
  id: string,
  payload: { status: "PROCESSING" | "COMPLETED" | "REJECTED"; proofUrl?: string | undefined; note?: string | undefined }
) => {
  const withdrawal = await db.withdrawal.findUnique({ where: { id } })
  if (!withdrawal) throw new AppError("Data pencairan tidak ditemukan", 404)

  if (payload.status === "COMPLETED" && !payload.proofUrl) {
    throw new AppError("Bukti transfer (proofUrl) wajib disertakan untuk status COMPLETED", 400)
  }

  return await db.$transaction(async (tx: Prisma.TransactionClient) => {
    // Jika ditolak, kembalikan saldo ke vendor
    if (payload.status === "REJECTED" && withdrawal.status !== "REJECTED") {
      await tx.vendor.update({
        where: { id: withdrawal.vendorId },
        data: { balance: { increment: withdrawal.amount } },
      })
    }

    return await tx.withdrawal.update({
      where: { id },
      data: {
        status: payload.status,
        ...(payload.proofUrl !== undefined && { proofUrl: payload.proofUrl }),
        ...(payload.note !== undefined && { note: payload.note }),
      },
    })
  })
}
