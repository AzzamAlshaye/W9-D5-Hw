"use strict";
// src/models/user.model.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersCollection = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generate_id_1 = require("../utils/generate-id");
const userSchema = new mongoose_1.Schema({
    id: {
        type: String,
        default: () => `user_${(0, generate_id_1.generateId)()}`,
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
}, {
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
});
// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// Compare candidate vs. stored hash
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.UsersCollection = (0, mongoose_1.model)("Users", userSchema);
