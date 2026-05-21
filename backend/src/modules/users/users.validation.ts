import { z } from "zod"

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .optional(),
  phone: z.string().max(20, "Nomor telepon terlalu panjang").optional(),
  avatar: z.union([z.string().url("Format URL avatar tidak valid"), z.literal("")]).optional().nullable(),
})

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePasswordSchema = z
  .object({
    currentPassword: z.string({ required_error: "Password lama wajib diisi" }),
    newPassword: z
      .string({ required_error: "Password baru wajib diisi" })
      .min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string({
      required_error: "Konfirmasi password wajib diisi",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })

// ─── Update User Status (Admin) ───────────────────────────────────────────────
export const updateUserStatusSchema = z.object({
  isActive: z.boolean({ required_error: "Status wajib diisi" }),
})

// ─── Query Params (Admin) ─────────────────────────────────────────────────────
export const getUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.enum(["CUSTOMER", "VENDOR", "ADMIN"]).optional(),
  isActive: z.coerce.boolean().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>