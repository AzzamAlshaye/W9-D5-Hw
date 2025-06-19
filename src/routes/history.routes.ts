// src/routes/history.routes.ts

import { Router } from "express"
import { authorized } from "../middleware/auth.middleware"
import { getHistory } from "../controllers/history.controller"

const router = Router()

// GET /history?limit=10&skip=0&sort=-requestedAt
// GET /history?count=true
router.get("/", authorized, getHistory)

export default router
