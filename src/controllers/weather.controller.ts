// src/controllers/weather.controller.ts

import { RequestHandler } from "express"
import axios from "axios"
import { BAD_REQUEST, OK } from "../utils/http-status"
import { AppError } from "../utils/error"

const API_KEY = process.env.OPENWEATHER_API_KEY
if (!API_KEY) {
  throw new Error("Missing OPENWEATHER_API_KEY in environment")
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; expiresAt: number }>()

function degToCardinal(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return directions[Math.round(deg / 45) % 8]
}

export const getWeather: RequestHandler = async (req, res, next) => {
  try {
    const { lat, lon } = req.query
    if (!lat || !lon) {
      throw new AppError("lat and lon are required", BAD_REQUEST)
    }

    const key = `${lat},${lon}`
    const now = Date.now()
    const cached = cache.get(key)
    if (cached && cached.expiresAt > now) {
      res.status(OK).json(cached.data)
      return
    }

    const resp = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      { params: { lat, lon, appid: API_KEY, units: "metric" } }
    )

    const body = resp.data
    const payload = {
      temperature: body.main.temp,
      humidity: body.main.humidity,
      conditions: body.weather[0].description,
      windSpeed: body.wind.speed,
      windDirection: degToCardinal(body.wind.deg),
      source: "openweathermap" as const,
    }

    // Cache the raw payload, but tag future responses as from cache
    cache.set(key, {
      data: { ...payload, source: "cache" },
      expiresAt: now + CACHE_TTL_MS,
    })

    res.status(OK).json(payload)
    // no `return res…`, just return void
  } catch (err) {
    next(err)
  }
}
