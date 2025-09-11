import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Progress } from '../ui/Progress.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  MessageCircle, Calendar, Users, Shield, Heart, Brain, Phone,
  TrendingUp, Globe, Zap, CheckCircle, Target, Smartphone, AlertTriangle, Lock,
  BookOpen, X, Badge
} from 'lucide-react';
import ResourceContent from './ResourceContent.jsx';
import AssessmentGraph from './AssessmentGraph.jsx';
import DailyJournal from './DailyJournal.jsx';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showProfileStatus, setShowProfileStatus] = useState(true);

  const isProfileComplete = user?.isProfileComplete;

  const handleCompleteProfile = () => {
    navigate('/user-signup', {
      state: {
        isProfileCompletion: true,
        userData: user
      }
    });
  };

  // Full Dashboard Content for Complete Profiles
  const FullDashboardContent = () => (
    <div className="space-y-6">


      {/* Resources Content */}
      <ResourceContent />

      {/* Play Games */}
      <div className="grid flex-row gap-6 md:grid-cols-3">
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Game 1
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span>Coming Soon....</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Game 2
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span>Coming Soon....</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-600" />
              Game 3
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span>Coming Soon....</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid flex-row gap-6 md:grid-cols-2">


        <Card className="border-purple-200">
          <AssessmentGraph />
        </Card>

        <DailyJournal />
      </div>
    </div>
  );

  // Profile Status Section


  return (
    <div className="space-y-6">
      <FullDashboardContent />
    </div>
  );
};

export default StudentDashboard;