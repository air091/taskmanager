import express from "express";
import {
  getMe,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMe);

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);

export default router;
