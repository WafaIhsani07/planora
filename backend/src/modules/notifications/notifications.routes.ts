import { Router } from "express"
import * as notifController from "./notifications.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js"

const router = Router()

// Semua route notifications membutuhkan autentikasi
router.use(authenticate)

// GET  /api/v1/notifications                — daftar notifikasi (+ filter & pagination)
router.get("/", notifController.getMyNotifications)

// GET  /api/v1/notifications/unread-count   — jumlah notif belum dibaca
router.get("/unread-count", notifController.getUnreadCount)

// PATCH /api/v1/notifications/read-all      — tandai semua sebagai sudah dibaca
// ⚠️ HARUS SEBELUM /:id/read agar Express tidak parse "read-all" sebagai :id
router.patch("/read-all", notifController.markAllAsRead)

// PATCH /api/v1/notifications/:id/read      — tandai satu notifikasi sebagai dibaca
router.patch("/:id/read", notifController.markAsRead)

export default router
