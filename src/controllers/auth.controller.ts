// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from "express"
import * as AuthService from "../services/auth.service"
import { CREATED, OK } from "../utils/http-status"
import { AppError } from "../utils/error"

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body
    const { accessToken } = await AuthService.signUp({ email, password })

    // Force JSON and status
    res.status(CREATED).json({ token: accessToken })
  } catch (err) {
    next(err)
  }
}

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body
    const { accessToken } = await AuthService.signIn(email, password)

    res.status(OK).json({ token: accessToken })
  } catch (err) {
    next(err)
  }
}

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // your sign-out logic (e.g. blacklist token)…
    res.sendStatus(OK)
  } catch (err) {
    next(err)
  }
}
