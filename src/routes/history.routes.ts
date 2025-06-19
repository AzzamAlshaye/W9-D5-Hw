// src/routes/history.routes.ts

import { Router } from "express"
import { getHistory } from "../controllers/history.controller"
import { authorized } from "../middleware/auth.middleware"

const router = Router()

// GET /history?limit=…&skip=…&sort=…  → paged list
// GET /history?count=true           → total count
// (both require a valid access token)
router.get("/", authorized, getHistory)

export default router
