import { Schema, model, Document } from "mongoose"

// Interface extending Mongoose Document
export interface CarMakeDocument extends Document {
  country: string
  brand: string
  createdAt: Date
  updatedAt: Date
}

// Define the schema
const CarMakeSchema = new Schema<CarMakeDocument>(
  {
    country: { type: String, required: true },
    brand: { type: String, required: true, unique: true },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
  }
)

// Export the model
export const CarMakeModel = model<CarMakeDocument>("CarMake", CarMakeSchema)
