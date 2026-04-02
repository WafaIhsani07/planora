import express, { type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Planora API running", status: "ok" })
})

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" })
})

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`)
    res.status(500).json({ message: "Internal Server Error" })
})

export default app