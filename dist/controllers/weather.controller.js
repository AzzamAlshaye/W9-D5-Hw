"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = require("../utils/http-status");
const error_1 = require("../utils/error");
const history_model_1 = require("../models/history.model");
const API_KEY = process.env.OPENWEATHER_API_KEY;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const cache = new Map();
function degToCardinal(deg) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
}
const getWeather = async (req, res, next) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            throw new error_1.AppError("lat and lon are required", http_status_1.BAD_REQUEST);
        }
        const key = `${lat},${lon}`;
        const now = Date.now();
        const entry = cache.get(key);
        if (entry && entry.expiresAt > now) {
            // cache‐hit: record and send
            await history_model_1.HistoryCollection.create({
                lat: Number(lat),
                lon: Number(lon),
                requestedAt: new Date(),
                source: "cache",
                ...entry.data,
            });
            const payload = { ...entry.data, source: "cache" };
            res.status(http_status_1.OK).json(payload);
            return; // <— return void, not Response
        }
        // cache‐miss: fetch fresh
        const resp = await axios_1.default.get("https://api.openweathermap.org/data/2.5/weather", { params: { lat, lon, appid: API_KEY, units: "metric" } });
        const body = resp.data;
        const baseData = {
            temperature: body.main.temp,
            humidity: body.main.humidity,
            conditions: body.weather[0].description,
            windSpeed: body.wind.speed,
            windDirection: degToCardinal(body.wind.deg),
        };
        // cache it
        cache.set(key, {
            data: baseData,
            expiresAt: now + CACHE_TTL_MS,
        });
        // record
        await history_model_1.HistoryCollection.create({
            lat: Number(lat),
            lon: Number(lon),
            requestedAt: new Date(),
            source: "openweathermap",
            ...baseData,
        });
        const payload = { ...baseData, source: "openweathermap" };
        res.status(http_status_1.OK).json(payload);
        // no return needed here—function ends and resolves to void
    }
    catch (err) {
        next(err);
    }
};
exports.getWeather = getWeather;
