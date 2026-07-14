const projectRepository = require("../Repositories/project.repository");
const ApiError = require("../Utils/ApiError");
const { PROJECT_STATUS, PROJECT_MEMBER_ROLE, } = require("../Constants/project.constants");

const createProject = async (userId, projectData) => {
    const project = await projectRepository.createProject({
        ...projectData,
        owner: userId,
        members: [
            {
                user: userId,
                role: PROJECT_MEMBER_ROLE.OWNER,
            },
        ],
        status: PROJECT_STATUS.ACTIVE,
    });

    return projectRepository.findProjectById(project._id);
};

const getMyProjects = async (
    userId,
    {
        page = 1,
        limit = 10,
        search = "",
        status,
    }
) => {

    const filter = {
        owner: userId,
        status: PROJECT_STATUS.ACTIVE,
    };

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$text = {
            $search: search,
        };
    }

    return projectRepository.findProjects(filter, {
        page,
        limit,
    });
};

const getProjectById = async (projectId, userId) => {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    if (project.owner._id.toString() !== userId) {
        throw new ApiError(
            403,
            "You are not authorized to view this project"
        );
    }
    return project;
};

const updateProject = async ( projectId, userId, updateData) => {
    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.owner._id.toString() !== userId) {
        throw new ApiError(403, "You are not authorized to update this project");
    }

    return projectRepository.updateProject(
        projectId,
        updateData
    );
};

const deleteProject = async ( projectId, userId ) => {
    const project = await projectRepository.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.owner._id.toString() !== userId) {
        throw new ApiError(
            403,
            "You are not authorized to delete this project"
        );
    }

    await projectRepository.archiveProject(projectId);
};

module.exports = {
    createProject,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject,
};