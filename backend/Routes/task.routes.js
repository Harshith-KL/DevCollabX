const express = require("express");
const taskController = require("../Controllers/task.controller");
const { createTaskValidator, updateTaskValidator, } = require("../Validators/task.validator");
const validationMiddleware = require("../Middleware/validation.middleware");
const { authenticate } = require("../Middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, createTaskValidator, validationMiddleware, taskController.createTask);
router.get("/", authenticate, taskController.getTasks);
router.get("/:id", authenticate, taskController.getTaskById);
router.patch("/:id", authenticate, updateTaskValidator, validationMiddleware, taskController.updateTask);
router.delete("/:id", authenticate, taskController.archiveTask);

module.exports = router;