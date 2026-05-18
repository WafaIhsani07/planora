import type { Request, Response } from "express"
import * as reviewService from "./reviews.service.js"
import { createReviewSchema } from "./reviews.validation.js"
import { sendSuccess, sendCreated, sendValidationError } from "../../utils/response.js"

export const createReview = async (req: Request, res: Response) => {
  const parsed = createReviewSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await reviewService.createReview(req.userId, parsed.data)
  sendCreated(res, result, "Review berhasil dikirim")
}

export const getVendorReviews = async (req: Request, res: Response) => {
  const { vendorId } = req.params
  if (!vendorId) {
    sendValidationError(res, { vendorId: ["Vendor ID wajib diisi"] })
    return
  }

  const result = await reviewService.getVendorReviews(vendorId as string)
  sendSuccess(res, result, "Berhasil mengambil review vendor")
}

export const getMyReviews = async (req: Request, res: Response) => {
  const result = await reviewService.getMyReviews(req.userId)
  sendSuccess(res, result, "Berhasil mengambil daftar review kamu")
}

export const replyToReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params
  const { reply } = req.body

  if (!reply) {
    sendValidationError(res, { reply: ["Balasan wajib diisi"] })
    return
  }

  const result = await reviewService.replyToReview(req.userId, reviewId, reply)
  sendSuccess(res, result, "Balasan review berhasil disimpan")
}
