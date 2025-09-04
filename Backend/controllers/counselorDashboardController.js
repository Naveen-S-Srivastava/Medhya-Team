import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Appointment from '../models/appointmentModel.js';
import Message from '../models/messageModel.js';
import SessionNote from '../models/sessionNoteModel.js';
import CounselorStats from '../models/counselorStatsModel.js';
import Payment from '../models/paymentModel.js';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';

// Get counselor dashboard overview
export const getDashboardOverview = catchAsync(async (req, res) => {
  const counselorId = req.user.id;

  // Get the actual counselor ID (either from User model or direct)
  let actualCounselorId = counselorId;
  
  // Check if this is an OAuth user with a counselor profile
  const user = await User.findById(counselorId);
  if (user && user.role === 'counselor' && user.counselorProfile) {
    actualCounselorId = user.counselorProfile;
  }

  // Get today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await Appointment.find({
    counselor: actualCounselorId,
    date: {
      $gte: today,
      $lt: tomorrow
    }
  }).populate('student', 'firstName lastName email profileImage');

  // Get upcoming appointments (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingAppointments = await Appointment.find({
    counselor: actualCounselorId,
    date: {
      $gte: tomorrow,
      $lte: nextWeek
    },
    status: { $in: ['pending', 'confirmed'] }
  }).populate('student', 'firstName lastName email profileImage')
    .sort({ date: 1, timeSlot: 1 });

  // Get recent messages
  const recentMessages = await Message.find({
    $or: [
      { sender: actualCounselorId, senderModel: 'Counselor' },
      { recipient: actualCounselorId, recipientModel: 'Counselor' }
    ]
  })
  .populate('sender', 'firstName lastName email profileImage')
  .populate('recipient', 'firstName lastName email profileImage')
  .sort({ createdAt: -1 })
  .limit(10);

  // Get unread message count
  const unreadCount = await Message.countDocuments({
    recipient: actualCounselorId,
    recipientModel: 'Counselor',
    isRead: false
  });

  // Get counselor stats
  const stats = await CounselorStats.findOne({ counselor: actualCounselorId });

  // Get recent payments
  const recentPayments = await Payment.find({
    counselor: actualCounselorId
  })
  .populate('student', 'firstName lastName email')
  .sort({ createdAt: -1 })
  .limit(5);

  // Get pending appointments count
  const pendingCount = await Appointment.countDocuments({
    counselor: actualCounselorId,
    status: 'pending'
  });

  // Get completed sessions this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const completedThisMonth = await Appointment.countDocuments({
    counselor: actualCounselorId,
    status: 'completed',
    date: { $gte: startOfMonth }
  });

  res.status(200).json({
    status: 'success',
    data: {
      todayAppointments,
      upcomingAppointments,
      recentMessages,
      unreadCount,
      stats: stats || {},
      recentPayments,
      pendingCount,
      completedThisMonth
    }
  });
});

