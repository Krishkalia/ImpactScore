"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const winner_controller_1 = require("../controllers/winner.controller");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get('/me', winner_controller_1.getMyWinnings);
router.post('/:id/proof', upload_1.upload.single('proof'), winner_controller_1.uploadProof);
router.get('/admin', auth_1.requireAdmin, winner_controller_1.getAllWinners);
router.put('/admin/:id/verify', auth_1.requireAdmin, winner_controller_1.verifyWinner);

exports.default = router;
