// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UsersCollection } from "../models/user.model"
import { jwtConfig } from "../config/jwt"
import { AppError } from "../utils/error"
import { UNAUTHORIZED } from "../utils/http-status"

export const authorized = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("You are not logged in", UNAUTHORIZED)
    }
    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      sub: string
      iat: number
      exp: number
    }

    // 3) Check if user still exists
    const user = await UsersCollection.findById(decoded.sub)
    if (!user) {
      throw new AppError("User no longer exists", UNAUTHORIZED)
    }

    // 4) Grant access
    req.user = user
    next()
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new AppError("Token has expired", UNAUTHORIZED))
    } else {
      next(new AppError("Invalid token", UNAUTHORIZED))
    }
  }
}
