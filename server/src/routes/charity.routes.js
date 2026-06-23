"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const charity_controller_1 = require("../controllers/charity.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', charity_controller_1.getCharities);
router.get('/:id', charity_controller_1.getCharityById);
router.put('/me', auth_1.requireAuth, charity_controller_1.setMyCharity);
router.get('/me/stats', auth_1.requireAuth, charity_controller_1.getMyCharityStats);
router.post('/donations', auth_1.requireAuth, charity_controller_1.createVoluntaryDonation); // Assuming logged in users for voluntary donations mostly, can adjust to optional auth if needed
const upload_1 = require("../middleware/upload");

router.post('/', auth_1.requireAuth, auth_1.requireAdmin, upload_1.upload.single('image'), charity_controller_1.createCharity);
router.put('/:id', auth_1.requireAuth, auth_1.requireAdmin, upload_1.upload.single('image'), charity_controller_1.updateCharity);
router.delete('/:id', auth_1.requireAuth, auth_1.requireAdmin, charity_controller_1.deleteCharity);

exports.default = router;
