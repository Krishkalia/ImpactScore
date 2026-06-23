"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = exports.getMySubscription = exports.createCheckoutSession = void 0;
const stripe_1 = require("../config/stripe");
const Subscription_1 = require("../models/Subscription");

const getMySubscription = async (req, res) => {
    try {
        const sub = await Subscription_1.Subscription.findOne({ user: req.user._id });
        if (!sub) {
            return res.status(404).json({ message: 'No active subscription found' });
        }
        res.json(sub);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getMySubscription = getMySubscription;

const createCheckoutSession = async (req, res) => {
    try {
        const { planId } = req.body; // e.g. 'monthly' or 'yearly'
        const user = req.user;
        let stripeCustomerId = '';
        const existingSub = await Subscription_1.Subscription.findOne({ user: user._id });
        if (existingSub?.stripeCustomerId) {
            stripeCustomerId = existingSub.stripeCustomerId;
        }
        else {
            const customer = await stripe_1.stripe.customers.create({
                email: user.email,
                metadata: { userId: user._id.toString() }
            });
            stripeCustomerId = customer.id;
        }
        const priceId = planId === 'yearly' ? process.env.STRIPE_PRICE_ID_YEARLY : process.env.STRIPE_PRICE_ID_MONTHLY;
        if (!priceId) {
            return res.status(500).json({ message: 'Stripe price ID not configured' });
        }
        const session = await stripe_1.stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/subscribe`,
            metadata: { userId: user._id.toString(), plan: planId }
        });
        return res.json({ url: session.url });
    }
    catch (error) {
        console.error("Stripe Checkout/Customer Failed:", error.message);
        res.status(500).json({ message: 'Error creating checkout session. Please check your Stripe API keys.' });
    }
};
exports.createCheckoutSession = createCheckoutSession;

const verifySession = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) return res.status(400).json({ message: 'Session ID required' });
        
        const session = await stripe_1.stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === 'paid') {
            const user = req.user;
            let existingSub = await Subscription_1.Subscription.findOne({ user: user._id });
            const planId = session.metadata?.plan || 'monthly';
            if (existingSub) {
                existingSub.status = 'active';
                existingSub.plan = planId;
                await existingSub.save();
            } else {
                existingSub = await Subscription_1.Subscription.create({
                    user: user._id,
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: session.subscription,
                    plan: planId,
                    status: 'active',
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                });
            }
            return res.json(existingSub);
        }
        res.json({ status: 'pending' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.verifySession = verifySession;
