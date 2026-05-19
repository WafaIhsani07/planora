import type { Request, Response, NextFunction } from "express"
import * as usersService from "./users.service.js"
import {
  updateProfileSchema,
  changePasswordSchema,
  updateUserStatusSchema,
  getUsersQuerySchema,
} from "./users.validation.js"
import {
  sendSuccess,
  sendValidationError,
} from "../../utils/response.js"
import { string } from "zod/v4"

// ─── Get Profile ──────────────────────────────────────────────────────────────
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await usersService.getProfile(req.userId)
  sendSuccess(res, user, "Profil berhasil diambil")
}

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = updateProfileSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const user = await usersService.updateProfile(req.userId, parsed.data)
  sendSuccess(res, user, "Profil berhasil diperbarui")
}

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = changePasswordSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  await usersService.changePassword(req.userId, parsed.data)
  sendSuccess(res, null, "Password berhasil diubah, silakan login ulang")
}

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = getUsersQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const result = await usersService.getAllUsers(parsed.data)
  sendSuccess(res, result, "Data user berhasil diambil")
}

// ─── Get User By ID (Admin) ───────────────────────────────────────────────────
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await usersService.getUserById(String(req.params["id"] ?? ""))
  sendSuccess(res, user, "Data user berhasil diambil")
}

// ─── Update User Status (Admin) ───────────────────────────────────────────────
export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = updateUserStatusSchema.safeParse(req.body)
  if (!parsed.success) {
    sendValidationError(res, parsed.error.flatten().fieldErrors)
    return
  }

  const user = await usersService.updateUserStatus(
    String(req.params["id"] ?? ""),
    parsed.data
  )
  sendSuccess(res, user, "Status user berhasil diperbarui")
}