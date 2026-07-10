const express = require("express");
const authController = require("../Controllers/auth.controller");
const { registerValidator } = require("../Validators/auth.validator");
const validationMiddleware = require("../Middleware/validation.middleware");

const router = express.Router();

router.post("/register", registerValidator, validationMiddleware, authController.register);

module.exports = router;