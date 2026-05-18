import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockDb, resetAllMocks } from "../../__tests__/helpers/mock-db.js"

// Mock database sebelum import service
vi.mock("../../config/database.js", () => ({ db: mockDb }))

// Import service SETELAH mock
import * as reviewService from "./reviews.service.js"

describe("Reviews Service", () => {
  beforeEach(() => {
    resetAllMocks()
  })

  // ──────────────────────────────────────────────────────────────
  // createReview
  // ──────────────────────────────────────────────────────────────
  describe("createReview", () => {
    const customerId = "customer-1"
    const validInput = {
      bookingId: "booking-1",
      rating: 5,
      comment: "Sangat memuaskan!",
    }

    // ─── Positive ─────────────────────────────────────────────
    it("should create review and update vendor rating", async () => {
      const mockBooking = {
        id: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        status: "COMPLETED",
        review: null,
      }
      const mockNewReview = {
        id: "review-1",
        bookingId: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        rating: 5,
        comment: "Sangat memuaskan!",
      }

      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      // $transaction menerima callback — kita eksekusi callback-nya dengan mock tx
      mockDb.$transaction.mockImplementation(async (cb: Function) => {
        const tx = {
          review: {
            create: vi.fn().mockResolvedValue(mockNewReview),
            findMany: vi.fn().mockResolvedValue([
              { rating: 5 },
              { rating: 4 },
            ]),
          },
          vendor: {
            update: vi.fn().mockResolvedValue({}),
          },
        }
        return cb(tx)
      })

      const result = await reviewService.createReview(customerId, validInput)

      expect(result).toEqual(mockNewReview)
      expect(mockDb.booking.findUnique).toHaveBeenCalledWith({
        where: { id: "booking-1" },
        include: { review: true },
      })
      expect(mockDb.$transaction).toHaveBeenCalledOnce()
    })

    it("should create review without comment", async () => {
      const mockBooking = {
        id: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        status: "COMPLETED",
        review: null,
      }
      const mockNewReview = {
        id: "review-1",
        bookingId: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        rating: 3,
        comment: null,
      }

      mockDb.booking.findUnique.mockResolvedValue(mockBooking)
      mockDb.$transaction.mockImplementation(async (cb: Function) => {
        const tx = {
          review: {
            create: vi.fn().mockResolvedValue(mockNewReview),
            findMany: vi.fn().mockResolvedValue([{ rating: 3 }]),
          },
          vendor: {
            update: vi.fn().mockResolvedValue({}),
          },
        }
        return cb(tx)
      })

      const result = await reviewService.createReview(customerId, {
        bookingId: "booking-1",
        rating: 3,
      })

      expect(result).toEqual(mockNewReview)
      expect(result.comment).toBeNull()
    })

    it("should correctly calculate average rating in transaction", async () => {
      const mockBooking = {
        id: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        status: "COMPLETED",
        review: null,
      }

      mockDb.booking.findUnique.mockResolvedValue(mockBooking)

      let capturedVendorUpdate: any = null
      mockDb.$transaction.mockImplementation(async (cb: Function) => {
        const vendorUpdate = vi.fn().mockResolvedValue({})
        capturedVendorUpdate = vendorUpdate
        const tx = {
          review: {
            create: vi.fn().mockResolvedValue({ id: "review-1" }),
            findMany: vi.fn().mockResolvedValue([
              { rating: 5 },
              { rating: 4 },
              { rating: 3 },
            ]),
          },
          vendor: {
            update: vendorUpdate,
          },
        }
        return cb(tx)
      })

      await reviewService.createReview(customerId, validInput)

      // Average = (5+4+3)/3 = 4
      expect(capturedVendorUpdate).toHaveBeenCalledWith({
        where: { id: "vendor-1" },
        data: {
          rating: 4,
          totalReviews: 3,
        },
      })
    })

    // ─── Negative ─────────────────────────────────────────────
    it("should throw 404 if booking not found", async () => {
      mockDb.booking.findUnique.mockResolvedValue(null)

      await expect(
        reviewService.createReview(customerId, validInput)
      ).rejects.toThrow("Pesanan tidak ditemukan")
    })

    it("should throw 403 if customer doesn't own the booking", async () => {
      mockDb.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        customerId: "other-customer",
        vendorId: "vendor-1",
        status: "COMPLETED",
        review: null,
      })

      await expect(
        reviewService.createReview(customerId, validInput)
      ).rejects.toThrow("Kamu tidak punya akses ke pesanan ini")
    })

    it("should throw 400 if booking status is not COMPLETED", async () => {
      mockDb.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        status: "PENDING",
        review: null,
      })

      await expect(
        reviewService.createReview(customerId, validInput)
      ).rejects.toThrow("Review hanya bisa diberikan untuk pesanan yang sudah selesai")
    })

    it("should throw 400 if booking status is CANCELLED", async () => {
      mockDb.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        status: "CANCELLED",
        review: null,
      })

      await expect(
        reviewService.createReview(customerId, validInput)
      ).rejects.toThrow("Review hanya bisa diberikan untuk pesanan yang sudah selesai")
    })

    it("should throw 400 if review already exists for this booking", async () => {
      mockDb.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        customerId: "customer-1",
        vendorId: "vendor-1",
        status: "COMPLETED",
        review: { id: "existing-review" }, // sudah ada review
      })

      await expect(
        reviewService.createReview(customerId, validInput)
      ).rejects.toThrow("Kamu sudah memberikan review untuk pesanan ini")
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getVendorReviews
  // ──────────────────────────────────────────────────────────────
  describe("getVendorReviews", () => {
    it("should return reviews for a vendor", async () => {
      const mockReviews = [
        {
          id: "review-1",
          rating: 5,
          comment: "Bagus",
          customer: { id: "c1", name: "Andi", avatar: null },
          booking: { id: "b1", layanan: { name: "Paket A" } },
        },
        {
          id: "review-2",
          rating: 4,
          comment: "Oke",
          customer: { id: "c2", name: "Budi", avatar: null },
          booking: { id: "b2", layanan: { name: "Paket B" } },
        },
      ]
      mockDb.review.findMany.mockResolvedValue(mockReviews)

      const result = await reviewService.getVendorReviews("vendor-1")

      expect(result).toEqual(mockReviews)
      expect(result).toHaveLength(2)
      expect(mockDb.review.findMany).toHaveBeenCalledWith({
        where: { vendorId: "vendor-1" },
        include: {
          customer: {
            select: { id: true, name: true, avatar: true },
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
    })

    it("should return empty array if vendor has no reviews", async () => {
      mockDb.review.findMany.mockResolvedValue([])

      const result = await reviewService.getVendorReviews("vendor-no-reviews")

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  // ──────────────────────────────────────────────────────────────
  // getMyReviews
  // ──────────────────────────────────────────────────────────────
  describe("getMyReviews", () => {
    it("should return reviews by customer with vendor and booking details", async () => {
      const mockReviews = [
        {
          id: "review-1",
          rating: 5,
          vendor: { id: "v1", businessName: "Vendor A" },
          booking: {
            id: "b1",
            eventDate: new Date(),
            layanan: { name: "Fotografi" },
          },
        },
      ]
      mockDb.review.findMany.mockResolvedValue(mockReviews)

      const result = await reviewService.getMyReviews("customer-1")

      expect(result).toEqual(mockReviews)
      expect(mockDb.review.findMany).toHaveBeenCalledWith({
        where: { customerId: "customer-1" },
        include: {
          vendor: {
            select: { id: true, businessName: true },
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
    })

    it("should return empty array if customer has no reviews", async () => {
      mockDb.review.findMany.mockResolvedValue([])

      const result = await reviewService.getMyReviews("customer-no-reviews")

      expect(result).toEqual([])
    })
  })

  // ──────────────────────────────────────────────────────────────
  // replyToReview
  // ──────────────────────────────────────────────────────────────
  describe("replyToReview", () => {
    const userId = "user-vendor-1"
    const vendorId = "vendor-1"
    const reviewId = "review-1"
    const reply = "Terima kasih banyak!"

    it("should save vendor reply to review successfully", async () => {
      mockDb.vendor.findUnique.mockResolvedValue({ id: vendorId, userId })
      mockDb.review.findUnique.mockResolvedValue({ id: reviewId, vendorId })
      mockDb.review.update.mockResolvedValue({ id: reviewId, reply })

      const result = await reviewService.replyToReview(userId, reviewId, reply)

      expect(result).toEqual({ id: reviewId, reply })
      expect(mockDb.vendor.findUnique).toHaveBeenCalledWith({ where: { userId } })
      expect(mockDb.review.findUnique).toHaveBeenCalledWith({ where: { id: reviewId } })
      expect(mockDb.review.update).toHaveBeenCalledWith({
        where: { id: reviewId },
        data: { reply },
      })
    })

    it("should throw 404 if vendor profile not found", async () => {
      mockDb.vendor.findUnique.mockResolvedValue(null)

      await expect(
        reviewService.replyToReview(userId, reviewId, reply)
      ).rejects.toThrow("Profil vendor tidak ditemukan")
    })

    it("should throw 404 if review not found", async () => {
      mockDb.vendor.findUnique.mockResolvedValue({ id: vendorId, userId })
      mockDb.review.findUnique.mockResolvedValue(null)

      await expect(
        reviewService.replyToReview(userId, reviewId, reply)
      ).rejects.toThrow("Review tidak ditemukan")
    })

    it("should throw 403 if review vendorId does not match current vendor", async () => {
      mockDb.vendor.findUnique.mockResolvedValue({ id: vendorId, userId })
      mockDb.review.findUnique.mockResolvedValue({ id: reviewId, vendorId: "other-vendor" })

      await expect(
        reviewService.replyToReview(userId, reviewId, reply)
      ).rejects.toThrow("Kamu tidak memiliki akses untuk membalas review ini")
    })
  })
})
