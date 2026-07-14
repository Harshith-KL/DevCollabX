const Task = require("../Models/task.model");

const createTask = async (taskData) => {
    return Task.create(taskData);
};

const findTaskById = async (taskId) => {
    return Task.findById(taskId)
        .populate("project", "name")
        .populate("reporter", "firstName lastName email")
        .populate("assignee", "firstName lastName email");
};

const findTasks = async (
    filter,
    page = 1,
    limit = 10,
    search = ""
) => {
    const query = {
        ...filter,
    };

    if (search) {
        query.$text = {
            $search: search,
        };
    }

    const skip = (page - 1) * limit;

    const [tasks, totalTasks] = await Promise.all([
        Task.find(query)
            .populate("reporter", "firstName lastName email")
            .populate("assignee", "firstName lastName email")
            .populate("project", "name")
            .sort({
                position: 1,
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        Task.countDocuments(query),
    ]);

    return {
        tasks,
        totalTasks,
    };
};

const updateTask = async (taskId, updateData) => {
    return Task.findByIdAndUpdate(
        taskId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("reporter", "firstName lastName email")
        .populate("assignee", "firstName lastName email")
        .populate("project", "name");
};

const archiveTask = async (taskId) => {
    return Task.findByIdAndUpdate(
        taskId,
        {
            isArchived: true,
        },
        {
            new: true,
        }
    );
};

module.exports = {
    createTask,
    findTaskById,
    findTasks,
    updateTask,
    archiveTask,
};