// Get upcoming sessions
export const getUpcomingSessions = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  // Get the actual counselor ID
  let actualCounselorId = counselorId;
  const user = await User.findById(counselorId);
  if (user && user.role === 'counselor' && user.counselorProfile) {
    actualCounselorId = user.counselorProfile;
  }

  const filter = { counselor: actualCounselorId };
  if (status) {
    filter.status = status;
  }

  const appointments = await Appointment.find(filter)
    .populate('student', 'firstName lastName email profileImage phone')
    .sort({ date: 1, timeSlot: 1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Appointment.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    data: {
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get recent messages
export const getRecentMessages = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  // Get the actual counselor ID
  let actualCounselorId = counselorId;
  const user = await User.findById(counselorId);
  if (user && user.role === 'counselor' && user.counselorProfile) {
    actualCounselorId = user.counselorProfile;
  }

  const filter = {
    $or: [
      { sender: actualCounselorId, senderModel: 'Counselor' },
      { recipient: actualCounselorId, recipientModel: 'Counselor' }
    ]
  };

  if (unreadOnly === 'true') {
    filter.recipient = actualCounselorId;
    filter.recipientModel = 'Counselor';
    filter.isRead = false;
  }

  const messages = await Message.find(filter)
    .populate('sender', 'firstName lastName email profileImage')
    .populate('recipient', 'firstName lastName email profileImage')
    .populate('appointmentId', 'date timeSlot')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Message.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    data: {
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Send message
export const sendMessage = catchAsync(async (req, res) => {
  const { recipientId, content, messageType = 'text', appointmentId, priority = 'normal' } = req.body;
  const counselorId = req.user.id;

  const message = await Message.create({
    sender: counselorId,
    senderModel: 'Counselor',
    recipient: recipientId,
    recipientModel: 'User',
    content,
    messageType,
    appointmentId,
    priority
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'firstName lastName email profileImage')
    .populate('recipient', 'firstName lastName email profileImage');

  res.status(201).json({
    status: 'success',
    data: {
      message: populatedMessage
    }
  });
});

// Mark message as read
export const markMessageAsRead = catchAsync(async (req, res) => {
  const { messageId } = req.params;
  const counselorId = req.user.id;

  const message = await Message.findOneAndUpdate(
    {
      _id: messageId,
      recipient: counselorId,
      recipientModel: 'Counselor'
    },
    {
      isRead: true,
      readAt: new Date()
    },
    { new: true }
  );

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      message
    }
  });
});

// Get session notes
export const getSessionNotes = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const { page = 1, limit = 10, studentId } = req.query;

  // For now, return empty data
  const sessionNotes = [];
  const total = 0;

  res.status(200).json({
    status: 'success',
    data: {
      sessionNotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Create session note
export const createSessionNote = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const {
    appointmentId,
    studentId,
    sessionDate,
    sessionDuration,
    sessionType,
    presentingIssues,
    sessionSummary,
    interventions,
    homework,
    progressNotes,
    riskAssessment,
    moodRating,
    nextSessionDate,
    recommendations,
    tags
  } = req.body;

  const sessionNote = await SessionNote.create({
    appointment: appointmentId,
    counselor: counselorId,
    student: studentId,
    sessionDate,
    sessionDuration,
    sessionType,
    presentingIssues,
    sessionSummary,
    interventions,
    homework,
    progressNotes,
    riskAssessment,
    moodRating,
    nextSessionDate,
    recommendations,
    tags
  });

  const populatedNote = await SessionNote.findById(sessionNote._id)
    .populate('student', 'firstName lastName email')
    .populate('appointment', 'date timeSlot status');

  res.status(201).json({
    status: 'success',
    data: {
      sessionNote: populatedNote
    }
  });
});

// Get payment records
export const getPaymentRecords = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  // Get the actual counselor ID
  let actualCounselorId = counselorId;
  const user = await User.findById(counselorId);
  if (user && user.role === 'counselor' && user.counselorProfile) {
    actualCounselorId = user.counselorProfile;
  }

  const filter = { counselor: actualCounselorId };
  if (status) {
    filter.paymentStatus = status;
  }

  const payments = await Payment.find(filter)
    .populate('student', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Payment.countDocuments(filter);

  // Calculate total earnings
  const totalEarnings = await Payment.aggregate([
    { $match: { counselor: actualCounselorId, paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      payments,
      totalEarnings: totalEarnings[0]?.total || 0,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Get counselor statistics
export const getCounselorStats = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const { period = 'month' } = req.query;

  const stats = await CounselorStats.findOne({ counselor: counselorId });

  // Get appointments for the specified period
  const startDate = new Date();
  if (period === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === 'month') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (period === 'year') {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const appointments = await Appointment.find({
    counselor: counselorId,
    date: { $gte: startDate }
  });

  // Calculate period-specific stats
  const periodStats = {
    totalSessions: appointments.length,
    completedSessions: appointments.filter(a => a.status === 'completed').length,
    cancelledSessions: appointments.filter(a => a.status === 'cancelled').length,
    pendingSessions: appointments.filter(a => a.status === 'pending').length,
    totalHours: appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.sessionDuration || 60), 0) / 60
  };

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats || {},
      periodStats
    }
  });
});

// Get student list
export const getStudentList = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const { page = 1, limit = 10, search } = req.query;

  // For now, return empty data
  const students = [];
  const total = 0;

  res.status(200).json({
    status: 'success',
    data: {
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

// Update appointment status
export const updateAppointmentStatus = catchAsync(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const counselorId = req.user.id;

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: appointmentId,
      counselor: counselorId
    },
    { status },
    { new: true }
  ).populate('student', 'firstName lastName email');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      appointment
    }
  });
});

// Get counselor profile
export const getCounselorProfile = catchAsync(async (req, res) => {
  const counselorId = req.user.id;

  // First try to find in User model (for OAuth users)
  let user = await User.findById(counselorId);
  
  if (user && user.role === 'counselor') {
    // If it's an OAuth counselor user, get their counselor profile
    if (user.counselorProfile) {
      const counselor = await Counselor.findById(user.counselorProfile);
      if (counselor) {
        return res.status(200).json({
          status: 'success',
          data: {
            counselor
          }
        });
      }
    }
    
    // If no counselor profile linked, return user data as counselor
    return res.status(200).json({
      status: 'success',
      data: {
        counselor: {
          _id: user._id,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          specialization: ["Anxiety", "Depression", "Stress Management"],
          languages: ["English", "Hindi"],
          experience: 5,
          education: {
            degree: "Masters in Psychology",
            institution: "University",
            year: 2020
          },
          bio: "Experienced counselor helping students with mental health challenges.",
          rating: 4.5,
          totalRatings: 20
        }
      }
    });
  }

  // If not found in User model, try Counselor model directly
  const counselor = await Counselor.findById(counselorId);
  if (counselor) {
    return res.status(200).json({
      status: 'success',
      data: {
        counselor
      }
    });
  }

  throw new AppError('Counselor not found', 404);
});

// Update counselor profile
export const updateCounselorProfile = catchAsync(async (req, res) => {
  const counselorId = req.user.id;
  const updateData = req.body;

  // Remove fields that shouldn't be updated
  delete updateData.email;
  delete updateData.license;

  // First try to update in User model (for OAuth users)
  let counselor = await User.findByIdAndUpdate(
    counselorId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!counselor) {
    // If not found in User model, try Counselor model
    counselor = await Counselor.findByIdAndUpdate(
      counselorId,
      updateData,
      { new: true, runValidators: true }
    );
  }

  if (!counselor) {
    throw new AppError('Counselor not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      counselor
    }
  });
});
