import express from "express";
import { createActivity, getActivitiesForUser } from "../controllers/activityController.js";

const router = express.Router();
router.post("/", createActivity);
router.get("/:userId", getActivitiesForUser);

export default router;
