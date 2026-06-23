"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = void 0;
const stripe_1 = require("../config/stripe");
const Subscription_1 = require("../models/Subscription");
const Donation_1 = require("../models/Donation");

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                if (session.mode === 'subscription' && session.metadata?.userId) {
                    await Subscription_1.Subscription.findOneAndUpdate({ user: session.metadata.userId }, {
                        status: 'active',
                        plan: session.metadata.plan || 'monthly',
                        stripeCustomerId: session.customer,
                        stripeSubscriptionId: session.subscription,
                    }, { upsert: true, new: true });
                } else if (session.mode === 'payment' && session.metadata?.type === 'voluntary_donation') {
                    // Record one-time voluntary donation
                    const donation = new Donation_1.Donation({
                        user: session.metadata.userId === 'anonymous' ? undefined : session.metadata.userId,
                        charity: session.metadata.charityId,
                        amount: session.amount_total / 100, // Convert from cents
                        source: 'voluntary',
                        stripePaymentIntentId: session.payment_intent
                    });
                    await donation.save();
                }
                break;
            }
            case 'invoice.paid': {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    const subscription = await stripe_1.stripe.subscriptions.retrieve(invoice.subscription);
                    await Subscription_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: invoice.subscription }, {
                        status: 'active',
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        renewalDate: new Date(subscription.current_period_end * 1000)
                    });
                }
                break;
            }
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                if (invoice.subscription) {
                    await Subscription_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: invoice.subscription }, { status: 'lapsed' });
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                await Subscription_1.Subscription.findOneAndUpdate({ stripeSubscriptionId: subscription.id }, { status: 'cancelled' });
                break;
            }
        }
    }
    catch (error) {
        console.error('Webhook handler failed', error);
    }
    res.status(200).json({ received: true });
};
exports.handleStripeWebhook = handleStripeWebhook;
