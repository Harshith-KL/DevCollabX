const Project = require("../Models/project.model");
const { PROJECT_STATUS } = require("../Constants/project.constants");

const createProject = async (projectData) => {
    return Project.create(projectData);
};

const findProjectById = async (projectId) => {
    return Project.findById(projectId)
        .populate("owner", "firstName lastName email profileImage")
        .populate("members.user", "firstName lastName email profileImage");
};

const findProjects = async (filter, options = {}) => {
    const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
    } = options;

    const skip = (page - 1) * limit;

    const projects = await Project.find(filter)
        .populate("owner", "firstName lastName email profileImage")
        .populate("members.user", "firstName lastName email profileImage")
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const totalProjects = await Project.countDocuments(filter);

    return {
        projects,
        totalProjects,
    };
};

const updateProject = async (projectId, updateData) => {
    return Project.findByIdAndUpdate(
        projectId,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );
};

const archiveProject = async (projectId) => {
    return Project.findByIdAndUpdate(
        projectId,
        {
        status: PROJECT_STATUS.ARCHIVED,
        },
        {
        new: true,
        }
    );
};

module.exports = {
    createProject,
    findProjectById,
    findProjects,
    updateProject,
    archiveProject,
};