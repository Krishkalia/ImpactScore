"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = exports.getUsersCount = exports.getUsers = exports.updateUser = exports.deleteUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const emailService_1 = require("../services/emailService");

const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m')
    });
    const refreshToken = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: (process.env.REFRESH_EXPIRES_IN || '7d')
    });
    return { accessToken, refreshToken };
};
const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
        const role = 'subscriber';
        const user = new User_1.User({ email, passwordHash, fullName, role });
        await user.save();
        const { accessToken, refreshToken } = generateTokens(user.id);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        };
        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.cookie('accessToken', accessToken, cookieOptions);
        res.status(201).json({
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            accessToken
        });
        
        // Send Welcome Email asynchronously
        (0, emailService_1.sendWelcomeEmail)(user).catch(err => console.error("Failed to send welcome email", err));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(user.id);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        };
        res.cookie('refreshToken', refreshToken, cookieOptions);
        res.cookie('accessToken', accessToken, cookieOptions);
        res.json({
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
            accessToken
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        const tokens = generateTokens(user.id);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        };
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        res.cookie('accessToken', tokens.accessToken, cookieOptions);
        res.json({
            accessToken: tokens.accessToken,
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
        });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
};
exports.refresh = refresh;
const logout = (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getUsersCount = async (req, res) => {
    try {
        const count = await User_1.User.countDocuments();
        res.json({ count });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users count' });
    }
};
exports.getUsersCount = getUsersCount;
const getUsers = async (req, res) => {
    try {
        const users = await User_1.User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};
exports.getUsers = getUsers;

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { golfScore, role, subscription } = req.body;
        
        const user = await User_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (golfScore !== undefined) user.golfScore = golfScore;
        if (role) user.role = role;
        if (subscription && subscription.status) {
            if (!user.subscription) user.subscription = {};
            user.subscription.status = subscription.status;
        }

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};
exports.updateUser = updateUser;

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
