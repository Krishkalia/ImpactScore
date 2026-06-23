"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveSubscription = void 0;
const Subscription_1 = require("../models/Subscription");
const requireActiveSubscription = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const subscription = await Subscription_1.Subscription.findOne({ user: req.user._id, status: 'active' });
        if (!subscription) {
            return res.status(403).json({ message: 'Active subscription required' });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.requireActiveSubscription = requireActiveSubscription;
