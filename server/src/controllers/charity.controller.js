"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVoluntaryDonation = exports.getMyCharityStats = exports.setMyCharity = exports.getCharityById = exports.getCharities = exports.createCharity = exports.updateCharity = exports.deleteCharity = void 0;
const Charity_1 = require("../models/Charity");
const Donation_1 = require("../models/Donation");
const Subscription_1 = require("../models/Subscription");
const User_1 = require("../models/User");
const stripe_1 = require("../config/stripe");
const getCharities = async (req, res) => {
    try {
        const charities = await Charity_1.Charity.find({ isActive: true }).sort({ isFeatured: -1, name: 1 });
        res.json(charities);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching charities' });
    }
};
exports.getCharities = getCharities;
const getCharityById = async (req, res) => {
    try {
        const charity = await Charity_1.Charity.findById(req.params.id);
        if (!charity || !charity.isActive) {
            return res.status(404).json({ message: 'Charity not found' });
        }
        res.json(charity);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching charity' });
    }
};
exports.getCharityById = getCharityById;
const setMyCharity = async (req, res) => {
    try {
        const { charityId, contributionPct } = req.body;
        if (contributionPct < 10) {
            return res.status(400).json({ message: 'Minimum contribution is 10%' });
        }
        const user = await User_1.User.findByIdAndUpdate(req.user._id, { charity: charityId, charityContributionPct: contributionPct }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating charity preference' });
    }
};
exports.setMyCharity = setMyCharity;

const getMyCharityStats = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user._id).populate('charity');
        if (!user || !user.charity) {
            return res.json({ charity: null, totalContributed: 0, contributionPct: 10 });
        }
        
        const donations = await Donation_1.Donation.find({ user: req.user._id, charity: user.charity._id });
        const totalContributed = donations.reduce((sum, d) => sum + d.amount, 0);
        
        res.json({
            charity: user.charity,
            totalContributed,
            contributionPct: user.charityContributionPct || 10
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching charity stats' });
    }
};
exports.getMyCharityStats = getMyCharityStats;

const createVoluntaryDonation = async (req, res) => {
    try {
        const { charityId, amount } = req.body;
        if (!charityId || typeof charityId !== 'string') {
            return res.status(400).json({ message: 'Invalid charity ID provided. Please refresh the page.' });
        }
        const charity = await Charity_1.Charity.findById(charityId);
        if (!charity) {
            return res.status(404).json({ message: 'Charity not found' });
        }

        const session = await stripe_1.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Donation to ${charity.name}`,
                            description: 'Direct voluntary donation',
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                charityId,
                userId: req.user ? req.user._id.toString() : 'anonymous',
                type: 'voluntary_donation'
            },
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?donation=success`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/charities?donation=cancelled`,
        });

        res.json({ url: session.url });
    }
    catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ message: error.message || 'Error creating donation' });
    }
};
exports.createVoluntaryDonation = createVoluntaryDonation;

const createCharity = async (req, res) => {
    try {
        const { name, description, targetAmount } = req.body;
        const imageUrl = req.file ? req.file.path : '/charity_placeholder.png';
        const charity = new Charity_1.Charity({ name, description, targetAmount, imageUrl });
        await charity.save();
        res.status(201).json(charity);
    } catch (error) {
        res.status(500).json({ message: 'Error creating charity' });
    }
};
exports.createCharity = createCharity;

const updateCharity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, targetAmount, isActive, isFeatured } = req.body;
        
        const updateData = { name, description, targetAmount, isActive, isFeatured };
        if (req.file) updateData.imageUrl = req.file.path;
        
        const charity = await Charity_1.Charity.findByIdAndUpdate(id, updateData, { new: true });
        if (!charity) {
            return res.status(404).json({ message: 'Charity not found' });
        }
        res.json(charity);
    } catch (error) {
        res.status(500).json({ message: 'Error updating charity' });
    }
};
exports.updateCharity = updateCharity;

const deleteCharity = async (req, res) => {
    try {
        const { id } = req.params;
        const charity = await Charity_1.Charity.findByIdAndDelete(id);
        if (!charity) {
            return res.status(404).json({ message: 'Charity not found' });
        }
        res.json({ message: 'Charity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting charity' });
    }
};
exports.deleteCharity = deleteCharity;
