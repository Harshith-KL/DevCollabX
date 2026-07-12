const ApiError = require("../Utils/ApiError");

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)) {
            return next(
                new ApiError(403, "You are not authorized to access this resource")
            );
        }
        next();
    };
};

module.exports = {
    authorize,
}