// backend/src/modules/messages/messages.routes.ts
import { Router } from "express"
import * as messagesController from "./messages.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js"

const router = Router({ mergeParams: true }) // penting: agar :bookingId tersedia

// Semua endpoint pesan butuh autentikasi
router.use(authenticate)

// GET    /bookings/:bookingId/messages/unread-count
router.get("/unread-count", messagesController.getUnreadCount)

// GET    /bookings/:bookingId/messages
router.get("/", messagesController.getMessages)

// POST   /bookings/:bookingId/messages
router.post("/", messagesController.createMessage)

export default router
