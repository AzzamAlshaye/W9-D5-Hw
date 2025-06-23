// src/controllers/weather.controller.ts
import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/error"
import { BAD_REQUEST, OK } from "../utils/http-status"
import { fetchWeather, WeatherPayload } from "../service/weather.service"

// Extend Express Request to include authenticated user
interface AuthenticatedRequest extends Request {
  user?: { _id: string }
}

export const getWeather = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lat = Number(req.query.lat)
    const lon = Number(req.query.lon)
    if (!lat || !lon) {
      throw new AppError("lat and lon are required", BAD_REQUEST)
    }

    const rawUserId = req.user?._id
    const payload: WeatherPayload = await fetchWeather(lat, lon, rawUserId)
    res.status(OK).json(payload)
  } catch (err) {
    next(err)
  }
}
