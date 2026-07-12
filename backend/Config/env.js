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
};