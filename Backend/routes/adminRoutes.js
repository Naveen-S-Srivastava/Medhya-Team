import express from 'express';
import { getAdminDashboardStats } from '../controllers/adminDashboardController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Apply authentication and admin role restriction to all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', getAdminDashboardStats);

// Test endpoint to verify admin routes are working
router.get('/test', (req, res) => {
  res.json({
    message: 'Admin routes are working!',
    timestamp: new Date().toISOString(),
    user: req.user ? {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
    } : 'not authenticated'
  });
});

export default router;