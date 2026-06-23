"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminAlerts = exports.getAdminDraws = exports.getDraws = exports.publishDraw = exports.simulateDraw = void 0;
const Draw_1 = require("../models/Draw");
const Subscription_1 = require("../models/Subscription");
const DrawTicket_1 = require("../models/DrawTicket");
const Winner_1 = require("../models/Winner");
const User_1 = require("../models/User");
const drawEngine_1 = require("../services/drawEngine");
const prizePoolCalculator_1 = require("../services/prizePoolCalculator");
const emailService_1 = require("../services/emailService");

const simulateDraw = async (req, res) => {
    try {
        const { logicType = 'random', algorithmicBias = 'favor_frequent' } = req.body || {};
        const winningNumbers = await (0, drawEngine_1.generateWinningNumbers)(logicType, algorithmicBias);
        const prizePoolTotal = await (0, prizePoolCalculator_1.calculatePrizePool)();
        // Add rollover if any
        const lastDraw = await Draw_1.Draw.findOne({ status: 'published' }).sort({ drawMonth: -1 });
        const rollover = lastDraw ? lastDraw.jackpotRollover : 0;
        const finalPoolTotal = prizePoolTotal + rollover;
        const tickets = await (0, drawEngine_1.getActiveSubscribersTickets)();
        const evaluatedTickets = [];
        let matchCounts = { 3: 0, 4: 0, 5: 0 };
        tickets.forEach(ticket => {
            const uniqueNumbers = [...new Set(ticket.numbers)];
            const match = uniqueNumbers.filter(n => winningNumbers.includes(n)).length;
            evaluatedTickets.push({
                user: ticket.user,
                numbers: ticket.numbers,
                matchCount: match
            });
            if (match >= 3) {
                matchCounts[match]++;
            }
        });
        const poolByTier = {
            fiveMatch: finalPoolTotal * 0.40,
            fourMatch: finalPoolTotal * 0.35,
            threeMatch: finalPoolTotal * 0.25
        };
        const nextRollover = matchCounts[5] === 0 ? poolByTier.fiveMatch : 0;
        const simulationResult = {
            winningNumbers,
            prizePoolTotal: finalPoolTotal,
            rolloverIncluded: rollover,
            poolByTier,
            matchCounts,
            nextRollover,
            evaluatedTickets
        };
        const draw = new Draw_1.Draw({
            drawMonth: new Date(),
            logicType,
            algorithmicBias,
            status: 'simulated',
            winningNumbers,
            prizePoolTotal: finalPoolTotal,
            poolByTier,
            jackpotRollover: nextRollover,
            simulationResult
        });
        await draw.save();
        res.json(draw);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error simulating draw: ' + error.message });
    }
};
exports.simulateDraw = simulateDraw;
const publishDraw = async (req, res) => {
    try {
        const { id } = req.params;
        const draw = await Draw_1.Draw.findById(id);
        if (!draw || draw.status !== 'simulated') {
            return res.status(400).json({ message: 'Draw not found or already published' });
        }
        draw.status = 'published';
        draw.publishedAt = new Date();
        draw.runByAdmin = req.user._id;
        await draw.save();
        const tickets = draw.simulationResult.evaluatedTickets || [];
        const winnersToCreate = [];
        const ticketsToCreate = [];
        for (const ticket of tickets) {
            const matchCount = ticket.matchCount;
            ticketsToCreate.push({
                draw: draw._id,
                user: ticket.user,
                numbers: ticket.numbers,
                matchCount
            });
            if (matchCount >= 3) {
                let prizeAmount = 0;
                if (matchCount === 5)
                    prizeAmount = draw.poolByTier.fiveMatch / draw.simulationResult.matchCounts[5];
                if (matchCount === 4)
                    prizeAmount = draw.poolByTier.fourMatch / draw.simulationResult.matchCounts[4];
                if (matchCount === 3)
                    prizeAmount = draw.poolByTier.threeMatch / draw.simulationResult.matchCounts[3];
                winnersToCreate.push({
                    draw: draw._id,
                    user: ticket.user,
                    matchType: matchCount,
                    prizeAmount,
                    verificationStatus: 'pending',
                    paymentStatus: 'pending'
                });
            }
        }
        await DrawTicket_1.DrawTicket.insertMany(ticketsToCreate);
        if (winnersToCreate.length > 0) {
            await Winner_1.Winner.insertMany(winnersToCreate);
            
            // Dispatch Winner Alerts asynchronously
            winnersToCreate.forEach(w => {
                (0, emailService_1.sendWinnerAlert)(w.user, draw, w.matchType, w.prizeAmount)
                    .catch(err => console.error("Failed to send winner alert", err));
            });
        }
        
        // Notify all active users that the draw was published
        const activeUsers = tickets.map(t => t.user);
        if (activeUsers.length > 0) {
            (0, emailService_1.sendDrawPublishedEmail)(activeUsers, draw)
                .catch(err => console.error("Failed to send draw published email", err));
        }

        res.json(draw);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error publishing draw' });
    }
};
exports.publishDraw = publishDraw;
const getDraws = async (req, res) => {
    try {
        const draws = await Draw_1.Draw.find({ status: 'published' }).sort({ drawMonth: -1 });
        res.json(draws);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching draws' });
    }
};
exports.getDraws = getDraws;
const getAdminDraws = async (req, res) => {
    try {
        const draws = await Draw_1.Draw.find().sort({ drawMonth: -1 });
        res.json(draws);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching admin draws' });
    }
};
exports.getAdminDraws = getAdminDraws;

const getAdminAlerts = async (req, res) => {
    try {
        const alerts = [];
        
        // Find pending winner verifications
        const pendingWinners = await Winner_1.Winner.find({ verificationStatus: 'pending' }).populate('user', 'name');
        pendingWinners.forEach(winner => {
            alerts.push({
                id: winner._id,
                type: 'Winner Verification Required',
                message: `User ${winner.user ? winner.user.name : 'Unknown'} uploaded screenshot proof for winnings. Review pending.`,
                time: winner.updatedAt,
                severity: 'high'
            });
        });

        // Find failed subscriptions
        const failedSubs = await Subscription_1.Subscription.find({ status: 'lapsed' });
        if (failedSubs.length > 0) {
            alerts.push({
                id: 'failed_subs',
                type: 'Subscription Lapsed',
                message: `${failedSubs.length} subscription renewals failed payment.`,
                time: new Date(), 
                severity: 'warning'
            });
        }
        
        alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts' });
    }
};
exports.getAdminAlerts = getAdminAlerts;
