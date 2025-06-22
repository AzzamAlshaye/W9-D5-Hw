"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryCollection = void 0;
// src/models/history.model.ts
const mongoose_1 = require("mongoose");
const historySchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    // ← New weather fields
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    conditions: { type: String, required: true },
    windSpeed: { type: Number, required: true },
    windDirection: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    source: { type: String, required: true },
});
exports.HistoryCollection = (0, mongoose_1.model)("History", historySchema);
