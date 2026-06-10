import { Router } from "express"
import * as usersController from "./users.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js"

const router = Router()

// ─── Protected — Semua User ───────────────────────────────────────────────────
router.get("/profile", authenticate, usersController.getProfile)
router.put("/profile", authenticate, usersController.updateProfile)
router.put("/change-password", authenticate, usersController.changePassword)
router.delete("/me", authenticate, usersController.deactivateMyAccount)

// ─── Protected — Admin Only ───────────────────────────────────────────────────
router.get("/", authenticate, authorize("ADMIN"), usersController.getAllUsers)
router.get("/:id", authenticate, authorize("ADMIN"), usersController.getUserById)
router.patch("/:id/status", authenticate, authorize("ADMIN"), usersController.updateUserStatus)

export default router