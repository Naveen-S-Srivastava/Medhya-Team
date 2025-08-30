import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Alert, AlertDescription } from '../ui/Alert';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Progress } from '../ui/Progress';
import { useCounselorDashboard } from '../hooks/useCounselorDashboard';
import { 
  Calendar, 
  MessageSquare, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  User,
  FileText,
  Settings,
  Mail,
  Phone,
  MapPin,
  Star,
  Eye,
  EyeOff,
  Send,
  Plus,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Heart,
  Activity,
  Award,
  BarChart3
} from 'lucide-react';

const CounselorDashboard = () => {
  const {
    loading,
    error,
    dashboardData,
    getDashboardOverview,
    getUpcomingSessions,
    getRecentMessages,
    sendMessage,
    markMessageAsRead,
    getSessionNotes,
    createSessionNote,
    getPaymentRecords,
    getCounselorStats,
    getStudentList,
    updateAppointmentStatus,
    getCounselorProfile,
    updateCounselorProfile,
    clearError
  } = useCounselorDashboard();

  const [activeTab, setActiveTab] = useState('overview');
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sessionNotes, setSessionNotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [profile, setProfile] = useState({});
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await getDashboardOverview();
      await loadSessions();
      await loadMessages();
      await loadSessionNotes();
      await loadPayments();
      await loadStudents();
      await loadStats();
      await loadProfile();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await getUpcomingSessions({ limit: 10 });
      setSessions(response.appointments || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await getRecentMessages({ limit: 20 });
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadSessionNotes = async () => {
    try {
      const response = await getSessionNotes({ limit: 10 });
      setSessionNotes(response.sessionNotes || []);
    } catch (error) {
      console.error('Error loading session notes:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await getPaymentRecords({ limit: 10 });
      setPayments(response.payments || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await getStudentList({ limit: 20 });
      setStudents(response.students || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getCounselorStats('month');
      setStats(response.stats || {});
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await getCounselorProfile();
      setProfile(response.counselor || {});
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedStudent || !messageContent.trim()) return;

    try {
      await sendMessage({
        recipientId: selectedStudent._id,
        content: messageContent,
        priority: 'normal'
      });
      setMessageContent('');
      setShowMessageModal(false);
      setSelectedStudent(null);
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      await loadSessions();
      await getDashboardOverview();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading && !dashboardData.todayAppointments.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          <p className="text-slate-500 text-sm mt-1">Preparing everything for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Counselor Dashboard
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Welcome back, <span className="font-semibold text-sky-600">{profile.name || 'Counselor'}</span> 👋
            </p>
          </div>
          <Button 
            onClick={loadDashboardData} 
            disabled={loading}
            className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-rose-200 bg-rose-50 text-rose-700 rounded-2xl">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-slate-700 font-semibold">Today's Sessions</CardTitle>
              <div className="p-3 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-xl">
                <Calendar className="h-6 w-6 text-sky-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{dashboardData.todayAppointments.length}</div>
              <p className="text-slate-600 text-sm mt-1">
                {dashboardData.pendingCount} pending sessions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-slate-700 font-semibold">Unread Messages</CardTitle>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{dashboardData.unreadCount}</div>
              <p className="text-slate-600 text-sm mt-1">
                New messages waiting
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-slate-700 font-semibold">Total Students</CardTitle>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{students.length}</div>
              <p className="text-slate-600 text-sm mt-1">
                Active students
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-slate-700 font-semibold">Monthly Sessions</CardTitle>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-800">{dashboardData.completedThisMonth}</div>
              <p className="text-slate-600 text-sm mt-1">
                Completed this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-1 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="sessions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Sessions
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="students" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Students
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Payments
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Today's Appointments */}
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-xl">
                      <Calendar className="w-5 h-5 text-sky-600" />
                    </div>
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.todayAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No appointments today</p>
                      <p className="text-slate-400 text-sm">Enjoy your free time!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.todayAppointments.map((appointment) => (
                        <div key={appointment._id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-sky-200">
                              <AvatarImage src={appointment.student?.profileImage} />
                              <AvatarFallback className="bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-600 font-semibold">
                                {appointment.student?.firstName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {appointment.student?.firstName} {appointment.student?.lastName}
                              </p>
                              <p className="text-slate-600 text-sm">
                                {formatTime(appointment.timeSlot)}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                    </div>
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.recentMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No recent messages</p>
                      <p className="text-slate-400 text-sm">All caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {dashboardData.recentMessages.slice(0, 5).map((message) => (
                        <div key={message._id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 border-2 border-emerald-200">
                              <AvatarImage src={message.sender?.profileImage} />
                              <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 font-semibold">
                                {message.sender?.firstName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {message.sender?.firstName} {message.sender?.lastName}
                              </p>
                              <p className="text-slate-600 text-sm truncate max-w-32">
                                {message.content}
                              </p>
                            </div>
                          </div>
                          {!message.isRead && (
                            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                  </div>
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.recentPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No recent payments</p>
                    <p className="text-slate-400 text-sm">Payments will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentPayments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-rose-200">
                            <AvatarImage src={payment.student?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 font-semibold">
                              {payment.student?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {payment.student?.firstName} {payment.student?.lastName}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-slate-800">₹{payment.amount}</p>
                          <Badge className={`${getPaymentStatusColor(payment.status)} border font-medium`}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium text-lg">No upcoming sessions</p>
                    <p className="text-slate-400 text-sm">All sessions are completed or cancelled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session._id} className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-6">
                          <Avatar className="w-16 h-16 border-3 border-emerald-200">
                            <AvatarImage src={session.student?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 font-bold text-lg">
                              {session.student?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-xl text-slate-800">
                              {session.student?.firstName} {session.student?.lastName}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {session.student?.email}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {formatDate(session.date)} at {formatTime(session.timeSlot)}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {session.appointmentType} • {session.urgencyLevel}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(session.status)} border font-medium`}>
                            {session.status}
                          </Badge>
                          {session.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdateAppointmentStatus(session._id, 'confirmed')}
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateAppointmentStatus(session._id, 'cancelled')}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all duration-300"
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
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Messages</h3>
              <Button 
                onClick={() => setShowMessageModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
              <CardContent className="p-0">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium text-lg">No messages</p>
                    <p className="text-slate-400 text-sm">Start a conversation with your students</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {messages.map((message) => (
                      <div key={message._id} className="flex items-center justify-between p-6 border-b border-slate-200 last:border-b-0 hover:bg-white/30 transition-all duration-300">
                        <div className="flex items-center gap-6">
                          <Avatar className="w-14 h-14 border-2 border-purple-200">
                            <AvatarImage src={message.sender?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 font-semibold">
                              {message.sender?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-800 text-lg">
                              {message.sender?.firstName} {message.sender?.lastName}
                            </p>
                            <p className="text-slate-600 text-sm max-w-md">
                              {message.content}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {!message.isRead && message.recipientModel === 'Counselor' && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">Unread</Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markMessageAsRead(message._id)}
                            className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  My Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium text-lg">No students found</p>
                    <p className="text-slate-400 text-sm">Students will appear here once they book sessions</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                      <div key={student._id} className="p-6 bg-white/50 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-16 h-16 border-3 border-amber-200">
                            <AvatarImage src={student.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 font-bold text-lg">
                              {student.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-800 text-lg">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowMessageModal(true);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                  </div>
                  Payment Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <DollarSign className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium text-lg">No payment records</p>
                    <p className="text-slate-400 text-sm">Payment history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-6">
                          <Avatar className="w-14 h-14 border-2 border-rose-200">
                            <AvatarImage src={payment.student?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 font-semibold">
                              {payment.student?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-slate-800 text-lg">
                              {payment.student?.firstName} {payment.student?.lastName}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {payment.description || 'Session Payment'}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {formatDate(payment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-slate-800">₹{payment.amount}</p>
                          <Badge className={`${getPaymentStatusColor(payment.status)} border font-medium`}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile._id ? (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24 border-4 border-indigo-200">
                        <AvatarImage src={profile.profileImage} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 font-bold text-2xl">
                          {profile.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-3xl font-bold text-slate-800">{profile.name}</h3>
                        <p className="text-slate-600 text-lg">{profile.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.floor(profile.averageRating || 0) ? 'text-amber-400 fill-current' : 'text-slate-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-slate-600 font-medium">
                            {profile.averageRating || 0} ({profile.totalRatings || 0} ratings)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-lg">Contact Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                            <Mail className="w-5 h-5 text-sky-500" />
                            <span className="text-slate-700">{profile.email}</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                            <Phone className="w-5 h-5 text-emerald-500" />
                            <span className="text-slate-700">{profile.phone || 'Not provided'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-lg">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.specialization?.map((spec, index) => (
                            <Badge key={index} className="bg-gradient-to-r from-sky-100 to-indigo-100 text-sky-700 border-sky-200 font-medium">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-lg">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.languages?.map((lang, index) => (
                            <Badge key={index} className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 font-medium">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-lg">Experience</h4>
                        <div className="p-4 bg-white/50 rounded-xl">
                          <p className="text-slate-700 font-medium">{profile.experience} years of experience</p>
                          <p className="text-slate-600 text-sm mt-1">
                            {profile.education?.degree} from {profile.education?.institution}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-lg">Bio</h4>
                      <div className="p-4 bg-white/50 rounded-xl">
                        <p className="text-slate-700 leading-relaxed">{profile.bio || 'No bio available'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium text-lg">Loading profile...</p>
                    <p className="text-slate-400 text-sm">Please wait while we fetch your information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Send Message</h3>
                {selectedStudent && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl border border-sky-200">
                    <p className="text-sky-700 font-medium">To: {selectedStudent.firstName} {selectedStudent.lastName}</p>
                  </div>
                )}
                <textarea
                  className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                  rows="4"
                  placeholder="Type your message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMessageModal(false);
                      setSelectedStudent(null);
                      setMessageContent('');
                    }}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-2 rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!messageContent.trim()}
                    className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselorDashboard;