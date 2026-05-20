import { Router } from "express"
import { toggleFavoriteHandler, getFavoritesHandler } from "./favorites.controller.js"
import { requireAuth } from "../../middlewares/auth.middleware.js"

const router = Router()

router.use(requireAuth)

router.get("/", getFavoritesHandler)
router.post("/toggle", toggleFavoriteHandler)

export default router
