// backend/src/modules/bookings/bookings.controller.ts
import type { Request, Response, NextFunction } from "express"
import * as bookingsService from "./bookings.service.js"
import { createBookingSchema, updateStatusSchema } from "./bookings.validation.js"
import { sendSuccess, sendCreated, sendValidationError } from "../../utils/response.js"

export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = createBookingSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await bookingsService.createBooking(req.userId, parsed.data)
  sendCreated(res, result, "Pesanan berhasil dibuat")
}

export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Cast (req as any) untuk baca properti custom dari middleware
  const role = req.userRole
  
  const result = await bookingsService.getMyBookings(req.userId, role)
  sendSuccess(res, result, "Daftar pesanan berhasil diambil")
}

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = updateStatusSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const role = req.userRole
  const bookingId = req.params.id as string

  const result = await bookingsService.updateBookingStatus(req.userId, role, bookingId, parsed.data)
  sendSuccess(res, result, "Status pesanan berhasil diperbarui")
}