import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { postCollabToSubtask } from "../controllers/collab.controller.js";

const router = express.Router();
router.use(authMiddleware);
router.post("/:subtaskId/add-collab", postCollabToSubtask);

export default router;
