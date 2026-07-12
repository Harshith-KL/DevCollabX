const ApiError = require("../Utils/ApiError");
const { verifyAccessToken } = require("../Utils/jwt");

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(
            new ApiError(401, "Access token is required")
        );
    }

    if (!authHeader.startsWith("Bearer ")) {
        return next(
            new ApiError(401, "Invalid authorization format")
        );
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return next(
            new ApiError(401, "Invalid or expired access token")
        );
    }
};

module.exports = {
    authenticate,
};