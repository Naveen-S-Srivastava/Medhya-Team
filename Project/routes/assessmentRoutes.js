import express from "express";
import Assessment from "../models/assessmentModel.js";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();
    res.status(201).json(assessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.params.userId });
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
