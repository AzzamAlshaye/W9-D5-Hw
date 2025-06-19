import { Schema, model, Document } from "mongoose"

// Interface extending Mongoose Document
export interface CarDealerDocument extends Document {
  name: string
  email: string
  city: string
  createdAt: Date
  updatedAt: Date
}

// Define the schema
const CarDealerSchema = new Schema<CarDealerDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    city: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
)

// Export the model
export const CarDealerModel = model<CarDealerDocument>(
  "CarDealer",
  CarDealerSchema
)
