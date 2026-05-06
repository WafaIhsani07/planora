import type { Request, Response, NextFunction } from "express"
import * as paymentsService from "./payments.service.js"
import { createPaymentSchema, verifyPaymentSchema } from "./payments.validation.js"
import { sendSuccess, sendCreated, sendValidationError } from "../../utils/response.js"

export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = createPaymentSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await paymentsService.createPayment(req.userId, parsed.data)
  sendCreated(res, result, "Informasi pembayaran berhasil dikirim")
}

export const verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = verifyPaymentSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await paymentsService.verifyPayment(req.userId, req.userRole, req.params.id, parsed.data)
  sendSuccess(res, result, "Status pembayaran berhasil diverifikasi")
}

export const getPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const result = await paymentsService.getPaymentByBookingId(req.userId, req.userRole, req.params.bookingId)
  sendSuccess(res, result, "Data pembayaran berhasil diambil")
}