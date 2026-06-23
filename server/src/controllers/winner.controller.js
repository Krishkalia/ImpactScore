"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyWinnings = exports.uploadProof = exports.getAllWinners = exports.verifyWinner = void 0;
const Winner_1 = require("../models/Winner");
const uploadProof = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        const proofUrl = req.file.path;
        const winner = await Winner_1.Winner.findOneAndUpdate({ _id: id, user: req.user._id }, { proofUrl, verificationStatus: 'pending' }, { new: true });
        if (!winner) {
            return res.status(404).json({ message: 'Winner record not found' });
        }
        res.json(winner);
    }
    catch (error) {
        res.status(500).json({ message: 'Error uploading proof' });
    }
};
exports.uploadProof = uploadProof;
const getMyWinnings = async (req, res) => {
    try {
        const winnings = await Winner_1.Winner.find({ user: req.user._id }).populate('draw');
        res.json(winnings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching winnings' });
    }
};
exports.getMyWinnings = getMyWinnings;
const getAllWinners = async (req, res) => {
    try {
        const winners = await Winner_1.Winner.find().populate('user', 'name email').populate('draw', 'drawMonth');
        res.json(winners);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching winners' });
    }
};
exports.getAllWinners = getAllWinners;
const verifyWinner = async (req, res) => {
    try {
        const { id } = req.params;
        const { verificationStatus, paymentStatus } = req.body;
        const winner = await Winner_1.Winner.findByIdAndUpdate(id, { verificationStatus, paymentStatus }, { new: true });
        if (!winner) {
            return res.status(404).json({ message: 'Winner not found' });
        }
        res.json(winner);
    }
    catch (error) {
        res.status(500).json({ message: 'Error verifying winner' });
    }
};
exports.verifyWinner = verifyWinner;
