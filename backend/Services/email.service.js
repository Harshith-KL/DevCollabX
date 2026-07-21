const nodemailer = require("nodemailer");
const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_FROM,
    APP_URL,
} = require("../Config/env");

const createTransporter = () => {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        return null;
    }
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
};

const transporter = createTransporter();

const sendEmail = async ({ to, subject, html, text }) => {
    if (!transporter) {
        console.info(`[EMAIL] ${subject} to ${to}`);
        console.info(text || html);
        return;
    }

    await transporter.sendMail({
        from: EMAIL_FROM || SMTP_USER,
        to,
        subject,
        html,
        text,
    });
};

const sendPasswordResetEmail = async (email, token, firstName = "") => {
    const resetUrl = `${APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    const subject = "Reset your DevCollabX password";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Hello ${firstName || "there"},</p>
            <p>We received a request to reset your password. Click the button below to continue.</p>
            <p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                    Reset Password
                </a>
            </p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
    `;

    const text = `Hello ${firstName || "there"},\n\nWe received a request to reset your password. Use this link to continue: ${resetUrl}`;

    await sendEmail({
        to: email,
        subject,
        html,
        text,
    });
};

const sendVerificationEmail = async (email, token, firstName = "") => {
    const verificationUrl = `${APP_URL || "http://localhost:3000"}/verify-email?token=${token}`;
    const subject = "Verify your DevCollabX email";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email Address</h2>
            <p>Hello ${firstName || "there"},</p>
            <p>Welcome to DevCollabX. Please verify your email address to activate your account.</p>
            <p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 12px 20px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px;">
                    Verify Email
                </a>
            </p>
        </div>
    `;

    const text = `Hello ${firstName || "there"},\n\nPlease verify your email address using this link: ${verificationUrl}`;

    await sendEmail({
        to: email,
        subject,
        html,
        text,
    });
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
};
