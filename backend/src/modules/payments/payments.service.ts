import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type { CreatePaymentInput, VerifyPaymentInput } from "./payments.validation.js"
import { createNotification } from "../notifications/notifications.service.js"

// ─── Create Payment (Customer submit bukti bayar) ────────────────────────
export const createPayment = async (userId: string, input: CreatePaymentInput) => {
  const booking = await db.booking.findUnique({
    where: { id: input.bookingId },
    include: { vendor: { select: { userId: true } } },
  })

  if (!booking) throw new AppError("Pesanan tidak ditemukan", 404)
  if (booking.customerId !== userId) throw new AppError("Akses ditolak: Pesanan ini bukan milikmu", 403)

  const existingPayment = await db.payment.findUnique({
    where: { bookingId: input.bookingId },
  })

  if (existingPayment) {
    const isDP = existingPayment.mode === "DP"
    
    let updatedPayment;
    if (input.type === "DP" || (isDP && (existingPayment.dpStatus === null || existingPayment.dpStatus === "FAILED"))) {
      if (existingPayment.dpStatus === "PAID") throw new AppError("DP sudah dibayar lunas", 400)
      updatedPayment = await db.payment.update({
        where: { bookingId: input.bookingId },
        data: {
          dpMethod: input.method,
          dpProofUrl: input.proofUrl,
          dpStatus: "PENDING",
        }
      })
    } else if (input.type === "PELUNASAN" || (isDP && existingPayment.dpStatus === "PAID")) {
      if (existingPayment.pelunasanStatus === "PAID") throw new AppError("Pelunasan sudah dibayar lunas", 400)
      updatedPayment = await db.payment.update({
        where: { bookingId: input.bookingId },
        data: {
          pelunasanMethod: input.method,
          pelunasanProofUrl: input.proofUrl,
          pelunasanStatus: "PENDING",
        }
      })
    } else {
      if (existingPayment.status === "PAID") throw new AppError("Pesanan sudah lunas", 400)
      updatedPayment = await db.payment.update({
        where: { bookingId: input.bookingId },
        data: {
          method: input.method,
          proofUrl: input.proofUrl,
          status: "PENDING",
        }
      })
    }
    
    // Kirim notifikasi ke Vendor bahwa Customer telah mengunggah bukti bayar
    try {
      const displayId = input.bookingId.substring(Math.max(0, input.bookingId.length - 6)).toUpperCase()
      if (booking.vendor?.userId) {
        await createNotification({
          userId: booking.vendor.userId,
          title: "Bukti Pembayaran Diunggah",
          message: `Pelanggan telah mengunggah bukti pembayaran untuk pesanan #${displayId}. Menunggu verifikasi Admin.`,
          type: "PAYMENT",
          data: { bookingId: input.bookingId },
        })
      }
    } catch (e) {
      console.error("[CreatePayment] Gagal mengirim notifikasi upload bukti:", e)
    }

    return updatedPayment;
  }

  // Fallback (jika data payment belum ada sama sekali)
  const payment = await db.payment.create({
    data: {
      bookingId: input.bookingId,
      amount: booking.totalPrice,
      method: input.method,
      proofUrl: input.proofUrl ?? null,
      status: "PENDING",
    },
  })

  // Kirim notifikasi ke Vendor bahwa Customer telah mengunggah bukti bayar
  try {
    const displayId = input.bookingId.substring(Math.max(0, input.bookingId.length - 6)).toUpperCase()
    if (booking.vendor?.userId) {
      await createNotification({
        userId: booking.vendor.userId,
        title: "Bukti Pembayaran Diunggah",
        message: `Pelanggan telah mengunggah bukti pembayaran untuk pesanan #${displayId}. Menunggu verifikasi Admin.`,
        type: "PAYMENT",
        data: { bookingId: input.bookingId },
      })
    }
  } catch (e) {
    console.error("[CreatePayment] Gagal mengirim notifikasi upload bukti:", e)
  }

  return payment
}

