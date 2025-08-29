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

export const getAllAssessments = async (req, res) => {
  try {
    const { type, startDate, endDate, user } = req.query;
    let query = {};

    if (type) query.type = type;
    if (user) query.user = user;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const assessments = await Assessment.find(query).populate('user', 'name email');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssessmentAnalytics = async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(0); // All time
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days
    }

    // Get assessments in date range
    const assessments = await Assessment.find({
      date: { $gte: startDate, $lte: now }
    }).populate('user', 'name email');

    console.log(`Found ${assessments.length} assessments for timeRange: ${timeRange}`);

    // Calculate analytics
    const totalAssessments = assessments.length;
    const uniqueUsers = new Set(assessments.map(a => a.user?._id?.toString() || a.user?.toString()).filter(Boolean)).size;
    const averageScore = assessments.length > 0 
      ? assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length 
      : 0;

    // Group by assessment type
    const typeStats = assessments.reduce((acc, assessment) => {
      if (!acc[assessment.type]) {
        acc[assessment.type] = { count: 0, totalScore: 0 };
      }
      acc[assessment.type].count++;
      acc[assessment.type].totalScore += assessment.score;
      return acc;
    }, {});

    // Calculate averages for each type
    Object.keys(typeStats).forEach(type => {
      typeStats[type].averageScore = typeStats[type].totalScore / typeStats[type].count;
    });

    res.json({
      totalAssessments,
      uniqueUsers,
      averageScore,
      typeStats,
      assessments,
      timeRange,
      startDate,
      endDate: now
    });
  } catch (error) {
    console.error('Error in getAssessmentAnalytics:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getWeeklyPatterns = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get assessments for the last 7 days
    const assessments = await Assessment.find({
      date: { $gte: startDate, $lte: now }
    });

    console.log(`Found ${assessments.length} assessments for weekly patterns`);

    // Group by day of week
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = dayNames.map(day => ({
      day,
      phq9: 0,
      gad7: 0,
      ghq12: 0
    }));

    assessments.forEach(assessment => {
      const dayOfWeek = new Date(assessment.date).getDay();
      const dayName = dayNames[dayOfWeek];
      const dayData = weeklyData.find(d => d.day === dayName);
      
      if (dayData) {
        switch (assessment.type) {
          case 'PHQ-9':
            dayData.phq9++;
            break;
          case 'GAD-7':
            dayData.gad7++;
            break;
          case 'GHQ-12':
            dayData.ghq12++;
            break;
        }
      }
    });

    res.json(weeklyData);
  } catch (error) {
    console.error('Error in getWeeklyPatterns:', error);
    res.status(500).json({ error: error.message });
  }
};


