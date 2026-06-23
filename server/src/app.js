"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
const score_routes_1 = __importDefault(require("./routes/score.routes"));
const charity_routes_1 = __importDefault(require("./routes/charity.routes"));
const draw_routes_1 = __importDefault(require("./routes/draw.routes"));
const winner_routes_1 = __importDefault(require("./routes/winner.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Webhook route must be before express.json()
app.use('/api/webhooks', webhook_routes_1.default);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/subscriptions', subscription_routes_1.default);
app.use('/api/scores', score_routes_1.default);
app.use('/api/charities', charity_routes_1.default);
app.use('/api/draws', draw_routes_1.default);
app.use('/api/winners', winner_routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
exports.default = app;
