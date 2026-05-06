// backend/src/modules/bookings/bookings.validation.ts
import { z } from "zod"

export const createBookingSchema = z.object({
  layananId: z.string({ required_error: "Layanan ID wajib diisi" }),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format eventDate harus YYYY-MM-DD"),
  eventAddress: z.string().optional(),
  notes: z.string().optional(),
})

export const updateStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"], {
    required_error: "Status wajib diisi",
  }),
  cancelReason: z.string().optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>