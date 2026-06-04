import cron from "node-cron"
import { db } from "../config/database.js"
import { createNotification } from "../modules/notifications/notifications.service.js"

// Fungsi worker untuk mengecek dan membatalkan pesanan kadaluarsa (> 24 jam)
export const checkExpiredBookings = async () => {
  console.log("[Cron Job] Mengecek pesanan kadaluarsa...")
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    // Cari pesanan PENDING yang dibuat lebih dari 24 jam lalu
    // dan pembayarannya belum ada atau masih PENDING
    const expiredBookings = await db.booking.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lt: twentyFourHoursAgo,
        },
        OR: [
          { payment: null },
          { payment: { status: "PENDING" } }
        ]
      },
      include: { payment: true }
    })

    if (expiredBookings.length === 0) {
      console.log("[Cron Job] Tidak ada pesanan kadaluarsa.")
      return
    }

    let canceledCount = 0

    for (const booking of expiredBookings) {
      await db.$transaction(async (tx) => {
        // 1. Ubah status booking
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: "CANCELLED",
            cancelReason: "Waktu pembayaran 24 jam telah habis otomatis dibatalkan sistem.",
          },
        })

        // 2. Bebaskan jadwal jika ada
        if (booking.jadwalId) {
          await tx.jadwal.update({
            where: { id: booking.jadwalId },
            data: { isAvailable: true, note: null },
          })
        }

        // 3. Batalkan payment jika ada
        if (booking.payment) {
          await tx.payment.update({
            where: { id: booking.payment.id },
            data: { status: "FAILED", note: "Waktu pembayaran habis." },
          })
        }
      })

      // Kirim notifikasi ke Customer
      try {
        const displayId = booking.id.substring(Math.max(0, booking.id.length - 6)).toUpperCase()
        await createNotification({
          userId: booking.customerId,
          title: "Pesanan Kedaluwarsa",
          message: `Pesanan Anda #${displayId} otomatis dibatalkan karena tidak ada pembayaran yang diterima dalam 24 jam.`,
          type: "SYSTEM",
          data: { bookingId: booking.id },
        })
      } catch (notifErr) {
        console.error("[Cron Job] Gagal membuat notifikasi pembatalan:", notifErr)
      }

      canceledCount++
    }

    console.log(`[Cron Job] Berhasil membatalkan ${canceledCount} pesanan kadaluarsa.`)
  } catch (error) {
    console.error("[Cron Job] Gagal mengecek pesanan kadaluarsa:", error)
  }
}

// Jalankan setiap jam
cron.schedule("0 * * * *", checkExpiredBookings)
