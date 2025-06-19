import { Router } from "express"
import { signup, signin, signout } from "../controllers/auth.controller"
import { authorized } from "../middleware/auth.middleware"

const router = Router()

// POST /auth/signup
router.post("/signup", signup)

// POST /auth/signin
router.post("/signin", signin)

// POST /auth/signout  (requires valid JWT)
router.post("/signout", authorized, signout)

export default router
