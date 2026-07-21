const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30m",
    NODE_ENV: process.env.NODE_ENV || "development",
    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    REFRESH_TOKEN_EXPIRES_IN_DAYS: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS) || 30,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
    APP_URL: process.env.APP_URL || "http://localhost:3000",
};