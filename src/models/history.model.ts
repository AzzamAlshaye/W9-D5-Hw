// src/models/history.model.ts
import { Document, Schema, model, Types } from "mongoose"

// Define the History document interface
export interface HistoryDocument extends Document {
  user: Types.ObjectId
  lat: number
  lon: number
  temperature: number
  humidity: number
  conditions: string
  windSpeed: number
  windDirection: string
  requestedAt: Date
  source: string
}

const historySchema = new Schema<HistoryDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },

    // Weather fields
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    conditions: { type: String, required: true },
    windSpeed: { type: Number, required: true },
    windDirection: { type: String, required: true },

    requestedAt: { type: Date, default: Date.now },
    source: { type: String, required: true },
  },
  { timestamps: false }
)

export const HistoryCollection = model<HistoryDocument>(
  "History",
  historySchema
)
