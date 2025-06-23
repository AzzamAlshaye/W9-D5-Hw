"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../config/jwt");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const tokenBlacklist_1 = require("../config/tokenBlacklist");
async function registerUser(email, password) {
    if (!email || !password) {
        throw new error_1.AppError("Email and password are required", http_status_1.BAD_REQUEST);
    }
    const existing = await user_model_1.UsersCollection.findOne({ email });
    if (existing) {
        throw new error_1.AppError("Email already in use", http_status_1.BAD_REQUEST);
    }
    const user = await user_model_1.UsersCollection.create({ email, password });
    const token = jsonwebtoken_1.default.sign({ sub: user._id }, jwt_1.jwtConfig.secret, jwt_1.jwtConfig.accessToken.options);
    return { token };
}
async function loginUser(email, password) {
    if (!email || !password) {
        throw new error_1.AppError("Email and password are required", http_status_1.BAD_REQUEST);
    }
    const user = (await user_model_1.UsersCollection.findOne({ email }).select("+password"));
    if (!user || !(await user.comparePassword(password))) {
        throw new error_1.AppError("Invalid credentials", http_status_1.UNAUTHORIZED);
    }
    const token = jsonwebtoken_1.default.sign({ sub: user._id }, jwt_1.jwtConfig.secret, jwt_1.jwtConfig.accessToken.options);
    return { token };
}
function logoutUser(authorizationHeader) {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new error_1.AppError("No token provided", http_status_1.UNAUTHORIZED);
    }
    const token = authorizationHeader.split(" ")[1];
    tokenBlacklist_1.tokenBlacklist.add(token);
}
