import type { Request, Response } from "express"
import * as notifService from "./notifications.service.js"
import {
  getNotificationsQuerySchema,
  markAsReadSchema,
} from "./notifications.validation.js"
import { sendSuccess, sendValidationError } from "../../utils/response.js"

// ─── GET /notifications ───────────────────────────────────────────────────────
export const getMyNotifications = async (req: Request, res: Response) => {
  const parsed = getNotificationsQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await notifService.getMyNotifications(req.userId, parsed.data)
  sendSuccess(res, result, "Berhasil mengambil notifikasi")
}

// ─── GET /notifications/unread-count ─────────────────────────────────────────
export const getUnreadCount = async (req: Request, res: Response) => {
  const count = await notifService.getUnreadCount(req.userId)
  sendSuccess(res, { count }, "Berhasil mengambil jumlah notifikasi belum dibaca")
}

// ─── PATCH /notifications/:id/read ───────────────────────────────────────────
export const markAsRead = async (req: Request, res: Response) => {
  const parsed = markAsReadSchema.safeParse(req.params)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  await notifService.markAsRead(req.userId, parsed.data.id)
  sendSuccess(res, null, "Notifikasi ditandai sudah dibaca")
}

// ─── PATCH /notifications/read-all ───────────────────────────────────────────
export const markAllAsRead = async (req: Request, res: Response) => {
  const result = await notifService.markAllAsRead(req.userId)
  sendSuccess(
    res,
    { updatedCount: result.count },
    "Semua notifikasi ditandai sudah dibaca"
  )
}

// ─── GET /notifications/:id ──────────────────────────────────────────────────
export const getNotificationById = async (req: Request, res: Response) => {
  const parsed = markAsReadSchema.safeParse(req.params)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const notification = await notifService.getNotificationById(
    req.userId,
    parsed.data.id
  )
  sendSuccess(res, notification, "Berhasil mengambil detail notifikasi")
}

