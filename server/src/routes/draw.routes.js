"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const draw_controller_1 = require("../controllers/draw.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', draw_controller_1.getDraws);
// Admin routes
router.get('/admin', auth_1.requireAuth, auth_1.requireAdmin, draw_controller_1.getAdminDraws);
router.get('/admin/alerts', auth_1.requireAuth, auth_1.requireAdmin, draw_controller_1.getAdminAlerts);
router.post('/simulate', auth_1.requireAuth, auth_1.requireAdmin, draw_controller_1.simulateDraw);
router.post('/publish/:id', auth_1.requireAuth, auth_1.requireAdmin, draw_controller_1.publishDraw);
exports.default = router;
