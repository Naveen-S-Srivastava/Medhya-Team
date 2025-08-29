import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/userController.js";

const router = express.Router();
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/:id", getProfile);

export default router;
