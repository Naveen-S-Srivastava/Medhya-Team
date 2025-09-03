// src/Components/AppLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs.jsx';
import { Badge } from '../ui/Badge.jsx';
import {
  MessageCircle, Calendar, BookOpen, Users, BarChart3, Heart, AlertTriangle, Zap, Building2
} from 'lucide-react';
import Navbar from './Navbar.jsx';

const studentNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/chat', label: 'Medhya Support', icon: MessageCircle },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/resources', label: 'Resources', icon: BookOpen },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/wellness', label: 'Wellness', icon: Heart },
];

const adminNavItems = [
  { path: '/admin', label: 'Analytics', icon: BarChart3 },
  { path: '/crisis', label: 'Crisis Management', icon: AlertTriangle },
  { path: '/innovation', label: 'AI Innovation', icon: Zap },
  { path: '/institutions', label: 'Institutions', icon: Building2 },
];

const AppLayout = ({ userRole, user, onLogout, systemStats }) => {
  const location = useLocation();
  const navItems = userRole === 'student' ? studentNavItems : adminNavItems;
  const defaultPath = userRole === 'student' ? '/dashboard' : '/admin';
  
  // Check if student profile is complete
  const isProfileComplete = user?.isProfileComplete;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userRole={userRole} user={user} onLogout={onLogout} systemStats={systemStats} />

      <main className="container mx-auto px-4 py-6">
        <Tabs value={location.pathname} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              // For students, disable restricted routes when profile is incomplete
              const isRestrictedRoute = userRole === 'student' && !isProfileComplete && 
                ['/chat', '/appointments', '/community', '/wellness'].includes(item.path);
              
              return (
                <TabsTrigger 
                  key={item.path} 
                  value={item.path} 
                  asChild
                  disabled={isRestrictedRoute}
                  className={isRestrictedRoute ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Link 
                    to={isRestrictedRoute ? '#' : item.path} 
                    className={`flex items-center gap-2 ${isRestrictedRoute ? 'pointer-events-none' : ''}`}
                    onClick={isRestrictedRoute ? (e) => e.preventDefault() : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {isRestrictedRoute && (
                      <span className="text-xs text-red-500 ml-1">🔒</span>
                    )}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {/* Show access restriction message for incomplete profiles */}
          {userRole === 'student' && !isProfileComplete && (
            <div className="text-center py-2 px-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                🔒 <strong>Limited Access:</strong> Complete your profile to unlock AI Support, Appointments, Community, and Wellness features. 
                <span className="text-green-600 font-medium"> Resources are currently available.</span>
              </p>
            </div>
          )}
          
          {/* The Outlet will render the matched route component (e.g., StudentDashboard, AIChat, etc.) */}
          <Outlet />

        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 MEDHYA . Built for Smart India Hackathon 2024.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;