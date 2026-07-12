const RefreshToken = require("../Models/refreshToken.model");

const createRefreshToken = async (refreshTokenData) => {
    return await RefreshToken.create(refreshTokenData);
};

const findRefreshToken = async (tokenHash) => {
    return await RefreshToken.findOne({
        tokenHash,
    });
};

const revokeRefreshToken = async (id) => {
    return await RefreshToken.findByIdAndUpdate(
        id,
        {
            isRevoked: true,
        },
        {
            new: true,
        }
    );
};

const revokeAllUserRefreshTokens = async (userId) => {
    return await RefreshToken.updateMany(
        {
            user: userId,
            isRevoked: false,
        },
        {
            isRevoked: true,
        }
    );
};

const deleteExpiredRefreshTokens = async () => {
    return await RefreshToken.deleteMany({
        expiresAt: {
            $lt: new Date(),
        },
    });
};

module.exports = {
    createRefreshToken,
    findRefreshToken,
    revokeRefreshToken,
    revokeAllUserRefreshTokens,
    deleteExpiredRefreshTokens,
};