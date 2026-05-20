/**
 * Mock Prisma Client untuk unit testing.
 *
 * Cara pakai di test file:
 *   vi.mock("../../config/database.js", () => ({ db: mockDb }))
 *
 * Setiap method Prisma di-mock dengan vi.fn() agar bisa di-spy,
 * di-return value, dan di-reset per test.
 */
import { vi } from "vitest"

// Helper: buat object yang setiap property-nya adalah vi.fn()
const createModelMock = () => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  count: vi.fn(),
  aggregate: vi.fn(),
  upsert: vi.fn(),
})

export const mockDb = {
  user: createModelMock(),
  vendor: createModelMock(),
  kategori: createModelMock(),
  layanan: createModelMock(),
  portfolio: createModelMock(),
  jadwal: createModelMock(),
  booking: createModelMock(),
  payment: createModelMock(),
  review: createModelMock(),
  notification: createModelMock(),
  message: createModelMock(),
  refreshToken: createModelMock(),
  passwordResetToken: createModelMock(),
  $transaction: vi.fn(),
}

/**
 * Reset semua mock di mockDb.
 * Panggil di beforeEach() agar setiap test mulai dari keadaan bersih.
 */
export const resetAllMocks = () => {
  for (const model of Object.values(mockDb)) {
    if (typeof model === "object" && model !== null) {
      for (const method of Object.values(model)) {
        if (typeof method === "function" && "mockReset" in method) {
          ;(method as ReturnType<typeof vi.fn>).mockReset()
        }
      }
    }
  }
}
