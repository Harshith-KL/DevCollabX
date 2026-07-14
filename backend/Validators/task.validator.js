const { body } = require("express-validator");

const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required")
        .isLength({ min: 3, max: 200 })
        .withMessage("Task title must be between 3 and 200 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage("Description cannot exceed 5000 characters"),

    body("project")
        .notEmpty()
        .withMessage("Project is required")
        .isMongoId()
        .withMessage("Invalid project id"),

    body("assignee")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Invalid assignee id"),

    body("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
        .withMessage("Invalid priority"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid due date"),
];

const updateTaskValidator = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage("Task title must be between 3 and 200 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage("Description cannot exceed 5000 characters"),

    body("assignee")
        .optional({ nullable: true })
        .isMongoId()
        .withMessage("Invalid assignee id"),

    body("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
        .withMessage("Invalid priority"),

    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid due date"),
];

module.exports = {
    createTaskValidator,
    updateTaskValidator,
};