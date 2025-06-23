// src/services/weather.service.ts
import axios from "axios"
import { AppError } from "../utils/error"
import { BAD_REQUEST } from "../utils/http-status"
import { HistoryCollection } from "../models/history.model"

const API_KEY = process.env.OPENWEATHER_API_KEY!
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

type BaseData = Omit<WeatherPayload, "source">

export interface WeatherPayload {
  temperature: number
  humidity: number
  conditions: string
  windSpeed: number
  windDirection: string
  source: "openweathermap" | "cache"
}

const cache = new Map<string, { data: BaseData; expiresAt: number }>()

function degToCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(deg / 45) % 8]
}

/**
 * Fetch weather (cache or API) and record history for the given user.
 */
export async function fetchWeather(
  lat: number,
  lon: number,
  userId?: string
): Promise<WeatherPayload> {
  if (!userId) {
    throw new AppError("User must be authenticated", BAD_REQUEST)
  }

  const key = `${lat},${lon}`
  const now = Date.now()
  const entry = cache.get(key)

  if (entry && entry.expiresAt > now) {
    await HistoryCollection.create({
      user: userId,
      lat,
      lon,
      requestedAt: new Date(),
      source: "cache",
      ...entry.data,
    })
    return { ...entry.data, source: "cache" }
  }

  const resp = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    { params: { lat, lon, appid: API_KEY, units: "metric" } }
  )
  const body = resp.data
  const baseData: BaseData = {
    temperature: body.main.temp,
    humidity: body.main.humidity,
    conditions: body.weather[0].description,
    windSpeed: body.wind.speed,
    windDirection: degToCardinal(body.wind.deg),
  }

  cache.set(key, { data: baseData, expiresAt: now + CACHE_TTL_MS })

  await HistoryCollection.create({
    user: userId,
    lat,
    lon,
    requestedAt: new Date(),
    source: "openweathermap",
    ...baseData,
  })

  return { ...baseData, source: "openweathermap" }
}
