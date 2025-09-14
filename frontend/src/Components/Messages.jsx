import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  RefreshCw, Send, MessageSquare, Video,
} from 'lucide-react';
import { useCounselorDashboard } from '../hooks/useCounselorDashboard';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';

const Messages = ({ sessions, messages, loadMessages, loadDashboardData, loading }) => {
  const { sendMessage, markMessageAsRead, getRecentMessages } = useCounselorDashboard();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Messages state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [selectedChatStudent, setSelectedChatStudent] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Handle individual chat with a student
  const handleStartChat = async (sessionId, student) => {
    console.log(sessionId, student)
    setSelectedChatStudent(student);
    setSelectedSessionId(sessionId);

    // Filter messages for this specific student and sort them properly for chat display
    const studentMessages = messages.filter(msg => {
      if (msg.senderModel === 'User' && msg.sender?._id === student._id) return true;
      if (msg.recipientModel === 'User' && msg.recipient?._id === student._id) return true;
      return false;
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort oldest first for chat display
    setChatMessages(studentMessages);

    // Mark all unread messages from this student as read
    const unreadMessages = studentMessages.filter(msg =>
      msg.senderModel === 'User' && msg.sender?._id === student._id && !msg.isRead
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
    console.log("Starting video call for student:", student);
    console.log("Current user:", user);
    console.log("Counselor profile ID:", user?.counselorProfile);

    if (!user?.counselorProfile) {
      alert("Counselor profile not found. Please log in again.");
      return;
    }

    if (!student?._id) {
      alert("Student information not available.");
      return;
    }

    try {
      const apiUrl = `/appointments/find/${student._id}/${user.counselorProfile}`;
      console.log("Making API call to:", apiUrl);

      const res = await apiClient.get(apiUrl);

      console.log("API Response:", res);

      // Handle both response formats: direct object or wrapped in data
      const appointment = res.data || res;
      const roomId = appointment?.roomId;

      if (roomId) {
        console.log("Navigating to video room:", roomId);
        navigate(`/room/${roomId}`); // Go to video call page
      } else {
        console.log("No roomId found in appointment:", appointment);
        alert("No active appointment found for this student or room not assigned. Please ensure the appointment is confirmed.");
      }
    } catch (err) {
      console.error("Failed to start video call:", err);
      if (err.response?.status === 404) {
        alert("No confirmed appointment found for this student. Please confirm the appointment first.");
      } else {
        alert("Failed to start video call. Please try again.");
      }
    }
  };

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
          if (msg.senderModel === 'User' && msg.sender?._id === selectedChatStudent._id) return true;
          if (msg.recipientModel === 'User' && msg.recipient?._id === selectedChatStudent._id) return true;
          return false;
        }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort oldest first for chat display

        setChatMessages(studentMessages);
      }, 200); // Small delay to ensure state is updated
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)] overflow-hidden">
        {/* Main Chat Area */}
        <div className="lg:col-span-4">
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

      {/* Message Modal */}
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
    </>
  );
};

export default Messages;