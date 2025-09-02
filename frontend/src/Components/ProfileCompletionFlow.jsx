import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Label } from '../ui/Label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select.jsx';
import { Checkbox } from '../ui/Checkbox.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Progress } from '../ui/Progress.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useApi } from '../hooks/useApi.js';
import { User, GraduationCap, Shield, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

const ProfileCompletionFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const { apiCall } = useApi();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Step 1: Basic Information (UserSignup content)
  const [basicInfo, setBasicInfo] = useState({
    firstName: '', lastName: '', username: '', phone: '', 
    dateOfBirth: '', gender: ''
  });
  
  // Step 2: Academic Information (Signup step 1 content)
  const [academicInfo, setAcademicInfo] = useState({
    institutionId: '', studentId: '', course: '', year: '', department: ''
  });
  
  // Step 3: Security & Consent (Signup step 2 & 3 content)
  const [securityInfo, setSecurityInfo] = useState({
    securityQuestion: '', securityAnswer: '', emergencyContact: '', emergencyPhone: '',
    privacyConsent: false, dataProcessingConsent: false, mentalHealthConsent: false
  });

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (user?.email && !basicInfo.username) {
      setBasicInfo(prev => ({ ...prev, username: user.email.split('@')[0] }));
    }
    
    // Handle profile completion flow with user data from UserSignup
    if (location.state?.isProfileCompletion && location.state?.userData) {
      const userData = location.state.userData;
      console.log('🔍 Pre-filling form with user data from UserSignup:', userData);
      
      setBasicInfo(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || user?.email?.split('@')[0] || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || ''
      }));
    }
  }, [user, location.state]);

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAcademicInfoChange = (field, value) => {
    setAcademicInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityInfoChange = (field, value) => {
    setSecurityInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step) => {
    const errors = [];
    switch (step) {
      case 1:
        if (!basicInfo.firstName || !basicInfo.lastName || !basicInfo.username || !basicInfo.phone || !basicInfo.dateOfBirth || !basicInfo.gender) {
          errors.push('All basic information fields are required');
        }
        break;
      case 2:
        if (!academicInfo.institutionId || !academicInfo.studentId || !academicInfo.course || !academicInfo.year) {
          errors.push('All academic information fields are required');
        }
        break;
      case 3:
        if (!securityInfo.securityQuestion || !securityInfo.securityAnswer || !securityInfo.emergencyContact || !securityInfo.emergencyPhone) {
          errors.push('All security information fields are required');
        }
        if (!securityInfo.privacyConsent || !securityInfo.dataProcessingConsent || !securityInfo.mentalHealthConsent) {
          errors.push('All consents are required');
        }
        break;
    }
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    setError('');
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Combine all form data
      const formData = {
        ...basicInfo,
        ...academicInfo,
        ...securityInfo
      };

      console.log('🔍 Submitting form data:', formData);

      // Save user details using the correct API format
      const saveResponse = await apiCall(`/user-details/${user._id}`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      console.log('✅ User details saved:', saveResponse);

      // Mark profile as complete
      const completeResponse = await apiCall(`/user-details/${user._id}/complete`, {
        method: 'PATCH'
      });

      console.log('✅ Profile marked complete:', completeResponse);

      // Update local user state
      updateUser({ ...user, isProfileComplete: true });
      
      setSuccess('Profile completed successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error completing profile:', err);
      setError(err.message || 'Failed to complete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input 
                  value={basicInfo.firstName} 
                  onChange={(e) => handleBasicInfoChange('firstName', e.target.value)} 
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input 
                  value={basicInfo.lastName} 
                  onChange={(e) => handleBasicInfoChange('lastName', e.target.value)} 
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div>
              <Label>Username *</Label>
              <Input 
                value={basicInfo.username} 
                onChange={(e) => handleBasicInfoChange('username', e.target.value)} 
                placeholder="Choose a username"
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input 
                value={basicInfo.phone} 
                onChange={(e) => handleBasicInfoChange('phone', e.target.value)} 
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date of Birth *</Label>
                <Input 
                  type="date" 
                  value={basicInfo.dateOfBirth} 
                  onChange={(e) => handleBasicInfoChange('dateOfBirth', e.target.value)} 
                />
              </div>
              <div>
                <Label>Gender *</Label>
                <Select value={basicInfo.gender} onValueChange={(value) => handleBasicInfoChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Institution ID *</Label>
              <Input 
                value={academicInfo.institutionId} 
                onChange={(e) => handleAcademicInfoChange('institutionId', e.target.value)} 
                placeholder="Enter institution ID"
              />
            </div>
            <div>
              <Label>Student ID *</Label>
              <Input 
                value={academicInfo.studentId} 
                onChange={(e) => handleAcademicInfoChange('studentId', e.target.value)} 
                placeholder="Enter student ID"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Course *</Label>
                <Input 
                  value={academicInfo.course} 
                  onChange={(e) => handleAcademicInfoChange('course', e.target.value)} 
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <Label>Year *</Label>
                <Select value={academicInfo.year} onValueChange={(value) => handleAcademicInfoChange('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Department</Label>
              <Input 
                value={academicInfo.department} 
                onChange={(e) => handleAcademicInfoChange('department', e.target.value)} 
                placeholder="Enter department (optional)"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Security Question *</Label>
              <Select value={securityInfo.securityQuestion} onValueChange={(value) => handleSecurityInfoChange('securityQuestion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a security question" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="What was your first pet's name?">What was your first pet's name?</SelectItem>
                  <SelectItem value="In which city were you born?">In which city were you born?</SelectItem>
                  <SelectItem value="What was your mother's maiden name?">What was your mother's maiden name?</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Security Answer *</Label>
              <Input 
                value={securityInfo.securityAnswer} 
                onChange={(e) => handleSecurityInfoChange('securityAnswer', e.target.value)} 
                placeholder="Enter your answer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Emergency Contact *</Label>
                <Input 
                  value={securityInfo.emergencyContact} 
                  onChange={(e) => handleSecurityInfoChange('emergencyContact', e.target.value)} 
                  placeholder="Emergency contact name"
                />
              </div>
              <div>
                <Label>Emergency Phone *</Label>
                <Input 
                  value={securityInfo.emergencyPhone} 
                  onChange={(e) => handleSecurityInfoChange('emergencyPhone', e.target.value)} 
                  placeholder="Emergency phone number"
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={securityInfo.privacyConsent} 
                  onCheckedChange={(checked) => handleSecurityInfoChange('privacyConsent', checked)} 
                />
                <Label>I agree to the privacy policy and terms of service *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={securityInfo.dataProcessingConsent} 
                  onCheckedChange={(checked) => handleSecurityInfoChange('dataProcessingConsent', checked)} 
                />
                <Label>I consent to data processing for mental health support *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={securityInfo.mentalHealthConsent} 
                  onCheckedChange={(checked) => handleSecurityInfoChange('mentalHealthConsent', checked)} 
                />
                <Label>I consent to mental health support services *</Label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to complete your profile.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Help us personalize your MindCare experience</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5" />}
              {currentStep === 2 && <GraduationCap className="h-5 w-5" />}
              {currentStep === 3 && <Shield className="h-5 w-5" />}
              Step {currentStep} of {totalSteps}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Basic personal information"}
              {currentStep === 2 && "Academic and institutional details"}
              {currentStep === 3 && "Security and consent information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? 'Completing...' : 'Complete Profile'}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletionFlow;
