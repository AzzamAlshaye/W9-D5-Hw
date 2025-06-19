import { Router } from "express"
import { signUp, signIn, signOut } from "../controllers/auth.controller"
import { authorized } from "../middleware/auth.middleware"

const router = Router()

// POST /auth/signup
router.post("/signup", signUp)

// POST /auth/signin
router.post("/signin", signIn)

// POST /auth/signout (requires a valid access token)
router.post("/signout", authorized, signOut)

export default router
