// src/models/history.model.ts

import { Schema, model, Document } from "mongoose"

export interface HistoryDocument extends Document {
  lat: number
  lon: number
  requestedAt: Date
  source: string // e.g. "openweathermap" or "cache"
  temperature: number // °C
  humidity: number // %
  conditions: string // e.g. "Cloudy"
  windSpeed: number // m/s
  windDirection: string // e.g. "NW"
}

const historySchema = new Schema<HistoryDocument>(
  {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    requestedAt: { type: Date, default: () => new Date(), required: true },
    source: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    conditions: { type: String, required: true },
    windSpeed: { type: Number, required: true },
    windDirection: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        const { _id, ...rest } = ret
        return { id: _id, ...rest }
      },
    },
  }
)

export const HistoryCollection = model<HistoryDocument>(
  "History",
  historySchema
)
