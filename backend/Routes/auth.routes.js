const express = require("express");
const authController = require("../Controllers/auth.controller");
const {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    verifyEmailValidator,
    resendVerificationValidator,
} = require("../Validators/auth.validator");
const validationMiddleware = require("../Middleware/validation.middleware");
const { authenticate } = require("../Middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerValidator, validationMiddleware, authController.register);
router.post("/login", loginValidator, validationMiddleware, authController.login);
router.post("/refresh-token", authController.refresh);
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/logout", authController.logout);
router.post("/forgot-password", forgotPasswordValidator, validationMiddleware, authController.forgotPassword);
router.post("/reset-password", resetPasswordValidator, validationMiddleware, authController.resetPassword);
router.post("/verify-email", verifyEmailValidator, validationMiddleware, authController.verifyEmail);
router.post("/resend-verification", resendVerificationValidator, validationMiddleware, authController.resendVerificationEmail);

module.exports = router;