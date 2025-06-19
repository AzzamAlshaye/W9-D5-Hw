"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI?.trim();
        const dbName = process.env.MONGODB_DB?.trim();
        if (!mongoURI || !dbName) {
            logger_1.default.error("MONGODB_URI or MONGODB_DB is not defined");
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoURI, { dbName });
        logger_1.default.info(`MongoDB connected successfully to database “${dbName}”`);
    }
    catch (error) {
        logger_1.default.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
