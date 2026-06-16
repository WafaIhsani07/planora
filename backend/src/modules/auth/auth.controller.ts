import type { Request, Response, NextFunction } from "express"
import * as authService from "./auth.service.js"
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js"
import {
  sendSuccess,
  sendCreated,
  sendValidationError,
} from "../../utils/response.js"

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await authService.register(parsed.data)
  sendCreated(res, result, "Registrasi berhasil")
}

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await authService.login(parsed.data)
  sendSuccess(res, result, "Login berhasil")
}

// ─── Refresh Token ───────────────────────────────────────────────────────────
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = refreshTokenSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await authService.refreshToken(parsed.data.refreshToken)
  sendSuccess(res, result, "Token berhasil diperbarui")
}

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = refreshTokenSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  await authService.logout(parsed.data.refreshToken)
  sendSuccess(res, null, "Logout berhasil")
}

// ─── Get Me ──────────────────────────────────────────────────────────────────
export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await authService.getMe(req.userId)
  sendSuccess(res, user, "Data berhasil diambil")
}

// ─── Forgot Password ─────────────────────────────────────────────────────────
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = forgotPasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await authService.requestPasswordReset(parsed.data)
  sendSuccess(res, result, "Token reset berhasil dibuat")
}

// ─── Reset Password ─────────────────────────────────────────────────────────-
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = resetPasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  await authService.resetPassword(parsed.data)
  sendSuccess(res, null, "Password berhasil direset")
}

// ─── Rollback Registration ───────────────────────────────────────────────────
export const rollbackRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await authService.rollbackRegistration(req.userId)
  sendSuccess(res, null, "Pendaftaran berhasil dibatalkan")
}