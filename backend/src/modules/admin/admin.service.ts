import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
// Tambah mockDb-friendly reference ke vendor model
import type {
  AdminGetAllBookingsQuery,
  AdminGetAllPaymentsQuery,
} from "./admin.validation.js"

// ─── Get Dashboard Stats ──────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  // Semua user
  const totalUsers = await db.user.count({ where: {} })
  // Vendor yang sudah verified
  const activeVendors = await db.vendor.count({ where: { status: "VERIFIED" } })
  // Vendor yang masih pending
  const pendingVendors = await db.vendor.count({ where: { status: "PENDING" } })
  // Semua booking
  const totalBookings = await db.booking.count({ where: {} })
  // Booking yang menunggu konfirmasi
  const pendingBookings = await db.booking.count({ where: { status: "PENDING" } })
  // Total revenue dari pembayaran yang PAID
  const revenueAgg = await db.payment.aggregate({
    where: { status: "PAID" },
    _sum: { amount: true },
  })

  return {
    totalUsers,
    activeVendors,
    pendingVendors,
    totalBookings,
    pendingBookings,
    totalRevenue: Number(revenueAgg._sum.amount ?? 0),
  }
}

// ─── Get All Bookings (Admin) ─────────────────────────────────────────────────
export const getAllBookings = async (query: AdminGetAllBookingsQuery) => {
  const { page, limit, status, search } = query
  const skip = (page - 1) * limit

  const where = {
    ...(status !== undefined && { status }),
    ...(search !== undefined && {
      customer: {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      },
    }),
  }

  const bookings = await db.booking.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      totalPrice: true,
      eventDate: true,
      cancelReason: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      vendor: {
        select: { id: true, businessName: true },
      },
      layanan: {
        select: { id: true, name: true, price: true },
      },
      payment: {
        select: { id: true, status: true, amount: true, method: true },
      },
    },
  })
  const total = await db.booking.count({ where })

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// ─── Get Booking Detail (Admin) ───────────────────────────────────────────────
export const getBookingDetail = async (bookingId: string) => {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      status: true,
      totalPrice: true,
      eventDate: true,
      eventAddress: true,
      notes: true,
      cancelReason: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      vendor: {
        select: { id: true, businessName: true },
      },
      layanan: {
        select: { id: true, name: true, price: true },
      },
      jadwal: {
        select: { id: true, date: true },
      },
      payment: {
        select: {
          id: true,
          status: true,
          amount: true,
          method: true,
          proofUrl: true,
          paidAt: true,
          verifiedAt: true,
        },
      },
      review: {
        select: { id: true, rating: true, comment: true, createdAt: true },
      },
    },
  })

  if (!booking) throw new AppError("Pesanan tidak ditemukan", 404)
  return booking
}

// ─── Get Monitoring Stats (halaman /admin/monitoring) ─────────────────────────
export const getMonitoringStats = async () => {
  const totalTransactions = await db.payment.count({ where: {} })
  const paidCount = await db.payment.count({ where: { status: "PAID" } })
  const pendingCount = await db.payment.count({ where: { status: "PENDING" } })
  const failedCount = await db.payment.count({ where: { status: "FAILED" } })
  const refundedCount = await db.payment.count({ where: { status: "REFUNDED" } })
  const revenueAgg = await db.payment.aggregate({
    where: { status: "PAID" },
    _sum: { amount: true },
  })

  return {
    totalTransactions,
    paidCount,
    pendingCount,
    failedCount,
    refundedCount,
    totalRevenue: Number(revenueAgg._sum.amount ?? 0),
  }
}

// ─── Get All Payments (Admin) ─────────────────────────────────────────────────
export const getAllPayments = async (query: AdminGetAllPaymentsQuery) => {
  const { page, limit, status, startDate, endDate } = query
  const skip = (page - 1) * limit

  const where = {
    ...(status !== undefined && { status }),
    ...(startDate !== undefined &&
      endDate !== undefined && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
  }

  const payments = await db.payment.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      amount: true,
      method: true,
      proofUrl: true,
      paidAt: true,
      verifiedAt: true,
      createdAt: true,
      booking: {
        select: {
          id: true,
          customer: { select: { id: true, name: true, email: true } },
          vendor: { select: { id: true, businessName: true } },
          layanan: { select: { id: true, name: true } },
        },
      },
    },
  })
  const total = await db.payment.count({ where })

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
