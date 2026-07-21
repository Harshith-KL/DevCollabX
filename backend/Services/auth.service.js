const bcrypt = require("bcryptjs");
const authRepository = require("../Repositories/user.repository");
const authTokenRepository = require("../Repositories/authToken.repository");
const ApiError = require("../Utils/ApiError");
const { BCRYPT_SALT_ROUNDS } = require("../Config/env");
const { generateAuthTokens, verifyRefreshToken, rotateRefreshToken, generateAccessTokenForUser, } = require("./token.service");
const refreshTokenRepository = require("../Repositories/refreshToken.repository");
const { generateSecureToken, hashToken } = require("../Utils/token.util");
const { sendPasswordResetEmail, sendVerificationEmail } = require("./email.service");

const register = async(userData, userAgent = "", ipAddress = "") => {
    const { email, password } = userData;
    const existingUser = await authRepository.findUserByEmail(email);
    if(existingUser) {
        throw new ApiError(409, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const newUser = {
        ...userData,
        password: hashedPassword,
    };
    const createdUser = await authRepository.createUser(newUser);
    const userResponse = await authRepository.findUserById(createdUser._id);

    await authTokenRepository.invalidateUserTokens(createdUser._id, "emailVerification");

    const verificationToken = generateSecureToken();
    const verificationTokenHash = hashToken(verificationToken);
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await authTokenRepository.createAuthToken({
        user: createdUser._id,
        type: "emailVerification",
        tokenHash: verificationTokenHash,
        expiresAt: verificationExpiresAt,
    });

    await sendVerificationEmail(createdUser.email, verificationToken, createdUser.firstName);

    const tokens = await generateAuthTokens(userResponse, userAgent, ipAddress);

    return {
        user: userResponse,
        ...tokens,
    };
};

const login = async(userData, userAgent = "", ipAddress = "") => {
    const {email, password} = userData;
    const user = await authRepository.findUserByEmailWithPassword(email);
    if(!user) {
        throw new ApiError(401, "Invalid Email or PAssword");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid Email or Password");
    }
    const userResponse = await authRepository.findUserById(user._id);
    
    const tokens = await generateAuthTokens(userResponse, userAgent, ipAddress);

    return {
        user: userResponse,
        ...tokens,
    };
};

const getCurrentUser = async(userId) => {
    const user = await authRepository.findUserById(userId);
    if(!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

const refresh = async (refreshToken) => {
    const session = await verifyRefreshToken(refreshToken);
    const user = await authRepository.findUserById(session.user);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = generateAccessTokenForUser(user);
    const newRefreshToken = await rotateRefreshToken(session);

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

const logout = async (refreshToken) => {
    const session = await verifyRefreshToken(refreshToken);
    await refreshTokenRepository.revokeRefreshToken(session._id);
    return;
};

const forgotPassword = async (email) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        return;
    }

    await authTokenRepository.invalidateUserTokens(user._id, "passwordReset");

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await authTokenRepository.createAuthToken({
        user: user._id,
        type: "passwordReset",
        tokenHash,
        expiresAt,
    });

    await sendPasswordResetEmail(user.email, rawToken, user.firstName);
    return;
};

const resetPassword = async (token, newPassword) => {
    const tokenHash = hashToken(token);
    const authToken = await authTokenRepository.findActiveTokenByHash(tokenHash, "passwordReset");

    if (!authToken) {
        throw new ApiError(400, "Invalid or expired password reset token");
    }

    const user = await authRepository.findUserById(authToken.user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await authRepository.updateUserById(user._id, { password: hashedPassword });
    await authTokenRepository.markAuthTokenAsUsed(authToken._id);
    await refreshTokenRepository.revokeAllUserRefreshTokens(user._id);

    return;
};

const verifyEmail = async (token) => {
    const tokenHash = hashToken(token);
    const authToken = await authTokenRepository.findActiveTokenByHash(tokenHash, "emailVerification");

    if (!authToken) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    const user = await authRepository.findUserById(authToken.user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isEmailVerified) {
        await authTokenRepository.markAuthTokenAsUsed(authToken._id);
        return;
    }

    await authRepository.updateUserById(user._id, { isEmailVerified: true });
    await authTokenRepository.markAuthTokenAsUsed(authToken._id);

    return;
};

const resendVerificationEmail = async (email) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
        return;
    }

    if (user.isEmailVerified) {
        throw new ApiError(409, "Email is already verified");
    }

    await authTokenRepository.invalidateUserTokens(user._id, "emailVerification");

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await authTokenRepository.createAuthToken({
        user: user._id,
        type: "emailVerification",
        tokenHash,
        expiresAt,
    });

    await sendVerificationEmail(user.email, rawToken, user.firstName);
    return;
};

module.exports = {
    register,
    login,
    getCurrentUser,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
}