const express = require("express");
const authController = require("../Controllers/auth.controller");
const { registerValidator, loginValidator } = require("../Validators/auth.validator");
const validationMiddleware = require("../Middleware/validation.middleware");
const { authenticate } = require("../Middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerValidator, validationMiddleware, authController.register);
router.post("/login", loginValidator, validationMiddleware, authController.login);
router.post("/refresh-token", authController.refresh);
router.get("/me", authenticate, authController.getCurrentUser);
router.post("/logout", authController.logout);

module.exports = router;