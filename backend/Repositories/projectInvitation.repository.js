const ProjectInvitation = require("../Models/projectInvitation.model");
const { PROJECT_INVITATION_STATUS } = require("../Constants/project.constants");

const createInvitation = async (invitationData) => {
    return ProjectInvitation.create(invitationData);
};

const findActiveInvitation = async (projectId, invitedUserId) => {
    return ProjectInvitation.findOne({
        project: projectId,
        invitedUser: invitedUserId,
        status: PROJECT_INVITATION_STATUS.PENDING,
        deletedAt: null,
        expiresAt: { $gt: new Date() },
    });
};

const findInvitationById = async (invitationId) => {
    return ProjectInvitation.findById(invitationId)
        .populate("project", "name owner")
        .populate("invitedBy", "firstName lastName email")
        .populate("invitedUser", "firstName lastName email");
};

const updateInvitationStatus = async (invitationId, updateData) => {
    return ProjectInvitation.findByIdAndUpdate(invitationId, updateData, { new: true });
};

const softDeleteInvitation = async (invitationId) => {
    return ProjectInvitation.findByIdAndUpdate(
        invitationId,
        { deletedAt: new Date() },
        { new: true }
    );
};

const findProjectInvitations = async (projectId) => {
    return ProjectInvitation.find({
        project: projectId,
        deletedAt: null,
    })
        .populate("invitedBy", "firstName lastName email")
        .populate("invitedUser", "firstName lastName email")
        .sort({ createdAt: -1 });
};

module.exports = {
    createInvitation,
    findActiveInvitation,
    findInvitationById,
    updateInvitationStatus,
    softDeleteInvitation,
    findProjectInvitations,
};
