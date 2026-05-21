import { Router, type Request, type Response, type NextFunction } from "express"
import { authenticate } from "../../middlewares/auth.middleware.js"
import { uploadImageMiddleware } from "../../middlewares/upload.middleware.js"
import { sendCreated, sendValidationError } from "../../utils/response.js"
import { AppError } from "../../utils/error.js"

const router = Router()

// Handler upload single image
const uploadSingleImage = (req: Request, res: Response, next: NextFunction): void => {
  // Gunakan middleware multer untuk mengambil file ber-key 'file'
  uploadImageMiddleware.single("file")(req, res, (err: any) => {
    if (err) {
      if (err instanceof AppError) {
        next(err)
      } else {
        next(new AppError(err.message || "Gagal mengunggah file", 400))
      }
      return
    }

    if (!req.file) {
      next(new AppError("Harap pilih file gambar terlebih dahulu", 400))
      return
    }

    // Bentuk URL gambar yang bisa diakses secara publik
    const protocol = req.protocol
    const host = req.get("host")
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`

    sendCreated(res, { imageUrl }, "Gambar berhasil diunggah")
  })
}

// POST /api/v1/uploads - Unggah satu file gambar
router.post("/", authenticate, uploadSingleImage)

export default router
