"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrizePool = void 0;
const Subscription_1 = require("../models/Subscription");
const PlatformSetting_1 = require("../models/PlatformSetting");
const calculatePrizePool = async () => {
    const activeSubs = await Subscription_1.Subscription.find({ status: 'active' });
    // Get pool contribution percentage
    const setting = await PlatformSetting_1.PlatformSetting.findOne({ key: 'poolContributionPct' });
    const poolContributionPct = setting ? setting.value : 50; // Default 50%
    
    // Sum the exact amounts from active subscriptions based on their plan
    let totalCollected = 0;
    activeSubs.forEach(sub => {
        if (sub.plan === 'yearly') {
            totalCollected += 100;
        } else {
            totalCollected += 10; // monthly or default
        }
    });
    
    const totalPool = totalCollected * (poolContributionPct / 100);
    return totalPool;
};
exports.calculatePrizePool = calculatePrizePool;
