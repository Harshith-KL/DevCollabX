const projectRepository = require("../Repositories/project.repository");
const taskRepository = require("../Repositories/task.repository");
const ApiError = require("../Utils/ApiError");

const createTask = async (taskData, userId) => {
    const project = await projectRepository.findProjectById(taskData.project);

    if (!project || project.isArchived) {
        throw new ApiError(404, "Project not found");
    }

    if (project.owner._id.toString() !== userId) {
        throw new ApiError(
            403,
            "You are not authorized to create tasks in this project"
        );
    }

    const task = await taskRepository.createTask({
        ...taskData,
        reporter: userId,
    });

    return taskRepository.findTaskById(task._id);
};

const getTasks = async (
    userId,
    page,
    limit,
    search
) => {
    return taskRepository.findTasks(
        {
            reporter: userId,
            isArchived: false,
        },
        page,
        limit,
        search
    );
};

const getTaskById = async (taskId, userId) => {
    const task = await taskRepository.findTaskById(taskId);

    if (!task || task.isArchived) {
        throw new ApiError(404, "Task not found");
    }

    if (task.reporter._id.toString() !== userId) {
        throw new ApiError(
            403,
            "You are not authorized to access this task"
        );
    }

    return task;
};

const updateTask = async (
    taskId,
    updateData,
    userId
) => {
    await getTaskById(taskId, userId);
    return taskRepository.updateTask(
        taskId,
        updateData
    );
};

const archiveTask = async (
    taskId,
    userId
) => {
    await getTaskById(taskId, userId);
    return taskRepository.archiveTask(taskId);
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    archiveTask,
};