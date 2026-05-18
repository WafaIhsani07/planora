import { z } from "zod"

// ─── Vendor Profile ───────────────────────────────────────────────────────────
export const createVendorProfileSchema = z.object({
  businessName: z
    .string({ required_error: "Nama bisnis wajib diisi" })
    .min(2, "Nama bisnis minimal 2 karakter")
    .max(100),
  description: z.string().max(1000).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  bankName: z.string().max(100).optional(),
  bankAccount: z.string().max(50).optional(),
  bankHolder: z.string().max(100).optional(),
})

export const updateVendorProfileSchema = createVendorProfileSchema.partial()

// ─── Reject Vendor ────────────────────────────────────────────────────────────
export const rejectVendorSchema = z.object({
  reason: z
    .string({ required_error: "Alasan penolakan wajib diisi" })
    .min(10, "Alasan minimal 10 karakter"),
})

// ─── Layanan ──────────────────────────────────────────────────────────────────
export const createLayananSchema = z.object({
  kategoriId: z.string({ required_error: "Kategori wajib dipilih" }),
  name: z
    .string({ required_error: "Nama layanan wajib diisi" })
    .min(2)
    .max(100),
  description: z.string().max(1000).optional(),
  price: z
    .number({ required_error: "Harga wajib diisi" })
    .positive("Harga harus lebih dari 0"),
  duration: z.number().int().positive().optional(),
  images: z.array(z.string().url("Format URL gambar tidak valid")).default([]),
})

export const updateLayananSchema = createLayananSchema.partial()

// ─── Query Params ─────────────────────────────────────────────────────────────
export const getVendorsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  kategoriId: z.string().optional(),
  city: z.string().optional(),
})

// ─── Portfolio ────────────────────────────────────────────────────────────────
export const createPortfolioSchema = z.object({
  title: z
    .string({ required_error: "Judul portofolio wajib diisi" })
    .min(2, "Judul portofolio minimal 2 karakter")
    .max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string({ required_error: "Foto portofolio wajib diunggah" }).url("Format URL gambar tidak valid"),
  eventDate: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────
export type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>
export type UpdateVendorProfileInput = z.infer<typeof updateVendorProfileSchema>
export type RejectVendorInput = z.infer<typeof rejectVendorSchema>
export type CreateLayananInput = z.infer<typeof createLayananSchema>
export type UpdateLayananInput = z.infer<typeof updateLayananSchema>
export type GetVendorsQuery = z.infer<typeof getVendorsQuerySchema>
export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>