const projectMemberService = require("../Services/projectMember.service");
const ApiResponse = require("../Utils/ApiResponse");
const asyncHandler = require("../Utils/asyncHandler");

const inviteMember = asyncHandler(async (req, res) => {
    const invitation = await projectMemberService.inviteMember(
        req.params.projectId,
        req.user.userId,
        req.body
    );

    return res.status(201).json(
        new ApiResponse(201, "Invitation sent successfully", invitation)
    );
});

const acceptInvitation = asyncHandler(async (req, res) => {
    await projectMemberService.acceptInvitation(req.params.invitationId, req.user.userId);

    return res.status(200).json(
        new ApiResponse(200, "Invitation accepted successfully")
    );
});

const removeMember = asyncHandler(async (req, res) => {
    await projectMemberService.removeMember(
        req.params.projectId,
        req.user.userId,
        req.params.memberId
    );

    return res.status(200).json(
        new ApiResponse(200, "Member removed successfully")
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
    await projectMemberService.updateMemberRole(
        req.params.projectId,
        req.user.userId,
        req.params.memberId,
        req.body.role
    );

    return res.status(200).json(
        new ApiResponse(200, "Member role updated successfully")
    );
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const result = await projectMemberService.getProjectMembers(
        req.params.projectId,
        req.user.userId
    );

    return res.status(200).json(
        new ApiResponse(200, "Project members fetched successfully", result)
    );
});

module.exports = {
    inviteMember,
    acceptInvitation,
    removeMember,
    updateMemberRole,
    getProjectMembers,
};
