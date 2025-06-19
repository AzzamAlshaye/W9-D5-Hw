"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.dev = void 0;
// Check if we're running in development mode
exports.dev = process.env.NODE_ENV === "development";
// Use the PORT environment variable if set, otherwise default to 3000
exports.port = process.env.PORT || 3000;
