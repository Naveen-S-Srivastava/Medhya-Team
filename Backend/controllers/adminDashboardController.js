import User from '../models/usermodel.js';
import Appointment from '../models/appointmentModel.js';
import Chat from '../models/aichatModel.js';
import CommunityPost from '../models/communityModel.js';
import CrisisAlert from '../models/crisisAlertModel.js';

// GET /api/admin/dashboard-stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [totalUsers, chatSessions, appointments, forumPosts, criticalAlerts] = await Promise.all([
      User.countDocuments(),
      Chat.countDocuments(),
      Appointment.countDocuments(),
      CommunityPost.countDocuments(),
      CrisisAlert.countDocuments({ status: 'critical' })
    ]);
    console.log('[ADMIN DASHBOARD STATS]', {
      totalUsers,
      chatSessions,
      appointments,
      forumPosts,
      criticalAlerts
    });
    res.json({
      totalUsers,
      chatSessions,
      appointments,
      forumPosts,
      criticalAlerts
    });
  } catch (error) {
    console.error('[ADMIN DASHBOARD ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};
