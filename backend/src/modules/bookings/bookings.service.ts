// backend/src/modules/bookings/bookings.service.ts
import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type { CreateBookingInput, UpdateStatusInput } from "./bookings.validation.js"
import type { Prisma } from "@prisma/client"
import { createNotification } from "../notifications/notifications.service.js"

// ─── Create Booking (Khusus Customer) ────────────────────────────────────
export const createBooking = async (customerId: string, input: CreateBookingInput) => {
  // 1. Cek apakah layanan valid & aktif
  const layanan = await db.layanan.findUnique({
    where: { id: input.layananId },
    include: { vendor: true },
  })
  if (!layanan) throw new AppError("Layanan tidak ditemukan", 404)
  if (!layanan.isActive) throw new AppError("Layanan ini sedang tidak aktif", 400)

  const eventDateObj = new Date(input.eventDate)
  // Cegah booking untuk tanggal yang sudah lewat (past date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (eventDateObj < today) {
    throw new AppError("Tidak dapat memesan untuk tanggal yang sudah lewat", 400)
  }

  try {
    // 2 & 3. Gunakan Transaction untuk mengunci jadwal dan membuat booking
    const booking = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Cek apakah vendor menutup tanggal tersebut secara manual (bukan karena Booked)
      const closedJadwal = await tx.jadwal.findFirst({
        where: {
          vendorId: layanan.vendorId,
          date: eventDateObj,
          isAvailable: false,
          note: { not: "Booked" }
        },
      })

      if (closedJadwal) {
        throw new AppError("Maaf, Vendor tutup pada tanggal tersebut", 400)
      }

      // Buat jadwal khusus untuk booking ini agar bisa multi-booking per hari
      const jadwal = await tx.jadwal.create({
        data: {
          vendorId: layanan.vendorId,
          date: eventDateObj,
          isAvailable: false,
          note: "Booked",
        },
      })

      const newBooking = await tx.booking.create({
        data: {
          customerId,
          vendorId: layanan.vendorId,
          layananId: input.layananId,
          jadwalId: jadwal.id, // Sambungkan ke jadwal
          eventDate: eventDateObj,
          eventAddress: input.eventAddress ?? null,
          notes: input.notes ?? null,
          totalPrice: layanan.price,
          status: "PENDING",
        },
      })

      // Create Initial Payment Record based on paymentMode
      const isDP = input.paymentMode === "DP";
      const totalDec = Number(layanan.price);
      
      await tx.payment.create({
        data: {
          bookingId: newBooking.id,
          amount: layanan.price, // Total expected
          mode: isDP ? "DP" : "FULL",
          status: "PENDING",
          dpAmount: isDP ? totalDec * 0.3 : null,
          pelunasanAmount: isDP ? totalDec * 0.7 : null,
        }
      })

      return newBooking
    })

    // Kirim notifikasi ke Vendor
    try {
      if (layanan.vendor?.userId) {
        await createNotification({
          userId: layanan.vendor.userId,
          title: "Pesanan Baru Masuk",
          message: `Anda menerima pesanan baru untuk paket ${layanan.name} pada tanggal ${eventDateObj.toLocaleDateString("id-ID")}.`,
          type: "BOOKING",
          data: { bookingId: booking.id },
        })
      }
    } catch (notifError) {
      console.error("[CreateBooking] Gagal membuat notifikasi:", notifError)
    }

    return booking
  } catch (error: any) {
    if (error.code === "P2002" || (error.message && error.message.includes("Unique constraint failed"))) {
      throw new AppError("Maaf, Vendor tutup atau tanggal tersebut sudah dipesan", 400)
    }
    throw error
  }
}

