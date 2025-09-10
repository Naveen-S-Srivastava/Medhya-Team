// src/Components/AppLayout.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs.jsx';
import {
  MessageCircle, Calendar, BookOpen, Users, BarChart3, Heart, AlertTriangle, Zap, Building2
} from 'lucide-react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
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
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userRole={userRole} user={user} onLogout={onLogout} systemStats={systemStats} />

      <main className="container mx-auto px-4 py-6">
        <Tabs value={location.pathname} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <TabsTrigger 
                  key={item.path} 
                  value={item.path} 
                  asChild
                >
                  <Link 
                    to={item.path} 
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
            <Outlet />
        </Tabs>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default AppLayout;