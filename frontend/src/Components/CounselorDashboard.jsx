
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  LayoutDashboard, Calendar, MessageSquare, Users, DollarSign, User, TrendingUp,
  RefreshCw, LogOut, Bell, ChevronDown, Eye, Send, Phone, Video,
  CheckCircle, Shield, Globe, Smartphone, AlertCircle, Lock, Key, X,
  MessageCircleIcon,

} from 'lucide-react';
import { useCounselorDashboard } from '../hooks/useCounselorDashboard';
import { useAuth } from '../hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useSocket } from "../context/SocketProvider";
import apiClient from '../utils/apiClient.js';
import { Link } from 'react-router-dom';
import StudentList from './StudentList';
import PaymentsList from './PaymentsList';
import DashboardGraphs from './DashboardGraphs';

// Main Dashboard Component
const CounselorDashboard = () => {
  // Use the counselor dashboard hook
  const {
    loading,
    error,
    dashboardData,
    getDashboardOverview,
    getUpcomingSessions,
    getPendingAppointments,
    getRecentMessages,
    sendMessage,
    markMessageAsRead,
    getPaymentRecords,
    updateAppointmentStatus,
    getCounselorProfile,
    updateCounselorProfile,
    clearError
  } = useCounselorDashboard();

  const { user, changePassword } = useAuth();

  // Local state
  const [activeView, setActiveView] = useState('dashboard');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [selectedChatStudent, setSelectedChatStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Password change modal state
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);

  // Data states
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const navigate = useNavigate();
  const socket = useSocket();
  // After login
  console.log(user?.counselorProfile);
  socket.emit("counselor-online", user?.counselorProfile);

  socket.on("student-status", ({ studentID, isOnline }) => {
    console.log(`Student ${studentID} is now ${isOnline ? "online" : "offline"}`);
  });


  // Load initial data - only once on mount
  useEffect(() => {
    loadDashboardData();
    loadProfile();
  }, []);

  // Check if password change is required when user data is available
  useEffect(() => {
    if (user?.requiresPasswordChange) {
      setShowPasswordChangeModal(true);
    }
  }, [user?.requiresPasswordChange]);  // Load data when view changes
  useEffect(() => {
    switch (activeView) {
      case 'sessions':
        loadSessions();
        break;
      case 'messages':
        loadMessages();
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

  // Periodic refresh for active chat to check for new messages from users
  useEffect(() => {
    if (!selectedChatStudent) return;

    const interval = setInterval(async () => {
      try {
        // Refresh messages and dashboard data
        await loadMessages();
        await loadDashboardData();

        // Update chat messages with fresh data
        const response = await getRecentMessages({ limit: 50 });
        const updatedMessages = response.messages || [];

        const studentMessages = updatedMessages.filter(msg => {
          if (msg.senderModel === 'User' && msg.sender?._id === selectedChatStudent._id) return true;
          if (msg.recipientModel === 'User' && msg?.recipient?._id === selectedChatStudent?._id) return true;
          return false;
        }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setChatMessages(studentMessages);
      } catch (error) {
        console.error('Error refreshing chat messages:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [selectedChatStudent]);

  const loadDashboardData = async () => {
    try {
      await getDashboardOverview();
      await getPendingAppointments();
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate password
    const errors = {};
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setChangingPassword(true);

    try {
      await changePassword(
        passwordData.currentPassword || 'TempPass123!', // Use dummy password if no current password
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      setShowPasswordChangeModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      alert('Password changed successfully!');
    } catch (err) {
      setPasswordErrors({ general: err.message });
    } finally {
      setChangingPassword(false);
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

  const handleApproveAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, 'confirmed');
      // Reload sessions after update
      loadSessions();
      loadDashboardData();
    } catch (err) {
      console.error('Failed to approve appointment:', err);
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

  // Handle individual chat with a student
  const handleStartChat = async (sessionId, student) => {
    console.log(sessionId, student)
    setSelectedChatStudent(student);
    setSelectedSessionId(sessionId);

    // Filter messages for this specific student and sort them properly for chat display
    const studentMessages = messages.filter(msg => {
      if (msg.senderModel === 'User' && msg.sender._id === student._id) return true;
      if (msg.recipientModel === 'User' && msg.recipient._id === student._id) return true;
      return false;
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort oldest first for chat display
    setChatMessages(studentMessages);

    // Mark all unread messages from this student as read
    const unreadMessages = studentMessages.filter(msg =>
      msg.senderModel === 'User' && msg.sender._id === student._id && !msg.isRead
    );

    // Mark each unread message as read
    for (const message of unreadMessages) {
      try {
        await markMessageAsRead(message._id);
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }

    // Refresh messages to update unread counts
    await loadMessages();
    await loadDashboardData();
  };


  // For starting video call (separate from chat)
  const handleStartVideoCall = async (student) => {
    console.log(student);
    try {
      const res = await apiClient.get(
        `/appointments/find/${student._id}/${user?.counselorProfile}`
      );

      if (res?.roomId) {
        console.log("Navigating to video room:", res.roomId);
        navigate(`/room/${res.roomId}`); // Go to video call page
      } else {
        alert("No active appointment found for this student.");
      }
    } catch (err) {
      console.error("Failed to start video call:", err);
    }
  };
  // Send message in individual chat
  // const handleSendChatMessage = async () => {
  //   if (!newMessage.trim() || !selectedChatStudent) return;
  //   console.log(selectedChatStudent.id);

  //   try {
  //     const messageData = {
  //       recipient: selectedChatStudent.id,
  //       content: newMessage.trim()
  //     };
  //     console.log(messageData)
  //     await sendMessage(messageData);

  //     setNewMessage('');

  //     // Refresh messages
  //     loadMessages();
  //     loadDashboardData();

  //     // Update chat messages
  //     const studentMessages = messages.filter(msg => {
  //       if (msg.senderModel === 'User' && msg.sender._id === selectedChatStudent._id) return true;
  //       if (msg.recipientModel === 'User' && msg.recipient._id === selectedChatStudent._id) return true;
  //       return false;
  //     });
  //     setChatMessages(studentMessages);
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // };

  const handleSendChatMessage = async () => {
    if (!newMessage.trim() || !selectedChatStudent?._id) return;
    console.log(selectedSessionId)

    try {
      const messageData = {
        recipientId: selectedChatStudent._id,   // ✅ FIX: correct key for counselor dashboard
        content: newMessage.trim(),
        messageType: "text",                    // ✅ default type
        appointmentId: selectedSessionId,     // ✅ pass if you have it in state
        priority: "normal"                      // optional
      };

      await sendMessage(messageData);

      setNewMessage('');

      // Reload data after sending
      await loadMessages();
      await loadDashboardData();

      // Wait a moment for the state to update, then refresh chat messages
      setTimeout(async () => {
        // Get fresh messages from the updated state
        const response = await getRecentMessages({ limit: 50 });
        const updatedMessages = response.messages || [];

        // Update local chat thread with fresh data
        const studentMessages = updatedMessages.filter(msg => {
          if (msg.senderModel === 'User' && msg.sender._id === selectedChatStudent._id) return true;
          if (msg.recipientModel === 'User' && msg.recipient._id === selectedChatStudent._id) return true;
          return false;
        }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort oldest first for chat display

        setChatMessages(studentMessages);
      }, 200); // Small delay to ensure state is updated
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  // Get unique students from messages
  // const getUniqueStudents = () => {
  //   const studentMap = new Map();
  //   messages.forEach(message => {
  //     // Students can be either sender or recipient depending on who sent the message
  //     let student = null;
  //     if (message.senderModel === 'User') {
  //       student = message.sender;
  //     } else if (message.recipientModel === 'User') {
  //       student = message.recipient;
  //     }

  //     if (student && !studentMap.has(student._id)) {
  //       studentMap.set(student._id, {
  //         ...student,
  //         lastMessage: message,
  //         unreadCount: messages.filter(m => {
  //           // Only count unread messages that the counselor received from this student
  //           return (
  //             m.senderModel === "User" &&
  //             m.sender?._id === student._id &&
  //             !m.isRead
  //           );
  //         }).length
  //       });
  //     }
  //   });
  //   return Array.from(studentMap.values());
  // };

  const getUniqueStudents = () => {
    const studentMap = new Map();

    messages.forEach(message => {
      // Students can be either sender or recipient depending on who sent the message
      let student = null;

      if (message.senderModel === "User" && message.sender?._id) {
        student = message.sender;
      } else if (message.recipientModel === "User" && message.recipient?._id) {
        student = message.recipient;
      }

      if (student && !studentMap.has(student._id)) {
        const unreadCount = messages.filter(m => {
          return (
            m.senderModel === "User" &&
            m.sender?._id === student._id && // ✅ Safe check
            !m.isRead
          );
        }).length;

        studentMap.set(student._id, {
          ...student,
          lastMessage: message,
          unreadCount
        });
      }
    });

    return Array.from(studentMap.values());
  };

  // Get all students for the message modal (including those without messages)
  const getAllStudents = () => {
    const messageStudents = getUniqueStudents();
    const allStudents = [...messageStudents];

    // Add any students from appointments who might not have messages yet
    sessions.forEach(session => {
      if (session.student && !allStudents.find(s => s._id === session.student._id)) {
        allStudents.push(session.student);
      }
    });

    // Debug: Log student data
    console.log('All Students for Message Modal:', allStudents.map(s => ({
      id: s._id,
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      hasName: !!(s.firstName && s.lastName)
    })));

    return allStudents;
  };

  // Group sessions by student and get the most recent appointment per student
  const getUniqueSessionsByStudent = () => {
    const studentSessionMap = new Map();
    const studentSessionCounts = new Map();

    sessions.forEach(session => {
      if (session.student) {
        const studentId = session.student._id;
        const existingSession = studentSessionMap.get(studentId);

        // Count total sessions for this student
        studentSessionCounts.set(studentId, (studentSessionCounts.get(studentId) || 0) + 1);

        // If no existing session or this session is more recent, use this one
        if (!existingSession || new Date(session.date) > new Date(existingSession.date)) {
          studentSessionMap.set(studentId, {
            ...session,
            totalSessions: studentSessionCounts.get(studentId)
          });
        }
      }
    });

    return Array.from(studentSessionMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
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
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center justify-center h-10 w-10 rounded-full shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img src={logo} alt="Medhya Logo" className="w-full h-full object-contain" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">MEDHYA</h1>
              <p className="text-xs text-gray-500 font-medium">Counselor Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"><Bell className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full" onClick={() => setActiveView('messages')}><MessageCircleIcon className="h-5 w-5" /></Button>
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
                    onClick={() => { setActiveView('payments'); setDropdownOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Payments
                  </button>
                  <button
                    onClick={() => { setActiveView('students'); setDropdownOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    All Students
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
                      <AlertCircle className="w-6 h-6 text-orange-600" /> Pending Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.pendingAppointments?.length === 0 ? (
                      <div className="text-center py-6">
                        <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No pending appointments</p>
                        <p className="text-gray-400 text-sm">All appointments are up to date!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.pendingAppointments?.map((appointment) => (
                          <div key={appointment._id} className="flex items-center justify-between p-4 border border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12 ring-2 ring-orange-100">
                                <AvatarImage src={appointment.student?.profileImage} />
                                <AvatarFallback className="bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-700 font-semibold">
                                  {appointment.student?.firstName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {appointment.student?.firstName} {appointment.student?.lastName}
                                </p>
                                <p className="text-sm text-gray-600 font-medium">
                                  {new Date(appointment.date).toLocaleDateString()} at {appointment.timeSlot}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {appointment.appointmentType === 'oncampus' ? 'In-Person' : 'Online'}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveAppointment(appointment._id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateAppointmentStatus(appointment._id, 'cancelled')}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              {/* <div className="grid gap-6 md:grid-cols-2">
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
              </div> */}

              <div className="grid gap-6 md:grid-cols-1">
                <DashboardGraphs />
              </div>
            </>
          )}
          {activeView === 'sessions' && (
            <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
                  <Calendar className="w-6 h-6 text-blue-600" />All Sessions
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">Showing most recent appointment per student</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Loading sessions...</p>
                  </div>
                ) : getUniqueSessionsByStudent().length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No upcoming sessions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getUniqueSessionsByStudent().map((session) => (
                      <div
                        key={session._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          handleStartChat(session._id, session.student);
                          setActiveView("messages");
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                            <AvatarImage src={session.student?.profileImage} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                              {session.student?.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-800">
                                {session.student?.firstName} {session.student?.lastName}
                              </p>
                              {session.totalSessions > 1 && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                  {session.totalSessions} sessions
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                              {formatDate(session.date)} at {formatTime(session.timeSlot)}
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-3"
                          onClick={(e) => e.stopPropagation()} // ✅ stop bubbling
                        >
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)] overflow-hidden">
              {/* Left Sidebar - Counselor Tools */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6 h-full">
                  <div className="flex flex-col h-full">
                    {/* Counselor Info */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg overflow-hidden">
                        <img src={logo} alt="Medhya Logo" className="w-full h-full object-contain" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">Medhya Portal</h2>
                      <p className="text-sm text-gray-600">Professional Support Tools</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4 flex-1">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 text-sm">Quick Actions</h3>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                            📋 View All Sessions
                          </Button>
                          <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                            📊 Analytics Dashboard
                          </Button>
                          <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                            📝 Session Notes
                          </Button>
                          <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                            🎯 Treatment Plans
                          </Button>
                        </div>
                      </div>

                      {/* Session Stats */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mt-4">
                        <h4 className="font-semibold text-gray-800 text-sm mb-2">Today's Stats</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Active Chats</span>
                            <span className="font-semibold text-green-600">{getUniqueStudents().length}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Messages Sent</span>
                            <span className="font-semibold text-blue-600">{messages.length}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Pending Approvals</span>
                            <span className="font-semibold text-orange-600">{dashboardData.pendingAppointments?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">Emergency Protocol</p>
                        <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                          🚨 Crisis Alert
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Chat Area */}
              <div className="lg:col-span-3">
                <Card className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 h-full">
                  <div className="h-full flex flex-col">
                    {!selectedChatStudent ? (
                      // Chat List View (WhatsApp-style)
                      <div className="flex-1 flex flex-col">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 border-b border-green-300 p-4 rounded-t-2xl">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Messages</h2>
                            <Button
                              onClick={() => setShowMessageModal(true)}
                              disabled={getAllStudents().length === 0}
                              className="bg-white/20 hover:bg-white/30 text-white border-white/30 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              New Chat
                            </Button>
                          </div>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
                          {loading ? (
                            <div className="flex items-center justify-center h-full">
                              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                          ) : getUniqueStudents().length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                              <h3 className="text-lg font-semibold text-gray-700 mb-2">No conversations yet</h3>
                              <p className="text-gray-500 mb-4">Start chatting with your students</p>
                              <Button
                                onClick={() => setShowMessageModal(true)}
                                disabled={getAllStudents().length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {getAllStudents().length === 0 ? 'No Students Available' : 'Start First Chat'}
                              </Button>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {getUniqueStudents().map((student) => (
                                <div
                                  key={student._id}
                                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                  onClick={() => {
                                    // Find the most recent appointment/session for this student
                                    const studentSession = sessions.find(session =>
                                      session.student?._id === student?._id
                                    );
                                    const sessionId = studentSession ? studentSession?._id : null;
                                    handleStartChat(sessionId, student);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <Avatar className="w-12 h-12">
                                        <AvatarImage src={student.profileImage} />
                                        <AvatarFallback className="bg-green-100 text-green-700">
                                          {student.firstName?.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      {student.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                                          {student.unreadCount}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                          {student.firstName} {student.lastName}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                          {formatDate(student.lastMessage?.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 truncate">
                                        {student.lastMessage?.content}
                                      </p>
                                    </div>

                                    {student.unreadCount > 0 && (
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Individual Chat View
                      <div className="flex-1 flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 border-b border-green-300 p-4 flex justify-between items-center rounded-t-2xl">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedChatStudent(null)}
                              className="text-white hover:text-green-100 hover:bg-white/20 rounded-full"
                            >
                              ←
                            </Button>
                            <Avatar className="w-12 h-12 ring-2 ring-white/30">
                              <AvatarImage src={selectedChatStudent.profileImage} />
                              <AvatarFallback className="bg-white/20 text-white font-semibold">
                                {selectedChatStudent.firstName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-white">
                                {selectedChatStudent.firstName} {selectedChatStudent.lastName}
                              </h3>
                              <p className="text-sm text-green-100">Student</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            {/* <div className="flex items-center pr-4" onClick={() => {
                              setSelectedChatStudent(selectedChatStudent._id); // ✅ update state
                              console.log(selectedChatStudent._id);
                              navigate(`/room/${selectedChatStudent._id}`); // or appointment.roomId
                            }}
                            >
                              <Video size={35} className="text-white hover:text-green-100 cursor-pointer" />
                            </div> */}
                            <div className="flex items-center pr-4" onClick={() => handleStartVideoCall(selectedChatStudent)}>
                              <Video size={35} />
                            </div>
                          </div>
                        </div>

                        {/* Messages - Dynamic height with scroll */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-green-50/30 relative" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                          {/* Subtle pattern overlay */}
                          <div className="absolute inset-0 opacity-5 pointer-events-none">
                            <div className="absolute inset-0" style={{
                              backgroundImage: `radial-gradient(circle at 25px 25px, #10b981 2px, transparent 0)`,
                              backgroundSize: '50px 50px'
                            }}></div>
                          </div>
                          {chatMessages.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                              <p>No messages yet. Start the conversation!</p>
                            </div>
                          ) : (
                            chatMessages.map((message) => {
                              const isStudentMessage = (message.senderModel === 'User');
                              return (
                                <div
                                  key={message._id}
                                  className={`flex ${isStudentMessage ? 'justify-start' : 'justify-end'} relative z-10`}
                                >
                                  <div
                                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${isStudentMessage
                                      ? 'bg-white border border-gray-200 shadow-md'
                                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                      }`}
                                  >
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    <p className={`text-xs mt-2 ${isStudentMessage
                                      ? 'text-gray-500'
                                      : 'text-green-100'
                                      }`}>
                                      {formatDate(message.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Message Input */}
                        <div className="bg-gradient-to-r from-white to-green-50/50 border-t border-green-200/50 p-4 rounded-b-2xl">
                          <div className="flex gap-3">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-full px-4 py-3 bg-white/80 backdrop-blur-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                              />
                            </div>
                            <Button
                              onClick={handleSendChatMessage}
                              disabled={!newMessage.trim()}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
          {activeView === 'students' && (
            <StudentList
              loading={loading}
              onSendMessage={(student) => {
                setSelectedStudent(student);
                setShowMessageModal(true);
              }}
              onRefresh={loadDashboardData}
            />
          )}
          {activeView === 'payments' && (
            <PaymentsList
              payments={payments}
              loading={loading}
            />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Send Message</h3>
                  <p className="text-sm text-gray-600">Communicate with your students</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedStudent(null);
                  setMessageContent('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Recipient Selection */}
              {selectedStudent ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedStudent.profileImage} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {selectedStudent.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </p>
                    <p className="text-sm text-blue-700">{selectedStudent.email}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Student</label>
                  {getAllStudents().length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                      <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">No students available yet</p>
                      <p className="text-gray-500 text-xs">Students will appear here after booking appointments</p>
                    </div>
                  ) : (
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onChange={(e) => {
                        const student = getAllStudents().find(s => s._id === e.target.value);
                        setSelectedStudent(student);
                      }}
                    >
                      <option value="">Choose a student...</option>
                      {getAllStudents().map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.firstName && student.lastName
                            ? `${student.firstName} ${student.lastName} (${student.email})`
                            : student.email
                          }
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows="6"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Keep your message professional and supportive</span>
                  <span>{messageContent.length}/500</span>
                </div>
              </div>

              {/* Quick Message Templates */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quick Templates</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Thank you for reaching out. I'm here to help.",
                    "Let's schedule a follow-up session.",
                    "How are you feeling today?",
                    "I'm proud of your progress."
                  ].map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-left justify-start text-xs h-auto p-2 border-gray-200 hover:border-green-300 hover:bg-green-50"
                      onClick={() => setMessageContent(template)}
                    >
                      {template}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedStudent(null);
                  setMessageContent('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSendMessage();
                  // After sending, start chat with the student
                  if (selectedStudent) {
                    setSelectedChatStudent(selectedStudent);
                    setShowMessageModal(false);
                  }
                }}
                disabled={!messageContent.trim() || !selectedStudent || loading}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send & Start Chat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
              <button
                onClick={() => setShowPasswordChangeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {passwordErrors.general && (
                  <p className="text-red-500 text-sm">{passwordErrors.general}</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordChangeModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorDashboard;