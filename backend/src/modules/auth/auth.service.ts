import bcrypt from "bcryptjs"
import { randomBytes } from "node:crypto"
import { db } from "../../config/database.js"
import { AppError } from "../../utils/error.js"
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js"
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.validation.js"

const SALT_ROUNDS = 12
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000 // 7 hari
const RESET_TOKEN_EXPIRES_MS = 30 * 60 * 1000 // 30 menit

// ─── Register ────────────────────────────────────────────────────────────
export const register = async (input: RegisterInput) => {
  const emailNormalized = input.email.trim().toLowerCase()
  const existing = await db.user.findUnique({
    where: { email: emailNormalized },
  })
  if (existing) throw new AppError("Email sudah terdaftar", 409)

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

  const user = await db.user.create({
    data: {
      name: input.name,
      email: emailNormalized,
      password: hashedPassword,
      role: input.role,
      phone: input.phone ?? null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  })

  const accessToken = signAccessToken({ userId: user.id, role: user.role })
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role })

  await db.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    },
  })

  return { user, accessToken, refreshToken }
}

// ─── Login ───────────────────────────────────────────────────────────────
export const login = async (input: LoginInput) => {
  const emailNormalized = input.email.trim().toLowerCase()
  const user = await db.user.findUnique({
    where: { email: emailNormalized },
  })
  if (!user) throw new AppError("Email atau password salah", 401)
  if (!user.isActive) throw new AppError("Akun kamu telah dinonaktifkan", 403)

  const isMatch = await bcrypt.compare(input.password, user.password)
  if (!isMatch) throw new AppError("Email atau password salah", 401)

  // ─── LOGIKA VALIDASI PLATFORM (OPSI 2) ───
  if (input.appType === "WEB" && user.role === "CUSTOMER") {
    throw new AppError("Akses ditolak: Aplikasi web hanya untuk Vendor dan Admin.", 403)
  }

  if (input.appType === "MOBILE" && (user.role === "VENDOR" || user.role === "ADMIN")) {
    throw new AppError("Akses ditolak: Gunakan website Planora untuk mengelola bisnis Anda.", 403)
  }
  // ─────────────────────────────────────────

  const accessToken = signAccessToken({ userId: user.id, role: user.role })
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role })

  await db.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    },
  })

  const { password: _password, ...safeUser } = user
  return { user: safeUser, accessToken, refreshToken }
}

// ─── Refresh Token ───────────────────────────────────────────────────────
export const refreshToken = async (token: string) => {
  const stored = await db.refreshToken.findUnique({
    where: { token },
  })
  if (!stored) throw new AppError("Refresh token tidak valid", 401)

  if (stored.expiresAt < new Date()) {
    await db.refreshToken.delete({ where: { token } })
    throw new AppError("Refresh token sudah expired, silakan login ulang", 401)
  }

  const payload = verifyRefreshToken(token)

  const accessToken = signAccessToken({
    userId: payload.userId,
    role: payload.role,
  })

  return { accessToken }
}

// ─── Logout ──────────────────────────────────────────────────────────────
export const logout = async (token: string) => {
  await db.refreshToken.deleteMany({ where: { token } })
}

// ─── Get Me ──────────────────────────────────────────────────────────────
export const getMe = async (userId: string) => {
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
      createdAt: true,
      updatedAt: true,
      vendor: {
        select: {
          id: true,
          businessName: true,
          status: true,
          city: true,
          rating: true,
        },
      },
    },
  })

  if (!user) throw new AppError("User tidak ditemukan", 404)
  return user
}

// ─── Forgot Password ─────────────────────────────────────────────────────────
export const requestPasswordReset = async (input: ForgotPasswordInput) => {
  const emailNormalized = input.email.trim().toLowerCase()
  const user = await db.user.findUnique({ where: { email: emailNormalized } })
  if (!user) throw new AppError("Email tidak ditemukan", 404)

  await db.passwordResetToken.deleteMany({ where: { userId: user.id } })

  const resetToken = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS)

  await db.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt,
    },
  })

  return { resetToken, expiresAt }
}

// ─── Reset Password ──────────────────────────────────────────────────────────
export const resetPassword = async (input: ResetPasswordInput) => {
  const stored = await db.passwordResetToken.findUnique({
    where: { token: input.token },
  })

  if (!stored) throw new AppError("Token reset tidak valid", 401)
  if (stored.usedAt) throw new AppError("Token reset sudah digunakan", 400)
  if (stored.expiresAt < new Date()) {
    await db.passwordResetToken.delete({ where: { token: input.token } })
    throw new AppError("Token reset sudah expired", 401)
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, SALT_ROUNDS)

  await db.user.update({
    where: { id: stored.userId },
    data: { password: hashedPassword },
  })

  await db.passwordResetToken.update({
    where: { token: input.token },
    data: { usedAt: new Date() },
  })

  await db.refreshToken.deleteMany({ where: { userId: stored.userId } })
}

// ─── Rollback Registration ───────────────────────────────────────────────────
export const rollbackRegistration = async (userId: string) => {
  // Only allow rollback if the vendor profile doesn't exist yet
  const vendor = await db.vendor.findUnique({ where: { userId } })
  if (vendor) {
    throw new AppError("Tidak dapat membatalkan pendaftaran karena profil vendor sudah dibuat", 400)
  }

  // Delete all refresh tokens
  await db.refreshToken.deleteMany({ where: { userId } })

  // Delete all password reset tokens
  await db.passwordResetToken.deleteMany({ where: { userId } })

  // Delete the user
  await db.user.delete({ where: { id: userId } })
}