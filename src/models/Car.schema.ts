import { Schema, model, Document, Types } from "mongoose"

// Interface extending Mongoose Document
export interface CarDocument extends Document {
  dealerId: Types.ObjectId
  carMakeId: Types.ObjectId
  name: string
  price: number
  year: number
  color: string
  wheelsCount: number
  createdAt: Date
  updatedAt: Date
}

// Define the schema
const CarSchema = new Schema<CarDocument>(
  {
    dealerId: { type: Schema.Types.ObjectId, ref: "Dealer", required: true },
    carMakeId: { type: Schema.Types.ObjectId, ref: "CarMake", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    year: { type: Number, required: true },
    color: { type: String, required: true },
    wheelsCount: { type: Number, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
)

// Export the model
export const CarModel = model<CarDocument>("Car", CarSchema)
