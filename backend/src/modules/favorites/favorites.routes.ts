import { Router } from "express"
import { toggleFavoriteHandler, getFavoritesHandler } from "./favorites.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js"

const router = Router()

router.use(authenticate)

router.get("/", getFavoritesHandler)
router.post("/toggle", toggleFavoriteHandler)

export default router
