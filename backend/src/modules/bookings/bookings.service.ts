// backend/src/modules/bookings/bookings.service.ts
import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type { CreateBookingInput, UpdateStatusInput } from "./bookings.validation.js"

// ─── Create Booking (Khusus Customer) ────────────────────────────────────
export const createBooking = async (customerId: string, input: CreateBookingInput) => {
  // 1. Cek apakah layanan valid & aktif
  const layanan = await db.layanan.findUnique({
    where: { id: input.layananId },
  })
  if (!layanan) throw new AppError("Layanan tidak ditemukan", 404)
  if (!layanan.isActive) throw new AppError("Layanan ini sedang tidak aktif", 400)

  const eventDateObj = new Date(input.eventDate)

  // 2. Cek Jadwal Vendor: Apakah vendor secara eksplisit menandai tanggal ini "Tutup"?
  const jadwal = await db.jadwal.findUnique({
    where: {
      vendorId_date: {
        vendorId: layanan.vendorId,
        date: eventDateObj,
      },
    },
  })

  if (jadwal && !jadwal.isAvailable) {
    throw new AppError("Maaf, Vendor tutup atau tidak tersedia pada tanggal tersebut", 400)
  }

  // 3. Buat Booking
  const booking = await db.booking.create({
    data: {
      customerId,
      vendorId: layanan.vendorId,
      layananId: input.layananId,
      eventDate: eventDateObj,
      eventAddress: input.eventAddress ?? null,
      notes: input.notes ?? null,
      totalPrice: layanan.price, // Harga diambil langsung dari database layanan
      status: "PENDING",
    },
  })

  return booking
}

// ─── Get My Bookings (Bisa diakses Customer & Vendor) ────────────────────
export const getMyBookings = async (userId: string, role: string) => {
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

  return db.booking.findMany({
    where: whereClause,
    include: {
      layanan: { select: { name: true, price: true } },
      customer: { select: { name: true, phone: true } },
      vendor: { select: { businessName: true } },
    },
    orderBy: { createdAt: "desc" },
  })
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
    include: { vendor: true },
  })

  if (!booking) throw new AppError("Pesanan tidak ditemukan", 404)

  // Otorisasi Customer: Hanya boleh batalkan pesanan miliknya
  if (role === "CUSTOMER") {
    if (booking.customerId !== userId) throw new AppError("Akses ditolak", 403)
    if (input.status !== "CANCELLED") {
      throw new AppError("Customer hanya diizinkan untuk membatalkan pesanan", 400)
    }
  }

  // Otorisasi Vendor: Hanya boleh update pesanan milik tokonya
  if (role === "VENDOR") {
    if (booking.vendor.userId !== userId) throw new AppError("Akses ditolak", 403)
  }

  return db.booking.update({
    where: { id: bookingId },
    data: {
      status: input.status,
      cancelReason: input.cancelReason ?? null,
    },
  })
}