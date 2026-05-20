// backend/src/modules/messages/__tests__/messages.service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockDb, resetAllMocks } from "../../../__tests__/helpers/mock-db.js"

// ─── Mock database ─────────────────────────────────────────────────────────
vi.mock("../../../config/database.js", () => ({ db: mockDb }))

import {
  getMessagesByBooking,
  sendMessage,
  getUnreadCount,
} from "../messages.service.js"

// ─── Test fixtures ──────────────────────────────────────────────────────────
const BOOKING_ID = "booking-111"
const CUSTOMER_ID = "user-customer-001"
const VENDOR_USER_ID = "user-vendor-001"
const OUTSIDER_ID = "user-outsider-999"

const mockBooking = {
  id: BOOKING_ID,
  customerId: CUSTOMER_ID,
  vendor: { userId: VENDOR_USER_ID },
}

const mockMessage = {
  id: "msg-001",
  bookingId: BOOKING_ID,
  senderId: CUSTOMER_ID,
  content: "Halo, apakah tersedia tanggal 5 Desember?",
  isRead: false,
  createdAt: new Date("2026-05-20T10:00:00Z"),
  sender: {
    id: CUSTOMER_ID,
    name: "Pelanggan A",
    avatar: null,
    role: "CUSTOMER",
  },
}

// ─── Tests ──────────────────────────────────────────────────────────────────
describe("messagesService", () => {
  beforeEach(() => {
    resetAllMocks()
  })

  // ── getMessagesByBooking ──────────────────────────────────────────────────
  describe("getMessagesByBooking", () => {
    it("harus mengembalikan daftar pesan untuk customer", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)
      mockDb.message.updateMany.mockResolvedValue({ count: 0 })
      mockDb.message.findMany.mockResolvedValue([mockMessage])

      const result = await getMessagesByBooking(BOOKING_ID, CUSTOMER_ID)

      expect(result).toHaveLength(1)
      expect(result[0].content).toBe("Halo, apakah tersedia tanggal 5 Desember?")
      expect(mockDb.message.updateMany).toHaveBeenCalledWith({
        where: {
          bookingId: BOOKING_ID,
          isRead: false,
          NOT: { senderId: CUSTOMER_ID },
        },
        data: { isRead: true },
      })
    })

    it("harus mengembalikan daftar pesan untuk vendor", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)
      mockDb.message.updateMany.mockResolvedValue({ count: 0 })
      mockDb.message.findMany.mockResolvedValue([mockMessage])

      const result = await getMessagesByBooking(BOOKING_ID, VENDOR_USER_ID)
      expect(result).toHaveLength(1)
    })

    it("harus throw 404 jika booking tidak ada", async () => {
      mockDb.booking.findUnique.mockResolvedValue(null)

      await expect(
        getMessagesByBooking(BOOKING_ID, CUSTOMER_ID)
      ).rejects.toMatchObject({ message: "Booking tidak ditemukan", statusCode: 404 })
    })

    it("harus throw 403 jika user bukan participant", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      await expect(
        getMessagesByBooking(BOOKING_ID, OUTSIDER_ID)
      ).rejects.toMatchObject({ message: "Akses ditolak", statusCode: 403 })
    })
  })

  // ── sendMessage ───────────────────────────────────────────────────────────
  describe("sendMessage", () => {
    it("harus berhasil mengirim pesan dari customer", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)
      mockDb.message.create.mockResolvedValue(mockMessage)

      const result = await sendMessage(BOOKING_ID, CUSTOMER_ID, "Halo!")
      expect(result.content).toBe("Halo, apakah tersedia tanggal 5 Desember?")
      expect(mockDb.message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            bookingId: BOOKING_ID,
            senderId: CUSTOMER_ID,
            content: "Halo!",
          }),
        })
      )
    })

    it("harus memotong whitespace dari konten pesan", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)
      mockDb.message.create.mockResolvedValue({ ...mockMessage, content: "Halo" })

      await sendMessage(BOOKING_ID, CUSTOMER_ID, "  Halo  ")

      expect(mockDb.message.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ content: "Halo" }),
        })
      )
    })

    it("harus throw 400 jika konten kosong", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      await expect(
        sendMessage(BOOKING_ID, CUSTOMER_ID, "")
      ).rejects.toMatchObject({ message: "Pesan tidak boleh kosong", statusCode: 400 })
    })

    it("harus throw 400 jika konten terlalu panjang (>1000 karakter)", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)
      const tooLong = "a".repeat(1001)

      await expect(
        sendMessage(BOOKING_ID, CUSTOMER_ID, tooLong)
      ).rejects.toMatchObject({ message: "Pesan terlalu panjang (maks 1000 karakter)", statusCode: 400 })
    })

    it("harus throw 404 jika booking tidak ada", async () => {
      mockDb.booking.findUnique.mockResolvedValue(null)

      await expect(
        sendMessage(BOOKING_ID, CUSTOMER_ID, "Halo!")
      ).rejects.toMatchObject({ message: "Booking tidak ditemukan", statusCode: 404 })
    })

    it("harus throw 403 jika sender bukan participant", async () => {
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      await expect(
        sendMessage(BOOKING_ID, OUTSIDER_ID, "Halo!")
      ).rejects.toMatchObject({ message: "Akses ditolak", statusCode: 403 })
    })
  })

  // ── getUnreadCount ────────────────────────────────────────────────────────
  describe("getUnreadCount", () => {
    it("harus mengembalikan jumlah pesan belum dibaca", async () => {
      mockDb.message.count.mockResolvedValue(3)

      const count = await getUnreadCount(BOOKING_ID, CUSTOMER_ID)
      expect(count).toBe(3)
      expect(mockDb.message.count).toHaveBeenCalledWith({
        where: {
          bookingId: BOOKING_ID,
          isRead: false,
          NOT: { senderId: CUSTOMER_ID },
        },
      })
    })

    it("harus mengembalikan 0 jika tidak ada pesan belum dibaca", async () => {
      mockDb.message.count.mockResolvedValue(0)

      const count = await getUnreadCount(BOOKING_ID, CUSTOMER_ID)
      expect(count).toBe(0)
    })
  })
})
