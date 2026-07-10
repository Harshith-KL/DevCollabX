const bcrypt = require("bcryptjs");
const authRepository = require("../Repositories/auth.repository");
const ApiError = require("../Utils/ApiError");

const register = async(userData) => {
    const { email, password } = userData;
    const existingUser = await authRepository.findUserByEmail(email);
    if(existingUser) {
        throw new ApiError(409, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        ...userData,
        password: hashedPassword,
    };
    const createdUser = await authRepository.createUser(newUser);
    const userResponse = await authRepository.findUserById(createdUser._id);
        return userResponse;
};

module.exports = {
    register,
}