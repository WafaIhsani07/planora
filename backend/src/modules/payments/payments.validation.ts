import { z } from "zod"

export const createPaymentSchema = z.object({
  bookingId: z.string({ required_error: "Booking ID wajib diisi" }),
  method: z.string({ required_error: "Metode pembayaran wajib diisi" }),
  proofUrl: z.string().url("Format URL bukti pembayaran tidak valid").optional(),
})

export const verifyPaymentSchema = z.object({
  status: z.enum(["PAID", "FAILED", "REFUNDED"], {
    required_error: "Status wajib diisi (PAID, FAILED, atau REFUNDED)",
  }),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>