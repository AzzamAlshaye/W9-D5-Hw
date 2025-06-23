import jwt from "jsonwebtoken"
import { UsersCollection, UserDocument } from "../models/user.model"
import { jwtConfig } from "../config/jwt"
import { AppError } from "../utils/error"
import { BAD_REQUEST, UNAUTHORIZED } from "../utils/http-status"
import { tokenBlacklist } from "../config/tokenBlacklist"

interface AuthResult {
  token: string
}

export async function registerUser(
  email: string,
  password: string
): Promise<AuthResult> {
  if (!email || !password) {
    throw new AppError("Email and password are required", BAD_REQUEST)
  }

  const existing = await UsersCollection.findOne({ email })
  if (existing) {
    throw new AppError("Email already in use", BAD_REQUEST)
  }

  const user = await UsersCollection.create({ email, password })
  const token = jwt.sign(
    { sub: user._id },
    jwtConfig.secret,
    jwtConfig.accessToken.options
  )

  return { token }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResult> {
  if (!email || !password) {
    throw new AppError("Email and password are required", BAD_REQUEST)
  }

  const user = (await UsersCollection.findOne({ email }).select(
    "+password"
  )) as UserDocument | null
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid credentials", UNAUTHORIZED)
  }

  const token = jwt.sign(
    { sub: user._id },
    jwtConfig.secret,
    jwtConfig.accessToken.options
  )

  return { token }
}

export function logoutUser(authorizationHeader?: string): void {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AppError("No token provided", UNAUTHORIZED)
  }
  const token = authorizationHeader.split(" ")[1]
  tokenBlacklist.add(token)
}
