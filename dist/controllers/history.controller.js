"use strict";
// src/controllers/history.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const history_model_1 = require("../models/history.model");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const getHistory = async (req, res, next) => {
    try {
        const { limit, skip, sort, count } = req.query;
        // If ?count=true, just return the total
        if (count === "true") {
            const total = await history_model_1.HistoryCollection.countDocuments();
            res.status(http_status_1.OK).json({ total });
            return;
        }
        // Parse pagination & sorting
        const l = limit ? parseInt(limit, 10) : 10;
        const s = skip ? parseInt(skip, 10) : 0;
        const sortBy = sort || "-requestedAt";
        if (isNaN(l) || isNaN(s)) {
            throw new error_1.AppError("limit and skip must be valid numbers", http_status_1.BAD_REQUEST);
        }
        // Fetch the entries
        const entries = await history_model_1.HistoryCollection.find().sort(sortBy).skip(s).limit(l);
        res.status(http_status_1.OK).json(entries);
    }
    catch (err) {
        next(err);
    }
};
exports.getHistory = getHistory;
