"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config"); // load .env first
const dotenv_1 = __importDefault(require("dotenv")); // optional if you prefer dotenv.config()
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./utils/logger"));
const helpers_1 = require("./utils/helpers");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const history_routes_1 = __importDefault(require("./routes/history.routes"));
const weather_routes_1 = __importDefault(require("./routes/weather.routes"));
const database_1 = require("./config/database");
const http_status_1 = require("./utils/http-status");
const error_middleware_1 = require("./middleware/error.middleware");
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, database_1.connectDB)();
// Create Express app
const app = (0, express_1.default)();
// ─── Middleware ────────────────────────────────────────────────────────────────
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("tiny", {
    stream: { write: (message) => logger_1.default.info(message.trim()) },
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ─── Routes ────────────────────────────────────────────────────────────────────
// Make sure this comes *after* express.json() and *before* your error handler
app.use("/auth", user_routes_1.default);
//weather endpoint
// **this line is required** for GET /weather
app.use("/weather", weather_routes_1.default);
//history endpoint
app.use("/history", history_routes_1.default);
app.use(error_middleware_1.errorHandler);
// Health check
app.get("/", (_req, res) => {
    res.status(http_status_1.OK).json({ message: "API is running!" });
});
// ─── Error Handling ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    logger_1.default.error("Error:", err.message);
    res.status(http_status_1.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong!",
        error: helpers_1.dev ? err.message : undefined,
    });
});
// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(helpers_1.port, () => {
    logger_1.default.info(`Server is running on port ${helpers_1.port}`);
});
