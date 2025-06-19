import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/error" // your AppError class

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err) // so you can see stack traces in your console

  // If it's an instance of your AppError, use its statusCode + message:
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message })
  }

  // Otherwise, it's a 500
  return res
    .status(500)
    .json({ success: false, message: "Something went wrong!" })
}
