const AuthToken = require("../Models/authToken.model");

const createAuthToken = async (tokenData) => {
    return await AuthToken.create(tokenData);
};

const findActiveTokenByHash = async (tokenHash, type) => {
    return await AuthToken.findOne({
        tokenHash,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() },
    });
};

const markAuthTokenAsUsed = async (id) => {
    return await AuthToken.findByIdAndUpdate(
        id,
        { isUsed: true },
        { new: true }
    );
};

const invalidateUserTokens = async (userId, type) => {
    return await AuthToken.updateMany(
        {
            user: userId,
            type,
            isUsed: false,
        },
        {
            isUsed: true,
        }
    );
};

const deleteExpiredTokens = async () => {
    return await AuthToken.deleteMany({
        expiresAt: { $lt: new Date() },
    });
};

module.exports = {
    createAuthToken,
    findActiveTokenByHash,
    markAuthTokenAsUsed,
    invalidateUserTokens,
    deleteExpiredTokens,
};
