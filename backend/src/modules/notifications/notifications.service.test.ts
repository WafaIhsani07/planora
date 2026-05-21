import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockDb, resetAllMocks } from "../../__tests__/helpers/mock-db.js"

// Mock database sebelum import service
vi.mock("../../config/database.js", () => ({ db: mockDb }))

import * as notifService from "./notifications.service.js"

describe("Notifications Service", () => {
  beforeEach(() => {
    resetAllMocks()
  })

  // ──────────────────────────────────────────────────────────────
  // createNotification
  // ──────────────────────────────────────────────────────────────
  describe("createNotification", () => {
    // ─── Positive ─────────────────────────────────────────────
    it("should create notification with all fields", async () => {
      const payload = {
        userId: "user-1",
        title: "Pesanan Baru",
        message: "Kamu mendapat pesanan baru",
        type: "BOOKING" as const,
        data: { bookingId: "b1" },
      }
      const mockResult = { id: "notif-1", ...payload, isRead: false, createdAt: new Date() }
      mockDb.notification.create.mockResolvedValue(mockResult)

      const result = await notifService.createNotification(payload)

      expect(result).toEqual(mockResult)
      expect(mockDb.notification.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          title: "Pesanan Baru",
          message: "Kamu mendapat pesanan baru",
          type: "BOOKING",
          data: { bookingId: "b1" },
        },
      })
    })

    it("should create notification without optional data", async () => {
      const payload = {
        userId: "user-1",
        title: "System Update",
        message: "Maintenance dijadwalkan",
        type: "SYSTEM" as const,
      }
      const mockResult = { id: "notif-2", ...payload, data: null, isRead: false, createdAt: new Date() }
      mockDb.notification.create.mockResolvedValue(mockResult)

      const result = await notifService.createNotification(payload)

      expect(result).toEqual(mockResult)
      expect(mockDb.notification.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          title: "System Update",
          message: "Maintenance dijadwalkan",
          type: "SYSTEM",
        },
      })
    })

    it("should create notifications for all valid types", async () => {
      const types = ["BOOKING", "PAYMENT", "REVIEW", "SYSTEM", "VERIFICATION"] as const

      for (const type of types) {
        resetAllMocks()
        mockDb.notification.create.mockResolvedValue({ id: `notif-${type}`, type })

        await notifService.createNotification({
          userId: "user-1",
          title: `Title ${type}`,
          message: `Message ${type}`,
          type,
        })

        expect(mockDb.notification.create).toHaveBeenCalledOnce()
      }
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getMyNotifications
  // ──────────────────────────────────────────────────────────────
  describe("getMyNotifications", () => {
    // ─── Positive ─────────────────────────────────────────────
    it("should return paginated notifications for user ordered by createdAt desc", async () => {
      const mockNotifs = [
        { id: "n1", title: "Baru", isRead: false, createdAt: new Date("2026-05-09") },
        { id: "n2", title: "Lama", isRead: true, createdAt: new Date("2026-05-08") },
      ]
      mockDb.notification.findMany.mockResolvedValue(mockNotifs)
      mockDb.notification.count.mockResolvedValue(2)

      const result = await notifService.getMyNotifications("user-1")

      // Service mengembalikan { notifications, pagination }
      expect(result.notifications).toEqual(mockNotifs)
      expect(result.notifications).toHaveLength(2)
      expect(result.pagination.total).toBe(2)
      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(20)
      expect(result.pagination.totalPages).toBe(1)
      expect(mockDb.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: "user-1" }),
          orderBy: { createdAt: "desc" },
        })
      )
    })

    it("should return empty notifications array with zero total if user has no notifications", async () => {
      mockDb.notification.findMany.mockResolvedValue([])
      mockDb.notification.count.mockResolvedValue(0)

      const result = await notifService.getMyNotifications("user-empty")

      expect(result.notifications).toEqual([])
      expect(result.notifications).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
      expect(result.pagination.totalPages).toBe(0)
    })

    it("should filter by type when provided", async () => {
      mockDb.notification.findMany.mockResolvedValue([])

      await notifService.getMyNotifications("user-1", { type: "BOOKING" })

      expect(mockDb.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "user-1",
            type: "BOOKING",
          }),
        })
      )
    })

    it("should apply pagination with page and limit", async () => {
      mockDb.notification.findMany.mockResolvedValue([])

      await notifService.getMyNotifications("user-1", { page: 2, limit: 10 })

      expect(mockDb.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
    })
  })

  // ──────────────────────────────────────────────────────────────
  // markAsRead
  // ──────────────────────────────────────────────────────────────
  describe("markAsRead", () => {
    // ─── Positive ─────────────────────────────────────────────
    it("should mark a specific notification as read", async () => {
      mockDb.notification.updateMany.mockResolvedValue({ count: 1 })

      const result = await notifService.markAsRead("user-1", "notif-1")

      expect(result.count).toBe(1)
      expect(mockDb.notification.updateMany).toHaveBeenCalledWith({
        where: { id: "notif-1", userId: "user-1" },
        data: { isRead: true },
      })
    })

    // ─── Negative ─────────────────────────────────────────────
    it("should return count 0 if notification doesn't exist or doesn't belong to user", async () => {
      mockDb.notification.updateMany.mockResolvedValue({ count: 0 })

      const result = await notifService.markAsRead("user-1", "nonexistent-id")

      expect(result.count).toBe(0)
    })
  })

  // ──────────────────────────────────────────────────────────────
  // markAllAsRead
  // ──────────────────────────────────────────────────────────────
  describe("markAllAsRead", () => {
    it("should mark all unread notifications as read for a user", async () => {
      mockDb.notification.updateMany.mockResolvedValue({ count: 5 })

      const result = await notifService.markAllAsRead("user-1")

      expect(result.count).toBe(5)
      expect(mockDb.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: "user-1", isRead: false },
        data: { isRead: true },
      })
    })

    it("should return count 0 if user has no unread notifications", async () => {
      mockDb.notification.updateMany.mockResolvedValue({ count: 0 })

      const result = await notifService.markAllAsRead("user-all-read")

      expect(result.count).toBe(0)
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getUnreadCount
  // ──────────────────────────────────────────────────────────────
  describe("getUnreadCount", () => {
    it("should return unread notification count", async () => {
      mockDb.notification.count.mockResolvedValue(3)

      const result = await notifService.getUnreadCount("user-1")

      expect(result).toBe(3)
      expect(mockDb.notification.count).toHaveBeenCalledWith({
        where: { userId: "user-1", isRead: false },
      })
    })

    it("should return 0 when all notifications are read", async () => {
      mockDb.notification.count.mockResolvedValue(0)

      const result = await notifService.getUnreadCount("user-all-read")

      expect(result).toBe(0)
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getNotificationById
  // ──────────────────────────────────────────────────────────────
  describe("getNotificationById", () => {
    it("should successfully retrieve a notification by ID", async () => {
      const mockResult = {
        id: "notif-1",
        userId: "user-1",
        title: "Test Notification",
        message: "Test Message",
        type: "SYSTEM",
        data: null,
        isRead: false,
        createdAt: new Date(),
      }
      mockDb.notification.findFirst.mockResolvedValue(mockResult)

      const result = await notifService.getNotificationById("user-1", "notif-1")

      expect(result.id).toBe("notif-1")
      expect(result.vendorName).toBe("Planora Vendor")
      expect(result.fullMessage).toBe("Test Message")
      expect(mockDb.notification.findFirst).toHaveBeenCalledWith({
        where: { id: "notif-1", userId: "user-1" },
      })
    })

    it("should throw AppError 404 if notification not found", async () => {
      mockDb.notification.findFirst.mockResolvedValue(null)

      await expect(
        notifService.getNotificationById("user-1", "nonexistent-id")
      ).rejects.toThrow("Notifikasi tidak ditemukan")
    })

    it("should fetch real booking and vendor details if bookingId is in data", async () => {
      const mockResult = {
        id: "notif-1",
        userId: "user-1",
        title: "Pesanan Baru",
        message: "Kamu mendapat pesanan baru",
        type: "BOOKING",
        data: { bookingId: "b1" },
        isRead: false,
        createdAt: new Date(),
      }
      mockDb.notification.findFirst.mockResolvedValue(mockResult)

      const mockBooking = {
        id: "b1",
        vendor: {
          businessName: "Beautiful Weddings",
          user: { avatar: "https://avatar.url" }
        },
        layanan: {
          kategori: { name: "Wedding Planner" }
        }
      }
      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      const result = await notifService.getNotificationById("user-1", "notif-1")

      expect(result.vendorName).toBe("Beautiful Weddings")
      expect(result.vendorCategory).toBe("Wedding Planner")
      expect(result.vendorImageUrl).toBe("https://avatar.url")
    })
  })
})

