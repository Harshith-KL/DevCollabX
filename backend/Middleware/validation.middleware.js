const { validationResult } = require("express-validator");
const ApiError = require("../Utils/ApiError");

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.path,
            message: error.msg,
        }));
        return next(
            new ApiError(
                400,
                "Validation failed",
                formattedErrors
            )
        );
    }
    next();
};

module.exports = validationMiddleware;