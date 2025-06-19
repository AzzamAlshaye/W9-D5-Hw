import { Schema, model, Document } from "mongoose"

// Interface extending Mongoose Document
export interface ListDocument extends Document {
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
}

// Define the schema
const ListSchema = new Schema<ListDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
)

// Export the model
export const ListModel = model<ListDocument>("List", ListSchema)
