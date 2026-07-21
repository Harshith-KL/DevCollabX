const mongoose = require("mongoose");
const { PROJECT_INVITATION_STATUS } = require("../Constants/project.constants");

const projectInvitationSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        invitedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["ADMIN", "MEMBER"],
            default: "MEMBER",
        },
        status: {
            type: String,
            enum: Object.values(PROJECT_INVITATION_STATUS),
            default: PROJECT_INVITATION_STATUS.PENDING,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

projectInvitationSchema.index({ project: 1, invitedUser: 1, deletedAt: 1 });

const ProjectInvitation = mongoose.model("ProjectInvitation", projectInvitationSchema);

module.exports = ProjectInvitation;
