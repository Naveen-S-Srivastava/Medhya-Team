import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  LayoutDashboard, Calendar, MessageSquare, Users, DollarSign, User, TrendingUp,
  RefreshCw, LogOut, Bell, ChevronDown, Eye, Send, Phone,
  CheckCircle, Shield, Globe, Smartphone
} from 'lucide-react';

// Main Dashboard Component
const CounselorDashboard = () => {
  // --- MOCK DATA SECTION ---
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    _id: 'counselor123', name: 'Dr. Anjali Sharma', email: 'a.sharma@medhya.com', profileImage: 'https://i.pravatar.cc/150?u=anjali', phone: '+91 98765 43210',
    specialization: ['Cognitive Behavioral Therapy (CBT)', 'Stress Management', 'Anxiety Disorders'],
    languages: ['English', 'Hindi', 'Marathi'], experience: 12, education: { degree: 'Ph.D. in Clinical Psychology', institution: 'University of Delhi' },
    bio: 'Experienced clinical psychologist dedicated to providing compassionate and effective therapy. Specializing in CBT and mindfulness-based approaches to help individuals navigate life\'s challenges.'
  });

  const [students, setStudents] = useState([
    { _id: 's1', firstName: 'Rohan', lastName: 'Verma', email: 'rohan.v@email.com', profileImage: 'https://i.pravatar.cc/150?u=rohan' },
    { _id: 's2', firstName: 'Priya', lastName: 'Patel', email: 'priya.p@email.com', profileImage: 'https://i.pravatar.cc/150?u=priya' },
    { _id: 's3', firstName: 'Amit', lastName: 'Singh', email: 'amit.s@email.com', profileImage: 'https://i.pravatar.cc/150?u=amit' },
    { _id: 's4', firstName: 'Sneha', lastName: 'Gupta', email: 'sneha.g@email.com', profileImage: 'https://i.pravatar.cc/150?u=sneha' },
  ]);

  const [sessions, setSessions] = useState([
    { _id: 'sess1', student: students[0], date: new Date(), timeSlot: '11:00 AM', status: 'confirmed' },
    { _id: 'sess2', student: students[1], date: new Date(), timeSlot: '02:00 PM', status: 'pending' },
    { _id: 'sess3', student: students[2], date: new Date(new Date().setDate(new Date().getDate() + 2)), timeSlot: '04:00 PM', status: 'confirmed' },
  ]);

  const [messages, setMessages] = useState([
    { _id: 'msg1', sender: students[1], recipientModel: 'Counselor', content: 'Hi Dr. Anjali, just wanted to confirm our session for t...', createdAt: new Date(), isRead: false },
    { _id: 'msg2', sender: students[0], recipientModel: 'Counselor', content: 'Thank you for the resources you shared.', createdAt: new Date(new Date().setDate(new Date().getDate() - 1)), isRead: true },
    { _id: 'msg3', sender: students[3], recipientModel: 'Counselor', content: 'I have a quick question about our last discussion.', createdAt: new Date(), isRead: false },
  ]);

  const [payments, setPayments] = useState([
    { _id: 'pay1', student: students[0], amount: 1500, status: 'completed', createdAt: new Date(new Date().setDate(new Date().getDate() - 5)), description: 'Session Payment' },
    { _id: 'pay2', student: students[2], amount: 1500, status: 'completed', createdAt: new Date(new Date().setDate(new Date().getDate() - 2)), description: 'Session Payment' },
    { _id: 'pay3', student: students[1], amount: 1500, status: 'pending', createdAt: new Date(), description: 'Session Payment' },
  ]);
  
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: [], pendingCount: 0, unreadCount: 0, completedThisMonth: 0, recentMessages: [], recentPayments: []
  });

  useEffect(() => {
    const today = new Date().toDateString();
    setDashboardData({
        todayAppointments: sessions.filter(s => new Date(s.date).toDateString() === today),
        pendingCount: sessions.filter(s => s.status === 'pending').length,
        unreadCount: messages.filter(m => !m.isRead).length,
        completedThisMonth: 14,
        recentMessages: messages,
        recentPayments: payments,
    });
  }, [sessions, messages, payments]);
  // --- END OF MOCK DATA SECTION ---

  const [activeView, setActiveView] = useState('dashboard');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  const handleLogout = () => console.log('Counselor logged out');
  const loadDashboardData = () => { setLoading(true); setTimeout(() => setLoading(false), 1000); };
  const handleUpdateAppointmentStatus = (sessionId, status) => setSessions(sessions.map(s => s._id === sessionId ? { ...s, status } : s));
  const markMessageAsRead = (messageId) => setMessages(messages.map(m => m._id === messageId ? { ...m, isRead: true } : m));
  const handleSendMessage = () => { if(selectedStudent) { console.log(`Sending "${messageContent}" to ${selectedStudent.firstName}`); setShowMessageModal(false); setMessageContent(''); setSelectedStudent(null); } };
  
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

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter'] antialiased">
       <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
        {/* Top Bar: Logo, System Status, User Menu */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-purple-600 text-white font-bold text-xl">M</div>
            <div>
              <h1 className="text-md font-bold text-gray-800">MEDHYA</h1>
              <p className="text-xs text-gray-500">Counselor Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-700 border border-green-200 font-medium hidden lg:flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>System Active
            </Badge>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"><Bell className="h-5 w-5" /></Button>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 text-left">
                <Avatar className="h-9 w-9"><AvatarImage src={profile.profileImage} /><AvatarFallback className="bg-purple-100 text-purple-700">{profile.name?.charAt(0)}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                  <p className="text-xs text-gray-500">Counselor</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <button onClick={() => { setActiveView('profile'); setDropdownOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User className="h-4 w-4" /> My Profile</button>
                  <div className="my-1 h-px bg-gray-100" />
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Second, SEPARATE Bar: Navigation Links */}
        <div className="h-14 bg-white border-b border-gray-200">
            <nav className="max-w-7xl mx-auto h-full flex items-center gap-8 px-6">
                {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeView === item.id ? 'bg-slate-100 text-gray-900 shadow-sm border border-gray-200/80' : 'text-gray-600 hover:bg-slate-50'
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
            <h1 className="text-3xl font-bold text-gray-800 capitalize">{activeView === 'dashboard' ? 'Counselor Dashboard' : activeView}</h1>
            <p className="text-gray-600 mt-1 text-base">Monitor your students and manage appointments.</p>
          </div>
          <Button onClick={loadDashboardData} disabled={loading} variant="outline" className="bg-white"><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Data</Button>
        </div>
        
        <div className="space-y-6">
          {activeView === 'dashboard' && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-blue-800">Today's Sessions</CardTitle><Calendar className="h-4 w-4 text-blue-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-900">{dashboardData.todayAppointments.length}</div><p className="text-xs text-blue-700">{dashboardData.pendingCount} pending</p></CardContent></Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-green-800">Unread Messages</CardTitle><MessageSquare className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-900">{dashboardData.unreadCount}</div><p className="text-xs text-green-700">Requires attention</p></CardContent></Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-purple-800">Active Students</CardTitle><Users className="h-4 w-4 text-purple-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-purple-900">{students.length}</div><p className="text-xs text-purple-700">Total active students</p></CardContent></Card>
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-orange-800">Monthly Sessions</CardTitle><TrendingUp className="h-4 w-4 text-orange-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-900">{dashboardData.completedThisMonth}</div><p className="text-xs text-orange-700">Completed this month</p></CardContent></Card>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold"><Calendar className="w-5 h-5 text-blue-600" /> Today's Appointments</CardTitle></CardHeader><CardContent>{dashboardData.todayAppointments.length === 0 ? (<div className="text-center py-6"><Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 font-medium">No appointments today</p><p className="text-gray-400 text-sm">Enjoy your free time!</p></div>) : (<div className="space-y-4">{dashboardData.todayAppointments.map((a) => (<div key={a._id} className="flex items-center justify-between p-3 border rounded-md"><div className="flex items-center gap-3"><Avatar className="w-10 h-10"><AvatarImage src={a.student?.profileImage} /><AvatarFallback className="bg-blue-100 text-blue-600">{a.student?.firstName?.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{a.student?.firstName} {a.student?.lastName}</p><p className="text-sm text-gray-500">{a.timeSlot}</p></div></div><Badge className={getStatusColor(a.status)}>{a.status}</Badge></div>))}</div>)}</CardContent></Card>
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold"><MessageSquare className="w-5 h-5 text-green-600" /> Recent Messages</CardTitle></CardHeader><CardContent>{dashboardData.recentMessages.length === 0 ? (<div className="text-center py-6"><MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 font-medium">No recent messages</p><p className="text-gray-400 text-sm">All caught up!</p></div>) : (<div className="space-y-4">{dashboardData.recentMessages.map((m) => (<div key={m._id} className="flex items-center justify-between p-3 border rounded-md"><div className="flex items-center gap-3"><Avatar className="w-10 h-10"><AvatarImage src={m.sender?.profileImage} /><AvatarFallback className="bg-green-100 text-green-600">{m.sender?.firstName?.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{m.sender?.firstName} {m.sender?.lastName}</p><p className="text-sm text-gray-500 truncate max-w-xs">{m.content}</p></div></div>{!m.isRead && (<div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>)}</div>))}</div>)}</CardContent></Card>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-blue-200 bg-white"><CardHeader><CardTitle className="flex items-center gap-2 text-gray-800 font-semibold"><Shield className="w-5 h-5 text-blue-600" /> Privacy & Security</CardTitle></CardHeader><CardContent className="space-y-3 text-gray-600"><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>End-to-end encryption</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>HIPAA compliant</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Anonymous mode available</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Local data processing</span></div></CardContent></Card>
                <Card className="border-purple-200 bg-white"><CardHeader><CardTitle className="flex items-center gap-2 text-gray-800 font-semibold"><Globe className="w-5 h-5 text-purple-600" /> Cultural Adaptation</CardTitle></CardHeader><CardContent className="space-y-3 text-gray-600"><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>15+ Indian languages</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Regional counseling</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Cultural sensitivity</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Family-inclusive care</span></div></CardContent></Card>
                <Card className="border-green-200 bg-white"><CardHeader><CardTitle className="flex items-center gap-2 text-gray-800 font-semibold"><Smartphone className="w-5 h-5 text-green-600" /> Mobile-First Design</CardTitle></CardHeader><CardContent className="space-y-3 text-gray-600"><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Offline mode support</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Low bandwidth optimized</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Progressive Web App</span></div><div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-600" /><span>Voice interface ready</span></div></CardContent></Card>
              </div>
            </>
          )}

          {activeView === 'sessions' && (<Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />All Sessions</CardTitle></CardHeader><CardContent>{sessions.length === 0 ? (<div className="text-center py-10"><p>No upcoming sessions</p></div>) : (<div className="space-y-4">{sessions.map((s) => (<div key={s._id} className="flex items-center justify-between p-4 border rounded-md"><div className="flex items-center gap-4"><Avatar className="w-12 h-12"><AvatarImage src={s.student?.profileImage} /><AvatarFallback className="bg-blue-100 text-blue-600">{s.student?.firstName?.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{s.student?.firstName} {s.student?.lastName}</p><p className="text-sm text-gray-500">{formatDate(s.date)} at {formatTime(s.timeSlot)}</p></div></div><div className="flex items-center gap-3"><Badge className={getStatusColor(s.status)}>{s.status}</Badge>{s.status === 'pending' && (<div className="flex gap-2"><Button size="sm" onClick={() => handleUpdateAppointmentStatus(s._id, 'confirmed')}>Confirm</Button><Button size="sm" variant="outline" onClick={() => handleUpdateAppointmentStatus(s._id, 'cancelled')}>Cancel</Button></div>)}</div></div>))}</div>)}</CardContent></Card>)}
          {activeView === 'messages' && (<Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />All Messages</CardTitle></CardHeader><CardContent>{messages.length === 0 ? (<div className="text-center py-10"><p>No messages</p></div>) : (<div className="divide-y">{messages.map((m) => (<div key={m._id} className="flex items-center justify-between p-4"><div className="flex items-center gap-4"><Avatar className="w-12 h-12"><AvatarImage src={m.sender?.profileImage} /><AvatarFallback className="bg-green-100 text-green-600">{m.sender?.firstName?.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{m.sender?.firstName} {m.sender?.lastName}</p><p className="text-sm text-gray-600">{m.content}</p><p className="text-xs text-gray-400 mt-1">{formatDate(m.createdAt)}</p></div></div><div className="flex items-center gap-3">{!m.isRead && (<Badge className="bg-green-500 text-white">Unread</Badge>)}<Button size="sm" variant="ghost" onClick={() => markMessageAsRead(m._id)}><Eye className="w-4 h-4" /></Button></div></div>))}</div>)}</CardContent></Card>)}
          {activeView === 'students' && (<Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />My Students</CardTitle></CardHeader><CardContent>{students.length === 0 ? (<div className="text-center py-10"><p>No students found</p></div>) : (<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{students.map((s) => (<div key={s._id} className="p-4 border rounded-lg shadow-sm"><div className="flex items-center gap-4 mb-3"><Avatar className="w-14 h-14"><AvatarImage src={s.profileImage} /><AvatarFallback className="bg-purple-100 text-purple-600">{s.firstName?.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{s.firstName} {s.lastName}</p><p className="text-sm text-gray-500">{s.email}</p></div></div><Button size="sm" className="w-full" onClick={() => { setSelectedStudent(s); setShowMessageModal(true); }}><MessageSquare className="w-4 h-4 mr-2" />Send Message</Button></div>))}</div>)}</CardContent></Card>)}
          {activeView === 'payments' && (<Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" />Payment Records</CardTitle></CardHeader><CardContent>{payments.length === 0 ? (<div className="text-center py-10"><p>No payment records</p></div>) : (<div className="space-y-4">{payments.map((p) => (<div key={p._id} className="flex items-center justify-between p-4 border rounded-md"><div className="flex items-center gap-4"><Avatar className="w-12 h-12"><AvatarImage src={p.student?.profileImage} /><AvatarFallback className="bg-green-100 text-green-600">{p.student?.firstName?.charAt(0)}</AvatarFallback></Avatar><div><p className="font-medium">{p.student?.firstName} {p.student?.lastName}</p><p className="text-sm text-gray-600">{p.description}</p><p className="text-xs text-gray-500">{formatDate(p.createdAt)}</p></div></div><div className="text-right"><p className="font-semibold text-xl text-gray-800">₹{p.amount}</p><Badge className={getPaymentStatusColor(p.status)}>{p.status}</Badge></div></div>))}</div>)}</CardContent></Card>)}
          {activeView === 'profile' && (<Card className="bg-white"><CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Profile Information</CardTitle></CardHeader><CardContent><div className="space-y-8"><div className="flex items-center gap-6"><Avatar className="w-20 h-20 border"><AvatarImage src={profile.profileImage} /><AvatarFallback className="text-xl bg-blue-100 text-blue-600">{profile.name?.charAt(0)}</AvatarFallback></Avatar><div><h3 className="text-2xl font-semibold">{profile.name}</h3><p className="text-gray-600">{profile.email}</p></div></div><div className="grid gap-6 md:grid-cols-2"><div className="space-y-3"><h4>Contact Information</h4><div className="space-y-2"><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span>{profile.email}</span></div><div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span>{profile.phone}</span></div></div></div><div className="space-y-3"><h4>Specializations</h4><div className="flex flex-wrap gap-2">{profile.specialization.map((s, i) => (<Badge key={i} variant="secondary">{s}</Badge>))}</div></div><div className="space-y-3"><h4>Languages</h4><div className="flex flex-wrap gap-2">{profile.languages.map((l, i) => (<Badge key={i} variant="secondary" className="bg-green-100 text-green-800">{l}</Badge>))}</div></div><div className="space-y-3"><h4>Experience</h4><div><p>{profile.experience} years of experience</p><p className="text-sm text-gray-600">{profile.education.degree} from {profile.education.institution}</p></div></div></div><div className="space-y-3"><h4>Bio</h4><p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p></div></div></CardContent></Card>)}
        </div>
      </main>

      {showMessageModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in-50 zoom-in-95">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Message</h3>
                {selectedStudent && (<div className="mb-4 p-2 bg-blue-50 rounded-md border border-blue-200 text-blue-700 text-sm">To: {selectedStudent.firstName} {selectedStudent.lastName}</div>)}
                <textarea className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" rows="4" placeholder="Type your message..." value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => { setShowMessageModal(false); setSelectedStudent(null); setMessageContent(''); }}>Cancel</Button>
                  <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>Send</Button>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default CounselorDashboard;