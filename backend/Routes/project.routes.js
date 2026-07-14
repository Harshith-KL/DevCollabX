const express = require("express");
const projectController = require("../Controllers/project.controller");
const { createProjectValidator, updateProjectValidator, } = require("../Validators/project.validator");
const validationMiddleware = require("../Middleware/validation.middleware");
const { authenticate } = require("../Middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createProjectValidator, validationMiddleware, projectController.createProject);
router.get("/", authenticate, projectController.getMyProjects);
router.get("/:id", authenticate, projectController.getProjectById);
router.patch("/:id", authenticate, updateProjectValidator, validationMiddleware, projectController.updateProject);
router.delete("/:id", authenticate, projectController.deleteProject);

module.exports = router;