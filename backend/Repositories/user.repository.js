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

const updateUserById = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

const updateUserByEmail = async (email, updateData) => {
    return await User.findOneAndUpdate({ email }, updateData, { new: true });
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
    findUserByEmailWithPassword,
    updateUserById,
    updateUserByEmail,
};