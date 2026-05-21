import { Router } from "express"
import * as reviewController from "./reviews.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// Public Routes
router.get("/vendor/:vendorId", reviewController.getVendorReviews)

// Protected Routes (Customer Only)
router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  reviewController.createReview
)

router.get(
  "/me",
  authenticate,
  authorize("CUSTOMER"),
  reviewController.getMyReviews
)

// Protected Routes (Vendor Only)
router.put(
  "/:reviewId/reply",
  authenticate,
  authorize("VENDOR"),
  reviewController.replyToReview
)

export default router
