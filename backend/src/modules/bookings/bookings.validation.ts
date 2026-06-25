// backend/src/modules/bookings/bookings.validation.ts
import { z } from "zod"

export const createBookingSchema = z.object({
  layananId: z.string({ required_error: "Layanan ID wajib diisi" }),
  eventDate: z.string({ required_error: "eventDate wajib diisi" }),
  eventAddress: z.string().optional(),
  notes: z.string().optional(),
  paymentMode: z.enum(["FULL", "DP"]).optional().default("FULL"),
})

export const updateStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {
    required_error: "Status wajib diisi",
  }),
  cancelReason: z.string().optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>

export const getBookingsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(500).default(50),
  status: z.string().optional(),
})
export type GetBookingsQuery = z.infer<typeof getBookingsQuerySchema>