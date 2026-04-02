import { type Request, type Response } from "express"
import prisma from "../config/prisma.js"

export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.json(users)
}