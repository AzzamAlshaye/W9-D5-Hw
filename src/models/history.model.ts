// src/models/history.model.ts
import { Schema, model } from "mongoose"

const historySchema = new Schema({
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
})

export const HistoryCollection = model("History", historySchema)
