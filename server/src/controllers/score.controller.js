"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteScore = exports.updateScore = exports.createScore = exports.getScores = void 0;
const Score_1 = require("../models/Score");
const getScores = async (req, res) => {
    try {
        const scores = await Score_1.Score.find({ user: req.user._id }).sort({ playedOn: -1 });
        res.json(scores);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching scores' });
    }
};
exports.getScores = getScores;
const createScore = async (req, res) => {
    try {
        const { value, playedOn } = req.body;
        if (value < 1 || value > 45) {
            return res.status(400).json({ message: 'Score must be between 1 and 45' });
        }
        const userId = req.user._id;
        const existingDate = await Score_1.Score.findOne({ user: userId, playedOn: new Date(playedOn) });
        if (existingDate) {
            return res.status(409).json({ message: 'A score for this date already exists. Please edit it instead.' });
        }
        const newScore = new Score_1.Score({ user: userId, value, playedOn: new Date(playedOn) });
        await newScore.save();
        const allScores = await Score_1.Score.find({ user: userId }).sort({ playedOn: 1 });
        if (allScores.length > 5) {
            const scoresToDelete = allScores.slice(0, allScores.length - 5);
            const idsToDelete = scoresToDelete.map(s => s._id);
            await Score_1.Score.deleteMany({ _id: { $in: idsToDelete } });
        }
        const updatedScores = await Score_1.Score.find({ user: userId }).sort({ playedOn: -1 });
        res.status(201).json(updatedScores);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating score' });
    }
};
exports.createScore = createScore;
const updateScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { value, playedOn } = req.body;
        if (value < 1 || value > 45) {
            return res.status(400).json({ message: 'Score must be between 1 and 45' });
        }
        const score = await Score_1.Score.findOneAndUpdate({ _id: id, user: req.user._id }, { value, playedOn: new Date(playedOn) }, { new: true });
        if (!score) {
            return res.status(404).json({ message: 'Score not found' });
        }
        res.json(score);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating score' });
    }
};
exports.updateScore = updateScore;
const deleteScore = async (req, res) => {
    try {
        const { id } = req.params;
        const score = await Score_1.Score.findOneAndDelete({ _id: id, user: req.user._id });
        if (!score) {
            return res.status(404).json({ message: 'Score not found' });
        }
        res.json({ message: 'Score deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting score' });
    }
};
exports.deleteScore = deleteScore;
