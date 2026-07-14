const taskService = require("../Services/task.service");
const ApiResponse = require("../Utils/ApiResponse");
const asyncHandler = require("../Utils/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(
        req.body,
        req.user.userId
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Task created successfully",
            task
        )
    );
});

const getTasks = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
    } = req.query;

    const tasks = await taskService.getTasks(
        req.user.userId,
        Number(page),
        Number(limit),
        search
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Tasks fetched successfully",
            tasks
        )
    );
});

const getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(
        req.params.id,
        req.user.userId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Task fetched successfully",
            task
        )
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(
        req.params.id,
        req.body,
        req.user.userId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Task updated successfully",
            task
        )
    );
});

const archiveTask = asyncHandler(async (req, res) => {
    await taskService.archiveTask(
        req.params.id,
        req.user.userId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Task archived successfully"
        )
    );
});

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    archiveTask,
};