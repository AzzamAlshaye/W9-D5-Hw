// src/controllers/auth.controller.ts

import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { UsersCollection } from "../models/user.model"
import { jwtConfig } from "../config/jwt"
import { AppError } from "../utils/error"
import { CREATED, OK, UNAUTHORIZED, BAD_REQUEST } from "../utils/http-status"

export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
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

    res.status(CREATED).json({ token })
  } catch (err) {
    next(err)
  }
}

export const signin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw new AppError("Email and password are required", BAD_REQUEST)
    }

    const user = await UsersCollection.findOne({ email }).select("+password")
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid credentials", UNAUTHORIZED)
    }

    const token = jwt.sign(
      { sub: user._id },
      jwtConfig.secret,
      jwtConfig.accessToken.options
    )

    res.status(OK).json({ token })
  } catch (err) {
    next(err)
  }
}

export const signout: RequestHandler = async (req, res, next) => {
  try {
    // If using a token blacklist, add the token/user here
    res.status(OK).json({ message: "Signed out successfully" })
  } catch (err) {
    next(err)
  }
}
