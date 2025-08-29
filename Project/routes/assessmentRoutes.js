import express from "express";
import { createAssessment, getAssessmentsForUser } from "../controllers/assessmentController.js";

const router = express.Router();
router.post("/", createAssessment);
router.get("/:userId", getAssessmentsForUser);

export default router;
