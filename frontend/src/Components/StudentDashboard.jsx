// src/Components/StudentDashboard.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Progress } from '../ui/Progress.jsx';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle, Calendar, Users, Shield, Heart, Brain, Phone,
  TrendingUp, Globe, Zap, CheckCircle, Target, Smartphone
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const studentStats = {
    totalSessions: 47,
    peersHelped: 8,
    wellnessScore: 78,
    streakDays: 12,
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Wellness Score</CardTitle>
            <Heart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{studentStats.wellnessScore}%</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <p className="text-xs text-green-700">+5% this week</p>
            </div>
            <Progress value={studentStats.wellnessScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Daily Streak</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{studentStats.streakDays} days</div>
            <p className="text-xs text-green-700">Keep it up! 🔥</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">AI Sessions</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{studentStats.totalSessions}</div>
            <p className="text-xs text-purple-700">Total conversations</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Community Impact</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{studentStats.peersHelped}</div>
            <p className="text-xs text-orange-700">Peers supported</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Wellness Journey */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-blue-600" />Quick Actions</CardTitle>
            <CardDescription>Get immediate support when you need it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => navigate('/chat')}>
              <MessageCircle className="w-4 h-4 mr-2" /> Start AI Chat Session
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/appointments')}>
              <Calendar className="w-4 h-4 mr-2" /> Book Counselor Appointment
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Phone className="w-4 h-4 mr-2" /> Emergency: 1800-599-0019 (iCALL)
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-green-600" />Your Wellness Journey</CardTitle>
            <CardDescription>Track your mental health progress with AI insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Great progress! Your consistency is paying off. Keep it up! 🌟
                </AlertDescription>
            </Alert>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/wellness')}>
                <Brain className="w-4 h-4 mr-2" /> Go to Wellness Center
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;