// ─── Get My Bookings (Bisa diakses Customer & Vendor) ────────────────────
export const getMyBookings = async (
  userId: string, 
  role: string, 
  query?: { page?: number; limit?: number; status?: string | undefined }
) => {
  const page = query?.page || 1
  const limit = query?.limit || 50
  const skip = (page - 1) * limit
  let whereClause: any = {}

  if (role === "CUSTOMER") {
    // Customer melihat daftar pesanan miliknya
    whereClause = { customerId: userId }
  } else if (role === "VENDOR") {
    // Vendor melihat daftar pesanan yang masuk ke tokonya
    const vendor = await db.vendor.findUnique({ where: { userId } })
    if (!vendor) throw new AppError("Profil Vendor tidak ditemukan", 404)
    whereClause = { vendorId: vendor.id }
  } else {
    throw new AppError("Akses Role tidak diizinkan", 403)
  }

  if (query?.status) {
    whereClause.status = query.status
  }

  const data = await db.booking.findMany({
    where: whereClause,
    include: {
      layanan: { select: { name: true, price: true, duration: true } },
      customer: { select: { name: true, phone: true, email: true } },
      vendor: { select: { businessName: true, bankName: true, bankAccount: true, bankHolder: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  })
  const total = await db.booking.count({ where: whereClause })

  // Pembatalan Otomatis H-3 (Lazy Evaluation)
  const now = new Date()
  for (const booking of data) {
    if (booking.status === "CONFIRMED" && booking.payment?.mode === "DP" && booking.payment?.status !== "PAID") {
      const h3Date = new Date(booking.eventDate)
      h3Date.setDate(h3Date.getDate() - 3)
      if (now >= h3Date) {
        // Batalkan pesanan
        await db.booking.update({
          where: { id: booking.id },
          data: { status: "CANCELLED", cancelReason: "Otomatis dibatalkan: Belum melunasi pembayaran hingga H-3 acara" }
        })
        booking.status = "CANCELLED"
        booking.cancelReason = "Otomatis dibatalkan: Belum melunasi pembayaran hingga H-3 acara"
        
        // Buka kembali jadwal vendor
        if (booking.jadwalId) {
          await db.jadwal.update({
            where: { id: booking.jadwalId },
            data: { isAvailable: true, note: null }
          })
        }
      }
    }
  }

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

// ─── Update Booking Status ───────────────────────────────────────────────
export const updateBookingStatus = async (
  userId: string,
  role: string,
  bookingId: string,
  input: UpdateStatusInput
) => {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { vendor: true, payment: true },
  })

  if (!booking) throw new AppError("Pesanan tidak ditemukan", 404)

  // Cegah perubahan status apa pun jika pesanan sudah berstatus COMPLETED atau CANCELLED
  if (booking.status === "COMPLETED") {
    throw new AppError("Pesanan yang sudah selesai tidak dapat diubah statusnya", 400)
  }
  if (booking.status === "CANCELLED") {
    throw new AppError("Pesanan yang sudah dibatalkan tidak dapat diubah statusnya", 400)
  }

  // Otorisasi Customer: Boleh batalkan pesanan miliknya, atau konfirmasi selesai (pelepasan escrow)
  if (role === "CUSTOMER") {
    if (booking.customerId !== userId) throw new AppError("Akses ditolak", 403)
    if (input.status !== "CANCELLED" && input.status !== "COMPLETED") {
      throw new AppError("Customer hanya diizinkan untuk membatalkan atau menyelesaikan pesanan", 400)
    }
    // Blokir pembatalan jika pesanan sudah dibayar
    if (input.status === "CANCELLED" && booking.payment?.status === "PAID") {
      throw new AppError("Pesanan sudah Lunas. Silakan hubungi Admin untuk pengajuan pembatalan dan refund.", 400)
    }
  }

  // Otorisasi Vendor: Hanya boleh update pesanan milik tokonya
  if (role === "VENDOR") {
    if (booking.vendor.userId !== userId) throw new AppError("Akses ditolak", 403)

    // Vendor tidak boleh menyelesaikan pesanan secara sepihak
    if (input.status === "COMPLETED") {
      throw new AppError("Hanya Customer yang dapat menyelesaikan pesanan (melepas pembayaran escrow)", 400)
    }
  }

  // Logika Khusus: Pesanan Selesai (COMPLETED)
  if (input.status === "COMPLETED") {
    if (booking.payment?.status !== "PAID") {
      throw new AppError("Pesanan tidak bisa diselesaikan karena belum lunas dibayar", 400)
    }

    // Validasi Tanggal: Tidak boleh selesai sebelum tanggal acara dimulai
    const now = new Date()
    const eventDate = new Date(booking.eventDate)
    
    // Set both to start of day for comparison
    now.setHours(0, 0, 0, 0)
    eventDate.setHours(0, 0, 0, 0)
    
    if (now < eventDate) {
      throw new AppError("Pesanan belum bisa diselesaikan karena tanggal acara belum terlewat.", 400)
    }

    // Gunakan transaction untuk update status dan tambah saldo vendor
    const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Update Booking Status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: input.status,
          cancelReason: input.cancelReason ?? null,
        },
      })

      // 2. Tambah Saldo Vendor (95% masuk ke vendor, 5% komisi platform)
      const netAmount = Number(booking.totalPrice) * 0.95;
      await tx.vendor.update({
        where: { id: booking.vendorId },
        data: {
          balance: { increment: netAmount },
        },
      })

      return updatedBooking
    })

    // Kirim notifikasi
    try {
      await createNotification({
        userId: booking.customerId,
        title: "Pesanan Selesai",
        message: `Pesanan Anda dengan kode #${bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()} telah diselesaikan oleh Vendor. Terima kasih!`,
        type: "BOOKING",
        data: { bookingId },
      })

      if (booking.vendor?.userId) {
        await createNotification({
          userId: booking.vendor.userId,
          title: "Pesanan Selesai",
          message: `Pesanan #${bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()} telah diselesaikan dan dana telah ditambahkan ke saldo Anda.`,
          type: "BOOKING",
          data: { bookingId },
        })
      }
    } catch (e) {
      console.error("[UpdateBookingStatus] Gagal membuat notifikasi COMPLETED:", e)
    }

    return result
  }

  // Jika bukan COMPLETED, update status dan unlock jadwal jika CANCELLED
  const result = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: input.status,
        cancelReason: input.cancelReason ?? null,
      },
    })

    // Jika dibatalkan, bebaskan jadwal dan ubah status refund jika perlu
    if (input.status === "CANCELLED") {
      if (booking.jadwalId) {
        await tx.jadwal.update({
          where: { id: booking.jadwalId },
          data: { isAvailable: true, note: null },
        })
      }

      // Otomatis ubah status pembayaran menjadi PENDING_REFUND jika sebelumnya PAID
      if (booking.payment?.status === "PAID") {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: { 
            status: "PENDING_REFUND", 
            note: "Pesanan dibatalkan setelah lunas, menunggu proses refund oleh Admin." 
          },
        })
      }
    }

    return updatedBooking
  })

  // Kirim notifikasi
  try {
    if (input.status === "CANCELLED") {
      const customerMsg = booking.payment?.status === "PAID"
        ? `Pesanan Anda #${bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()} dibatalkan. Pengembalian dana sedang diproses oleh Admin.`
        : `Pesanan Anda #${bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()} telah dibatalkan.`
      
      await createNotification({
        userId: booking.customerId,
        title: "Pesanan Dibatalkan",
        message: customerMsg,
        type: "BOOKING",
        data: { bookingId },
      })

      if (booking.vendor?.userId) {
        await createNotification({
          userId: booking.vendor.userId,
          title: "Pesanan Dibatalkan",
          message: `Pesanan #${bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()} telah dibatalkan.`,
          type: "BOOKING",
          data: { bookingId },
        })
      }
    } else if (input.status === "CONFIRMED") {
      await createNotification({
        userId: booking.customerId,
        title: "Pesanan Dikonfirmasi",
        message: `Pesanan Anda #${bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()} telah dikonfirmasi oleh Vendor. Silakan segera selesaikan pembayaran agar pesanan dapat diproses.`,
        type: "BOOKING",
        data: { bookingId },
      })
    } else if (input.status === "IN_PROGRESS") {
      await createNotification({
        userId: booking.customerId,
        title: "Pesanan Diproses",
        message: `Pesanan Anda #${bookingId.substring(Math.max(0, bookingId.length - 6)).toUpperCase()} saat ini sedang dikerjakan oleh Vendor.`,
        type: "BOOKING",
        data: { bookingId },
      })
    }
  } catch (e) {
    console.error("[UpdateBookingStatus] Gagal membuat notifikasi CANCELLED:", e)
  }

  return result
}

// ─── Get Booking By ID (Otorisasi Customer & Vendor) ─────────────────────
export const getBookingById = async (userId: string, role: string, bookingId: string) => {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      layanan: {
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      vendor: {
        select: {
          id: true,
          userId: true,
          businessName: true,
          bankName: true,
          bankAccount: true,
          bankHolder: true,
          description: true,
          city: true,
          rating: true,
          user: {
            select: {
              avatar: true,
            },
          },
        },
      },
      payment: true,
    },
  })

  if (!booking) {
    throw new AppError("Pesanan tidak ditemukan", 404)
  }

  // Otorisasi: Customer hanya boleh melihat pesanan miliknya sendiri
  if (role === "CUSTOMER" && booking.customerId !== userId) {
    throw new AppError("Akses ditolak", 403)
  }

  // Otorisasi: Vendor hanya boleh melihat pesanan yang diajukan ke tokonya sendiri
  if (role === "VENDOR" && booking.vendor.userId !== userId) {
    throw new AppError("Akses ditolak", 403)
  }

  return booking
}