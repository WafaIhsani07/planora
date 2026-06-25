// backend/src/modules/messages/messages.service.ts
import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"

// ─── Konstanta ─────────────────────────────────────────────────────────────
const MESSAGE_SELECT = {
  id: true,
  bookingId: true,
  senderId: true,
  content: true,
  isRead: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      name: true,
      avatar: true,
      role: true,
    },
  },
} as const

// ─── Get messages per booking ───────────────────────────────────────────────
/**
 * Mengambil semua pesan dalam sebuah booking.
 * Memverifikasi bahwa peminta (requesterId) adalah customer atau vendor booking ini.
 */
export const getMessagesByBooking = async (
  bookingId: string,
  requesterId: string
) => {
  // Pastikan booking ada dan requester memiliki akses
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      vendorId: true,
      vendor: { select: { userId: true } },
    },
  })

  if (!booking) throw new AppError("Booking tidak ditemukan", 404)

  const isParticipant =
    booking.customerId === requesterId ||
    booking.vendor.userId === requesterId

  if (!isParticipant) throw new AppError("Akses ditolak", 403)

  // Tandai semua pesan yang belum dibaca oleh requester sebagai sudah dibaca dalam percakapan dengan vendor ini
  await db.message.updateMany({
    where: {
      booking: {
        customerId: booking.customerId,
        vendorId: booking.vendorId,
      },
      isRead: false,
      NOT: { senderId: requesterId },
    },
    data: { isRead: true },
  })

  // Mengambil SEMUA pesan antara customer dan vendor ini, dari semua pesanan mereka
  const messages = await db.message.findMany({
    where: {
      booking: {
        customerId: booking.customerId,
        vendorId: booking.vendorId,
      },
    },
    select: MESSAGE_SELECT,
    orderBy: { createdAt: "asc" },
  })

  return messages
}

// ─── Send message ───────────────────────────────────────────────────────────
/**
 * Mengirim pesan baru dalam sebuah booking.
 */
export const sendMessage = async (
  bookingId: string,
  senderId: string,
  content: string
) => {
  if (!content || content.trim().length === 0) {
    throw new AppError("Pesan tidak boleh kosong", 400)
  }
  if (content.length > 1000) {
    throw new AppError("Pesan terlalu panjang (maks 1000 karakter)", 400)
  }

  // Pastikan booking ada dan sender adalah participant
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      vendor: { select: { userId: true } },
    },
  })

  if (!booking) throw new AppError("Booking tidak ditemukan", 404)

  const isParticipant =
    booking.customerId === senderId ||
    booking.vendor.userId === senderId

  if (!isParticipant) throw new AppError("Akses ditolak", 403)

  const message = await db.message.create({
    data: {
      bookingId,
      senderId,
      content: content.trim(),
    },
    select: MESSAGE_SELECT,
  })

  return message
}

// ─── Unread count per booking ───────────────────────────────────────────────
/**
 * Menghitung jumlah pesan belum dibaca untuk user tertentu di sebuah booking.
 */
export const getUnreadCount = async (bookingId: string, userId: string) => {
  const count = await db.message.count({
    where: {
      bookingId,
      isRead: false,
      NOT: { senderId: userId },
    },
  })
  return count
}
