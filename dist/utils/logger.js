"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// logger.js
const winston_1 = __importDefault(require("winston"));
// Create a logger instance with default settings
const logger = winston_1.default.createLogger({
    level: "info", // minimum level to log (info, warn, error, etc.)
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), // add timestamp to each log entry
    winston_1.default.format.json() // output logs in JSON format
    ),
    transports: [
        // Write error-level logs to logs/error.log
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" }),
        // Write all logs (info and above) to logs/combined.log
        new winston_1.default.transports.File({ filename: "logs/combined.log" }),
    ],
});
// In non-production environments, also log to the console
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), // add colors for easier reading
        winston_1.default.format.simple() // simple text output (not JSON)
        ),
    }));
}
exports.default = logger;
