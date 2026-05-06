// backend/src/modules/jadwal/jadwal.validation.ts
import { z } from "zod"

export const setJadwalSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  isAvailable: z.boolean({ required_error: "Status isAvailable wajib diisi" }),
  note: z.string().optional(),
})

export const getJadwalQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format startDate harus YYYY-MM-DD").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format endDate harus YYYY-MM-DD").optional(),
})

export type SetJadwalInput = z.infer<typeof setJadwalSchema>