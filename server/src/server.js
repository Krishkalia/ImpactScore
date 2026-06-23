"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.default)();
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            
            // Keep-alive ping to prevent Render/Railway free tier from sleeping
            const pingInterval = 14 * 60 * 1000; // 14 minutes
            setInterval(() => {
                const url = process.env.SERVER_URL || `http://localhost:${PORT}`;
                fetch(`${url}/health`)
                    .then(res => console.log(`Keep-alive ping successful: ${url}/health`))
                    .catch(err => console.error('Keep-alive ping failed:', err.message));
            }, pingInterval);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
