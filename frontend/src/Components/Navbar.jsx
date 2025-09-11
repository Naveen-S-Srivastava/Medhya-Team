// src/Components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  Heart, Menu, X, Bell, Settings, LogOut, User,
  Building2, GraduationCap, ChevronDown, RefreshCw,
  Smile, Flame, CheckCircle, AlertCircle,
} from 'lucide-react';
import { authAPI } from '../services/api.js';
import { moodAPI } from '../services/api.js';
import medha from '../assets/logo.png';
import ChangePasswordModal from './ChangePasswordModal';
import MoodTrackerModal from './MoodTrackerModal';

const Navbar = ({ userRole, user, onLogout, systemStats, onRefreshMoodData }) => {
  console.log('🧭 Navbar rendered with:', { userRole, user: user ? { id: user.id, email: user.email, currentStreak: user.currentStreak } : null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isMoodTrackerModalOpen, setIsMoodTrackerModalOpen] = useState(false);
  const [todaysMood, setTodaysMood] = useState(null);
  const [userStreak, setUserStreak] = useState({ current: 0, longest: 0 });
  const [isLoadingMood, setIsLoadingMood] = useState(false);
  const [isLoadingStreak, setIsLoadingStreak] = useState(false);
  const [profileStatus, setProfileStatus] = useState(() => {
    // Initialize with current user profile status if available
    if (user?.isProfileComplete !== undefined) {
      return {
        isComplete: user.isProfileComplete,
        lastChecked: new Date().toLocaleTimeString(),
        message: user.isProfileComplete
          ? 'Profile is complete! All features are available.'
          : 'Consider completing your profile for a better experience.'
      };
    }
    return null;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // --- Side Effects ---

  // Handle header style on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsChangePasswordModalOpen(false);
    // Don't clear profile status on route change, only on logout
  }, [location.pathname]);

  // Debug: Monitor todaysMood changes
  useEffect(() => {
    console.log('🎭 todaysMood changed:', todaysMood);
  }, [todaysMood]);

  // Load mood and streak data when component mounts or user changes
  useEffect(() => {
    if (userRole === 'student' && user && user.id) {
      console.log('👤 Loading mood data for authenticated user:', user.id);
      loadTodaysMood();
      loadUserStreak();
    } else {
      console.log('👤 Not loading mood data - user not authenticated or not student');
    }
  }, [userRole, user?.id]); // Use user.id to ensure proper dependency tracking

  // Refresh mood data when requested
  useEffect(() => {
    if (onRefreshMoodData && userRole === 'student' && user) {
      console.log('🔄 Refreshing mood data...', onRefreshMoodData);
      loadTodaysMood();
      loadUserStreak();
    }
  }, [onRefreshMoodData]);

  // Load today's mood
  const loadTodaysMood = async () => {
    if (!user) {
      console.log('🚫 loadTodaysMood: No user available');
      return;
    }

    console.log('📥 loadTodaysMood: Starting to load mood for user:', user.id);
    setIsLoadingMood(true);
    try {
      const response = await moodAPI.getTodaysMood();
      console.log('📥 loadTodaysMood: API response:', response);

      if (response.success && response.data) {
        console.log('📥 loadTodaysMood: Setting mood data:', response.data);
        setTodaysMood(response.data);
      } else {
        console.log('📥 loadTodaysMood: No mood data found');
        setTodaysMood(null);
      }
    } catch (error) {
      console.error('❌ loadTodaysMood: Error loading today\'s mood:', error);
      setTodaysMood(null);
    } finally {
      setIsLoadingMood(false);
    }
  };

  // Load user streak data
  const loadUserStreak = async () => {
    if (!user) return;

    setIsLoadingStreak(true);
    try {
      // For now, we'll use mock data since we need to implement the streak API
      // In a real implementation, you'd call an API to get the user's streak
      console.log('🔥 Loading streak data for user:', user);
      console.log('🔥 User currentStreak:', user.currentStreak);
      console.log('🔥 User longestStreak:', user.longestStreak);

      setUserStreak({
        current: user.currentStreak || 0,
        longest: user.longestStreak || 0
      });
    } catch (error) {
      console.error('Error loading user streak:', error);
      setUserStreak({ current: 0, longest: 0 });
    } finally {
      setIsLoadingStreak(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (passwordData) => {
    console.log('🔐 handlePasswordChange called with:', passwordData);
    try {
      // Make API call to change password
      console.log('🔐 Making API call to change password...');
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        newPasswordConfirm: passwordData.newPasswordConfirm // Backend expects newPasswordConfirm
      });

      console.log('🔐 Password change API call successful');
      // Show success message
      alert('Password changed successfully!');

    } catch (error) {
      console.error('🔐 Password change failed:', error);
      console.error('🔐 Error details:', {
        message: error.message,
        status: error.status,
        stack: error.stack
      });

      // Let the modal handle the error display
      throw error;
    }
  };

  const studentStats = {
    wellnessScore: 78,
    streakDays: 12
  };

  // Handle profile status check
  const handleCheckProfileStatus = async () => {
    setIsCheckingStatus(true);
    try {
      // Here you would make an API call to check profile status
      // For now, we'll use the current user data

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update profile status based on current user data
      const isComplete = user?.isProfileComplete || false;
      const status = {
        isComplete,
        lastChecked: new Date().toLocaleTimeString(),
        message: isComplete
          ? 'Profile is complete! All features are available.'
          : 'Profile is incomplete. Complete your profile to unlock all features.'
      };

      setProfileStatus(status);

    } catch (error) {
      console.error('❌ Failed to check profile status:', error);
      setProfileStatus({
        isComplete: false,
        lastChecked: new Date().toLocaleTimeString(),
        message: 'Failed to check profile status. Please try again.'
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Handle mood submission
  const handleMoodSubmit = async (moodData) => {
    try {
      if (todaysMood) {
        // Update existing mood
        await moodAPI.updateTodaysMood(moodData);
      } else {
        // Log new mood
        await moodAPI.logMood(moodData);
      }

      // Reload today's mood
      await loadTodaysMood();
    } catch (error) {
      console.error('Error submitting mood:', error);
      throw error;
    }
  };

  // Handle mood tracker button click
  const handleMoodTrackerClick = () => {
    setIsMoodTrackerModalOpen(true);
  };

  // Handle streak button click
  const handleStreakClick = () => {
    // For now, just show an alert with streak info
    // In the future, this could open a detailed streak view
    alert(`Current Streak: ${userStreak.current} days\nLongest Streak: ${userStreak.longest} days\nKeep it up! 🔥`);
  };

  // --- Reusable UI Components ---

  const UserMenu = () => (
    <div ref={userMenuRef} className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-slate-100"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
            {user?.firstName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-slate-800 truncate max-w-[150px]">{user?.firstName || 'User'}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">

          <div className="p-2 space-y-1">
            {user?.role === 'admin' ? (
              // Admin menu - simplified
              <>
                <button
                  onClick={() => {
                    setIsChangePasswordModalOpen(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100"
                >
                  <Settings className="h-4 w-4 text-slate-500" /> Change Password
                </button>
              </>
            ) : (
              // Non-admin menu
              <>
                <Link to="/profile" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100">
                  <User className="h-4 w-4 text-slate-500" /> Profile
                </Link>

                {/* Profile Status Display */}
                {profileStatus && (
                  <div className={`mx-3 my-2 p-2 rounded-md text-xs ${profileStatus.isComplete
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-orange-50 border border-orange-200'
                    }`}>
                    <div className="flex items-center gap-1 mb-1">
                      {profileStatus.isComplete ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                      )}
                      <span className={`font-medium ${profileStatus.isComplete ? 'text-green-700' : 'text-orange-700'
                        }`}>
                        {profileStatus.isComplete ? 'Profile Complete' : 'Profile Incomplete'}
                      </span>
                    </div>
                    <p className={`text-xs ${profileStatus.isComplete ? 'text-green-600' : 'text-orange-600'
                      }`}>
                      {profileStatus.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Last checked: {profileStatus.lastChecked}
                    </p>
                  </div>
                )}

                {!user?.isProfileComplete && (
                  <Link to="/user-signup" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-orange-600 rounded-md hover:bg-orange-50 bg-orange-50">
                    <User className="h-4 w-4 text-orange-500" /> Complete Profile
                  </Link>
                )}
                {user?.isProfileComplete && (
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">Profile Complete</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="p-2 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // --- Main Render ---
  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm' : 'bg-/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left Section: Logo & Status Badges */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5">
                <div >
                  <img className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg shadow-md" src={medha} />
                </div>
                <div>
                  <h1 className="hidden sm:block text-xl font-bold text-slate-800">MEDHYA </h1>
                  <p className="hidden md:block text-xs text-slate-500">Advanced Digital Psychological Intervention System</p>
                </div>
              </Link>


            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-4">
              {/* Mood Tracker Button - Only for students */}
              {userRole === 'student' && (
                <button
                  onClick={handleMoodTrackerClick}
                  disabled={isLoadingMood}
                  className="relative p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                  title={isLoadingMood ? "Loading..." : todaysMood ? `Today's mood: ${todaysMood.moodEmoji}` : "Track your mood"}
                >
                  {isLoadingMood ? (
                    <RefreshCw className="h-5 w-5 text-slate-500 animate-spin" />
                  ) : todaysMood ? (
                    <span className="text-lg">{todaysMood.moodEmoji}</span>
                  ) : (
                    <Smile className="h-5 w-5 text-slate-500" />
                  )}
                  {!todaysMood && !isLoadingMood && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  )}
                </button>
              )}


              {/* TEST: Manual Refresh Button - Only for students */}
              {/* {userRole === 'student' && (
                <button
                  onClick={() => {
                    console.log('🧪 Manual refresh triggered');
                    console.log('🧪 Current user data:', user);
                    loadTodaysMood();
                    loadUserStreak();
                  }}
                  className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
                  title="Manual refresh (test)"
                >
                  <RefreshCw className="h-5 w-5 text-green-500" />
                </button>
              )} */}


              {/* Daily Streak Button - Only for students */}
              {userRole === 'student' && (
                <button
                  onClick={handleStreakClick}
                  disabled={isLoadingStreak}
                  className="relative p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                  title={isLoadingStreak ? "Loading..." : `Current streak: ${userStreak.current} days`}
                >
                  {isLoadingStreak ? (
                    <RefreshCw className="h-5 w-5 text-slate-500 animate-spin" />
                  ) : (
                    <Flame className="h-5 w-5 text-orange-500" />
                  )}
                  {userStreak.current > 0 && !isLoadingStreak && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {userStreak.current}
                    </span>
                  )}
                </button>
              )}


              {/* Profile Status Check Button */}
              {userRole === 'student' && (
                <button
                  onClick={handleCheckProfileStatus}
                  disabled={isCheckingStatus}
                  className="relative p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                  title={isCheckingStatus ? "Checking..." : profileStatus ? "Profile status checked" : "Check Profile Status"}
                >
                  {isCheckingStatus ? (
                    <RefreshCw className="h-5 w-5 text-slate-500 animate-spin" />
                  ) : profileStatus ? (
                    profileStatus.isComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )
                  ) : (
                    <RefreshCw className="h-5 w-5 text-slate-500" />
                  )}
                  {profileStatus && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${profileStatus.isComplete ? 'bg-green-400' : 'bg-orange-400'
                        } opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${profileStatus.isComplete ? 'bg-green-500' : 'bg-orange-500'
                        }`}></span>
                    </span>
                  )}
                </button>
              )}


              <button className="relative p-2 rounded-full hover:bg-slate-100">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              </button>
              <UserMenu />
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-slate-100">
                <Menu className="h-6 w-6 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu (Slide-in) --- */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="fixed inset-0 bg-black/30" onClick={() => setIsMenuOpen(false)}></div>
        <div className="relative h-full w-full max-w-xs bg-white p-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-md">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">MEDHYA</h1>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md hover:bg-slate-100">
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between px-3">
              <p className="text-sm font-semibold text-slate-800">Welcome, {user?.firstName || 'User'}</p>

              {/* Mobile Profile Status Check Button */}
              {userRole === 'student' && (
                <button
                  onClick={handleCheckProfileStatus}
                  disabled={isCheckingStatus}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                  title={isCheckingStatus ? "Checking..." : profileStatus ? "Profile status checked" : "Check Profile Status"}
                >
                  {isCheckingStatus ? (
                    <RefreshCw className="h-4 w-4 text-slate-500 animate-spin" />
                  ) : profileStatus ? (
                    profileStatus.isComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )
                  ) : (
                    <RefreshCw className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              )}

              {/* Mobile Mood Tracker Button */}
              {userRole === 'student' && (
                <button
                  onClick={() => {
                    handleMoodTrackerClick();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoadingMood}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                  title={isLoadingMood ? "Loading..." : todaysMood ? `Today's mood: ${todaysMood.moodEmoji}` : "Track your mood"}
                >
                  {isLoadingMood ? (
                    <RefreshCw className="h-4 w-4 text-slate-500 animate-spin" />
                  ) : todaysMood ? (
                    <span className="text-base">{todaysMood.moodEmoji}</span>
                  ) : (
                    <Smile className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              )}

              {/* Mobile Daily Streak Button */}
              {userRole === 'student' && (
                <button
                  onClick={() => {
                    handleStreakClick();
                    setIsMenuOpen(false);
                  }}
                  disabled={isLoadingStreak}
                  className="relative p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
                  title={isLoadingStreak ? "Loading..." : `Current streak: ${userStreak.current} days`}
                >
                  {isLoadingStreak ? (
                    <RefreshCw className="h-4 w-4 text-slate-500 animate-spin" />
                  ) : (
                    <Flame className="h-4 w-4 text-orange-500" />
                  )}
                  {userStreak.current > 0 && !isLoadingStreak && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {userStreak.current}
                    </span>
                  )}
                </button>
              )}
            </div>

            {user?.role === 'admin' ? (
              // Admin mobile menu - simplified
              <>
                <button
                  onClick={() => {
                    setIsChangePasswordModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-base text-slate-700 rounded-md hover:bg-slate-100"
                >
                  <Settings className="h-5 w-5 text-slate-500" /> Change Password
                </button>
              </>
            ) : (
              // Non-admin mobile menu
              <>
                <Link to="/profile" className="flex items-center gap-3 w-full px-3 py-2 text-base text-slate-700 rounded-md hover:bg-slate-100">
                  <User className="h-5 w-5 text-slate-500" /> Profile
                </Link>

                {/* Mobile Profile Status Display */}
                {profileStatus && (
                  <div className={`mx-3 my-2 p-3 rounded-md text-sm ${profileStatus.isComplete
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-orange-50 border border-orange-200'
                    }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {profileStatus.isComplete ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      <span className={`font-medium ${profileStatus.isComplete ? 'text-green-700' : 'text-orange-700'
                        }`}>
                        {profileStatus.isComplete ? 'Profile Complete' : 'Profile Incomplete'}
                      </span>
                    </div>
                    <p className={`text-sm ${profileStatus.isComplete ? 'text-green-600' : 'text-orange-600'
                      }`}>
                      {profileStatus.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Last checked: {profileStatus.lastChecked}
                    </p>
                  </div>
                )}

                {!user?.isProfileComplete && (
                  <Link to="/user-signup" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-orange-600 rounded-md hover:bg-orange-50 bg-orange-50">
                    <User className="h-4 w-4 text-orange-500" /> Complete Profile
                  </Link>
                )}
                <Link to="/settings" className="flex items-center gap-3 w-full px-3 py-2 text-base text-slate-700 rounded-md hover:bg-slate-100">
                  <Settings className="h-5 w-5 text-slate-500" /> Settings
                </Link>
              </>
            )}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-base text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />

      {/* Mood Tracker Modal */}
      <MoodTrackerModal
        isOpen={isMoodTrackerModalOpen}
        onClose={() => setIsMoodTrackerModalOpen(false)}
        onSubmit={handleMoodSubmit}
        todaysMood={todaysMood}
      />
    </>
  );
};

export default Navbar;