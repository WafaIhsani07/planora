import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type {
  CreateVendorProfileInput,
  UpdateVendorProfileInput,
  RejectVendorInput,
  CreateLayananInput,
  UpdateLayananInput,
  GetVendorsQuery,
  CreatePortfolioInput,
} from "./vendors.validation.js"

// ─── Get All Vendors (Public) ─────────────────────────────────────────────────
export const getAllVendors = async (query: GetVendorsQuery) => {
  const { page, limit, search, kategoriId, city } = query
  const skip = (page - 1) * limit

  const where = {
    status: "VERIFIED" as const,
    ...(search && {
      OR: [
        { businessName: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(city && { city: { contains: city, mode: "insensitive" as const } }),
    ...(kategoriId && {
      layanan: { some: { kategoriId, isActive: true } },
    }),
  }

  const vendors = await db.vendor.findMany({
    where,
    skip,
    take: limit,
    orderBy: { rating: "desc" },
    select: {
      id: true,
      businessName: true,
      description: true,
      city: true,
      province: true,
      rating: true,
      totalReviews: true,
      totalBookings: true,
      user: { select: { name: true, avatar: true } },
      layanan: {
        where: { isActive: true },
        take: 3,
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          kategori: { select: { name: true, slug: true } },
        },
      },
    },
  })
  const total = await db.vendor.count({ where })

  return {
    vendors,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// ─── Get Vendor By ID (Public) ────────────────────────────────────────────────
export const getVendorById = async (id: string) => {
  const vendor = await db.vendor.findUnique({
    where: { id, status: "VERIFIED" },
    select: {
      id: true,
      businessName: true,
      description: true,
      address: true,
      city: true,
      province: true,
      rating: true,
      totalReviews: true,
      totalBookings: true,
      createdAt: true,
      user: { select: { name: true, avatar: true } },
      layanan: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          duration: true,
          images: true,
          kategori: { select: { id: true, name: true, slug: true } },
        },
      },
      portfolio: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          eventDate: true,
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          customer: { select: { name: true, avatar: true } },
        },
      },
    },
  })

  if (!vendor) throw new AppError("Vendor tidak ditemukan", 404)
  return vendor
}

// ─── Get My Vendor Profile ────────────────────────────────────────────────────
export const getMyVendorProfile = async (userId: string) => {
  const vendor = await db.vendor.findUnique({
    where: { userId },
    select: {
      id: true,
      businessName: true,
      description: true,
      address: true,
      city: true,
      province: true,
      status: true,
      rejectedReason: true,
      rating: true,
      totalReviews: true,
      totalBookings: true,
      balance: true,
      bankName: true,
      bankAccount: true,
      bankHolder: true,
      ktpUrl: true,
      bankBookUrl: true,
      businessLicenseUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!vendor) throw new AppError("Profil vendor belum dibuat", 404)
  return vendor
}

// ─── Create Vendor Profile ────────────────────────────────────────────────────
export const createVendorProfile = async (
  userId: string,
  input: CreateVendorProfileInput
) => {
  const existing = await db.vendor.findUnique({ where: { userId } })
  if (existing) throw new AppError("Profil vendor sudah ada", 409)

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError("User tidak ditemukan", 404)
  if (user.role !== "VENDOR")
    throw new AppError("Hanya user dengan role VENDOR yang bisa membuat profil vendor", 403)

  return db.vendor.create({
    data: {
      userId,
      businessName: input.businessName,
      description: input.description ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      province: input.province ?? null,
      bankName: input.bankName ?? null,
      bankAccount: input.bankAccount ?? null,
      bankHolder: input.bankHolder ?? null,
      ktpUrl: input.ktpUrl ?? null,
      bankBookUrl: input.bankBookUrl ?? null,
      businessLicenseUrl: input.businessLicenseUrl ?? null,
    },
  })
}

// ─── Update Vendor Profile ────────────────────────────────────────────────────
export const updateVendorProfile = async (
  userId: string,
  input: UpdateVendorProfileInput
) => {
  return db.vendor.upsert({
    where: { userId },
    update: {
      ...(input.businessName !== undefined && { businessName: input.businessName }),
      ...(input.description !== undefined && { description: input.description ?? null }),
      ...(input.address !== undefined && { address: input.address ?? null }),
      ...(input.city !== undefined && { city: input.city ?? null }),
      ...(input.province !== undefined && { province: input.province ?? null }),
      ...(input.bankName !== undefined && { bankName: input.bankName ?? null }),
      ...(input.bankAccount !== undefined && { bankAccount: input.bankAccount ?? null }),
      ...(input.bankHolder !== undefined && { bankHolder: input.bankHolder ?? null }),
      ...(input.ktpUrl !== undefined && { ktpUrl: input.ktpUrl ?? null }),
      ...(input.bankBookUrl !== undefined && { bankBookUrl: input.bankBookUrl ?? null }),
      ...(input.businessLicenseUrl !== undefined && { businessLicenseUrl: input.businessLicenseUrl ?? null }),
    },
    create: {
      userId,
      businessName: input.businessName ?? "Bisnis Baru",
      description: input.description ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      province: input.province ?? null,
      bankName: input.bankName ?? null,
      bankAccount: input.bankAccount ?? null,
      bankHolder: input.bankHolder ?? null,
      ktpUrl: input.ktpUrl ?? null,
      bankBookUrl: input.bankBookUrl ?? null,
      businessLicenseUrl: input.businessLicenseUrl ?? null,
    }
  })
}

// ─── Get My Layanan ───────────────────────────────────────────────────────────
export const getMyLayanan = async (userId: string) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor) throw new AppError("Profil vendor tidak ditemukan", 404)

  return db.layanan.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      images: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      kategori: { select: { id: true, name: true, slug: true } },
    },
  })
}

