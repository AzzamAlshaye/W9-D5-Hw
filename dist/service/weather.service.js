"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWeather = fetchWeather;
// src/services/weather.service.ts
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const history_model_1 = require("../models/history.model");
const API_KEY = process.env.OPENWEATHER_API_KEY;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map();
function degToCardinal(deg) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
}
/**
 * Fetch weather (cache or API) and record history for the given user.
 */
async function fetchWeather(lat, lon, userId) {
    if (!userId) {
        throw new error_1.AppError("User must be authenticated", http_status_1.BAD_REQUEST);
    }
    const key = `${lat},${lon}`;
    const now = Date.now();
    const entry = cache.get(key);
    if (entry && entry.expiresAt > now) {
        await history_model_1.HistoryCollection.create({
            user: userId,
            lat,
            lon,
            requestedAt: new Date(),
            source: "cache",
            ...entry.data,
        });
        return { ...entry.data, source: "cache" };
    }
    const resp = await axios_1.default.get("https://api.openweathermap.org/data/2.5/weather", { params: { lat, lon, appid: API_KEY, units: "metric" } });
    const body = resp.data;
    const baseData = {
        temperature: body.main.temp,
        humidity: body.main.humidity,
        conditions: body.weather[0].description,
        windSpeed: body.wind.speed,
        windDirection: degToCardinal(body.wind.deg),
    };
    cache.set(key, { data: baseData, expiresAt: now + CACHE_TTL_MS });
    await history_model_1.HistoryCollection.create({
        user: userId,
        lat,
        lon,
        requestedAt: new Date(),
        source: "openweathermap",
        ...baseData,
    });
    return { ...baseData, source: "openweathermap" };
}
