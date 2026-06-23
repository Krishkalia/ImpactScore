"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWinnerAlert = exports.sendDrawPublishedEmail = exports.sendWelcomeEmail = void 0;
const nodemailer = require("nodemailer");

// Initialize transporter
// In production, configure this with real SMTP credentials from process.env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER || 'mock_user',
        pass: process.env.SMTP_PASS || 'mock_pass'
    }
});

// A helper to handle the actual sending or logging if credentials aren't set
const sendEmail = async (to, subject, text, html) => {
    const from = process.env.EMAIL_FROM || 'noreply@impactscore.com';
    
    // If we detect dummy config or missing keys, we just mock the send
    if (!process.env.SMTP_USER && !process.env.EMAIL_API_KEY) {
        console.log('\n================== EMAIL MOCK DISPATCH ==================');
        console.log(`To: ${to}`);
        console.log(`From: ${from}`);
        console.log(`Subject: ${subject}`);
        console.log(`\nBody:\n${text}`);
        console.log('=========================================================\n');
        return true;
    }

    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        });
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

const sendWelcomeEmail = async (user) => {
    const subject = 'Welcome to ImpactScore!';
    const text = `Hello ${user.fullName || 'Golfer'},\n\nWelcome to ImpactScore! We are thrilled to have you join our community.\n\nStart logging your Stableford scores and making a global charitable impact today.\n\nBest,\nThe ImpactScore Team`;
    
    return await sendEmail(user.email, subject, text, `<p>${text.replace(/\n/g, '<br/>')}</p>`);
};
exports.sendWelcomeEmail = sendWelcomeEmail;

const sendDrawPublishedEmail = async (users, draw) => {
    if (!users || users.length === 0) return;
    
    const subject = `Official Draw Results Published - ${new Date(draw.drawMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
    const bccList = users.map(u => u.email).join(','); // Send as BCC to protect privacy
    
    const text = `Hello ImpactScore Subscriber,\n\nThe official draw results for this month have been published!\n\nWinning Numbers: ${draw.winningNumbers.join(', ')}\nTotal Prize Pool: $${draw.prizePoolTotal.toLocaleString()}\n\nCheck your dashboard to see if you matched the sequence and won a prize.\n\nBest,\nThe ImpactScore Team`;

    return await sendEmail(bccList, subject, text, `<p>${text.replace(/\n/g, '<br/>')}</p>`);
};
exports.sendDrawPublishedEmail = sendDrawPublishedEmail;

const sendWinnerAlert = async (winnerUser, draw, matchType, amount) => {
    const subject = '🎉 Congratulations! You are a Winner!';
    const text = `Hello ${winnerUser.fullName || 'Golfer'},\n\nIncredible news! Your recent scores resulted in a ${matchType}-Number Match in the latest ImpactScore draw.\n\nYou have won: $${amount.toLocaleString(undefined, {minimumFractionDigits: 2})}\n\nPlease log in to your User Dashboard immediately to complete the winner verification process and claim your prize.\n\nBest,\nThe ImpactScore Team`;

    return await sendEmail(winnerUser.email, subject, text, `<p>${text.replace(/\n/g, '<br/>')}</p>`);
};
exports.sendWinnerAlert = sendWinnerAlert;
