import express from "express";
import { 
  createAssessment, 
  getAssessmentsForUser, 
  getAllAssessments,
  getAssessmentAnalytics,
  getWeeklyPatterns
} from "../controllers/assessmentController.js";

const router = express.Router();
router.post("/", createAssessment);
router.get("/analytics", getAssessmentAnalytics);
router.get("/weekly-patterns", getWeeklyPatterns);
router.get("/", getAllAssessments);
router.get("/:userId", getAssessmentsForUser);

export default router;
