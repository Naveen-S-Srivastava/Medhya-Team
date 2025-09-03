// src/Components/Navbar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import {
  Heart, Menu, X, Bell, Settings, LogOut, User,
  Building2, GraduationCap, ChevronDown
} from 'lucide-react';

const Navbar = ({ userRole, user, onLogout, systemStats }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // --- Side Effects ---

  // Handle header style on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const studentStats = {
    wellnessScore: 78,
    streakDays: 12
  };

  // --- Reusable UI Components ---

  const UserMenu = () => (
    <div ref={userMenuRef} className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-slate-100"
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.imageUrl} alt={user?.name || 'User'} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-slate-800 truncate max-w-[150px]">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500 capitalize">{userRole}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{userRole}</p>
             {userRole === 'student' && (
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">Wellness: {studentStats.wellnessScore}%</Badge>
                <Badge variant="outline">Streak: {studentStats.streakDays} days</Badge>
              </div>
            )}
          </div>
          <div className="p-2 space-y-1">
            <Link to="/profile" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100">
              <User className="h-4 w-4 text-slate-500" /> Profile
            </Link>
            {!user?.isProfileComplete && (
              <Link to="/user-signup" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-orange-600 rounded-md hover:bg-orange-50 bg-orange-50">
                <User className="h-4 w-4 text-orange-500" /> Complete Profile
              </Link>
            )}
            {user?.isProfileComplete && (
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Profile Complete</span>
              </div>
            )}
            <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100">
              <Settings className="h-4 w-4 text-slate-500" /> Settings
            </button>
          </div>
          <div className="p-2 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // --- Main Render ---
  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm' : 'bg-/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section: Logo & Status Badges */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-md">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="hidden sm:block text-xl font-bold text-slate-800">MEDHYA </h1>
                  <p className="hidden md:block text-xs text-slate-500">Advanced Digital Psychological Intervention System</p>
                </div>
              </Link>

              {/* RESTORED: System Status Badges */}
              {userRole !== 'guest' && (
                <div className="hidden lg:flex items-center gap-3">
                  <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                    <div className="w-2 h-2 mr-2 animate-pulse rounded-full bg-green-500"></div>
                    System Active
                  </Badge>
                  <Badge variant="secondary">
                    {systemStats?.activeUsers?.toLocaleString() || '15.4K'} Active Users
                  </Badge>
                </div>
              )}
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-4">
              {userRole === 'guest' ? (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Student Login
                  </Button>
                  <Button onClick={() => navigate('/login')} className="bg-slate-800 hover:bg-slate-900 text-white">
                    <Building2 className="h-4 w-4 mr-2" />
                    Admin Portal
                  </Button>
                </>
              ) : (
                <>
                  <button className="relative p-2 rounded-full hover:bg-slate-100">
                    <Bell className="h-5 w-5 text-slate-500" />
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  </button>
                  <UserMenu />
                  <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-slate-100">
                    <Menu className="h-6 w-6 text-slate-600" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Menu (Slide-in) --- */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="fixed inset-0 bg-black/30" onClick={() => setIsMenuOpen(false)}></div>
        <div className="relative h-full w-full max-w-xs bg-white p-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-md">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">MEDHYA</h1>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md hover:bg-slate-100">
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>
          <div className="mt-6 space-y-2">
            <p className="px-3 py-2 text-sm font-semibold text-slate-800">Welcome, {user?.name || 'User'}</p>
            <Link to="/profile" className="flex items-center gap-3 w-full px-3 py-2 text-base text-slate-700 rounded-md hover:bg-slate-100">
              <User className="h-5 w-5 text-slate-500" /> Profile
            </Link>
            {!user?.isProfileComplete && (
              <Link to="/user-signup" className="flex items-center gap-3 w-full px-3 py-2 text-sm text-orange-600 rounded-md hover:bg-orange-50 bg-orange-50">
                <User className="h-4 w-4 text-orange-500" /> Complete Profile
              </Link>
            )}
            <Link to="/settings" className="flex items-center gap-3 w-full px-3 py-2 text-base text-slate-700 rounded-md hover:bg-slate-100">
              <Settings className="h-5 w-5 text-slate-500" /> Settings
            </Link>
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={onLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-base text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;