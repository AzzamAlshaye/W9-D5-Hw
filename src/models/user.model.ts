// src/models/user.model.ts

import { Schema, model, Document } from "mongoose"
import bcrypt from "bcryptjs"
import { generateId } from "../utils/generate-id"

export interface UserDocument extends Document {
  id: string
  email: string
  password: string
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<UserDocument>(
  {
    id: {
      type: String,
      default: () => `user_${generateId()}`,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => ({
        id: ret.id,
        email: ret.email,
        role: ret.role,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      }),
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => ({
        id: ret.id,
        email: ret.email,
        role: ret.role,
        createdAt: ret.createdAt,
        updatedAt: ret.updatedAt,
      }),
    },
  }
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare candidate vs. stored hash
userSchema.methods.comparePassword = function (
  this: UserDocument,
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password)
}

export const UsersCollection = model<UserDocument>("Users", userSchema)
