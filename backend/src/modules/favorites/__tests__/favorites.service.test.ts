import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockDb, resetAllMocks } from "../../../__tests__/helpers/mock-db.js"

vi.mock("../../../config/database.js", () => ({ db: mockDb }))

import { toggleFavorite, getFavorites } from "../favorites.service.js"

const USER_ID = "user-123"
const VENDOR_ID = "vendor-456"

const mockVendor = {
  id: VENDOR_ID,
  businessName: "Vendor Test",
  rating: 4.5,
  user: { avatar: "avatar.png" },
  layanan: [{ kategori: { name: "Foto" } }],
}

describe("favoritesService", () => {
  beforeEach(() => {
    resetAllMocks()
  })

  describe("toggleFavorite", () => {
    it("harus menambah favorit jika belum ada", async () => {
      mockDb.vendor.findUnique.mockResolvedValue(mockVendor)
      mockDb.favorite.findUnique.mockResolvedValue(null)
      mockDb.favorite.create.mockResolvedValue({ id: "fav-1", userId: USER_ID, vendorId: VENDOR_ID })

      const result = await toggleFavorite(USER_ID, VENDOR_ID)
      expect(result.isFavorite).toBe(true)
      expect(mockDb.favorite.create).toHaveBeenCalledWith({
        data: { userId: USER_ID, vendorId: VENDOR_ID },
      })
    })

    it("harus menghapus favorit jika sudah ada", async () => {
      mockDb.vendor.findUnique.mockResolvedValue(mockVendor)
      mockDb.favorite.findUnique.mockResolvedValue({ id: "fav-1", userId: USER_ID, vendorId: VENDOR_ID })
      mockDb.favorite.delete.mockResolvedValue({ id: "fav-1" })

      const result = await toggleFavorite(USER_ID, VENDOR_ID)
      expect(result.isFavorite).toBe(false)
      expect(mockDb.favorite.delete).toHaveBeenCalledWith({
        where: { id: "fav-1" },
      })
    })

    it("harus error 404 jika vendor tidak ditemukan", async () => {
      mockDb.vendor.findUnique.mockResolvedValue(null)
      await expect(toggleFavorite(USER_ID, VENDOR_ID)).rejects.toMatchObject({ statusCode: 404 })
    })
  })

  describe("getFavorites", () => {
    it("harus mengembalikan daftar favorit", async () => {
      mockDb.favorite.findMany.mockResolvedValue([
        {
          id: "fav-1",
          vendor: mockVendor,
        },
      ])

      const result = await getFavorites(USER_ID)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(VENDOR_ID)
      expect(result[0].businessName).toBe("Vendor Test")
    })
  })
})
