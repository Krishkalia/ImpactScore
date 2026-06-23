"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/refresh', auth_controller_1.refresh);
router.post('/logout', auth_controller_1.logout);

const auth_1 = require("../middleware/auth");
router.get('/users/count', auth_1.requireAuth, auth_1.requireAdmin, auth_controller_1.getUsersCount);
router.get('/users', auth_1.requireAuth, auth_1.requireAdmin, auth_controller_1.getUsers);
router.put('/users/:id', auth_1.requireAuth, auth_1.requireAdmin, auth_controller_1.updateUser);
router.delete('/users/:id', auth_1.requireAuth, auth_1.requireAdmin, auth_controller_1.deleteUser);

exports.default = router;
