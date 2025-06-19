"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../config/jwt");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const authorized = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw new error_1.AppError("You are not logged in", http_status_1.UNAUTHORIZED);
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
        // 3) Check if user still exists
        const user = await user_model_1.UsersCollection.findById(decoded.sub);
        if (!user) {
            throw new error_1.AppError("User no longer exists", http_status_1.UNAUTHORIZED);
        }
        // 4) Grant access
        req.user = user;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new error_1.AppError("Token has expired", http_status_1.UNAUTHORIZED));
        }
        else {
            next(new error_1.AppError("Invalid token", http_status_1.UNAUTHORIZED));
        }
    }
};
exports.authorized = authorized;
