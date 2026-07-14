const mongoose = require("mongoose");

const {
    TASK_STATUS,
    TASK_PRIORITY,
} = require("../Constants/task.constants");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            default: "",
            maxlength: 5000,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },

        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },

        status: {
            type: String,
            enum: Object.values(TASK_STATUS),
            default: TASK_STATUS.TODO,
            index: true,
        },

        priority: {
            type: String,
            enum: Object.values(TASK_PRIORITY),
            default: TASK_PRIORITY.MEDIUM,
            index: true,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        labels: {
            type: [String],
            default: [],
        },

        position: {
            type: Number,
            default: 0,
        },

        isArchived: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

taskSchema.index({
    title: "text",
    description: "text",
});

module.exports = mongoose.model("Task", taskSchema);