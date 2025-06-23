"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHistoryParams = parseHistoryParams;
exports.getHistoryCount = getHistoryCount;
exports.getHistoryEntries = getHistoryEntries;
// src/services/history.service.ts
const history_model_1 = require("../models/history.model");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const mongoose_1 = require("mongoose");
function parseHistoryParams(params, rawUserId) {
    const l = params.limit ? parseInt(params.limit, 10) : 10;
    const s = params.skip ? parseInt(params.skip, 10) : 0;
    const sortBy = params.sort ?? "-requestedAt";
    if (isNaN(l) || isNaN(s)) {
        throw new error_1.AppError("limit and skip must be valid numbers", http_status_1.BAD_REQUEST);
    }
    if (!rawUserId || !mongoose_1.Types.ObjectId.isValid(rawUserId)) {
        throw new error_1.AppError("Invalid or missing user id", http_status_1.BAD_REQUEST);
    }
    return { limit: l, skip: s, sortBy, userId: new mongoose_1.Types.ObjectId(rawUserId) };
}
async function getHistoryCount(userId) {
    return history_model_1.HistoryCollection.countDocuments({ user: userId });
}
async function getHistoryEntries(opts) {
    return history_model_1.HistoryCollection.find({ user: opts.userId })
        .sort(opts.sortBy)
        .skip(opts.skip)
        .limit(opts.limit)
        .exec();
}
