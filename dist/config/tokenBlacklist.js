"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenBlacklist = void 0;
// src/config/tokenBlacklist.ts
/**
 * A simple in-memory store of revoked JWTs.
 * In production you’d use Redis or a DB with expiry instead.
 */
exports.tokenBlacklist = new Set();
