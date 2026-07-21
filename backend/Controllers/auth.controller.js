const authService = require("../Services/auth.service");
const ApiResponse = require("../Utils/ApiResponse");
const ApiError = require("../Utils/ApiError");
const asyncHandler = require("../Utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body, req.get("user-agent"), req.ip);
    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully",
            user
        )
    );
});

const login = asyncHandler(async (req, res) => {
    const user = await authService.login(req.body, req.get("user-agent"), req.ip);
    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful",
            user
        )
    );
});

const getCurrentUser = asyncHandler(async(req, res) => {
    const user = await authService.getCurrentUser(req.user.userId);
    return res.status(200).json(
        new ApiResponse(
            200,
            "Current user fetched successfully",
            user
        )
    );
});

const refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }
    const tokens = await authService.refresh(refreshToken);
    return res.status(200).json(
        new ApiResponse(
            200,
            "Token refreshed successfully",
            tokens
        )
    );
});

const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }
    await authService.logout(refreshToken);
    return res.status(200).json(
        new ApiResponse(
            200,
            "Logged out successfully"
        )
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    return res.status(200).json(
        new ApiResponse(
            200,
            "If an account exists for that email, a password reset link has been sent"
        )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    return res.status(200).json(
        new ApiResponse(
            200,
            "Password reset successfully"
        )
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;
    await authService.verifyEmail(token);
    return res.status(200).json(
        new ApiResponse(
            200,
            "Email verified successfully"
        )
    );
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.resendVerificationEmail(email);
    return res.status(200).json(
        new ApiResponse(
            200,
            "Verification email sent successfully"
        )
    );
});

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
};