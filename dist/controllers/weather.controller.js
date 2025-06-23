"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const weather_service_1 = require("../service/weather.service");
const getWeather = async (req, res, next) => {
    try {
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);
        if (!lat || !lon) {
            throw new error_1.AppError("lat and lon are required", http_status_1.BAD_REQUEST);
        }
        const rawUserId = req.user?._id;
        const payload = await (0, weather_service_1.fetchWeather)(lat, lon, rawUserId);
        res.status(http_status_1.OK).json(payload);
    }
    catch (err) {
        next(err);
    }
};
exports.getWeather = getWeather;
