import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { 
  Heart, Shield, Eye, EyeOff, Building2, GraduationCap, 
  UserCheck, Lock, Globe, CheckCircle, AlertTriangle,
  Phone, Mail, MapPin
} from 'lucide-react';

const Login = ({ onLogin, onShowSignup }) => {
  const [loginType, setLoginType] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    institutionId: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

  const institutions = [
    { id: 'iit-delhi', name: 'Indian Institute of Technology, Delhi' },
    { id: 'iit-bombay', name: 'Indian Institute of Technology, Bombay' },
    { id: 'iit-kanpur', name: 'Indian Institute of Technology, Kanpur' },
    { id: 'du-north', name: 'University of Delhi, North Campus' },
    { id: 'jnu', name: 'Jawaharlal Nehru University' },
    { id: 'bhu', name: 'Banaras Hindu University' },
    { id: 'nit-trichy', name: 'National Institute of Technology, Trichy' },
    { id: 'vit-vellore', name: 'VIT University, Vellore' },
    { id: 'manipal', name: 'Manipal Institute of Technology' },
    { id: 'anna-univ', name: 'Anna University, Chennai' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (loginType === 'student' && !formData.institutionId) {
      newErrors.institutionId = 'Please select your institution';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      onLogin(loginType);
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const demoCredentials = {
    student: { email: 'student@university.edu', password: 'demo123456' },
    admin: { email: 'admin@institution.edu', password: 'admin123456' }
  };

  const fillDemoCredentials = () => {
    const creds = demoCredentials[loginType];
    setFormData(prev => ({
      ...prev,
      email: creds.email,
      password: creds.password,
      institutionId: loginType === 'student' ? 'iit-delhi' : ''
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to MindSupport Pro
            </h1>
            <p className="text-muted-foreground">
              Secure access to your mental health support platform
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <Tabs value={loginType} onValueChange={setLoginType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Administrator
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {loginType === 'student' ? (
                  <>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Student Login
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 text-purple-600" />
                    Administrator Login
                  </>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {loginType === 'student' 
                  ? 'Access your personal mental health dashboard and support tools'
                  : 'Manage institutional mental health programs and analytics'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institution Selection for Students */}
              {loginType === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="institution">Educational Institution</Label>
                  <Select 
                    value={formData.institutionId} 
                    onValueChange={(value) => handleInputChange('institutionId', value)}
                  >
                    <SelectTrigger className={errors.institutionId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions.map((institution) => (
                        <SelectItem key={institution.id} value={institution.id}>
                          {institution.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.institutionId && (
                    <p className="text-sm text-red-600">{errors.institutionId}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={loginType === 'student' ? 'student@university.edu' : 'admin@institution.edu'}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="text-sm p-0 h-auto">
                  Forgot password?
                </Button>
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In Securely
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={fillDemoCredentials}
                type="button"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Use Demo Credentials
              </Button>
            </div>

            {/* Signup Link for Students */}
            {loginType === 'student' && (
              <div className="text-center space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">New Student?</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Don't have an account yet?
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onShowSignup}
                  type="button"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Create Student Account
                </Button>
              </div>
            )}

            {/* Security Notice */}
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Your privacy is protected.</strong> All sessions are encrypted and HIPAA compliant. 
                Your mental health data is kept strictly confidential.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>15+ Languages</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Emergency Support: <strong>1800-599-0019</strong> (iCALL)</p>
            <p className="mt-1">© 2024 MindSupport Pro - Built for Smart India Hackathon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;