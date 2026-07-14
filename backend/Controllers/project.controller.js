const projectService = require("../Services/project.service");
const ApiResponse = require("../Utils/ApiResponse");
const asyncHandler = require("../Utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
    const project = await projectService.createProject(
        req.user.userId,
        req.body
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Project created successfully",
            project
        )
    );
});

const getMyProjects = asyncHandler(async (req, res) => {
    const projects = await projectService.getMyProjects(
        req.user.userId,
        req.query
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Projects fetched successfully",
            projects
        )
    );
});

const getProjectById = asyncHandler(async (req, res) => {
    const project = await projectService.getProjectById( req.params.id, req.user.userId );
    return res.status(200).json(
        new ApiResponse(
            200,
            "Project fetched successfully",
            project
        )
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const project = await projectService.updateProject(
        req.params.id,
        req.user.userId,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Project updated successfully",
            project
        )
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    await projectService.deleteProject(
        req.params.id,
        req.user.userId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Project deleted successfully"
        )
    );
});

module.exports = {
    createProject,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject,
};