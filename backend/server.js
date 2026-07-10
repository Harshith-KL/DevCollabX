const app = require('./app');
const connectDB = require("./Config/db");
const {PORT} = require("./Config/env");

const startServer = async() => {
    try {
        await connectDB();
        app.listen(PORT,() => {
            console.log(`Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error("Server Failed:", error.message);
    }
};

startServer();