import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  LayoutDashboard, Calendar, MessageSquare, Users, DollarSign, User, TrendingUp,
  RefreshCw, LogOut, Bell, ChevronDown, Eye, Send, Phone,
  CheckCircle, Shield, Globe, Smartphone, AlertCircle
  
} from 'lucide-react';
import { useCounselorDashboard } from '../hooks/useCounselorDashboard';

// Main Dashboard Component
const CounselorDashboard = () => {
  // Use the counselor dashboard hook
  const {
    loading,
    error,
    dashboardData,
    getDashboardOverview,
    getUpcomingSessions,
    getRecentMessages,
    sendMessage,
    markMessageAsRead,
    getPaymentRecords,
    getStudentList,
    updateAppointmentStatus,
    getCounselorProfile,
    updateCounselorProfile,
    clearError
  } = useCounselorDashboard();
  
  // Local state
  const [activeView, setActiveView] = useState('dashboard');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  // Data states
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    loadProfile();
  }, []);

  // Load data when view changes
  useEffect(() => {
    switch (activeView) {
      case 'sessions':
        loadSessions();
        break;
      case 'messages':
        loadMessages();
        break;
      case 'students':
        loadStudents();
        break;
      case 'payments':
        loadPayments();
        break;
      case 'profile':
        loadProfile();
        break;
    }
  }, [activeView]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const loadDashboardData = async () => {
    try {
      await getDashboardOverview();
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await getCounselorProfile();
      setProfile(response.counselor);
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await getUpcomingSessions({ limit: 50 });
      setSessions(response.appointments || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await getRecentMessages({ limit: 50 });
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await getStudentList({ limit: 50 });
      setStudents(response.students || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await getPaymentRecords({ limit: 50 });
      setPayments(response.payments || []);
    } catch (err) {
      console.error('Failed to load payments:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleUpdateAppointmentStatus = async (sessionId, status) => {
    try {
      await updateAppointmentStatus(sessionId, status);
      // Reload sessions after update
      loadSessions();
      loadDashboardData();
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const handleMarkMessageAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      // Reload messages after update
      loadMessages();
      loadDashboardData();
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedStudent || !messageContent.trim()) return;
    
    try {
      await sendMessage({
        recipientId: selectedStudent._id,
        content: messageContent.trim(),
        messageType: 'text'
      });
      
      setShowMessageModal(false);
      setMessageContent('');
      setSelectedStudent(null);
      
      // Reload messages after sending
      loadMessages();
      loadDashboardData();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };
  
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (time) => time;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const getPaymentStatusColor = (status) => { return 'bg-gray-100 text-gray-800 border-gray-300'; };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sessions', label: 'Sessions', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  // Show error message if there's an error
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => { clearError(); loadDashboardData(); }} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-br from-sky-100 via-white to-blue-100 transition-colors duration-300 font-['Inter'] antialiased">
       <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        {/* Top Bar: Logo, System Status, User Menu */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-xl shadow-lg">M</div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">MEDHYA</h1>
              <p className="text-xs text-gray-500 font-medium">Counselor Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-700 border border-green-200 font-medium hidden lg:flex items-center shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>System Active
            </Badge>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"><Bell className="h-5 w-5" /></Button>
            <div className="relative dropdown-container">
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 text-left">
                <Avatar className="h-10 w-10 ring-2 ring-indigo-100">
                  <AvatarImage src={profile?.profileImage} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-semibold">
                    {profile?.name?.charAt(0) || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{profile?.name || 'Counselor'}</p>
                  <p className="text-xs text-gray-500">Counselor</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{profile?.name || 'Counselor'}</p>
                    <p className="text-xs text-gray-500">{profile?.email || 'counselor@example.com'}</p>
                  </div>
                  <button 
                    onClick={() => { setActiveView('profile'); setDropdownOpen(false); }} 
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <User className="h-4 w-4" /> 
                    My Profile
                  </button>
                  <button 
                    onClick={() => { setActiveView('dashboard'); setDropdownOpen(false); }} 
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" /> 
                    Dashboard
                  </button>
                  <div className="my-1 h-px bg-gray-200" />
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" /> 
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Second, SEPARATE Bar: Navigation Links */}
        <div className="h-14 bg-white/90 backdrop-blur-sm border-b border-gray-200">
            <nav className="max-w-7xl mx-auto h-full flex items-center gap-8 px-6">
                {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeView === item.id ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-md border border-indigo-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}>
                    <item.icon className="h-4 w-4" />{item.label}
                </button>
                ))}
            </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 capitalize">{activeView === 'dashboard' ? 'Counselor Dashboard' : activeView}</h1>
            <p className="text-gray-600 mt-2 text-lg">Monitor your students and manage appointments with modern insights.</p>
          </div>
          <Button 
            onClick={loadDashboardData} 
            disabled={loading} 
            variant="outline" 
            className="bg-white shadow-lg border-indigo-300 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
            Refresh Data
          </Button>
        </div>
        
        <div className="space-y-6">
          {activeView === 'dashboard' && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg rounded-xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">Today's Sessions</CardTitle>
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">
                      {dashboardData.todayAppointments?.length || 0}
                    </div>
                    <p className="text-xs text-blue-700 font-medium">{dashboardData.pendingCount || 0} pending</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg rounded-xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-800">Unread Messages</CardTitle>
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-900">
                      {dashboardData.unreadCount || 0}
                    </div>
                    <p className="text-xs text-green-700 font-medium">Requires attention</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg rounded-xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800">Active Students</CardTitle>
                    <Users className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900">
                      {students.length}
                    </div>
                    <p className="text-xs text-purple-700 font-medium">Total active students</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg rounded-xl transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-orange-800">Monthly Sessions</CardTitle>
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-900">
                      {dashboardData.completedThisMonth || 0}
                    </div>
                    <p className="text-xs text-orange-700 font-medium">Completed this month</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                      <Calendar className="w-6 h-6 text-blue-600" /> Today's Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.todayAppointments?.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No appointments today</p>
                        <p className="text-gray-400 text-sm">Enjoy your free time!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.todayAppointments?.map((appointment) => (
                          <div key={appointment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                                <AvatarImage src={appointment.student?.profileImage} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                                  {appointment.student?.firstName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {appointment.student?.firstName} {appointment.student?.lastName}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">{appointment.timeSlot}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(appointment.status)} shadow-sm font-medium`}>
                              {appointment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                      <MessageSquare className="w-6 h-6 text-green-600" /> Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.recentMessages?.length === 0 ? (
                      <div className="text-center py-6">
                        <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No recent messages</p>
                        <p className="text-gray-400 text-sm">All caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.recentMessages?.map((message) => (
                          <div key={message._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-green-100 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 ring-2 ring-green-100">
                                <AvatarImage src={message.sender?.profileImage} />
                                <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-semibold">
                                  {message.sender?.firstName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {message.sender?.firstName} {message.sender?.lastName}
                                </p>
                                <p className="text-sm text-gray-600 truncate max-w-xs font-medium">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                            {!message.isRead && (
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-blue-200 bg-white shadow-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                      <Shield className="w-6 h-6 text-blue-600" /> Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>End-to-end encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>HIPAA compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Anonymous mode available</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Local data processing</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-purple-200 bg-white shadow-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                      <Globe className="w-6 h-6 text-purple-600" /> Cultural Adaptation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>15+ Indian languages</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Regional counseling</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Cultural sensitivity</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Family-inclusive care</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-green-200 bg-white shadow-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                      <Smartphone className="w-6 h-6 text-green-600" /> Mobile-First Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Offline mode support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Low bandwidth optimized</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Progressive Web App</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Voice interface ready</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeView === 'sessions' && (
            <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                  <Calendar className="w-6 h-6 text-blue-600" />All Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading sessions...</p>
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No upcoming sessions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                            <AvatarImage src={session.student?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                              {session.student?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {session.student?.firstName} {session.student?.lastName}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                              {formatDate(session.date)} at {formatTime(session.timeSlot)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(session.status)} shadow-sm font-medium`}>
                            {session.status}
                          </Badge>
                          {session.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                onClick={() => handleUpdateAppointmentStatus(session._id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleUpdateAppointmentStatus(session._id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {activeView === 'messages' && (
            <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                  <MessageSquare className="w-6 h-6 text-green-600" />All Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No messages</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-green-100 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 ring-2 ring-green-100">
                            <AvatarImage src={message.sender?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-semibold">
                              {message.sender?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {message.sender?.firstName} {message.sender?.lastName}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!message.isRead && (
                            <Badge className="bg-green-500 text-white shadow-sm font-medium">Unread</Badge>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-green-300 hover:border-green-600 hover:bg-green-50 transition-all duration-300"
                            onClick={() => handleMarkMessageAsRead(message._id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {activeView === 'students' && (
            <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                  <Users className="w-6 h-6 text-purple-600" />My Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading students...</p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No students found</p>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                      <div key={student._id} className="p-5 border border-gray-200 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-purple-100 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-16 h-16 ring-2 ring-purple-100">
                            <AvatarImage src={student.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 font-semibold text-lg">
                              {student.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-800 text-lg">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{student.email}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105" 
                          onClick={() => { setSelectedStudent(student); setShowMessageModal(true); }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />Send Message
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {activeView === 'payments' && (
            <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                  <DollarSign className="w-6 h-6 text-orange-600" />Payment Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading payments...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No payment records</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-orange-50 hover:to-orange-100 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 ring-2 ring-orange-100">
                            <AvatarImage src={payment.student?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-700 font-semibold">
                              {payment.student?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {payment.student?.firstName} {payment.student?.lastName}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{payment.description}</p>
                            <p className="text-xs text-gray-500 font-medium">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-gray-800">₹{payment.amount}</p>
                          <Badge className={`${getPaymentStatusColor(payment.paymentStatus)} shadow-sm font-medium`}>
                            {payment.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {activeView === 'profile' && (
            <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                  <User className="w-6 h-6 text-indigo-600" />Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading profile...</p>
                  </div>
                ) : profile ? (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-20 h-20 border">
                        <AvatarImage src={profile.profileImage} />
                        <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                          {profile.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-2xl font-semibold">{profile.name}</h3>
                        <p className="text-gray-600">{profile.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{profile.phone}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.specialization?.map((spec, i) => (
                            <Badge key={i} variant="secondary">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.languages?.map((lang, i) => (
                            <Badge key={i} variant="secondary" className="bg-green-100 text-green-800">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Experience</h4>
                        <div>
                          <p>{profile.experience} years of experience</p>
                          <p className="text-sm text-gray-600">
                            {profile.education?.degree} from {profile.education?.institution}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Bio</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Profile not found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {showMessageModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in-50 zoom-in-95">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Message</h3>
              {selectedStudent && (
                <div className="mb-4 p-2 bg-blue-50 rounded-md border border-blue-200 text-blue-700 text-sm">
                  To: {selectedStudent.firstName} {selectedStudent.lastName}
                </div>
              )}
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" 
                rows="4" 
                placeholder="Type your message..." 
                value={messageContent} 
                onChange={(e) => setMessageContent(e.target.value)} 
              />
                <div className="flex justify-end gap-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => { 
                    setShowMessageModal(false); 
                    setSelectedStudent(null); 
                    setMessageContent(''); 
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!messageContent.trim() || loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </Button>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default CounselorDashboard;