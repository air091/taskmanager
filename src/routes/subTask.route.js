import express from "express";
import {
  deleteSubTaskController,
  getAllSubTaskByTask,
  postSubTask,
  putSubTask,
} from "../controllers/subTask.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/:taskId", getAllSubTaskByTask);
router.post("/:taskId/create", postSubTask);
router.put("/:taskId/:subtaskId", putSubTask);
router.delete("/:taskId/:subtaskId", deleteSubTaskController);

export default router;
