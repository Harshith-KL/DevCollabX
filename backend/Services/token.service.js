const crypto = require("crypto");
const refreshTokenRepository = require("../Repositories/refreshToken.repository");
const { REFRESH_TOKEN_EXPIRES_IN_DAYS, } = require("../Config/env");
const { generateAccessToken } = require("../Utils/jwt");
const ApiError = require("../Utils/ApiError");

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

const hashRefreshToken = (refreshToken) => {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
};

const generateAccessTokenForUser = (user) => {
    return generateAccessToken({
        userId: user._id,
        role: user.role,
    });
};

const createRefreshTokenSession = async (userId, userAgent = "", ipAddress = "") => {
    const refreshToken = generateRefreshToken();
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(
        expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS
    );

    await refreshTokenRepository.createRefreshToken({
        user: userId,
        tokenHash,
        expiresAt,
        userAgent,
        ipAddress,
    });

    return refreshToken;
};

const generateAuthTokens = async (user, userAgent = "", ipAddress = "") => {
    const accessToken = generateAccessTokenForUser(user);

    const refreshToken = await createRefreshTokenSession(user._id, userAgent, ipAddress);

    return {
        accessToken,
        refreshToken,
    };
};

const verifyRefreshToken = async (refreshToken) => {
    const tokenHash = hashRefreshToken(refreshToken);
    const session = await refreshTokenRepository.findRefreshToken(tokenHash);

    if (!session) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (session.isRevoked) {
        throw new ApiError(401, "Refresh token revoked");
    }

    if (session.expiresAt < new Date()) {
        throw new ApiError(401, "Refresh token expired");
    }

    return session;
};

const rotateRefreshToken = async (session) => {
    await refreshTokenRepository.revokeRefreshToken(session._id);

    return createRefreshTokenSession(
        session.user,
        session.userAgent,
        session.ipAddress
    );
};

module.exports = {
    createRefreshTokenSession,
    generateAuthTokens,
    verifyRefreshToken,
    rotateRefreshToken,
    generateAccessTokenForUser,
};