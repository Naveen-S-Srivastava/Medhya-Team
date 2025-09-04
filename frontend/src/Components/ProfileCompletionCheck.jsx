import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { AlertTriangle, UserPlus, ArrowRight } from 'lucide-react';

const ProfileCompletionCheck = ({ children, requireComplete = false }) => {
  const { user, loading, checkProfileCompletion } = useAuth();
  const navigate = useNavigate();
  const [profileStatus, setProfileStatus] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user || loading) return;

      try {
        const status = await checkProfileCompletion();
        if (status) {
          setProfileStatus(status);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfileStatus();
  }, [user, loading, checkProfileCompletion]);

  // Show loading while checking
  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking profile status...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // If profile is complete, render children
  if (profileStatus?.isProfileComplete) {
    return children;
  }

  // If profile is not complete and we require completion
  if (requireComplete && !profileStatus?.isProfileComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Profile Completion Required
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Complete your profile to access all features
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Profile Completion</span>
                <span>{profileStatus?.completionPercentage || 0}% Complete</span>
              </div>
              <Progress value={profileStatus?.completionPercentage || 0} className="h-2" />
            </div>

            {/* Missing Fields */}
            {profileStatus?.missingFields && profileStatus.missingFields.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Missing Information:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {profileStatus.missingFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/complete-profile')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
              >
                Complete Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>

            {/* Info */}
            <div className="text-center text-sm text-gray-500">
              <p>Completing your profile helps us provide personalized mental health support and resources.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If we don't require completion, render children with a warning
  return (
    <>
      {children}
      {!profileStatus?.isProfileComplete && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-80 shadow-lg border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800 mb-1">Complete Your Profile</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Complete your profile to access all features and get personalized support.
                  </p>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/complete-profile')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Complete Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ProfileCompletionCheck;
