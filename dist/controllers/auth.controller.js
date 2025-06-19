"use strict";
// src/controllers/auth.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../config/jwt");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const tokenBlacklist_1 = require("../config/tokenBlacklist");
const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new error_1.AppError("Email and password are required", http_status_1.BAD_REQUEST);
        }
        const existing = await user_model_1.UsersCollection.findOne({ email });
        if (existing) {
            throw new error_1.AppError("Email already in use", http_status_1.BAD_REQUEST);
        }
        const user = await user_model_1.UsersCollection.create({ email, password });
        const token = jsonwebtoken_1.default.sign({ sub: user._id }, jwt_1.jwtConfig.secret, jwt_1.jwtConfig.accessToken.options);
        res.status(http_status_1.CREATED).json({ token });
    }
    catch (err) {
        next(err);
    }
};
exports.signup = signup;
const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new error_1.AppError("Email and password are required", http_status_1.BAD_REQUEST);
        }
        const user = await user_model_1.UsersCollection.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            throw new error_1.AppError("Invalid credentials", http_status_1.UNAUTHORIZED);
        }
        const token = jsonwebtoken_1.default.sign({ sub: user._id }, jwt_1.jwtConfig.secret, jwt_1.jwtConfig.accessToken.options);
        res.status(http_status_1.OK).json({ token });
    }
    catch (err) {
        next(err);
    }
};
exports.signin = signin;
const signout = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new error_1.AppError("No token provided", http_status_1.UNAUTHORIZED);
        }
        const token = authHeader.split(" ")[1];
        tokenBlacklist_1.tokenBlacklist.add(token);
        res.status(http_status_1.OK).json({ success: true, message: "Signed out successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.signout = signout;
