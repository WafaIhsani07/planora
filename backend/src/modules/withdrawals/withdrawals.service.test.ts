import { describe, it, expect, vi, beforeEach } from "vitest"
import { createWithdrawal, processWithdrawal } from "./withdrawals.service.js"
import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"

vi.mock("../../config/database", () => ({
  db: {
    vendor: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    withdrawal: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(db)),
  },
}))

describe("Withdrawals Service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createWithdrawal", () => {
    const mockVendorId = "vendor-1"
    const validPayload = {
      amount: 1000000,
    }

    it("should create withdrawal successfully if balance is sufficient and bank details exist", async () => {
      vi.mocked(db.vendor.findUnique).mockResolvedValue({
        id: mockVendorId,
        balance: 5000000,
        bankName: "BCA",
        bankAccount: "12345678",
        bankHolder: "John Doe",
      } as any)

      vi.mocked(db.vendor.update).mockResolvedValue({} as any)
      vi.mocked(db.withdrawal.create).mockResolvedValue({ id: "wd-1" } as any)

      const result = await createWithdrawal(mockVendorId, validPayload)

      expect(db.vendor.findUnique).toHaveBeenCalledWith({ where: { id: mockVendorId } })
      expect(db.vendor.update).toHaveBeenCalledWith({
        where: { id: mockVendorId },
        data: { balance: { decrement: 1000000 } },
      })
      expect(db.withdrawal.create).toHaveBeenCalledWith({
        data: {
          vendorId: mockVendorId,
          amount: 1000000,
          status: "PENDING",
          bankName: "BCA",
          bankAccount: "12345678",
          bankHolder: "John Doe",
        },
      })
      expect(result).toHaveProperty("id", "wd-1")
    })

    it("should throw error if balance is insufficient", async () => {
      vi.mocked(db.vendor.findUnique).mockResolvedValue({
        id: mockVendorId,
        balance: 500000, // less than 1,000,000
        bankName: "BCA",
        bankAccount: "12345678",
        bankHolder: "John Doe",
      } as any)

      await expect(createWithdrawal(mockVendorId, validPayload)).rejects.toThrow(
        "Saldo tidak mencukupi untuk melakukan penarikan"
      )
    })

    it("should throw error if bank details are missing", async () => {
      vi.mocked(db.vendor.findUnique).mockResolvedValue({
        id: mockVendorId,
        balance: 5000000,
        bankName: null,
      } as any)

      await expect(createWithdrawal(mockVendorId, validPayload)).rejects.toThrow(
        "Harap lengkapi data rekening bank di profil Anda terlebih dahulu"
      )
    })
  })

  describe("processWithdrawal (Admin)", () => {
    it("should update status to PROCESSING", async () => {
      vi.mocked(db.withdrawal.findUnique).mockResolvedValue({
        id: "wd-1",
        status: "PENDING",
        amount: 1000000,
        vendorId: "vendor-1"
      } as any)

      vi.mocked(db.withdrawal.update).mockResolvedValue({ id: "wd-1", status: "PROCESSING" } as any)

      await processWithdrawal("wd-1", { status: "PROCESSING" })

      expect(db.withdrawal.update).toHaveBeenCalledWith({
        where: { id: "wd-1" },
        data: { status: "PROCESSING", note: undefined },
      })
    })

    it("should update status to COMPLETED and save proofUrl", async () => {
      vi.mocked(db.withdrawal.findUnique).mockResolvedValue({
        id: "wd-1",
        status: "PROCESSING",
        amount: 1000000,
        vendorId: "vendor-1"
      } as any)

      await processWithdrawal("wd-1", { status: "COMPLETED", proofUrl: "http://example.com/proof.jpg" })

      expect(db.withdrawal.update).toHaveBeenCalledWith({
        where: { id: "wd-1" },
        data: { status: "COMPLETED", proofUrl: "http://example.com/proof.jpg", note: undefined },
      })
    })

    it("should return funds to vendor balance if REJECTED", async () => {
      vi.mocked(db.withdrawal.findUnique).mockResolvedValue({
        id: "wd-1",
        status: "PENDING",
        amount: 1000000,
        vendorId: "vendor-1"
      } as any)

      await processWithdrawal("wd-1", { status: "REJECTED", note: "Rekening salah" })

      expect(db.vendor.update).toHaveBeenCalledWith({
        where: { id: "vendor-1" },
        data: { balance: { increment: 1000000 } },
      })
      expect(db.withdrawal.update).toHaveBeenCalledWith({
        where: { id: "wd-1" },
        data: { status: "REJECTED", note: "Rekening salah" },
      })
    })

    it("should throw error if attempting to complete without proofUrl", async () => {
      vi.mocked(db.withdrawal.findUnique).mockResolvedValue({
        id: "wd-1",
        status: "PROCESSING",
      } as any)

      await expect(processWithdrawal("wd-1", { status: "COMPLETED" })).rejects.toThrow(
        "Bukti transfer (proofUrl) wajib disertakan untuk status COMPLETED"
      )
    })
  })
})
