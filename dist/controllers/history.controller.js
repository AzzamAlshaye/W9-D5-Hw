"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const history_service_1 = require("../service/history.service");
const http_status_1 = require("../utils/http-status");
const getHistory = async (req, res, next) => {
    try {
        const rawUserId = req.user?._id;
        if (req.query.count === "true") {
            const { userId } = (0, history_service_1.parseHistoryParams)({}, rawUserId);
            const total = await (0, history_service_1.getHistoryCount)(userId);
            res.status(http_status_1.OK).json({ total });
            return;
        }
        const params = (0, history_service_1.parseHistoryParams)(req.query, rawUserId);
        const entries = await (0, history_service_1.getHistoryEntries)(params);
        res.status(http_status_1.OK).json(entries);
    }
    catch (err) {
        next(err);
    }
};
exports.getHistory = getHistory;
