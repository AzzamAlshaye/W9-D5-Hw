import { Router } from "express"
import { authorized } from "../middleware/auth.middleware"
import { getWeather } from "../controllers/weather.controller"

const router = Router()

// GET /weather?lat=...&lon=...
router.get("/", authorized, getWeather)

export default router
