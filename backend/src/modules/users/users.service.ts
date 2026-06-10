import bcrypt from "bcryptjs"
import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import type {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateUserStatusInput,
  GetUsersQuery,
} from "./users.validation.js"

const SALT_ROUNDS = 12

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      notificationSettings: true,
      createdAt: true,
      updatedAt: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
          status: true,
          city: true,
          province: true,
          rating: true,
          totalReviews: true,
          totalBookings: true,
        },
      },
    },
  })

  if (!user) throw new AppError("User tidak ditemukan", 404)
  return user
}

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const user = await db.user.update({
    where: { id: userId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.phone !== undefined && { phone: input.phone ?? null }),
      ...(input.avatar !== undefined && { avatar: input.avatar ?? null }),
      ...(input.notificationSettings !== undefined && { notificationSettings: input.notificationSettings }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      notificationSettings: true,
      updatedAt: true,
    },
  })

  return user
}

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (
  userId: string,
  input: ChangePasswordInput
) => {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError("User tidak ditemukan", 404)

  // Verifikasi password lama
  const isMatch = await bcrypt.compare(input.currentPassword, user.password)
  if (!isMatch) throw new AppError("Password lama tidak sesuai", 401)

  // Cek password baru tidak sama dengan yang lama
  const isSame = await bcrypt.compare(input.newPassword, user.password)
  if (isSame) throw new AppError("Password baru tidak boleh sama dengan password lama", 400)

  // Hash & update
  const hashedPassword = await bcrypt.hash(input.newPassword, SALT_ROUNDS)
  await db.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

  // Hapus semua refresh token (force logout semua device)
  await db.refreshToken.deleteMany({ where: { userId } })
}

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
export const getAllUsers = async (query: GetUsersQuery) => {
  const { page, limit, search, role, isActive } = query
  const skip = (page - 1) * limit

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(role && { role }),
    ...(isActive !== undefined && { isActive }),
  }

  const users = await db.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      createdAt: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
          status: true,
        },
      },
    },
  })
  const total = await db.user.count({ where })

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

// ─── Get User By ID (Admin) ───────────────────────────────────────────────────
export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
          status: true,
          city: true,
          province: true,
          rating: true,
          totalReviews: true,
          totalBookings: true,
        },
      },
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
  })

  if (!user) throw new AppError("User tidak ditemukan", 404)
  return user
}

// ─── Update User Status (Admin) ───────────────────────────────────────────────
export const updateUserStatus = async (
  id: string,
  input: UpdateUserStatusInput
) => {
  const user = await db.user.findUnique({ where: { id } })
  if (!user) throw new AppError("User tidak ditemukan", 404)

  const updated = await db.user.update({
    where: { id },
    data: { isActive: input.isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  })

  // Kalau dinonaktifkan, hapus semua refresh token
  if (!input.isActive) {
    await db.refreshToken.deleteMany({ where: { userId: id } })
  }

  return updated
}

// ─── Deactivate My Account ───────────────────────────────────────────────────
export const deactivateAccount = async (userId: string) => {
  const user = await db.user.update({
    where: { id: userId },
    data: { isActive: false },
  })

  // Hapus semua refresh token
  await db.refreshToken.deleteMany({ where: { userId } })
  return user
}