// ─── Verify Payment (Vendor / Admin konfirmasi pembayaran) ───────────────
export const verifyPayment = async (userId: string, userRole: string, paymentId: string, input: VerifyPaymentInput) => {
  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    include: { booking: { include: { vendor: true } } },
  })

  if (!payment) throw new AppError("Data pembayaran tidak ditemukan", 404)

  // Otorisasi: Hanya ADMIN yang bisa memverifikasi pembayaran
  if (userRole !== "ADMIN") {
    throw new AppError("Akses ditolak: Hanya Admin yang dapat memverifikasi pembayaran", 403)
  }

  let updateData: any = {
    verifiedBy: userId,
    note: input.note ?? null,
  }

  if (input.type === "DP") {
    updateData.dpStatus = input.status
    updateData.dpVerifiedAt = new Date()
    updateData.dpPaidAt = input.status === "PAID" ? new Date() : null
  } else if (input.type === "PELUNASAN") {
    updateData.pelunasanStatus = input.status
    updateData.pelunasanVerifiedAt = new Date()
    updateData.pelunasanPaidAt = input.status === "PAID" ? new Date() : null
    
    if (input.status === "PAID") {
      updateData.status = "PAID"
      updateData.verifiedAt = new Date()
      updateData.paidAt = new Date()
    }
  } else {
    updateData.status = input.status
    updateData.verifiedAt = new Date()
    updateData.paidAt = input.status === "PAID" ? new Date() : null
    updateData.refundProofUrl = input.refundProofUrl ?? null
    updateData.refundedAt = input.status === "REFUNDED" ? new Date() : null
    updateData.refundedBy = input.status === "REFUNDED" ? userId : null
  }

  const verifiedPayment = await db.payment.update({
    where: { id: paymentId },
    data: updateData,
  })

  // Jika pembayaran DP atau FULL SAH (PAID), otomatis naikkan status booking jadi CONFIRMED
  if (input.status === "PAID" && (input.type === "FULL" || input.type === "DP")) {
    await db.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    })
  }

  // Kirim notifikasi
  try {
    const bookingId = payment.bookingId
    const displayId = bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()

    if (input.status === "PAID") {
      // Notifikasi ke Customer
      await createNotification({
        userId: payment.booking.customerId,
        title: "Pembayaran Diterima",
        message: `Pembayaran Anda untuk pesanan #${displayId} telah diverifikasi oleh Admin. Pesanan Anda kini dikonfirmasi!`,
        type: "PAYMENT",
        data: { bookingId },
      })

      // Notifikasi ke Vendor
      if (payment.booking.vendor?.userId) {
        await createNotification({
          userId: payment.booking.vendor.userId,
          title: "Pembayaran Lunas",
          message: `Pembayaran untuk pesanan #${displayId} telah lunas dan diverifikasi oleh Admin.`,
          type: "PAYMENT",
          data: { bookingId },
        })
      }
    } else if (input.status === "FAILED") {
      // Notifikasi ke Customer
      await createNotification({
        userId: payment.booking.customerId,
        title: "Pembayaran Ditolak",
        message: `Pembayaran Anda untuk pesanan #${displayId} ditolak oleh Admin. Catatan: ${input.note ?? "-"}`,
        type: "PAYMENT",
        data: { bookingId },
      })
    } else if (input.status === "REFUNDED") {
      // Notifikasi ke Customer
      await createNotification({
        userId: payment.booking.customerId,
        title: "Refund Berhasil",
        message: `Pengembalian dana untuk pesanan #${displayId} telah ditransfer balik oleh Admin. Silakan periksa rekening Anda.`,
        type: "PAYMENT",
        data: { bookingId },
      })
    }
  } catch (notifError) {
    console.error("[VerifyPayment] Gagal mengirim notifikasi:", notifError)
  }

  return verifiedPayment
}

// ─── Get Payment Details ─────────────────────────────────────────────────
export const getPaymentByBookingId = async (userId: string, userRole: string, bookingId: string) => {
  const payment = await db.payment.findUnique({
    where: { bookingId },
    include: { booking: { include: { vendor: true } } },
  })

  if (!payment) throw new AppError("Pembayaran belum dilakukan untuk pesanan ini", 404)

  // Validasi agar hanya pihak terkait yang bisa melihat data pembayaran
  if (userRole === "CUSTOMER" && payment.booking.customerId !== userId) throw new AppError("Akses ditolak", 403)
  if (userRole === "VENDOR" && payment.booking.vendor.userId !== userId) throw new AppError("Akses ditolak", 403)

  return payment
}