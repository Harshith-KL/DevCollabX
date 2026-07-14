const { body } = require("express-validator");

const createProjectValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Project name must be between 3 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),
];

const updateProjectValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Project name must be between 3 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),
];

module.exports = {
    createProjectValidator,
    updateProjectValidator,
};