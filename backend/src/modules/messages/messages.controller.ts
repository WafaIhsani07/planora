// backend/src/modules/messages/messages.controller.ts
import type { Request, Response } from "express"
import * as messagesService from "./messages.service.js"
import {
  sendSuccess,
  sendCreated,
  sendError,
} from "../../utils/response.js"
import { AppError } from "../../utils/error.js"

// ─── GET /bookings/:bookingId/messages ─────────────────────────────────────
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params
    const messages = await messagesService.getMessagesByBooking(
      bookingId,
      req.userId
    )
    sendSuccess(res, messages, "Pesan berhasil diambil")
  } catch (err) {
    if (err instanceof AppError) {
      sendError(res, err.message, err.statusCode)
    } else {
      sendError(res, "Terjadi kesalahan server")
    }
  }
}

// ─── POST /bookings/:bookingId/messages ────────────────────────────────────
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params
    const { content } = req.body as { content: string }

    const message = await messagesService.sendMessage(
      bookingId,
      req.userId,
      content
    )
    sendCreated(res, message, "Pesan berhasil dikirim")
  } catch (err) {
    if (err instanceof AppError) {
      sendError(res, err.message, err.statusCode)
    } else {
      sendError(res, "Terjadi kesalahan server")
    }
  }
}

// ─── GET /bookings/:bookingId/messages/unread-count ───────────────────────
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params
    const count = await messagesService.getUnreadCount(bookingId, req.userId)
    sendSuccess(res, { count }, "Berhasil")
  } catch (err) {
    if (err instanceof AppError) {
      sendError(res, err.message, err.statusCode)
    } else {
      sendError(res, "Terjadi kesalahan server")
    }
  }
}
