import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockDb, resetAllMocks } from "../../__tests__/helpers/mock-db.js"

vi.mock("../../config/database.js", () => ({ db: mockDb }))

import * as adminService from "./admin.service.js"

describe("Admin Service", () => {
  beforeEach(() => {
    resetAllMocks()
  })

  // ──────────────────────────────────────────────────────────────
  // getDashboardStats
  // ──────────────────────────────────────────────────────────────
  describe("getDashboardStats", () => {
    it("should return all aggregated stats", async () => {
      mockDb.user.count.mockResolvedValueOnce(150)   // totalUsers
      mockDb.vendor.count
        .mockResolvedValueOnce(25)                   // activeVendors (VERIFIED)
        .mockResolvedValueOnce(12)                   // pendingVendors (PENDING)
      mockDb.booking.count
        .mockResolvedValueOnce(300)                  // totalBookings
        .mockResolvedValueOnce(50)                   // pendingBookings
      mockDb.payment.aggregate.mockResolvedValue({ _sum: { amount: 75000000 } })

      const result = await adminService.getDashboardStats()

      expect(result).toMatchObject({
        totalUsers: 150,
        activeVendors: 25,
        pendingVendors: 12,
        totalBookings: 300,
        pendingBookings: 50,
        totalRevenue: 75000000,
      })
    })

    it("should return 0 for revenue when no payments exist", async () => {
      mockDb.user.count.mockResolvedValue(0)
      mockDb.vendor.count.mockResolvedValue(0)
      mockDb.booking.count.mockResolvedValue(0)
      mockDb.payment.aggregate.mockResolvedValue({ _sum: { amount: null } })

      const result = await adminService.getDashboardStats()

      expect(result.totalRevenue).toBe(0)
    })

    it("should call db.user.count once for totalUsers", async () => {
      mockDb.user.count.mockResolvedValue(0)
      mockDb.vendor.count.mockResolvedValue(0)
      mockDb.booking.count.mockResolvedValue(0)
      mockDb.payment.aggregate.mockResolvedValue({ _sum: { amount: null } })

      await adminService.getDashboardStats()

      expect(mockDb.user.count).toHaveBeenCalledOnce()
      expect(mockDb.user.count).toHaveBeenCalledWith({ where: {} })
    })

    it("should call db.vendor.count separately for VERIFIED and PENDING", async () => {
      mockDb.user.count.mockResolvedValue(0)
      mockDb.vendor.count.mockResolvedValue(0)
      mockDb.booking.count.mockResolvedValue(0)
      mockDb.payment.aggregate.mockResolvedValue({ _sum: { amount: null } })

      await adminService.getDashboardStats()

      expect(mockDb.vendor.count).toHaveBeenCalledWith({ where: { status: "VERIFIED" } })
      expect(mockDb.vendor.count).toHaveBeenCalledWith({ where: { status: "PENDING" } })
      expect(mockDb.vendor.count).toHaveBeenCalledTimes(2)
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getAllBookings (admin — lihat semua booking)
  // ──────────────────────────────────────────────────────────────
  describe("getAllBookings", () => {
    it("should return paginated list of all bookings", async () => {
      const mockBookings = [
        {
          id: "b1",
          status: "PENDING",
          totalPrice: 1500000,
          customer: { name: "Andi", email: "andi@mail.com" },
          vendor: { businessName: "Vendor A" },
          layanan: { name: "Fotografi" },
          createdAt: new Date(),
        },
      ]
      mockDb.booking.findMany.mockResolvedValue(mockBookings)
      mockDb.booking.count.mockResolvedValue(1)

      const result = await adminService.getAllBookings({ page: 1, limit: 20 })

      expect(result.bookings).toEqual(mockBookings)
      expect(result.pagination.total).toBe(1)
      expect(result.pagination.page).toBe(1)
      expect(mockDb.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
          orderBy: { createdAt: "desc" },
        })
      )
    })

    it("should filter bookings by status", async () => {
      mockDb.booking.findMany.mockResolvedValue([])
      mockDb.booking.count.mockResolvedValue(0)

      await adminService.getAllBookings({ page: 1, limit: 20, status: "CONFIRMED" })

      expect(mockDb.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: "CONFIRMED" }),
        })
      )
    })

    it("should filter bookings by search (customer name/email)", async () => {
      mockDb.booking.findMany.mockResolvedValue([])
      mockDb.booking.count.mockResolvedValue(0)

      await adminService.getAllBookings({ page: 1, limit: 20, search: "Andi" })

      expect(mockDb.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            customer: expect.objectContaining({
              OR: expect.arrayContaining([
                expect.objectContaining({ name: expect.objectContaining({ contains: "Andi" }) }),
              ]),
            }),
          }),
        })
      )
    })

    it("should apply correct pagination skip", async () => {
      mockDb.booking.findMany.mockResolvedValue([])
      mockDb.booking.count.mockResolvedValue(0)

      await adminService.getAllBookings({ page: 3, limit: 10 })

      expect(mockDb.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 })
      )
    })

    it("should return empty result with zero total", async () => {
      mockDb.booking.findMany.mockResolvedValue([])
      mockDb.booking.count.mockResolvedValue(0)

      const result = await adminService.getAllBookings({ page: 1, limit: 20 })

      expect(result.bookings).toEqual([])
      expect(result.pagination.total).toBe(0)
      expect(result.pagination.totalPages).toBe(0)
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getBookingDetail (admin — detail satu booking)
  // ──────────────────────────────────────────────────────────────
  describe("getBookingDetail", () => {
    it("should return full booking detail including payment and review", async () => {
      const mockBooking = {
        id: "b1",
        status: "COMPLETED",
        totalPrice: 2000000,
        customer: { id: "c1", name: "Andi", email: "andi@mail.com", phone: "081234" },
        vendor: { id: "v1", businessName: "Vendor A" },
        layanan: { id: "l1", name: "Fotografi", price: 2000000 },
        payment: { id: "p1", status: "PAID", amount: 2000000 },
        review: { id: "r1", rating: 5, comment: "Bagus!" },
        jadwal: null,
      }
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      const result = await adminService.getBookingDetail("b1")

      expect(result).toEqual(mockBooking)
      expect(mockDb.booking.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: "b1" } })
      )
    })

    it("should throw 404 if booking not found", async () => {
      mockDb.booking.findUnique.mockResolvedValue(null)

      await expect(adminService.getBookingDetail("nonexistent")).rejects.toThrow(
        "Pesanan tidak ditemukan"
      )
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getMonitoringStats (stat transaksi untuk halaman /admin/monitoring)
  // ──────────────────────────────────────────────────────────────
  describe("getMonitoringStats", () => {
    it("should return payment stats grouped by status", async () => {
      mockDb.payment.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(60)  // PAID
        .mockResolvedValueOnce(25)  // PENDING
        .mockResolvedValueOnce(10)  // FAILED
        .mockResolvedValueOnce(5)   // REFUNDED
      mockDb.payment.aggregate.mockResolvedValue({ _sum: { amount: 120000000 } })

      const result = await adminService.getMonitoringStats()

      expect(result).toMatchObject({
        totalTransactions: 100,
        paidCount: 60,
        pendingCount: 25,
        failedCount: 10,
        refundedCount: 5,
        totalRevenue: 120000000,
      })
    })

    it("should return zero revenue when no paid payments", async () => {
      mockDb.payment.count.mockResolvedValue(0)
      mockDb.payment.aggregate.mockResolvedValue({ _sum: { amount: null } })

      const result = await adminService.getMonitoringStats()

      expect(result.totalRevenue).toBe(0)
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getAllPayments (daftar pembayaran untuk halaman monitoring)
  // ──────────────────────────────────────────────────────────────
  describe("getAllPayments", () => {
    it("should return paginated list of all payments", async () => {
      const mockPayments = [
        {
          id: "pay-1",
          status: "PAID",
          amount: 1500000,
          method: "BANK_TRANSFER",
          paidAt: new Date(),
          booking: {
            id: "b1",
            customer: { name: "Andi" },
            vendor: { businessName: "Vendor A" },
            layanan: { name: "Fotografi" },
          },
        },
      ]
      mockDb.payment.findMany.mockResolvedValue(mockPayments)
      mockDb.payment.count.mockResolvedValue(1)

      const result = await adminService.getAllPayments({ page: 1, limit: 20 })

      expect(result.payments).toEqual(mockPayments)
      expect(result.pagination.total).toBe(1)
    })

    it("should filter payments by status", async () => {
      mockDb.payment.findMany.mockResolvedValue([])
      mockDb.payment.count.mockResolvedValue(0)

      await adminService.getAllPayments({ page: 1, limit: 20, status: "PAID" })

      expect(mockDb.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: "PAID" }),
        })
      )
    })

    it("should filter by date range when startDate and endDate provided", async () => {
      mockDb.payment.findMany.mockResolvedValue([])
      mockDb.payment.count.mockResolvedValue(0)

      await adminService.getAllPayments({
        page: 1,
        limit: 20,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
      })

      expect(mockDb.payment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        })
      )
    })

    it("should return empty result when no payments exist", async () => {
      mockDb.payment.findMany.mockResolvedValue([])
      mockDb.payment.count.mockResolvedValue(0)

      const result = await adminService.getAllPayments({ page: 1, limit: 20 })

      expect(result.payments).toEqual([])
      expect(result.pagination.total).toBe(0)
    })
  })
})
