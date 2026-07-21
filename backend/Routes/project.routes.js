const express = require("express");
const projectController = require("../Controllers/project.controller");
const projectMemberController = require("../Controllers/projectMember.controller");
const { createProjectValidator, updateProjectValidator, } = require("../Validators/project.validator");
const {
    inviteMemberValidator,
    acceptInvitationValidator,
    removeMemberValidator,
    updateMemberRoleValidator,
} = require("../Validators/projectMember.validator");
const validationMiddleware = require("../Middleware/validation.middleware");
const { authenticate } = require("../Middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createProjectValidator, validationMiddleware, projectController.createProject);
router.get("/", authenticate, projectController.getMyProjects);
router.get("/:id", authenticate, projectController.getProjectById);
router.patch("/:id", authenticate, updateProjectValidator, validationMiddleware, projectController.updateProject);
router.delete("/:id", authenticate, projectController.deleteProject);
router.post(
    "/:projectId/invite",
    authenticate,
    inviteMemberValidator,
    validationMiddleware,
    projectMemberController.inviteMember
);
router.post(
    "/invitations/:invitationId/accept",
    authenticate,
    acceptInvitationValidator,
    validationMiddleware,
    projectMemberController.acceptInvitation
);
router.delete(
    "/:projectId/members/:memberId",
    authenticate,
    removeMemberValidator,
    validationMiddleware,
    projectMemberController.removeMember
);
router.patch(
    "/:projectId/members/:memberId/role",
    authenticate,
    updateMemberRoleValidator,
    validationMiddleware,
    projectMemberController.updateMemberRole
);
router.get(
    "/:projectId/members",
    authenticate,
    projectMemberController.getProjectMembers
);

module.exports = router;