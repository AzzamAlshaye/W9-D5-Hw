"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// POST /auth/signup
router.post("/signup", auth_controller_1.signup);
// POST /auth/signin
router.post("/signin", auth_controller_1.signin);
// POST /auth/signout  (requires valid JWT)
router.post("/signout", auth_middleware_1.authorized, auth_controller_1.signout);
exports.default = router;
