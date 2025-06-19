import { RequestHandler } from "express"
import axios from "axios"
import { BAD_REQUEST, OK } from "../utils/http-status"
import { AppError } from "../utils/error"
import { HistoryCollection } from "../models/history.model"

const API_KEY = process.env.OPENWEATHER_API_KEY!
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// Cache only the *raw* weather data (no source flag)
const cache = new Map<
  string,
  { data: Omit<WeatherPayload, "source">; expiresAt: number }
>()

interface WeatherPayload {
  temperature: number
  humidity: number
  conditions: string
  windSpeed: number
  windDirection: string
  source: "openweathermap" | "cache"
}

function degToCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(deg / 45) % 8]
}

export const getWeather: RequestHandler = async (req, res, next) => {
  try {
    const { lat, lon } = req.query
    if (!lat || !lon) {
      throw new AppError("lat and lon are required", BAD_REQUEST)
    }

    const key = `${lat},${lon}`
    const now = Date.now()
    const entry = cache.get(key)

    if (entry && entry.expiresAt > now) {
      // record cache‐hit
      await HistoryCollection.create({
        lat: Number(lat),
        lon: Number(lon),
        requestedAt: new Date(),
        source: "cache",
      })

      // return with source = "cache"
      const payload: WeatherPayload = {
        ...entry.data,
        source: "cache",
      }
      res.status(OK).json(payload)
      return
    }

    // cache‐miss → fetch fresh
    const resp = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      { params: { lat, lon, appid: API_KEY, units: "metric" } }
    )

    const body = resp.data
    const baseData = {
      temperature: body.main.temp,
      humidity: body.main.humidity,
      conditions: body.weather[0].description,
      windSpeed: body.wind.speed,
      windDirection: degToCardinal(body.wind.deg),
    }

    // cache the *baseData* only
    cache.set(key, {
      data: baseData,
      expiresAt: now + CACHE_TTL_MS,
    })

    // record cache‐miss
    await HistoryCollection.create({
      lat: Number(lat),
      lon: Number(lon),
      requestedAt: new Date(),
      source: "openweathermap",
    })

    // return with source = "openweathermap"
    const payload: WeatherPayload = {
      ...baseData,
      source: "openweathermap",
    }
    res.status(OK).json(payload)
  } catch (err) {
    next(err)
  }
}
