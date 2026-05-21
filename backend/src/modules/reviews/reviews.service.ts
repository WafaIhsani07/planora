import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type { CreateReviewInput } from "./reviews.validation.js"

// ─── Create Review ───────────────────────────────────────────────────────────
export const createReview = async (customerId: string, input: CreateReviewInput) => {
  // 1. Pastikan booking ada, milik customer ini, dan sudah selesai
  const booking = await db.booking.findUnique({
    where: { id: input.bookingId },
    include: { review: true },
  })

  if (!booking) throw new AppError("Pesanan tidak ditemukan", 404)
  if (booking.customerId !== customerId) throw new AppError("Kamu tidak punya akses ke pesanan ini", 403)
  if (booking.status !== "COMPLETED") throw new AppError("Review hanya bisa diberikan untuk pesanan yang sudah selesai", 400)
  if (booking.review) throw new AppError("Kamu sudah memberikan review untuk pesanan ini", 400)

  // 2. Buat review dalam transaksi
  const review = await db.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        bookingId: input.bookingId,
        customerId,
        vendorId: booking.vendorId,
        rating: input.rating,
        comment: input.comment ?? null,
      },
    })

    // 3. Update Vendor Rating & Total Reviews
    const reviews = await tx.review.findMany({
      where: { vendorId: booking.vendorId },
      select: { rating: true },
    })

    const totalReviews = reviews.length
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews

    await tx.vendor.update({
      where: { id: booking.vendorId },
      data: {
        rating: averageRating,
        totalReviews,
      },
    })

    return newReview
  })

  return review
}

// ─── Get Vendor Reviews ───────────────────────────────────────────────────────
export const getVendorReviews = async (vendorId: string) => {
  return db.review.findMany({
    where: { vendorId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      booking: {
        select: {
          id: true,
          layanan: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

// ─── Reply to Review (Vendor Only) ────────────────────────────────────────────
export const replyToReview = async (userId: string, reviewId: string, reply: string) => {
  const vendor = await db.vendor.findUnique({
    where: { userId },
  })

  if (!vendor) throw new AppError("Profil vendor tidak ditemukan", 404)

  const review = await db.review.findUnique({
    where: { id: reviewId },
  })

  if (!review) throw new AppError("Review tidak ditemukan", 404)
  if (review.vendorId !== vendor.id) throw new AppError("Kamu tidak memiliki akses untuk membalas review ini", 403)

  return db.review.update({
    where: { id: reviewId },
    data: { reply },
  })
}

// ─── Get My Reviews (Customer) ────────────────────────────────────────────────
export const getMyReviews = async (customerId: string) => {
  return db.review.findMany({
    where: { customerId },
    include: {
      vendor: {
        select: {
          id: true,
          businessName: true,
        },
      },
      booking: {
        select: {
          id: true,
          eventDate: true,
          layanan: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}
