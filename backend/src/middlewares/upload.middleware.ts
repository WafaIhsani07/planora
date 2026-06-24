import multer from "multer"
import path from "path"
import fs from "fs"
import { AppError } from "../utils/error.js"

// Hapus pembuatan folder lokal karena kita akan menggunakan Supabase Storage
// const uploadDir = "uploads"
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true })
// }

// Konfigurasi penyimpanan memori (Buffer)
const storage = multer.memoryStorage()

// Filter hanya file bertipe gambar
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|pdf/
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mime = allowedTypes.test(file.mimetype)

  if (ext && mime) {
    cb(null, true)
  } else {
    cb(new AppError("Hanya file gambar (JPG, PNG, WEBP, GIF) dan dokumen PDF yang diperbolehkan!", 400) as any, false)
  }
}

// Ekspor instance multer terkonfigurasi
export const uploadImageMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batasan ukuran file: 5MB
  },
  fileFilter,
})
