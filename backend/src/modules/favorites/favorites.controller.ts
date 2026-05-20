import { Request, Response, NextFunction } from "express"
import { toggleFavorite, getFavorites } from "./favorites.service.js"
import { AppError } from "../../utils/error.js"

export const toggleFavoriteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    if (!userId) throw new AppError("Akses ditolak", 401)

    const { vendorId } = req.body
    if (!vendorId) throw new AppError("Vendor ID diperlukan", 400)

    const result = await toggleFavorite(userId, vendorId)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}

export const getFavoritesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id
    if (!userId) throw new AppError("Akses ditolak", 401)

    const favorites = await getFavorites(userId)
    res.status(200).json({ success: true, data: favorites })
  } catch (error) {
    next(error)
  }
}
