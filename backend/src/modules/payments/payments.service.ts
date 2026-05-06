import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type { CreatePaymentInput, VerifyPaymentInput } from "./payments.validation.js"

// ─── Create Payment (Customer submit bukti bayar) ────────────────────────
export const createPayment = async (userId: string, input: CreatePaymentInput) => {
  const booking = await db.booking.findUnique({
    where: { id: input.bookingId },
  })

  if (!booking) throw new AppError("Pesanan tidak ditemukan", 404)
  if (booking.customerId !== userId) throw new AppError("Akses ditolak: Pesanan ini bukan milikmu", 403)

  const existingPayment = await db.payment.findUnique({
    where: { bookingId: input.bookingId },
  })
  if (existingPayment) throw new AppError("Data pembayaran untuk pesanan ini sudah ada", 400)

  // Otomatis ambil nominal total dari tabel Booking
  const payment = await db.payment.create({
    data: {
      bookingId: input.bookingId,
      amount: booking.totalPrice,
      method: input.method,
      proofUrl: input.proofUrl ?? null,
      status: "PENDING",
    },
  })

  return payment
}

// ─── Verify Payment (Vendor / Admin konfirmasi pembayaran) ───────────────
export const verifyPayment = async (userId: string, userRole: string, paymentId: string, input: VerifyPaymentInput) => {
  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    include: { booking: { include: { vendor: true } } },
  })

  if (!payment) throw new AppError("Data pembayaran tidak ditemukan", 404)

  // Otorisasi: Vendor hanya bisa verifikasi pembayaran untuk tokonya sendiri
  if (userRole === "VENDOR" && payment.booking.vendor.userId !== userId) {
    throw new AppError("Akses ditolak: Pembayaran ini untuk vendor lain", 403)
  }

  const verifiedPayment = await db.payment.update({
    where: { id: paymentId },
    data: {
      status: input.status,
      verifiedAt: new Date(),
      verifiedBy: userId,
      paidAt: input.status === "PAID" ? new Date() : null,
    },
  })

  // Jika pembayaran SAH (PAID), otomatis naikkan status booking jadi CONFIRMED
  if (input.status === "PAID") {
    await db.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    })
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