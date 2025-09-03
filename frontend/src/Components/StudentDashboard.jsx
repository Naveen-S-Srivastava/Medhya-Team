// src/Components/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Progress } from '../ui/Progress.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  MessageCircle, Calendar, Users, Shield, Heart, Brain, Phone,
  TrendingUp, Globe, Zap, CheckCircle, Target, Smartphone, AlertTriangle, Lock,
  BookOpen, X
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, forceRefreshProfileStatus } = useAuth();
  const [showProfileStatus, setShowProfileStatus] = useState(true);
  
  const studentStats = {
    totalSessions: 47,
    peersHelped: 8,
    wellnessScore: 78,
    streakDays: 12,
  };

  const isProfileComplete = user?.isProfileComplete;
  
  // Debug logging
  console.log('🔍 StudentDashboard - User profile status:', {
    userId: user?._id,
    isProfileComplete: user?.isProfileComplete,
    user: user
  });

  // Force refresh profile status when component mounts
  useEffect(() => {
    if (user?._id && !isProfileComplete) {
      console.log('🔍 Force refreshing profile status on dashboard load');
      forceRefreshProfileStatus();
    }
  }, [user?._id, isProfileComplete, forceRefreshProfileStatus]);

  // Reset profile status visibility on page refresh/component mount
  useEffect(() => {
    // Check if user previously closed the profile status
    const hideProfileStatus = localStorage.getItem('hideProfileStatus');
    if (hideProfileStatus !== 'true') {
      setShowProfileStatus(true);
    } else {
      setShowProfileStatus(false);
    }
  }, []);

  const handleCompleteProfile = () => {
    navigate('/user-signup', {
      state: {
        isProfileCompletion: true,
        userData: user
      }
    });
  };

  const handleRefreshProfileStatus = async () => {
    try {
      console.log('🔍 Manually refreshing profile status');
      await forceRefreshProfileStatus();
      console.log('✅ Profile status refreshed manually');
    } catch (error) {
      console.error('❌ Failed to refresh profile status:', error);
    }
  };

  const handleCloseProfileStatus = () => {
    setShowProfileStatus(false);
    // Store the preference in localStorage
    localStorage.setItem('hideProfileStatus', 'true');
  };

  // Limited Dashboard Content for Incomplete Profiles
  const LimitedDashboardContent = () => (
    <div className="space-y-6">
      {/* Profile Completion Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Profile Incomplete:</strong> Complete your profile to unlock all MindCare features including AI chat, 
          counselor appointments, assessments, and community features.
        </AlertDescription>
      </Alert>

      {/* Profile Completion Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Shield className="h-5 w-5" />
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-orange-700">
            Help us personalize your experience and unlock all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">Profile Completion</span>
              <span className="text-sm font-medium text-orange-800">0%</span>
            </div>
            <Progress value={0} className="h-2 bg-orange-200" />
            <p className="text-sm text-orange-700">
              Your profile is currently incomplete. Complete it to access all features.
            </p>
            <Button 
              onClick={handleCompleteProfile}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Complete Profile Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Features - Only Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            Available Features
          </CardTitle>
          <CardDescription className="text-green-700">
            You can access these features while completing your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Resources - Available */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-800 text-base">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Resources
                </CardTitle>
                <CardDescription className="text-green-700">
                  Access mental health resources and materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/resources')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Access Resources
                </Button>
              </CardContent>
            </Card>

            {/* AI Chat - Locked */}
            <Card className="border-gray-200 bg-gray-50 opacity-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-600 text-base">
                  <X className="h-5 w-5 text-gray-500" />
                  AI Chat Support
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Get instant mental health support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  disabled 
                  className="w-full"
                >
                  Complete Profile to Unlock
                </Button>
              </CardContent>
            </Card>

            {/* Appointments - Locked */}
            <Card className="border-gray-200 bg-gray-50 opacity-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-600 text-base">
                  <X className="h-5 w-5 text-gray-500" />
                  Counselor Appointments
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Book sessions with professional counselors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  disabled 
                  className="w-full"
                >
                  Complete Profile to Unlock
                </Button>
              </CardContent>
            </Card>

            {/* Community - Locked */}
            <Card className="border-gray-200 bg-gray-50 opacity-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-600 text-base">
                  <X className="h-5 w-5 text-gray-500" />
                  Community
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Connect with peers and share experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  disabled 
                  className="w-full"
                >
                  Complete Profile to Unlock
                </Button>
              </CardContent>
            </Card>

            {/* Wellness - Locked */}
            <Card className="border-gray-200 bg-gray-50 opacity-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-600 text-base">
                  <X className="h-5 w-5 text-gray-500" />
                  Wellness
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Track your mental wellness progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  disabled 
                  className="w-full"
                >
                  Complete Profile to Unlock
                </Button>
              </CardContent>
            </Card>

            {/* Dashboard - Locked */}
            <Card className="border-gray-200 bg-gray-50 opacity-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-600 text-base">
                  <X className="h-5 w-5 text-gray-500" />
                  Full Dashboard
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Access comprehensive dashboard features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  disabled 
                  className="w-full"
                >
                  Complete Profile to Unlock
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Full Dashboard Content for Complete Profiles
  const FullDashboardContent = () => (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="flex flex-row gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Wellness Score</CardTitle>
            <Heart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{studentStats.wellnessScore}%</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <p className="text-xs text-green-700">+5% this week</p>
            </div>
            <Progress value={studentStats.wellnessScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Daily Streak</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{studentStats.streakDays} days</div>
            <p className="text-xs text-green-700">Keep it up! 🔥</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">AI Sessions</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{studentStats.totalSessions}</div>
            <p className="text-xs text-purple-700">Total conversations</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Community Impact</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{studentStats.peersHelped}</div>
            <p className="text-xs text-orange-700">Peers supported</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Wellness Journey */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-blue-600" />Quick Actions</CardTitle>
            <CardDescription>Get immediate support when you need it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => navigate('/chat')}>
              <MessageCircle className="w-4 h-4 mr-2" /> Start AI Chat Session
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/appointments')}>
              <Calendar className="w-4 h-4 mr-2" /> Book Counselor Appointment
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Phone className="w-4 h-4 mr-2" /> Emergency: 1800-599-0019 (iCALL)
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-green-600" />Your Wellness Journey</CardTitle>
            <CardDescription>Track your mental health progress with AI insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Great progress! Your consistency is paying off. Keep it up! 🌟
              </AlertDescription>
            </Alert>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/wellness')}>
              <Brain className="w-4 h-4 mr-2" /> Go to Wellness Center
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid flex-row gap-6 md:grid-cols-3">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>HIPAA compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Anonymous mode available</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Local data processing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Cultural Adaptation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>15+ Indian languages</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Regional counseling</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Cultural sensitivity</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Family-inclusive care</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              Mobile-First Design
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Offline mode support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Low bandwidth optimized</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Progressive Web App</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Voice interface ready</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Profile Status Section
  const ProfileStatusSection = () => (
    <Card className={`${isProfileComplete ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'} relative`}>
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCloseProfileStatus}
        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-white/20 hover:scale-110 transition-all duration-200 rounded-full"
        title="Close Profile Status"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isProfileComplete ? 'text-green-800' : 'text-orange-800'}`}>
          {isProfileComplete ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          Profile Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className={`text-sm ${isProfileComplete ? 'text-green-700' : 'text-orange-700'}`}>
              {isProfileComplete 
                ? "Your profile is complete! You have access to all MindCare features including AI Chat, Appointments, Community, and Wellness." 
                : "Complete your profile to unlock all MindCare features. Currently, you only have access to Resources. After completing your profile, click 'Refresh Status' to update your access."
              }
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isProfileComplete ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              <span className={`text-sm font-medium ${isProfileComplete ? 'text-green-800' : 'text-orange-800'}`}>
                {isProfileComplete ? 'Profile Complete - Full Access' : 'Profile Incomplete - Limited Access'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')}
              className={`${isProfileComplete ? 'border-green-300 text-green-700 hover:bg-green-100' : 'border-orange-300 text-orange-700 hover:bg-orange-100'}`}
            >
              View Profile
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefreshProfileStatus}
              className="border-blue-300 text-blue-700 hover:bg-blue-100 font-medium"
            >
              🔄 Refresh Status
            </Button>
            {!isProfileComplete && (
              <Button 
                onClick={handleCompleteProfile}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Complete Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {showProfileStatus && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <ProfileStatusSection />
        </div>
      )}
      
      {/* Show Profile Status Button (when hidden) */}
      {!showProfileStatus && (
        <div className="text-center animate-in slide-in-from-top-2 duration-300">
          <Button
            variant="outline"
            onClick={() => {
              setShowProfileStatus(true);
              localStorage.removeItem('hideProfileStatus');
            }}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Shield className="h-4 w-4 mr-2" />
            Show Profile Status
          </Button>
        </div>
      )}
      
      {isProfileComplete ? <FullDashboardContent /> : <LimitedDashboardContent />}
    </div>
  );
};

export default StudentDashboard;