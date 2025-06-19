import { Schema, model } from "mongoose"

const historySchema = new Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  requestedAt: { type: Date, default: Date.now },
  source: { type: String, required: true },
})

export const HistoryCollection = model("History", historySchema)