// ─── Create Layanan ───────────────────────────────────────────────────────────
export const createLayanan = async (
  userId: string,
  input: CreateLayananInput
) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor)
    throw new AppError("Profil vendor tidak ditemukan, buat profil vendor terlebih dahulu", 404)
  if (vendor.status !== "VERIFIED")
    throw new AppError("Vendor harus terverifikasi untuk menambah layanan", 403)

  const kategori = await db.kategori.findUnique({ where: { id: input.kategoriId } })
  if (!kategori) throw new AppError("Kategori tidak ditemukan", 404)

  return db.layanan.create({
    data: {
      vendorId: vendor.id,
      kategoriId: input.kategoriId,
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      duration: input.duration ?? null,
      images: input.images,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      images: true,
      isActive: true,
      createdAt: true,
      kategori: { select: { id: true, name: true } },
    },
  })
}

// ─── Update Layanan ───────────────────────────────────────────────────────────
export const updateLayanan = async (
  userId: string,
  layananId: string,
  input: UpdateLayananInput
) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor) throw new AppError("Profil vendor tidak ditemukan", 404)

  const layanan = await db.layanan.findUnique({ where: { id: layananId } })
  if (!layanan) throw new AppError("Layanan tidak ditemukan", 404)
  if (layanan.vendorId !== vendor.id)
    throw new AppError("Kamu tidak punya akses ke layanan ini", 403)

  if (input.kategoriId) {
    const kategori = await db.kategori.findUnique({ where: { id: input.kategoriId } })
    if (!kategori) throw new AppError("Kategori tidak ditemukan", 404)
  }

  return db.layanan.update({
    where: { id: layananId },
    data: {
      ...(input.kategoriId !== undefined && { kategoriId: input.kategoriId }),
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description ?? null }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.duration !== undefined && { duration: input.duration ?? null }),
      ...(input.images !== undefined && { images: input.images }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      images: true,
      isActive: true,
      updatedAt: true,
      kategori: { select: { id: true, name: true } },
    },
  })
}

// ─── Delete Layanan (soft delete) ────────────────────────────────────────────
export const deleteLayanan = async (userId: string, layananId: string) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor) throw new AppError("Profil vendor tidak ditemukan", 404)

  const layanan = await db.layanan.findUnique({ where: { id: layananId } })
  if (!layanan) throw new AppError("Layanan tidak ditemukan", 404)
  if (layanan.vendorId !== vendor.id)
    throw new AppError("Kamu tidak punya akses ke layanan ini", 403)

  await db.layanan.update({
    where: { id: layananId },
    data: { isActive: false },
  })
}

// ─── Get Pending Vendors (Admin) ──────────────────────────────────────────────
export const getPendingVendors = async () => {
  return db.vendor.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      businessName: true,
      description: true,
      city: true,
      province: true,
      status: true,
      ktpUrl: true,
      bankBookUrl: true,
      businessLicenseUrl: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  })
}

// ─── Verify Vendor (Admin) ────────────────────────────────────────────────────
export const verifyVendor = async (id: string) => {
  const vendor = await db.vendor.findUnique({ where: { id } })
  if (!vendor) throw new AppError("Vendor tidak ditemukan", 404)
  if (vendor.status === "VERIFIED") throw new AppError("Vendor sudah terverifikasi", 400)

  return db.vendor.update({
    where: { id },
    data: { status: "VERIFIED", rejectedReason: null },
    select: {
      id: true,
      businessName: true,
      status: true,
      updatedAt: true,
    },
  })
}

// ─── Reject Vendor (Admin) ────────────────────────────────────────────────────
export const rejectVendor = async (id: string, input: RejectVendorInput) => {
  const vendor = await db.vendor.findUnique({ where: { id } })
  if (!vendor) throw new AppError("Vendor tidak ditemukan", 404)

  return db.vendor.update({
    where: { id },
    data: { status: "REJECTED", rejectedReason: input.reason },
    select: {
      id: true,
      businessName: true,
      status: true,
      rejectedReason: true,
      updatedAt: true,
    },
  })
}

// ─── Get My Portfolio ─────────────────────────────────────────────────────────
export const getMyPortfolio = async (userId: string) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor) throw new AppError("Profil vendor tidak ditemukan", 404)

  return db.portfolio.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
  })
}

// ─── Create Portfolio ──────────────────────────────────────────────────────────
export const createPortfolio = async (userId: string, input: CreatePortfolioInput) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor)
    throw new AppError("Profil vendor tidak ditemukan, buat profil vendor terlebih dahulu", 404)

  return db.portfolio.create({
    data: {
      vendorId: vendor.id,
      title: input.title,
      description: input.description ?? null,
      imageUrl: input.imageUrl,
      eventDate: input.eventDate ? new Date(input.eventDate) : null,
    },
  })
}

// ─── Delete Portfolio ──────────────────────────────────────────────────────────
export const deletePortfolio = async (userId: string, portfolioId: string) => {
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (!vendor) throw new AppError("Profil vendor tidak ditemukan", 404)

  const portfolio = await db.portfolio.findUnique({ where: { id: portfolioId } })
  if (!portfolio) throw new AppError("Item portofolio tidak ditemukan", 404)
  if (portfolio.vendorId !== vendor.id)
    throw new AppError("Kamu tidak punya akses ke item portofolio ini", 403)

  await db.portfolio.delete({
    where: { id: portfolioId },
  })
}