import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockDb, resetAllMocks } from "../../__tests__/helpers/mock-db.js"

// Mock database sebelum modul di-import
vi.mock("../../config/database.js", () => ({ db: mockDb }))

// Mock node-cron agar schedule tidak berjalan di background selama pengujian
vi.mock("node-cron", () => ({
  default: {
    schedule: vi.fn(),
  },
}))

import * as bookingsService from "./bookings.service.js"
import * as paymentsService from "../payments/payments.service.js"
import { checkExpiredBookings } from "../../jobs/cron.js"

describe("End-to-End (E2E) Integration Tests - Fase 1-4 dengan Peningkatan", () => {
  beforeEach(() => {
    resetAllMocks()
  })

  // ─── 1. PENCEGAHAN DOUBLE BOOKING ──────────────────────────────────────────
  describe("1. Pencegahan Double Booking & Race Condition", () => {
    it("should lock schedule on booking creation, notify the vendor, and prevent a second booking on the same date", async () => {
      const customerId = "customer-1"
      const input = {
        layananId: "layanan-1",
        eventDate: "2026-07-05",
        eventAddress: "Jakarta",
        notes: "Ulang tahun",
      }

      const mockLayanan = {
        id: "layanan-1",
        vendorId: "vendor-1",
        name: "Photografi Wedding",
        price: 1500000,
        isActive: true,
        vendor: {
          id: "vendor-1",
          userId: "vendor-user-1",
        },
      }

      const mockJadwal = {
        id: "jadwal-1",
        vendorId: "vendor-1",
        date: new Date("2026-07-05"),
        isAvailable: false,
        note: "Booked",
      }

      const mockBooking = {
        id: "booking-1",
        customerId,
        vendorId: "vendor-1",
        layananId: "layanan-1",
        jadwalId: "jadwal-1",
        eventDate: new Date("2026-07-05"),
        totalPrice: 1500000,
        status: "PENDING",
      }

      // Skenario 1: Pesanan pertama berhasil (jadwal belum di-lock)
      mockDb.layanan.findUnique.mockResolvedValue(mockLayanan)
      mockDb.$transaction.mockImplementationOnce(async (cb: Function) => {
        const tx = {
          jadwal: {
            findFirst: vi.fn().mockResolvedValue(null),
            findUnique: vi.fn().mockResolvedValue(null), // Jadwal kosong/belum ada
            create: vi.fn().mockResolvedValue(mockJadwal),
          },
          booking: {
            create: vi.fn().mockResolvedValue(mockBooking),
          },
          payment: {
            create: vi.fn().mockResolvedValue({}),
          },
        }
        return cb(tx)
      })

      const res1 = await bookingsService.createBooking(customerId, input)
      expect(res1).toEqual(mockBooking)

      // Cek apakah notifikasi dibuat untuk Vendor
      expect(mockDb.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "vendor-user-1",
            title: "Pesanan Baru Masuk",
            type: "BOOKING",
          }),
        })
      )

      // Skenario 2: Pesanan kedua gagal karena jadwal sudah di-lock (isAvailable: false)
      mockDb.$transaction.mockImplementationOnce(async (cb: Function) => {
        const tx = {
          jadwal: {
            findFirst: vi.fn().mockResolvedValue(null),
            create: vi.fn().mockImplementation(() => {
              const error: any = new Error("Unique constraint failed")
              error.code = "P2002"
              throw error
            }),
          },
          payment: {
            create: vi.fn().mockResolvedValue({}),
          },
        }
        return cb(tx)
      })

      await expect(
        bookingsService.createBooking("customer-2", input)
      ).rejects.toThrow("Maaf, Vendor tutup atau tanggal tersebut sudah dipesan")
    })

    it("should handle Prisma P2002 error gracefully and return user-friendly message", async () => {
      const customerId = "customer-1"
      const input = {
        layananId: "layanan-1",
        eventDate: "2026-07-05",
      }

      const mockLayanan = {
        id: "layanan-1",
        vendorId: "vendor-1",
        price: 1500000,
        isActive: true,
      }

      mockDb.layanan.findUnique.mockResolvedValue(mockLayanan)
      
      // Simulasikan error P2002 (unique constraint failed) pada saat transaction
      mockDb.$transaction.mockImplementationOnce(async () => {
        const error: any = new Error("Unique constraint failed")
        error.code = "P2002"
        throw error
      })

      await expect(
        bookingsService.createBooking(customerId, input as any)
      ).rejects.toThrow("Maaf, Vendor tutup atau tanggal tersebut sudah dipesan")
    })
  })

  // ─── 2. KEAMANAN VERIFIKASI PEMBAYARAN ──────────────────────────────────────
  describe("2. Keamanan Verifikasi Pembayaran (Admin-Only)", () => {
    const paymentId = "pay-1"
    const mockPayment = {
      id: paymentId,
      bookingId: "booking-1",
      status: "PENDING",
      booking: {
        customerId: "customer-1",
        vendor: { userId: "vendor-user-1" },
      },
    }

    it("should reject payment verification attempts by customer/vendor, and only allow admin", async () => {
      mockDb.payment.findUnique.mockResolvedValue(mockPayment)
      mockDb.payment.update.mockResolvedValue({ ...mockPayment, status: "PAID" })
      mockDb.booking.update.mockResolvedValue({})

      // Customer mencoba verifikasi -> Gagal (403)
      await expect(
        paymentsService.verifyPayment("customer-1", "CUSTOMER", paymentId, { status: "PAID" })
      ).rejects.toThrow("Akses ditolak: Hanya Admin yang dapat memverifikasi pembayaran")

      // Vendor mencoba verifikasi -> Gagal (403)
      await expect(
        paymentsService.verifyPayment("vendor-user-1", "VENDOR", paymentId, { status: "PAID" })
      ).rejects.toThrow("Akses ditolak: Hanya Admin yang dapat memverifikasi pembayaran")

      // Admin melakukan verifikasi -> Berhasil
      const result = await paymentsService.verifyPayment("admin-1", "ADMIN", paymentId, { status: "PAID" })
      expect(result.status).toBe("PAID")

      // Pastikan notifikasi dikirim ke Customer dan Vendor
      expect(mockDb.notification.create).toHaveBeenCalledTimes(2)
    })

    it("should allow admin to upload refund proof and save it in payment", async () => {
      mockDb.payment.findUnique.mockResolvedValue(mockPayment)
      mockDb.payment.update.mockResolvedValue({ 
        ...mockPayment, 
        status: "REFUNDED",
        refundProofUrl: "https://example.com/proof.jpg"
      })

      const result = await paymentsService.verifyPayment("admin-1", "ADMIN", paymentId, { 
        status: "REFUNDED",
        refundProofUrl: "https://example.com/proof.jpg"
      })

      expect(result.status).toBe("REFUNDED")
      expect(mockDb.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: paymentId },
          data: expect.objectContaining({
            status: "REFUNDED",
            refundProofUrl: "https://example.com/proof.jpg",
            refundedBy: "admin-1",
            refundedAt: expect.any(Date),
          }),
        })
      )
    })
  })

  // ─── 3. PEMBATASAN PEMBATALAN OLEH CUSTOMER ─────────────────────────────────
  describe("3. Pembatasan Pembatalan Pesanan oleh Customer", () => {
    it("should block customer cancellation if payment status is PAID", async () => {
      const bookingId = "booking-1"
      const mockBooking = {
        id: bookingId,
        customerId: "customer-1",
        vendor: { userId: "vendor-user-1" },
        payment: { status: "PAID" },
      }

      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      await expect(
        bookingsService.updateBookingStatus("customer-1", "CUSTOMER", bookingId, {
          status: "CANCELLED",
        })
      ).rejects.toThrow("Pesanan sudah Lunas. Silakan hubungi Admin untuk pengajuan pembatalan dan refund.")
    })

    it("should allow customer cancellation if payment status is PENDING or doesn't exist", async () => {
      const bookingId = "booking-1"
      const mockBooking = {
        id: bookingId,
        customerId: "customer-1",
        vendor: { userId: "vendor-user-1" },
        payment: { status: "PENDING" },
        jadwalId: "jadwal-1",
      }

      mockDb.booking.findUnique.mockResolvedValue(mockBooking)
      mockDb.$transaction.mockImplementation(async (cb: Function) => {
        const tx = {
          booking: {
            update: vi.fn().mockResolvedValue({ ...mockBooking, status: "CANCELLED" }),
          },
          jadwal: {
            update: vi.fn().mockResolvedValue({}),
          },
          payment: {
            update: vi.fn().mockResolvedValue({}),
          },
          vendor: {
            update: vi.fn().mockResolvedValue({}),
          }
        }
        return cb(tx)
      })

      const res = await bookingsService.updateBookingStatus("customer-1", "CUSTOMER", bookingId, {
        status: "CANCELLED",
      })
      expect(res.status).toBe("CANCELLED")
    })
  })

  // ─── 4. ALUR REFUND OTOMATIS ───────────────────────────────────────────────
  describe("4. Alur Refund Otomatis", () => {
    it("should change payment status to REFUNDED and notify customer when Vendor/Admin cancels a PAID booking", async () => {
      const bookingId = "booking-1"
      const mockBooking = {
        id: bookingId,
        customerId: "customer-1",
        jadwalId: "jadwal-1",
        vendor: { userId: "vendor-user-1" },
        payment: { id: "payment-1", status: "PAID" },
      }

      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      mockDb.$transaction.mockImplementation(async (cb: Function) => {
        const tx = {
          booking: {
            update: vi.fn().mockResolvedValue({ ...mockBooking, status: "CANCELLED" }),
          },
          jadwal: {
            update: vi.fn().mockResolvedValue({}),
          },
          payment: {
            update: vi.fn().mockResolvedValue({}),
          },
          vendor: {
            update: vi.fn().mockResolvedValue({}),
          }
        }
        return cb(tx)
      })

      const res = await bookingsService.updateBookingStatus("vendor-user-1", "VENDOR", bookingId, {
        status: "CANCELLED",
        cancelReason: "Vendor berhalangan",
      })

      expect(res.status).toBe("CANCELLED")
      
      // Memastikan customer menerima notifikasi pembatalan & info refund
      expect(mockDb.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "customer-1",
            title: "Pesanan Dibatalkan",
            message: expect.stringContaining("Pengembalian dana sedang diproses oleh Admin"),
          }),
        })
      )
    })
  })

  // ─── 5. PENAMBAHAN SALDO VENDOR ────────────────────────────────────────────
  describe("5. Penambahan Saldo Vendor", () => {
    it("should increase vendor balance when booking status is updated to COMPLETED and paid", async () => {
      const bookingId = "booking-1"
      const mockBooking = {
        id: bookingId,
        customerId: "customer-1",
        vendorId: "vendor-1",
        totalPrice: 2000000,
        status: "CONFIRMED",
        vendor: { id: "vendor-1", userId: "vendor-user-1" },
        payment: { status: "PAID" },
      }

      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      let capturedTxVendorUpdate: any = null

      mockDb.$transaction.mockImplementation(async (cb: Function) => {
        const txVendorUpdate = vi.fn().mockResolvedValue({})
        capturedTxVendorUpdate = txVendorUpdate

        const tx = {
          booking: {
            update: vi.fn().mockResolvedValue({ ...mockBooking, status: "COMPLETED" }),
          },
          vendor: {
            update: txVendorUpdate,
          },
        }
        return cb(tx)
      })

      const res = await bookingsService.updateBookingStatus("customer-1", "CUSTOMER", bookingId, {
        status: "COMPLETED",
      })

      expect(res.status).toBe("COMPLETED")
      expect(capturedTxVendorUpdate).toHaveBeenCalledWith({
        where: { id: "vendor-1" },
        data: {
          balance: { increment: 1900000 },
        },
      })

      // Memastikan customer dan vendor menerima notifikasi selesai
      expect(mockDb.notification.create).toHaveBeenCalledTimes(2)
    })
  })

  // ─── 6. CRON JOB PEMBATALAN OTOMATIS (24 JAM) ──────────────────────────────
  describe("6. Cron Job Pembatalan Otomatis (24 Jam)", () => {
    it("should cancel PENDING bookings, notify customer, and fail their payments", async () => {
      const mockExpiredBookings = [
        {
          id: "booking-expired-1",
          status: "PENDING",
          customerId: "customer-1",
          jadwalId: "jadwal-expired-1",
          payment: { id: "payment-expired-1", status: "PENDING" },
          createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 jam yang lalu
        },
      ]

      mockDb.booking.findMany.mockResolvedValue(mockExpiredBookings)

      mockDb.$transaction.mockImplementation(async (cb: Function) => {
        const tx = {
          booking: {
            update: vi.fn().mockResolvedValue({}),
          },
          jadwal: {
            update: vi.fn().mockResolvedValue({}),
          },
          payment: {
            update: vi.fn().mockResolvedValue({}),
          },
        }
        return cb(tx)
      })

      await checkExpiredBookings()

      expect(mockDb.booking.findMany).toHaveBeenCalled()
      // Cek apakah customer menerima notifikasi kedaluwarsa
      expect(mockDb.notification.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "customer-1",
            title: "Pesanan Kedaluwarsa",
          }),
        })
      )
    })
  })
})
