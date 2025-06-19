"use strict";
// src/routes/history.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const history_controller_1 = require("../controllers/history.controller");
const router = (0, express_1.Router)();
// GET /history?limit=10&skip=0&sort=-requestedAt
// GET /history?count=true
router.get("/", auth_middleware_1.authorized, history_controller_1.getHistory);
exports.default = router;
