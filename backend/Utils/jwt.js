const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../Config/env");

const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

module.exports = {
    generateAccessToken,
    verifyAccessToken,
}