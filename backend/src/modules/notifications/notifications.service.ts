import { db } from "../../config/database.js"
import type {
  CreateNotificationInput,
  GetNotificationsQuery,
} from "./notifications.validation.js"

// ─── Create Notification ──────────────────────────────────────────────────────
// Fungsi internal — dipanggil dari service lain (bookings, payments, dll)
export const createNotification = async (input: CreateNotificationInput) => {
  return db.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      ...(input.data && { data: input.data as any }),
    },
  })
}

// ─── Get My Notifications (dengan filter & pagination) ────────────────────────
export const getMyNotifications = async (
  userId: string,
  query: Partial<GetNotificationsQuery> = {}
) => {
  const { page = 1, limit = 20, type } = query
  const skip = (page - 1) * limit

  const [notifications, total] = await Promise.all([
    db.notification.findMany({
      where: {
        userId,
        ...(type !== undefined && { type }),
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.notification.count({
      where: {
        userId,
        ...(type !== undefined && { type }),
      },
    }),
  ])

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// ─── Mark Single Notification As Read ────────────────────────────────────────
export const markAsRead = async (userId: string, notificationId: string) => {
  return db.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  })
}

// ─── Mark All Notifications As Read ──────────────────────────────────────────
export const markAllAsRead = async (userId: string) => {
  return db.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  })
}

// ─── Get Unread Count ─────────────────────────────────────────────────────────
export const getUnreadCount = async (userId: string) => {
  return db.notification.count({
    where: { userId, isRead: false },
  })
}
