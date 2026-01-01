import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import databaseConnection from "./config/database.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import taskRouter from "./routes/task.route.js";
import subtaskRouter from "./routes/subTask.route.js";
import collabRouter from "./routes/collab.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/subtasks", subtaskRouter);
app.use("/api/collabs", collabRouter);

const startServer = async () => {
  try {
    databaseConnection;
    app.listen(PORT, () => console.log(`Server running in PORT ${PORT}`));
  } catch (err) {
    console.error(`Start server failed ${err}`);
    process.exit(1);
  }
};

startServer();
