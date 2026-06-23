"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const webhook_controller_1 = require("../controllers/webhook.controller");
const router = (0, express_1.Router)();
// Stripe needs the raw body to verify the signature
router.post('/stripe', express_2.default.raw({ type: 'application/json' }), webhook_controller_1.handleStripeWebhook);
exports.default = router;
