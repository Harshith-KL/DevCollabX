const mongoose = require("mongoose");
const projectRepository = require("../Repositories/project.repository");
const projectInvitationRepository = require("../Repositories/projectInvitation.repository");
const userRepository = require("../Repositories/user.repository");
const ApiError = require("../Utils/ApiError");
const { PROJECT_MEMBER_ROLE, PROJECT_INVITATION_STATUS } = require("../Constants/project.constants");

const canManageMembers = (actorRole) => {
    return actorRole === PROJECT_MEMBER_ROLE.OWNER || actorRole === PROJECT_MEMBER_ROLE.ADMIN;
};

const getProjectMemberRole = (project, userId) => {
    const member = project.members.find((entry) => entry.user._id.toString() === userId.toString());
    return member ? member.role : null;
};

const inviteMember = async (projectId, actorId, invitationData) => {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const actorRole = getProjectMemberRole(project, actorId);
    if (!canManageMembers(actorRole)) {
        throw new ApiError(403, "Only owner or admin can invite members");
    }

    const invitedUser = await userRepository.findUserByEmail(invitationData.email);
    if (!invitedUser) {
        throw new ApiError(404, "User not found");
    }

    if (invitedUser._id.toString() === project.owner._id.toString()) {
        throw new ApiError(400, "Owner cannot be invited");
    }

    const existingMember = project.members.some((member) => member.user._id.toString() === invitedUser._id.toString());
    if (existingMember) {
        throw new ApiError(409, "User is already a member of this project");
    }

    const existingInvitation = await projectInvitationRepository.findActiveInvitation(projectId, invitedUser._id);
    if (existingInvitation) {
        throw new ApiError(409, "An active invitation already exists for this user");
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await projectInvitationRepository.createInvitation({
        project: projectId,
        invitedBy: actorId,
        invitedUser: invitedUser._id,
        role: invitationData.role || PROJECT_MEMBER_ROLE.MEMBER,
        expiresAt,
    });

    return invitation;
};

const acceptInvitation = async (invitationId, userId) => {
    const invitation = await projectInvitationRepository.findInvitationById(invitationId);
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    if (invitation.invitedUser._id.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to accept this invitation");
    }

    if (invitation.deletedAt) {
        throw new ApiError(400, "Invitation has been removed");
    }

    if (invitation.status !== PROJECT_INVITATION_STATUS.PENDING) {
        throw new ApiError(400, "Invitation is no longer pending");
    }

    if (invitation.expiresAt < new Date()) {
        await projectInvitationRepository.updateInvitationStatus(invitationId, { status: PROJECT_INVITATION_STATUS.EXPIRED });
        throw new ApiError(400, "Invitation has expired");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const project = await projectRepository.findProjectById(invitation.project._id);
        const alreadyMember = project.members.some((member) => member.user._id.toString() === userId.toString());
        if (alreadyMember) {
            await session.abortTransaction();
            session.endSession();
            throw new ApiError(409, "You are already a member of this project");
        }

        await projectRepository.updateProject(invitation.project._id, {
            $push: {
                members: {
                    user: userId,
                    role: invitation.role,
                },
            },
        }, session);

        await projectInvitationRepository.updateInvitationStatus(invitationId, {
            status: PROJECT_INVITATION_STATUS.ACCEPTED,
            deletedAt: new Date(),
        });

        await session.commitTransaction();
        session.endSession();

        return { success: true };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const removeMember = async (projectId, actorId, memberId) => {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (memberId === project.owner._id.toString()) {
        throw new ApiError(400, "Owner cannot be removed");
    }

    const actorRole = getProjectMemberRole(project, actorId);
    if (!canManageMembers(actorRole)) {
        throw new ApiError(403, "Only owner or admin can remove members");
    }

    const member = project.members.find((entry) => entry.user._id.toString() === memberId);
    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    if (member.role === PROJECT_MEMBER_ROLE.OWNER) {
        throw new ApiError(400, "Owner cannot be removed");
    }

    await projectRepository.updateProject(projectId, {
        $pull: {
            members: { user: memberId },
        },
    });

    return { success: true };
};

const updateMemberRole = async (projectId, actorId, memberId, newRole) => {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const actorRole = getProjectMemberRole(project, actorId);
    if (!canManageMembers(actorRole)) {
        throw new ApiError(403, "Only owner or admin can update member roles");
    }

    if (memberId === project.owner._id.toString()) {
        throw new ApiError(400, "Owner role cannot be changed");
    }

    const targetMember = project.members.find((entry) => entry.user._id.toString() === memberId);
    if (!targetMember) {
        throw new ApiError(404, "Member not found");
    }

    if (targetMember.role === PROJECT_MEMBER_ROLE.OWNER) {
        throw new ApiError(400, "Owner role cannot be changed");
    }

    await projectRepository.updateProject(projectId, {
        $set: {
            "members.$[elem].role": newRole,
        },
    }, null, {
        arrayFilters: [{ "elem.user": memberId }],
    });

    return { success: true };
};

const getProjectMembers = async (projectId, userId) => {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const actorRole = getProjectMemberRole(project, userId);
    if (!actorRole) {
        throw new ApiError(403, "You are not a member of this project");
    }

    return {
        project: project._id,
        owner: project.owner,
        members: project.members,
        invitations: await projectInvitationRepository.findProjectInvitations(projectId),
    };
};

module.exports = {
    inviteMember,
    acceptInvitation,
    removeMember,
    updateMemberRole,
    getProjectMembers,
};
