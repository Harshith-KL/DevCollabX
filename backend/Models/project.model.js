const mongoose = require("mongoose");

const {
    PROJECT_STATUS,
    PROJECT_VISIBILITY,
    PROJECT_MEMBER_ROLE,
} = require("../Constants/project.constants");

const projectMemberSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: Object.values(PROJECT_MEMBER_ROLE),
            default: PROJECT_MEMBER_ROLE.MEMBER,
        },
    },
    {
        _id: false,
    }
);

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        members: {
            type: [projectMemberSchema],
            default: [],
        },

        visibility: {
            type: String,
            enum: Object.values(PROJECT_VISIBILITY),
            default: PROJECT_VISIBILITY.PUBLIC,
        },

        status: {
            type: String,
            enum: Object.values(PROJECT_STATUS),
            default: PROJECT_STATUS.ACTIVE,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

projectSchema.index({
    owner: 1,
    status: 1,
});

projectSchema.index({
    name: "text",
    description: "text",
});

module.exports = mongoose.model("Project", projectSchema);