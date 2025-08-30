// src/App.jsx
import React, { useState, createContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import Layouts & Pages
import LandingPage from './Components/LandingPage.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/SignUp.jsx';
import UserSignup from './Components/UserSignup.jsx';
import AppLayout from './Components/AppLayout.jsx';
import StudentDashboard from './Components/StudentDashboard.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx';
import AIChat from './Components/AIChat.jsx';
import AppointmentBooking from './Components/AppointmentBooking.jsx';
import ResourceHub from './Components/ResourceHub.jsx';
import PeerSupport from './Components/PeerSupport.jsx';
import CrisisManagement from './Components/CrisisManagement.jsx';
import InnovationShowcase from './Components/InnovationShowcase.jsx';
import ContactChoice from './Components/ContactChoice.jsx';
import ErrorBoundary from './Components/ErrorBoundary.jsx';


// Import Wellness component
import Wellness from './Components/Wellness.jsx';
import CounselorDashboard from './Components/CounselorDashboard.jsx';

// Dummy Institutions component for routing
const Institutions = () => <div className="p-6 bg-white rounded-lg shadow">Institutions Management Content</div>;

// Protected Route Component
const ProtectedRoute = ({ children, userRole, requiredRole = null }) => {
  if (userRole === 'guest') {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />; // or a dedicated "unauthorized" page
  }
  return children;
};

// User Context
export const UserContext = createContext();

export default function App() {
  const [userRole, setUserRole] = useState('guest');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const systemStats = {
    totalInstitutions: 127,
    activeUsers: 15420,
  };

  const handleLogin = (role, userData = null) => {
    setUserRole(role);
    setUser(userData || { name: role === 'student' ? 'Demo Student' : 'Demo Admin' });
    const destination = role === 'admin' ? '/admin' : '/dashboard';
    navigate(destination);
  };

  const handleLogout = () => {
    setUserRole('guest');
    setUser(null);
    setUserData(null);
    navigate('/');
  };

  return (
    <UserContext.Provider value={{ userRole, user, systemStats }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onLogin={() => navigate('/login')} systemStats={systemStats} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} onShowSignup={() => navigate('/signup')} onShowUserSignup={() => navigate('/user-signup')} />} />
        <Route path="/user-signup" element={<UserSignup onNext={(data) => { setUserData(data); navigate('/signup'); }} onShowLogin={() => navigate('/login')} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} onShowLogin={() => navigate('/login')} userData={userData} onBackToUserSignup={() => navigate('/user-signup')} />} />
        <Route path="/contact-choice" element={<ContactChoice />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/crisis" element={<CrisisManagement />} />
        <Route path="/innovation" element={<InnovationShowcase />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/counsellordash" element={<CounselorDashboard />} />
        {/* --- PROTECTED APPLICATION ROUTES using AppLayout --- */}
        <Route 
          element={
            <ProtectedRoute userRole={userRole}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} />
            </ProtectedRoute>
          }
        >
          {/* Student Routes */}
          <Route path="/dashboard" element={<ProtectedRoute userRole={userRole} requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute userRole={userRole} requiredRole="student"><AIChat /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute userRole={userRole} requiredRole="student"><AIChat /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute userRole={userRole} requiredRole="student"><AppointmentBooking /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute userRole={userRole} requiredRole="student"><ResourceHub /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute userRole={userRole} requiredRole="student"><PeerSupport /></ProtectedRoute>} />
          <Route path="/wellness" element={<ProtectedRoute userRole={userRole} requiredRole="student"><Wellness /></ProtectedRoute>} />

          {/* Admin Routes */}
          {/* <Route path="/admin" element={<ProtectedRoute userRole={userRole} requiredRole="student"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/crisis" element={<ProtectedRoute userRole={userRole} requiredRole="student"><ErrorBoundary><CrisisManagement /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/innovation" element={<ProtectedRoute userRole={userRole} requiredRole="student"><InnovationShowcase /></ProtectedRoute>} />
          <Route path="/institutions" element={<ProtectedRoute userRole={userRole} requiredRole="student"><Institutions /></ProtectedRoute>} /> */}
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContext.Provider>
  );
}