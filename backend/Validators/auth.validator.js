const { body } = require("express-validator");

const registerValidator = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be between 2 and 30 characters"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 1, max: 30 })
        .withMessage("Last name must be between 1 and 30 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be between 6 and 20 characters"),
];

module.exports = {
    registerValidator,
};