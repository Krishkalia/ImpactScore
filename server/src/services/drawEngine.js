"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveSubscribersTickets = exports.generateWinningNumbers = void 0;
const Score_1 = require("../models/Score");
const Subscription_1 = require("../models/Subscription");
const User_1 = require("../models/User"); // Explicitly require to avoid MissingSchemaError
const generateWinningNumbers = async (logicType, bias) => {
    const numbers = new Set();
    if (logicType === 'random') {
        while (numbers.size < 5) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
    }
    else {
        // Algorithmic
        const allScores = await Score_1.Score.find();
        const frequencies = {};
        for (let i = 1; i <= 45; i++)
            frequencies[i] = 0;
        allScores.forEach(score => {
            frequencies[score.value]++;
        });
        let pool = [];
        for (let i = 1; i <= 45; i++) {
            let weight = frequencies[i];
            if (bias === 'favor_rare') {
                weight = Math.max(1, 100 - weight); // Inverse weighting roughly
            }
            else {
                weight = Math.max(1, weight); // Direct weighting
            }
            for (let j = 0; j < weight; j++) {
                pool.push(i);
            }
        }
        while (numbers.size < 5) {
            const randIndex = Math.floor(Math.random() * pool.length);
            numbers.add(pool[randIndex]);
            // Remove all instances of chosen number from pool to prevent duplicates
            const chosen = pool[randIndex];
            pool = pool.filter(n => n !== chosen);
        }
    }
    return Array.from(numbers).sort((a, b) => a - b);
};
exports.generateWinningNumbers = generateWinningNumbers;
const getActiveSubscribersTickets = async () => {
    const activeSubs = await Subscription_1.Subscription.find({ status: 'active' }).populate('user');
    const tickets = [];
    for (const sub of activeSubs) {
        const scores = await Score_1.Score.find({ user: sub.user }).sort({ playedOn: -1 }).limit(5);
        if (scores.length === 5) {
            tickets.push({
                user: sub.user,
                numbers: scores.map(s => s.value).sort((a, b) => a - b)
            });
        }
    }
    return tickets;
};
exports.getActiveSubscribersTickets = getActiveSubscribersTickets;
