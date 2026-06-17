import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
// Tambah mockDb-friendly reference ke vendor model
import type {
  AdminGetAllBookingsQuery,
  AdminGetAllPaymentsQuery,
} from "./admin.validation.js"

// ─── Get Dashboard Stats ──────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  // Semua user (role CUSTOMER)
  const totalUsers = await db.user.count({ where: { role: "CUSTOMER" } })
  // Total vendor
  const totalVendors = await db.vendor.count({ where: {} })
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

  // Escrow Balance (PAID payments where bookings are not completed or cancelled)
  const escrowAgg = await db.payment.aggregate({
    where: {
      status: "PAID",
      booking: {
        status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      },
    },
    _sum: { amount: true },
  })

  // Ready to Withdraw (PENDING withdrawals)
  const withdrawalsAgg = await db.withdrawal.aggregate({
    where: { status: "PENDING" },
    _sum: { amount: true },
  })

  // Monthly Commission (5% of completed paid bookings this month)
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const completedBookingsThisMonth = await db.booking.findMany({
    where: {
      status: "COMPLETED",
      updatedAt: { gte: firstDayOfMonth },
      payment: { status: "PAID" }
    },
    select: { totalPrice: true }
  })
  const monthlyCommission = completedBookingsThisMonth.reduce(
    (sum, booking) => sum + Number(booking.totalPrice) * 0.05,
    0
  )

  // Pending Payments (PENDING status with uploaded proof)
  const pendingPayments = await db.payment.count({
    where: { status: "PENDING", proofUrl: { not: null } }
  })

  // Chart data (last 7 days daily revenue)
  const chartData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

    const dayPaid = await db.payment.aggregate({
      where: {
        status: "PAID",
        OR: [
          { paidAt: { gte: startOfDay, lte: endOfDay } },
          { paidAt: null, createdAt: { gte: startOfDay, lte: endOfDay } }
        ]
      },
      _sum: { amount: true }
    })

    const dayName = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    chartData.push({
      date: dayName,
      revenue: Number(dayPaid._sum.amount ?? 0)
    })
  }

  return {
    totalUsers,
    totalVendors,
    activeVendors,
    pendingVendors,
    totalBookings,
    pendingBookings,
    totalRevenue: Number(revenueAgg._sum.amount ?? 0),
    escrowBalance: Number(escrowAgg._sum.amount ?? 0),
    readyToWithdraw: Number(withdrawalsAgg._sum.amount ?? 0),
    monthlyCommission,
    pendingPayments,
    chartData,
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

// ─── System Settings (Admin) ──────────────────────────────────────────────────
export const getSettings = async () => {
  const settings = await db.systemSetting.findMany()
  const result: Record<string, any> = {}
  settings.forEach((s: any) => {
    result[s.key] = s.value
  })
  return result
}

export const updateSettings = async (settings: Record<string, any>) => {
  const results = []
  for (const [key, value] of Object.entries(settings)) {
    const updated = await db.systemSetting.upsert({
      where: { key },
      update: { value: value as any },
      create: { key, value: value as any },
    })
    results.push(updated)
  }
  return results
}

// ─── Update Admin Password ────────────────────────────────────────────────────
import bcrypt from "bcryptjs"
export const updateAdminPassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  const user = await db.user.update({
    where: { id: userId, role: "ADMIN" },
    data: { password: hashedPassword }
  })
  return { id: user.id, email: user.email }
}

