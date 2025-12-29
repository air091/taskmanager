import express from "express";
import {
  deleteUser,
  getAllUsers,
  putUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.put("/:id", putUser);
router.delete("/:id", deleteUser);

export default router;
