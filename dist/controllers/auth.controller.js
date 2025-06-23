"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.signin = exports.signup = void 0;
const auth_service_1 = require("../service/auth.service");
const http_status_1 = require("../utils/http-status");
const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { token } = await (0, auth_service_1.registerUser)(email, password);
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
        const { token } = await (0, auth_service_1.loginUser)(email, password);
        res.status(http_status_1.OK).json({ token });
    }
    catch (err) {
        next(err);
    }
};
exports.signin = signin;
const signout = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        (0, auth_service_1.logoutUser)(authHeader);
        res.status(http_status_1.OK).json({ success: true, message: "Signed out successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.signout = signout;
