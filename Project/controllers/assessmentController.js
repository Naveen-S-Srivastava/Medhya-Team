import { Assessment, AssessmentAverage } from '../models/assessmentModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import GAD7 from '../models/gad7Model.js';
import PHQ9 from '../models/phq9Model.js';

// Get questions for a specific assessment type
export const getQuestions = catchAsync(async (req, res) => {
  const { type } = req.params;
  
  if (!['GAD-7', 'PHQ-9'].includes(type)) {
    throw new AppError('Invalid assessment type', 400);
  }

  const Model = type === 'GAD-7' ? GAD7 : PHQ9;
  const questionsData = await Model.findOne({});
  
  if (!questionsData || !questionsData.questions || questionsData.questions.length === 0) {
    throw new AppError('Questions not found in database', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      type,
      questions: questionsData.questions
    }
  });
});

// Submit assessment responses
export const submitAssessment = catchAsync(async (req, res) => {
  const { type, responses } = req.body;
  const userId = req.user.id;

  if (!['GAD-7', 'PHQ-9'].includes(type)) {
    throw new AppError('Invalid assessment type', 400);
  }

  if (!Array.isArray(responses) || responses.length === 0) {
    throw new AppError('Responses are required', 400);
  }

  // Validate responses (should be 0, 1, 2, or 3)
  const validResponses = responses.every(response => 
    typeof response === 'number' && [0, 1, 2, 3].includes(response)
  );

  if (!validResponses) {
    throw new AppError('Invalid response values. Must be 0, 1, 2, or 3', 400);
  }

  // Calculate score
  const score = responses.reduce((sum, response) => sum + response, 0);

  // Check if user already has an assessment for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingAssessment = await Assessment.findOne({
    user: userId,
    type,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });

  if (existingAssessment) {
    throw new AppError('You have already completed this assessment today', 400);
  }

  // Create new assessment
  const assessment = await Assessment.create({
    user: userId,
    type,
    score,
    responses,
    date: new Date()
  });

  // Update 5-day average
  await updateFiveDayAverage(userId, type, score);

  res.status(201).json({
    status: 'success',
    data: {
      assessment,
      message: 'Assessment submitted successfully'
    }
  });
});

// Get user's assessment history
export const getAssessmentHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { type, limit = 10 } = req.query;

  const filter = { user: userId };
  if (type && ['GAD-7', 'PHQ-9'].includes(type)) {
    filter.type = type;
  }

  const assessments = await Assessment.find(filter)
    .sort({ date: -1 })
    .limit(parseInt(limit))
    .populate('user', 'name email');

  res.status(200).json({
    status: 'success',
    data: {
      assessments: assessments || []
    }
  });
});

// Get 5-day averages
export const getFiveDayAverages = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const averages = await AssessmentAverage.find({ user: userId });

  res.status(200).json({
    status: 'success',
    data: {
      averages: averages || []
    }
  });
});

// Get today's assessment if exists
export const getTodayAssessment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { type } = req.params;

  if (!['GAD-7', 'PHQ-9'].includes(type)) {
    throw new AppError('Invalid assessment type', 400);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const assessment = await Assessment.findOne({
    user: userId,
    type,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  });

  if (!assessment) {
    return res.status(404).json({
      status: 'error',
      message: 'No assessment found for today'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      assessment
    }
  });
});

// Helper function to update 5-day average
async function updateFiveDayAverage(userId, type, newScore) {
  // Get last 5 assessments for this type
  const lastFiveAssessments = await Assessment.find({
    user: userId,
    type
  })
  .sort({ date: -1 })
  .limit(5);

  // Get the last 5 scores
  const lastFiveScores = lastFiveAssessments.map(assessment => assessment.score);

  // Calculate average
  const fiveDayAverage = lastFiveScores.length > 0 
    ? lastFiveScores.reduce((sum, score) => sum + score, 0) / lastFiveScores.length 
    : 0;

  // Update or create the average record
  await AssessmentAverage.findOneAndUpdate(
    { user: userId, type },
    {
      fiveDayAverage,
      lastFiveScores,
      lastUpdated: new Date()
    },
    { upsert: true, new: true }
  );
}

// Get assessment statistics
export const getAssessmentStats = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { type, period = 30 } = req.query;

  const filter = { user: userId };
  if (type && ['GAD-7', 'PHQ-9'].includes(type)) {
    filter.type = type;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  filter.date = { $gte: startDate };

  const assessments = await Assessment.find(filter).sort({ date: 1 });

  // Calculate statistics
  const stats = {
    totalAssessments: assessments.length,
    averageScore: assessments.length > 0 
      ? assessments.reduce((sum, assessment) => sum + assessment.score, 0) / assessments.length 
      : 0,
    highestScore: assessments.length > 0 
      ? Math.max(...assessments.map(assessment => assessment.score)) 
      : 0,
    lowestScore: assessments.length > 0 
      ? Math.min(...assessments.map(assessment => assessment.score)) 
      : 0,
    assessmentsByType: {}
  };

  // Group by type
  if (!type) {
    const gad7Assessments = assessments.filter(a => a.type === 'GAD-7');
    const phq9Assessments = assessments.filter(a => a.type === 'PHQ-9');

    stats.assessmentsByType = {
      'GAD-7': {
        count: gad7Assessments.length,
        averageScore: gad7Assessments.length > 0 
          ? gad7Assessments.reduce((sum, a) => sum + a.score, 0) / gad7Assessments.length 
          : 0
      },
      'PHQ-9': {
        count: phq9Assessments.length,
        averageScore: phq9Assessments.length > 0 
          ? phq9Assessments.reduce((sum, a) => sum + a.score, 0) / phq9Assessments.length 
          : 0
      }
    };
  }

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats || {
        totalAssessments: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        assessmentsByType: {}
      },
      period: parseInt(period)
    }
  });
});

// Delete assessment
export const deleteAssessment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  // Find the assessment and verify ownership
  const assessment = await Assessment.findOne({
    _id: id,
    user: userId
  });

  if (!assessment) {
    throw new AppError('Assessment not found or you do not have permission to delete it', 404);
  }

  // Delete the assessment
  await Assessment.findByIdAndDelete(id);

  // Update 5-day average after deletion
  await updateFiveDayAverage(userId, assessment.type, null);

  res.status(200).json({
    status: 'success',
    message: 'Assessment deleted successfully'
  });
});


