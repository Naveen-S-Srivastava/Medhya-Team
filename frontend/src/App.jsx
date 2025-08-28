import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';
import {
  MessageCircle, Calendar, BookOpen, Users, BarChart3, Shield, Heart, Brain, Phone,
  Star, TrendingUp, Globe, Zap, Award, CheckCircle, ArrowRight, Menu, X, Map,
  Smartphone, Lock, Database, Clock, AlertTriangle, Target, Users2, Building2
} from 'lucide-react';
import AIChat from './CAIChat.jsx';
import AppointmentBooking from './AppointmentBooking.jsx';
import ResourceHub from './ResourceHub.jsx';
import PeerSupport from './PeerSupport.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import LandingPage from './LandingPage.jsx';
import CrisisManagement from './CrisisManagement.jsx';
import InnovationShowcase from './InnovationShowcase.jsx';
import Login from './lLogin.jsx';
import Signup from './SignUp.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'signup', 'app'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('guest');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const studentStats = {
    totalSessions: 47,
    resourcesViewed: 23,
    upcomingAppointments: 2,
    peersHelped: 8,
    wellnessScore: 78,
    streakDays: 12,
    moodTrend: 'improving'
  };

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
    setCurrentView('app');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole('guest');
    setUser(null);
    setCurrentView('landing');
    setActiveTab('dashboard');
  };

  const showLogin = () => {
    setCurrentView('login');
  };

  const showSignup = () => {
    setCurrentView('signup');
  };

  const showLanding = () => {
    setCurrentView('landing');
  };

  // Landing Page View
  if (currentView === 'landing') {
    return <LandingPage onLogin={showLogin} systemStats={systemStats} />;
  }

  // Login Page View
  if (currentView === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onShowSignup={showSignup}
        onBack={showLanding}
      />
    );
  }

  // Signup Page View
  if (currentView === 'signup') {
    return (
      <Signup
        onLogin={handleLogin}
        onShowLogin={showLogin}
        onBack={showLanding}
      />
    );
  }

  // Main Application View (after authentication)
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MindSupport Pro
                  </h1>
                  <p className="text-sm text-muted-foreground">Advanced Digital Psychological Intervention System</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  System Active
                </Badge>
                <Badge variant="secondary">{systemStats.activeUsers.toLocaleString()} Active Users</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
                  {userRole === 'admin' ? 'Administrator' : 'Student Portal'}
                </Badge>
                {userRole === 'student' && (
                  <Badge variant="outline" className="text-blue-600">
                    Wellness Score: {studentStats.wellnessScore}%
                  </Badge>
                )}
              </div>
              {user && (
                <div className="hidden md:block text-sm">
                  Welcome, <span className="font-medium">{user.name}</span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="space-y-2">
                <Badge variant={userRole === 'admin' ? 'default' : 'secondary'} className="w-full justify-center">
                  {userRole === 'admin' ? 'Administrator Portal' : 'Student Portal'}
                </Badge>
                {userRole === 'student' && (
                  <Badge variant="outline" className="w-full justify-center text-blue-600">
                    Wellness Score: {studentStats.wellnessScore}%
                  </Badge>
                )}
                {user && (
                  <div className="text-center text-sm text-muted-foreground">
                    Welcome, {user.name}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {userRole === 'admin' ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="crisis" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Crisis Management
              </TabsTrigger>
              <TabsTrigger value="innovation" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Innovation
              </TabsTrigger>
              <TabsTrigger value="institutions" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Institutions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AdminDashboard />
            </TabsContent>
            <TabsContent value="crisis">
              <CrisisManagement />
            </TabsContent>
            <TabsContent value="innovation">
              <InnovationShowcase />
            </TabsContent>
            <TabsContent value="institutions">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Multi-Institution Management
                    </CardTitle>
                    <CardDescription>
                      Manage mental health programs across {systemStats.totalInstitutions} educational institutions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-6 border rounded-lg">
                        <h3 className="text-2xl font-bold text-blue-600">{systemStats.totalInstitutions}</h3>
                        <p className="text-sm text-muted-foreground">Partner Institutions</p>
                      </div>
                      <div className="text-center p-6 border rounded-lg">
                        <h3 className="text-2xl font-bold text-green-600">98.7%</h3>
                        <p className="text-sm text-muted-foreground">System Uptime</p>
                      </div>
                      <div className="text-center p-6 border rounded-lg">
                        <h3 className="text-2xl font-bold text-purple-600">15+</h3>
                        <p className="text-sm text-muted-foreground">Indian Languages</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">AI Support</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
              <TabsTrigger value="wellness" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Wellness</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
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
                      onClick={() => setActiveTab('chat')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start AI Chat Session
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-green-200 hover:bg-green-50"
                      onClick={() => setActiveTab('appointments')}
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
                      onClick={() => setActiveTab('wellness')}
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
            </TabsContent>

            <TabsContent value="chat">
              <AIChat />
            </TabsContent>

            <TabsContent value="appointments">
              <AppointmentBooking />
            </TabsContent>

            <TabsContent value="resources">
              <ResourceHub />
            </TabsContent>

            <TabsContent value="community">
              <PeerSupport />
            </TabsContent>

            <TabsContent value="wellness" className="space-y-6">
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
            </TabsContent>
          </Tabs>
        )}
      </div>

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
    </div >
  );
}