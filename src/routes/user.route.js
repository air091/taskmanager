import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUsersByRole,
  putUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/find", authMiddleware, getUsersByRole);
router.get("/", getAllUsers);
router.put("/:id", putUser);
router.delete("/:id", deleteUser);

export default router;
