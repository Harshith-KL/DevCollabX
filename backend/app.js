const express = require('express');
const cors = require('cors');
const authRoutes = require("./Routes/auth.routes");
const projectRoutes = require("./Routes/project.routes");
const taskRoutes = require("./Routes/task.routes");
const errorHandler = require("./Middleware/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.get("/api/v1", (req, res) => {
    res.status(200).json({
        success: true,
        message: "server is running"
    });
});

app.use(errorHandler);

module.exports = app;