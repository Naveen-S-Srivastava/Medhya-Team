// src/App.jsx
import React, { useState, createContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';

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
const ProtectedRoute = ({ children, userRole, requiredRole = null, isLoading = false }) => {
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }
  
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
  const { user, loading, logout: authLogout } = useAuth();
  const [userRole, setUserRole] = useState('guest');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const systemStats = {
    totalInstitutions: 127,
    activeUsers: 15420,
  };

  // Update userRole when user changes
  useEffect(() => {
    if (user) {
      setUserRole(user.role || 'student');
    } else {
      setUserRole('guest');
    }
  }, [user]);

  const handleLogin = (role, userData = null) => {
    setUserRole(role);
    
    console.log('🔍 handleLogin called with:', { role, userData });
    
    // Handle different user types
    if (role === 'admin') {
      console.log('🚀 Redirecting admin to dashboard');
      navigate('/admin');
    } else if (role === 'counselor') {
      // Counselor login flow - always redirect to counselor dashboard
      console.log('🚀 Redirecting counselor to dashboard (no signup flow needed)');
      navigate('/counsellordash');
    } else if (role === 'student') {
      // Student login flow
      if (userData) {
        // Check if user exists and has complete profile
        const isExistingUser = userData.phone && userData.institutionId && userData.studentId;
        
        console.log('🔍 Student login analysis:', {
          isExistingUser,
          hasPhone: Boolean(userData.phone),
          hasInstitutionId: Boolean(userData.institutionId),
          hasStudentId: Boolean(userData.studentId),
          userData
        });
        
        if (isExistingUser) {
          // Existing user with complete profile - redirect to contact choice
          console.log('🚀 Redirecting existing user to contact choice');
          navigate('/contact-choice');
        } else {
          // New user or incomplete profile - redirect to signup flow
          console.log('🚀 Redirecting new/incomplete user to signup');
          navigate('/user-signup', { 
            state: { 
              user: userData, 
              isProfileCompletion: true,
              isNewUser: true
            } 
          });
        }
      } else {
        // No userData provided - redirect to signup
        console.log('🚀 Redirecting to signup (no userData)');
        navigate('/user-signup', { 
          state: { 
            isNewUser: true
          } 
        });
      }
    }
  };

  const handleLoginError = (role, error, googleData = null) => {
    console.log('🔍 Login error occurred:', error, 'Google data:', googleData);
    
    // If user not found in database, redirect to signup flow
    if (error && (error.includes('not found') || error.includes('User not found') || error.includes('Invalid credentials'))) {
      console.log('🚀 User not found, redirecting to signup flow');
      if (role === 'student') {
        // Redirect to user-signup first, then signup, then contact-choice
        navigate('/user-signup', { 
          state: { 
            isNewUser: true,
            fromLogin: true,
            loginType: role,
            googleData: googleData // Pass Google data if available
          } 
        });
      } else {
        // For admin, redirect to their respective signup
        navigate('/signup', { 
          state: { 
            isNewUser: true,
            fromLogin: true,
            loginType: role,
            googleData: googleData // Pass Google data if available
          } 
        });
      }
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setUserRole('guest');
    setUserData(null);
    navigate('/');
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userRole, user, systemStats }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onLogin={() => navigate('/login')} systemStats={systemStats} />} />
        <Route path="/login" element={
          userRole !== 'guest' ? 
            <Navigate to={userRole === 'admin' ? '/admin' : userRole === 'counselor' ? '/counsellordash' : '/contact-choice'} replace /> : 
            <Login 
              onLogin={handleLogin} 
              onLoginError={handleLoginError}
              onShowSignup={() => navigate('/signup')} 
              onShowUserSignup={() => navigate('/user-signup')} 
            />
        } />
        <Route path="/user-signup" element={<UserSignup onNext={(data) => { setUserData(data); navigate('/signup'); }} onShowLogin={() => navigate('/login')} />} />
        <Route path="/signup" element={
          <Signup 
            onLogin={handleLogin} 
            onShowLogin={() => navigate('/login')} 
            userData={userData} 
            onBackToUserSignup={() => navigate('/user-signup')} 
          />
        } />
        
        {/* Protected Routes */}
        <Route path="/contact-choice" element={
          <ProtectedRoute userRole={userRole} isLoading={loading}>
            <ContactChoice />
          </ProtectedRoute>
        } />
        
        <Route path="/counsellordash" element={
          <ProtectedRoute userRole={userRole} requiredRole="counselor" isLoading={loading}>
            <CounselorDashboard />
          </ProtectedRoute>
        } />

        {/* --- PROTECTED APPLICATION ROUTES using AppLayout --- */}
        <Route 
          element={
            <ProtectedRoute userRole={userRole} isLoading={loading}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} />
            </ProtectedRoute>
          }
        >
          {/* Student Routes */}
          <Route path="/dashboard" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><AIChat /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><AIChat /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><AppointmentBooking /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><ResourceHub /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><PeerSupport /></ProtectedRoute>} />
          <Route path="/wellness" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><Wellness /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/crisis" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><ErrorBoundary><CrisisManagement /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/innovation" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><InnovationShowcase /></ProtectedRoute>} />
          <Route path="/institutions" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><Institutions /></ProtectedRoute>} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContext.Provider>
  );
}