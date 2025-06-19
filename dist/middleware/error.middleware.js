"use strict";
// src/utils/error.middleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_1 = require("../utils/error");
const errorHandler = (err, req, res, next) => {
    console.error(err); // Log for your own debugging
    if (err instanceof error_1.AppError) {
        // Send the custom AppError status/message
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    // Fallback for any other errors
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
    });
    // no `return res...` here either
};
exports.errorHandler = errorHandler;
