const bcrypt = require("bcryptjs");
const authRepository = require("../Repositories/user.repository");
const ApiError = require("../Utils/ApiError");
const { BCRYPT_SALT_ROUNDS } = require("../Config/env");
const { generateAuthTokens, verifyRefreshToken, rotateRefreshToken, generateAccessTokenForUser, } = require("./token.service");
const refreshTokenRepository = require("../Repositories/refreshToken.repository");

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

module.exports = {
    register,
    login,
    getCurrentUser,
    refresh,
    logout,
}