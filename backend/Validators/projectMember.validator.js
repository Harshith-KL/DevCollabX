const { body, param } = require("express-validator");

const inviteMemberValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("role")
        .optional()
        .isIn(["ADMIN", "MEMBER"])
        .withMessage("Role must be ADMIN or MEMBER"),
];

const acceptInvitationValidator = [
    param("invitationId")
        .trim()
        .notEmpty()
        .withMessage("Invitation ID is required"),
];

const removeMemberValidator = [
    param("projectId")
        .trim()
        .notEmpty()
        .withMessage("Project ID is required"),

    param("memberId")
        .trim()
        .notEmpty()
        .withMessage("Member ID is required"),
];

const updateMemberRoleValidator = [
    param("projectId")
        .trim()
        .notEmpty()
        .withMessage("Project ID is required"),

    param("memberId")
        .trim()
        .notEmpty()
        .withMessage("Member ID is required"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["ADMIN", "MEMBER"])
        .withMessage("Role must be ADMIN or MEMBER"),
];

module.exports = {
    inviteMemberValidator,
    acceptInvitationValidator,
    removeMemberValidator,
    updateMemberRoleValidator,
};
