import { RequestHandler } from "express"
import { registerUser, loginUser, logoutUser } from "../service/auth.service"
import { CREATED, OK } from "../utils/http-status"

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { token } = await registerUser(email, password)
    res.status(CREATED).json({ token })
  } catch (err) {
    next(err)
  }
}

export const signin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { token } = await loginUser(email, password)
    res.status(OK).json({ token })
  } catch (err) {
    next(err)
  }
}

export const signout: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    logoutUser(authHeader)
    res.status(OK).json({ success: true, message: "Signed out successfully" })
  } catch (err) {
    next(err)
  }
}
