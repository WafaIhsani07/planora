import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockDb, resetAllMocks } from "../../__tests__/helpers/mock-db.js"

vi.mock("../../config/database.js", () => ({ db: mockDb }))

import * as paymentsService from "./payments.service.js"

describe("Payments Service", () => {
  beforeEach(() => {
    resetAllMocks()
  })

  describe("verifyPayment", () => {
    it("should update payment status to PAID and set paidAt", async () => {
      const mockPayment = {
        id: "pay-1",
        bookingId: "b1",
        status: "PENDING",
        booking: {
          vendor: { userId: "vendor-user-1" },
        },
      }
      mockDb.payment.findUnique.mockResolvedValue(mockPayment)
      mockDb.payment.update.mockResolvedValue({ ...mockPayment, status: "PAID" })
      mockDb.booking.update.mockResolvedValue({})

      const result = await paymentsService.verifyPayment("admin-1", "ADMIN", "pay-1", {
        status: "PAID",
      })

      expect(mockDb.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "pay-1" },
          data: expect.objectContaining({
            status: "PAID",
            verifiedBy: "admin-1",
            paidAt: expect.any(Date),
            verifiedAt: expect.any(Date),
          }),
        })
      )
      expect(mockDb.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "b1" },
          data: { status: "CONFIRMED" },
        })
      )
    })

    it("should update payment status to FAILED and save note", async () => {
      const mockPayment = {
        id: "pay-1",
        bookingId: "b1",
        status: "PENDING",
        booking: {
          vendor: { userId: "vendor-user-1" },
        },
      }
      mockDb.payment.findUnique.mockResolvedValue(mockPayment)
      mockDb.payment.update.mockResolvedValue({ ...mockPayment, status: "FAILED", note: "Bukti palsu" })

      const result = await paymentsService.verifyPayment("admin-1", "ADMIN", "pay-1", {
        status: "FAILED",
        note: "Bukti palsu",
      })

      expect(mockDb.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "pay-1" },
          data: expect.objectContaining({
            status: "FAILED",
            verifiedBy: "admin-1",
            note: "Bukti palsu",
            paidAt: null,
            verifiedAt: expect.any(Date),
          }),
        })
      )
      // Booking should not be updated to CONFIRMED
      expect(mockDb.booking.update).not.toHaveBeenCalled()
    })
  })
})
