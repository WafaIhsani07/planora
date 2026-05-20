import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"

export const toggleFavorite = async (userId: string, vendorId: string) => {
  const vendor = await db.vendor.findUnique({ where: { id: vendorId } })
  if (!vendor) throw new AppError("Vendor tidak ditemukan", 404)

  const existing = await db.favorite.findUnique({
    where: {
      userId_vendorId: { userId, vendorId },
    },
  })

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } })
    return { isFavorite: false }
  } else {
    await db.favorite.create({
      data: { userId, vendorId },
    })
    return { isFavorite: true }
  }
}

export const getFavorites = async (userId: string) => {
  const favorites = await db.favorite.findMany({
    where: { userId },
    include: {
      vendor: {
        include: {
          layanan: {
            include: {
              kategori: true,
            },
            take: 1, // untuk menunjang pencarian kategori dinamis seperti di explore_screen
          },
          user: {
            select: { avatar: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return favorites.map((fav) => {
    // Map data agar sesuai format yang diharapkan aplikasi mobile
    const vendorData = fav.vendor
    return {
      id: vendorData.id,
      businessName: vendorData.businessName,
      rating: vendorData.rating,
      avatar: vendorData.user.avatar,
      layanan: vendorData.layanan,
    }
  })
}
