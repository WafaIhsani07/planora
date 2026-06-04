import { z } from "zod"

export const createWithdrawalSchema = z.object({
  amount: z.number({
    required_error: "Nominal penarikan wajib diisi",
    invalid_type_error: "Nominal harus berupa angka",
  }).min(50000, "Nominal penarikan minimal Rp 50.000"),
})

export const processWithdrawalSchema = z.object({
  status: z.enum(["PROCESSING", "COMPLETED", "REJECTED"], {
    required_error: "Status wajib diisi (PROCESSING, COMPLETED, atau REJECTED)",
  }),
  proofUrl: z.string().url("Format URL bukti transfer tidak valid").optional(),
  note: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
}).refine(
  (data) => {
    if (data.status === "COMPLETED" && !data.proofUrl) return false
    return true
  },
  {
    message: "Bukti transfer (proofUrl) wajib disertakan jika status COMPLETED",
    path: ["proofUrl"],
  }
)

export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>
export type ProcessWithdrawalInput = z.infer<typeof processWithdrawalSchema>
