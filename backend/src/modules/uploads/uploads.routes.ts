import { Router, type Request, type Response, type NextFunction } from "express"
import { createClient } from "@supabase/supabase-js"
import path from "path"
import { authenticate } from "../../middlewares/auth.middleware.js"
import { uploadImageMiddleware } from "../../middlewares/upload.middleware.js"
import { sendCreated } from "../../utils/response.js"
import { AppError } from "../../utils/error.js"
import { env } from "../../config/env.js"

const router = Router()

// Inisialisasi Supabase Client menggunakan SERVICE_ROLE_KEY untuk bypass RLS
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// Handler upload single image
const uploadSingleImage = (req: Request, res: Response, next: NextFunction): void => {
  // Gunakan middleware multer untuk mengambil file ber-key 'file'
  uploadImageMiddleware.single("file")(req, res, async (err: any) => {
    if (err) {
      if (err instanceof AppError) {
        return next(err)
      } else {
        return next(new AppError(err.message || "Gagal memproses file", 400))
      }
    }

    if (!req.file) {
      return next(new AppError("Harap pilih file gambar terlebih dahulu", 400))
    }

    try {
      const file = req.file
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const ext = path.extname(file.originalname)
      const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`

      // Upload buffer ke Supabase Storage
      const { data, error } = await supabase.storage
        .from(env.SUPABASE_BUCKET_NAME)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        })

      if (error) {
        console.error("Supabase Upload Error:", error)
        return next(new AppError(`Gagal mengunggah gambar: ${error.message || JSON.stringify(error)}`, 500))
      }

      // Dapatkan public URL
      const { data: publicUrlData } = supabase.storage
        .from(env.SUPABASE_BUCKET_NAME)
        .getPublicUrl(data.path)

      sendCreated(res, { imageUrl: publicUrlData.publicUrl }, "Gambar berhasil diunggah")
    } catch (uploadError) {
      console.error("Upload process error:", uploadError)
      return next(new AppError("Terjadi kesalahan sistem saat mengunggah file", 500))
    }
  })
}

// POST /api/v1/uploads - Unggah satu file gambar
router.post("/", authenticate, uploadSingleImage)

export default router
