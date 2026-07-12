const User = require("../Models/user.model");

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const createUser = async (userData) => {
    return await User.create(userData);
};

const findUserById = async (userId) => {
    return await User.findById(userId);
};

const findUserByEmailWithPassword = async(email) => {
    return await User.findOne({email}).select("+password")
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
    findUserByEmailWithPassword,
};