const authService = require("../Services/auth.service");
const ApiResponse = require("../Utils/ApiResponse");
const asyncHandler = require("../Utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            user
        )
    );
});

module.exports = {
    register,
};