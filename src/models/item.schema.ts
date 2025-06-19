import { Schema, model, Document, Types } from "mongoose"

// Interface extending Mongoose Document
export interface ItemDocument extends Document {
  listId: Types.ObjectId
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

// Define the schema
const ItemSchema = new Schema<ItemDocument>(
  {
    listId: { type: Schema.Types.ObjectId, ref: "List", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
)

// Export the model
export const ItemModel = model<ItemDocument>("Item", ItemSchema)
