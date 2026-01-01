import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getSubtasksInTaskByUsers,
  getTasksByCollab,
  postCollabToSubtask,
} from "../controllers/collab.controller.js";

const router = express.Router();
router.use(authMiddleware);
router.post("/:subtaskId/add-collab", postCollabToSubtask);
router.get("/", getTasksByCollab);
router.get("/:taskId", getSubtasksInTaskByUsers);

export default router;
