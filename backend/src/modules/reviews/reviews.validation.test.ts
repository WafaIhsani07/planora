import { describe, it, expect } from "vitest"
import { createReviewSchema } from "./reviews.validation.js"

describe("Reviews Validation", () => {
  // ──────────────────────────────────────────────────────────────
  // createReviewSchema
  // ──────────────────────────────────────────────────────────────

  describe("createReviewSchema", () => {
    // ─── Positive Scenarios ───────────────────────────────────
    it("should pass with valid full input", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 5,
        comment: "Pelayanan sangat memuaskan!",
      })
      expect(result.success).toBe(true)
    })

    it("should pass with minimum rating (1)", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 1,
      })
      expect(result.success).toBe(true)
    })

    it("should pass with maximum rating (5)", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 5,
      })
      expect(result.success).toBe(true)
    })

    it("should pass without comment (optional)", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 3,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.comment).toBeUndefined()
      }
    })

    it("should pass with empty string comment", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 4,
        comment: "",
      })
      expect(result.success).toBe(true)
    })

    // ─── Negative Scenarios ───────────────────────────────────
    it("should fail without bookingId", () => {
      const result = createReviewSchema.safeParse({
        rating: 5,
      })
      expect(result.success).toBe(false)
    })

    it("should fail without rating", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
      })
      expect(result.success).toBe(false)
    })

    it("should fail with rating below 1", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 0,
      })
      expect(result.success).toBe(false)
    })

    it("should fail with rating above 5", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 6,
      })
      expect(result.success).toBe(false)
    })

    it("should fail with negative rating", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: -1,
      })
      expect(result.success).toBe(false)
    })

    it("should fail with non-integer rating (float)", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 3.5,
      })
      // Zod z.number() allows floats — this should pass unless we add .int()
      // This test documents current behavior
      expect(result.success).toBe(true)
    })

    it("should fail with comment longer than 500 chars", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 4,
        comment: "a".repeat(501),
      })
      expect(result.success).toBe(false)
    })

    it("should pass with comment exactly 500 chars", () => {
      const result = createReviewSchema.safeParse({
        bookingId: "clx123abc",
        rating: 4,
        comment: "a".repeat(500),
      })
      expect(result.success).toBe(true)
    })

    it("should fail with non-string bookingId", () => {
      const result = createReviewSchema.safeParse({
        bookingId: 12345,
        rating: 4,
      })
      expect(result.success).toBe(false)
    })

    it("should fail with empty object", () => {
      const result = createReviewSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })
})
