import type { Request, Response, NextFunction } from "express"
import type { Role } from "@prisma/client"
import { verifyAccessToken } from "../utils/jwt.js"
import { sendUnauthorized, sendForbidden } from "../utils/response.js"

// ─── Extend Express Request ──────────────────────────────────────────────────
declare global {
  namespace Express {
    interface Request {
      userId: string
      userRole: Role
    }
  }
}

// ─── Authenticate Middleware ─────────────────────────────────────────────────
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    sendUnauthorized(res)
    return
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    sendUnauthorized(res)
    return
  }

  try {
    const payload = verifyAccessToken(token)
    req.userId = payload.userId
    req.userRole = payload.role as Role
    next()
  } catch {
    sendUnauthorized(res, "Token tidak valid atau sudah expired")
  }
}

// ─── Authorize Middleware ────────────────────────────────────────────────────
export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.userRole)) {
      sendForbidden(res, "Kamu tidak punya akses ke resource ini")
      return
    }
    next()
  }
}
