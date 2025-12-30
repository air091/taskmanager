import express from "express";
import {
  deleteTaskController,
  getTasksByUser,
  postTask,
  putTask,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/create", postTask);
router.get("/", getTasksByUser);
router.put("/:id", putTask);
router.delete("/:id", deleteTaskController);

export default router;
