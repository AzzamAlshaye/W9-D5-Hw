// src/services/auth.service.ts

import jwt, { TokenExpiredError } from "jsonwebtoken"
import { UsersCollection, type UserDocument } from "../models/user.model"
import { jwtConfig } from "../config/jwt"
import { AppError } from "../utils/error"
import { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } from "../utils/http-status"

// 1) Ensure our JWT config is valid on module load
if (!jwtConfig.secret) {
  throw new Error("Missing jwtConfig.secret")
}
if (!jwtConfig.accessToken || !jwtConfig.refreshToken) {
  throw new Error("Missing jwtConfig.accessToken or refreshToken options")
}

export const signUp = async (userData: {
  email: string
  password: string
}): Promise<{
  user: UserDocument
  accessToken: string
  refreshToken: string
}> => {
  const existing = await UsersCollection.findOne({ email: userData.email })
  if (existing) {
    throw new AppError("Email already exists", BAD_REQUEST)
  }

  const user = await UsersCollection.create(userData)
  const tokens = await generateTokens(user)
  return { user, ...tokens }
}

export const signIn = async (
  email: string,
  password: string
): Promise<{
  user: UserDocument
  accessToken: string
  refreshToken: string
}> => {
  const user = await UsersCollection.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid credentials", UNAUTHORIZED)
  }

  const tokens = await generateTokens(user)
  return { user, ...tokens }
}

export const refreshTokens = async (
  incomingToken: string
): Promise<{
  accessToken: string
  refreshToken: string
}> => {
  try {
    const decoded = jwt.verify(incomingToken, jwtConfig.secret) as {
      type: string
      user: { id: string; email: string; role: string }
    }

    if (decoded.type !== "refresh") {
      throw new AppError("Wrong token type", UNAUTHORIZED)
    }

    const user = await UsersCollection.findById(decoded.user.id)
    if (!user) {
      throw new AppError("User not found", NOT_FOUND)
    }

    return generateTokens(user)
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError("Refresh token expired", UNAUTHORIZED)
    }
    throw new AppError("Invalid refresh token", UNAUTHORIZED)
  }
}

const generateTokens = async (
  user: UserDocument
): Promise<{
  accessToken: string
  refreshToken: string
}> => {
  const payload = {
    user: { id: user.id, email: user.email, role: user.role },
  }

  const accessToken = jwt.sign(
    { ...payload, type: "access" },
    jwtConfig.secret,
    jwtConfig.accessToken.options
  )

  const refreshToken = jwt.sign(
    { ...payload, type: "refresh" },
    jwtConfig.secret,
    jwtConfig.refreshToken.options
  )

  return { accessToken, refreshToken }
}
