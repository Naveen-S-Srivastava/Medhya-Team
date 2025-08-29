import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Badge } from './ui/Badge.jsx';
import { Alert, AlertDescription } from './ui/Alert.jsx';
import { Progress } from './ui/Progress.jsx';
import {
  MessageCircle, Calendar, BookOpen, Users, BarChart3, Shield, Heart, Brain, Phone,
  Star, TrendingUp, Globe, Zap, Award, CheckCircle, ArrowRight, Menu, X, Map,
  Smartphone, Lock, Database, Clock, AlertTriangle, Target, Users2, Building2
} from 'lucide-react';
import AIChat from './Components/AIChat.jsx';
import AppointmentBooking from './Components/AppointmentBooking.jsx';
import ResourceHub from './Components/ResourceHub.jsx';
import PeerSupport from './Components/PeerSupport.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx';
import LandingPage from './Components/LandingPage.jsx';
import InnovationShowcase from './Components/InnovationShowcase.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/SignUp.jsx';
import UserSignup from './Components/UserSignup.jsx';
import CrisisManagement from './Components/CrisisManagement.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, userRole }) => {
  if (userRole === 'guest') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main App Layout Component
const AppLayout = ({ userRole, user, onLogout, systemStats, navigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const studentStats = {
    totalSessions: 47,
    resourcesViewed: 23,
    upcomingAppointments: 2,
    peersHelped: 8,
    wellnessScore: 78,
    streakDays: 12,
    moodTrend: 'improving'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MindSupport Pro
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Advanced Digital Psychological Intervention System</p>
                </div>
              </div>
              
              {/* System Status Badges */}
              {userRole !== 'guest' && (
                <div className="hidden lg:flex items-center gap-3 ml-8">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    System Active
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700 border-blue-200">
                    {systemStats.activeUsers.toLocaleString()} Active Users
                  </Badge>
                </div>
              )}
            </div>

            {/* Right Side Navigation */}
            <div className="flex items-center gap-4">
              {userRole === 'guest' ? (
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 px-4 py-2"
                  >
                    Student Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2"
                  >
                    Admin Portal
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  {/* Navigation Links for Authenticated Users */}
                  <div className="hidden lg:flex items-center gap-1">
                    {userRole === 'student' ? (
                      <>
                        <Link to="/dashboard">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link to="/chat">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            AI Chat
                          </Button>
                        </Link>
                        <Link to="/appointments">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            Appointments
                          </Button>
                        </Link>
                        <Link to="/resources">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Resources
                          </Button>
                        </Link>
                        <Link to="/community">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2">
                            <Users className="w-4 h-4 mr-2" />
                            Community
                          </Button>
                        </Link>
                        <Link to="/wellness">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2">
                            <Heart className="w-4 h-4 mr-2" />
                            Wellness
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/admin">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50 px-3 py-2">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </Button>
                        </Link>
                        <Link to="/crisis">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-red-600 hover:bg-red-50 px-3 py-2">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Crisis Management
                          </Button>
                        </Link>
                        <Link to="/innovation">
                          <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-3 py-2">
                            <Zap className="w-4 h-4 mr-2" />
                            AI Innovation
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                  
                  {/* User Status Badges */}
                  <div className="hidden md:flex items-center gap-3">
                    <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="px-3 py-1">
                      {userRole === 'admin' ? 'Administrator' : 'Student Portal'}
                    </Badge>
                    {userRole === 'student' && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 px-3 py-1">
                        Wellness Score: {studentStats.wellnessScore}%
                      </Badge>
                    )}
                  </div>
                  
                  {/* Logout Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onLogout}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2"
                  >
                    Logout
                  </Button>
                  
                  {/* Mobile Menu Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && userRole !== 'guest' && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 bg-gray-50 rounded-lg mx-4">
              <div className="space-y-3 px-4">
                {/* Mobile Status Badges */}
                <div className="space-y-2">
                  <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="w-full justify-center py-2">
                    {userRole === 'admin' ? 'Administrator Portal' : 'Student Portal'}
                  </Badge>
                  {userRole === 'student' && (
                    <Badge variant="outline" className="w-full justify-center text-blue-600 border-blue-200 bg-blue-50 py-2">
                      Wellness Score: {studentStats.wellnessScore}%
                    </Badge>
                  )}
                </div>
                
                {/* Mobile Navigation Links */}
                <div className="space-y-1 pt-2">
                  {userRole === 'student' ? (
                    <>
                      <Link to="/dashboard" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <BarChart3 className="w-4 h-4 mr-3" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/chat" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <MessageCircle className="w-4 h-4 mr-3" />
                          AI Chat
                        </Button>
                      </Link>
                      <Link to="/appointments" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <Calendar className="w-4 h-4 mr-3" />
                          Appointments
                        </Button>
                      </Link>
                      <Link to="/resources" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <BookOpen className="w-4 h-4 mr-3" />
                          Resources
                        </Button>
                      </Link>
                      <Link to="/community" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <Users className="w-4 h-4 mr-3" />
                          Community
                        </Button>
                      </Link>
                      <Link to="/wellness" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <Heart className="w-4 h-4 mr-3" />
                          Wellness
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/admin" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-purple-600 hover:bg-purple-50">
                          <BarChart3 className="w-4 h-4 mr-3" />
                          Analytics
                        </Button>
                      </Link>
                      <Link to="/crisis" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50">
                          <AlertTriangle className="w-4 h-4 mr-3" />
                          Crisis Management
                        </Button>
                      </Link>
                      <Link to="/innovation" className="block">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                          <Zap className="w-4 h-4 mr-3" />
                          AI Innovation
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Render content based on current route */}
      {(() => {
        const path = location.pathname;
        if (path === '/dashboard') {
          return (
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-6">
                  {/* Enhanced Student Dashboard */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
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

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-800">Daily Streak</CardTitle>
                        <Zap className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-900">{studentStats.streakDays} days</div>
                        <p className="text-xs text-green-700">Keep it up! 🔥</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-800">AI Sessions</CardTitle>
                        <MessageCircle className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-900">{studentStats.totalSessions}</div>
                        <p className="text-xs text-purple-700">Total conversations</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
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
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-600" />
                          Quick Actions
                        </CardTitle>
                        <CardDescription>Get immediate support when you need it</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => navigate('/chat')}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Start AI Chat Session
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-green-200 hover:bg-green-50"
                          onClick={() => navigate('/appointments')}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Counselor Appointment
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-red-200 hover:bg-red-50 text-red-700"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Emergency: 1800-599-0019 (iCALL)
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => navigate('/wellness')}
                        >
                          <Brain className="w-4 h-4 mr-2" />
                          Today's Mood Check-in
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-600" />
                          Your Wellness Journey
                        </CardTitle>
                        <CardDescription>Track your mental health progress with AI insights</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Weekly Check-ins</span>
                            <span className="text-green-600 font-medium">6/7 days</span>
                          </div>
                          <Progress value={86} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Mindfulness Practice</span>
                            <span className="text-blue-600 font-medium">180/200 min</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Mood Trend</span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="text-green-600 font-medium">Improving</span>
                            </div>
                          </div>
                        </div>
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Great progress! Your consistency is paying off. Keep up the good work! 🌟
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Enhanced Features Section */}
                  <div className="grid gap-6 md:grid-cols-3">
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
              </div>
          );
        } else if (path === '/chat') {
          return (
            <div className="container mx-auto px-4 py-6">
              <AIChat />
            </div>
          );
        } else if (path === '/appointments') {
          return (
            <div className="container mx-auto px-4 py-6">
              <AppointmentBooking />
            </div>
          );
        } else if (path === '/resources') {
          return (
            <div className="container mx-auto px-4 py-6">
              <ResourceHub />
            </div>
          );
        } else if (path === '/community') {
          return (
            <div className="container mx-auto px-4 py-6">
              <PeerSupport />
            </div>
          );
        } else if (path === '/wellness') {
          return (
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Wellness Tracking & Mood Analysis
                    </CardTitle>
                    <CardDescription>
                      AI-powered mood tracking with personalized insights and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Advanced Wellness Features</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Track your mood, sleep patterns, stress levels, and receive AI-powered insights
                        for better mental health management.
                      </p>
                      <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
                        <Button className="h-16 flex-col gap-2" variant="outline">
                          <Heart className="w-6 h-6" />
                          <span>Daily Mood Check-in</span>
                        </Button>
                        <Button className="h-16 flex-col gap-2" variant="outline">
                          <Brain className="w-6 h-6" />
                          <span>Stress Assessment</span>
                        </Button>
                        <Button className="h-16 flex-col gap-2" variant="outline">
                          <Clock className="w-6 h-6" />
                          <span>Sleep Quality Tracker</span>
                        </Button>
                        <Button className="h-16 flex-col gap-2" variant="outline">
                          <TrendingUp className="w-6 h-6" />
                          <span>Wellness Insights</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        } else if (path === '/admin') {
          return (
            <div className="container mx-auto px-4 py-6">
              <AdminDashboard />
            </div>
          );
        } else if (path === '/crisis') {
          return (
            <div className="container mx-auto px-4 py-6">
              <CrisisManagement />
            </div>
          );
        } else if (path === '/innovation') {
          return (
            <div className="container mx-auto px-4 py-6">
              <InnovationShowcase />
            </div>
          );
        }
        return null;
      })()}

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="font-semibold mb-3">MindSupport Pro</h4>
              <p className="text-sm text-muted-foreground">
                Advanced mental health platform serving {systemStats.totalInstitutions}+ institutions across India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>24/7 Crisis Helpline</p>
                <p>iCALL: 1800-599-0019</p>
                <p>KIRAN: 1800-599-0019</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Privacy</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>HIPAA Compliant</p>
                <p>End-to-end Encryption</p>
                <p>Anonymous Sessions</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Innovation</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>AI-Powered Insights</p>
                <p>Predictive Analytics</p>
                <p>Cultural Adaptation</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 MindSupport Pro. Built for Smart India Hackathon 2024.</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Made in India</Badge>
              <Badge variant="outline">🇮🇳</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Context for managing user state
const UserContext = React.createContext();

export default function App() {
  const [userRole, setUserRole] = useState('guest');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const systemStats = {
    totalInstitutions: 127,
    activeUsers: 15420,
    sessionsToday: 342,
    crisisInterventions: 23,
    satisfactionRate: 94.6
  };

  const handleLogin = (role, userData = null) => {
    setUserRole(role);
    setUser(userData || { name: role === 'student' ? 'Demo Student' : 'Demo Admin' });
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUserRole('guest');
    setUser(null);
    setUserData(null);
    navigate('/');
  };

  const handleUserSignupComplete = (data) => {
    setUserData(data);
    navigate('/signup');
  };

  const handleBackToUserSignup = () => {
    navigate('/user-signup');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  // Redirect to landing page if accessing protected routes without authentication
  React.useEffect(() => {
    const protectedRoutes = ['/dashboard', '/chat', '/appointments', '/resources', '/community', '/wellness'];
    if (userRole === 'guest' && protectedRoutes.includes(location.pathname)) {
      navigate('/login');
    }
  }, [userRole, location.pathname, navigate]);

  return (
    <UserContext.Provider value={{ userRole, user, setUserRole, setUser }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onLogin={() => navigate('/login')} systemStats={systemStats} />} />
        
        <Route 
          path="/login" 
          element={
            <Login
              onLogin={handleLogin}
              onShowSignup={() => navigate('/signup')}
              onShowUserSignup={() => navigate('/user-signup')}
              onBack={handleBackToLanding}
            />
          } 
        />

        <Route 
          path="/user-signup" 
          element={
            <UserSignup
              onNext={handleUserSignupComplete}
              onShowLogin={handleBackToLogin}
              onBack={handleBackToLanding}
            />
          } 
        />

        <Route 
          path="/signup" 
          element={
            <Signup
              onLogin={handleLogin}
              onShowLogin={handleBackToLogin}
              userData={userData}
              onBackToUserSignup={handleBackToUserSignup}
              onBack={handleBackToLanding}
            />
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/chat" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/appointments" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/resources" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/community" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/wellness" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/crisis" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/innovation" 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} navigate={navigate} />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContext.Provider>
  );
}