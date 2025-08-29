import Assessment from "../models/assessmentModel.js";
import ActivityLog from "../models/activityLogModel.js";

export const createAssessment = async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();
    try {
      await ActivityLog.create({
        user: assessment.user,
        action: "assessment_create",
        metadata: {
          type: assessment.type,
          score: assessment.score
        }
      });
    } catch {}
    res.status(201).json(assessment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAssessmentsForUser = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.params.userId });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


