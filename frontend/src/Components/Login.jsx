import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Badge } from "../ui/Badge";
import { Alert, AlertDescription } from "../ui/Alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import {
  Heart,
  Shield,
  Eye,
  EyeOff,
  Building2,
  GraduationCap,
  UserCheck,
  Lock,
  Globe,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { testGoogleOAuth } from "../utils/googleOAuthTest.js";

const Login = ({ onLogin, onShowSignup, onShowUserSignup, onBack }) => {
  const navigate = useNavigate();
  const { login, googleAuth, loading, error } = useAuth();
  const [loginType, setLoginType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    institutionId: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const institutions = [
    { id: "iit-delhi", name: "Indian Institute of Technology, Delhi" },
    { id: "iit-bombay", name: "Indian Institute of Technology, Bombay" },
    { id: "iit-kanpur", name: "Indian Institute of Technology, Kanpur" },
    { id: "du-north", name: "University of Delhi, North Campus" },
    { id: "jnu", name: "Jawaharlal Nehru University" },
    { id: "bhu", name: "Banaras Hindu University" },
    { id: "nit-trichy", name: "National Institute of Technology, Trichy" },
    { id: "vit-vellore", name: "VIT University, Vellore" },
    { id: "manipal", name: "Manipal Institute of Technology" },
    { id: "anna-univ", name: "Anna University, Chennai" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (loginType === "student" && !formData.institutionId) {
      newErrors.institutionId = "Please select your institution";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      
      // Check user role from the response and call onLogin callback
        if (onLogin) {
        onLogin(user.role, user);
      }
      
      // The App component will handle navigation based on the authentication state
    } catch (err) {
      console.error('Login failed:', err);
      // If login fails, show error but don't redirect
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Test Google OAuth configuration first
      testGoogleOAuth();

      // Initialize Google OAuth
      const google = window.google;
      if (!google) {
        throw new Error('Google OAuth not available');
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'your-google-client-id') {
        throw new Error('Google Client ID not configured');
      }

      console.log('🔍 Starting Google OAuth with client ID:', clientId);

      google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile',
        callback: async (response) => {
          try {
            // Get user info from Google
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                'Authorization': `Bearer ${response.access_token}`
              }
            });

            const userInfo = await userInfoResponse.json();

            // Send to backend with login type
            const user = await googleAuth({
              googleId: userInfo.id,
              email: userInfo.email,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              profilePicture: userInfo.picture,
              loginType: loginType // Include the selected login type (admin/student)
            });

            // Check user role and profile completeness
            console.log('🔍 User profile check:', {
              role: user.role,
              phone: user.phone,
              institutionId: user.institutionId,
              studentId: user.studentId,
              course: user.course,
              year: user.year
            });

            // Call onLogin callback with user role and data
              if (onLogin) {
              onLogin(user.role, user);
              }
            
            // The App component will handle navigation based on the authentication state
          } catch (err) {
            console.error('Google auth failed:', err);
            // Show user-friendly error message
            if (err.message.includes('access blocked') || err.message.includes('invalid')) {
              alert('Google OAuth configuration issue. Please check the console for details.');
            }
          } finally {
            setIsLoading(false);
          }
        }
      }).requestAccessToken();
    } catch (err) {
      console.error('Google OAuth failed:', err);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const demoCredentials = {
    student: { email: "student@university.edu", password: "demo123456" },
    counselor: { email: "counselor@institution.edu", password: "counselor123456" },
    admin: { email: "admin@institution.edu", password: "admin123456" },
  };

  const fillDemoCredentials = () => {
    const creds = demoCredentials[loginType];
    setFormData((prev) => ({
      ...prev,
      email: creds.email,
      password: creds.password,
      institutionId: loginType === "student" ? "iit-delhi" : "",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Link to="/">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to MEDHYA
            </h1>
            <p className="text-muted-foreground">
              Secure access to your mental health support platform
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <Tabs
              value={loginType}
              onValueChange={setLoginType}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="student"
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="counselor" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Counselor
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Administrator
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {loginType === "student" ? (
                  <>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Student Login
                  </>
                ) : loginType === "counselor" ? (
                  <>
                    <UserCheck className="w-5 h-5 text-green-600" />
                    Counselor Login
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Administrator Login
                  </>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {loginType === "student"
                  ? "Access your personal mental health dashboard and support tools"
                  : loginType === "counselor"
                  ? "Provide professional counseling and support to students"
                  : "Manage institutional mental health programs and analytics"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
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
                  placeholder={
                    loginType === "student"
                      ? "student@university.edu"
                      : loginType === "counselor"
                      ? "counselor@institution.edu"
                      : "admin@institution.edu"
                  }
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
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
                    onCheckedChange={(checked) =>
                      handleInputChange("rememberMe", checked)
                    }
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
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 shadow-sm space-y-3 border border-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-700">
                  Instant Demo Access
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Try out MEDHYA without signing up. Explore features
                with demo data instantly.
              </p>
              <Button
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-100 hover:text-blue-800 transition"
                onClick={fillDemoCredentials}
                type="button"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Use Demo Credentials
              </Button>
            </div>

            {/* Signup Link for Students */}
            {loginType === "student" && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm space-y-3 border border-purple-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-semibold text-purple-700">
                    New Student?
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Don't have an account yet? Create your student profile and get
                  started today.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-100 hover:text-purple-800 transition"
                  onClick={onShowUserSignup}
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
                <strong>Your privacy is protected.</strong> All sessions are
                encrypted and HIPAA compliant. Your mental health data is kept
                strictly confidential.
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
            <p>
              Emergency Support: <strong>1800-599-0019</strong> (iCALL)
            </p>
            <p className="mt-1">
              © 2024 MEDHYA - Built for Smart India Hackathon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

