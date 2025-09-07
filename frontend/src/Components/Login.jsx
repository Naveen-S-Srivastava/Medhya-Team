"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Alert, AlertDescription } from "../ui/Alert";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";
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
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { validateGoogleOAuthConfig, getOAuthErrorMessage } from "../utils/googleOAuthConfig.js";

import LP from "../assets/logo1.jpg";
import Footer from "./Footer.jsx";

const Login = ({ onLogin, onShowUserSignup, onLoginError }) => {
  const navigate = useNavigate();
  const { login, googleAuth, loading, error } = useAuth();
  const [loginType, setLoginType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    institutionId: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [googleOAuthError, setGoogleOAuthError] = useState(null);

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

    setGoogleOAuthError(null);

    try {
      const user = await login(formData.email, formData.password);
      if (onLogin) {
        onLogin(user.role, user);
      }
    } catch (err) {
      if (err.message.includes('Google login')) {
        setGoogleOAuthError('This account was created using Google login. Please use the "Continue with Google" button to sign in.');
        return;
      }
      if (onLoginError) {
        onLoginError(loginType, err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!validateGoogleOAuthConfig()) {
        const errorMessage = 'Google OAuth is not properly configured for this domain. Please contact support.';
        alert(errorMessage);
        return;
      }

      const google = window.google;
      if (!google) throw new Error('Google OAuth not available');

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'your-google-client-id') {
        throw new Error('Google Client ID not configured');
      }

      google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile',
        callback: async (response) => {
          try {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { 'Authorization': `Bearer ${response.access_token}` }
            });
            const userInfo = await userInfoResponse.json();
            const user = await googleAuth({
              googleId: userInfo.id,
              email: userInfo.email,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              profilePicture: userInfo.picture,
              loginType: loginType
            });
            if (onLogin) {
              onLogin(user.role, user);
            }
          } catch (err) {
            if (err.message.includes('access blocked') || err.message.includes('invalid')) {
              const errorMessage = getOAuthErrorMessage(err);
              alert(errorMessage);
            } else if (err.code === 'USER_NOT_FOUND' && loginType !== 'counselor') {
              if (onLoginError) {
                onLoginError(loginType, err.message, err.googleData);
              }
            } else {
              if (onLoginError) {
                onLoginError(loginType, err.message);
              }
            }
          }
        }
      }).requestAccessToken();
    } catch (err) {
      const errorMessage = getOAuthErrorMessage(err);
      alert(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (googleOAuthError) {
      setGoogleOAuthError(null);
    }
  };

  const demoCredentials = {
    student: { email: "student@mindcare.com", password: "Student@123" },
    counselor: { email: "counselor@mindcare.com", password: "Counselor@123" },
    admin: { email: "admin@mindcare.com", password: "Admin@123" },
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-lavender-50 flex flex-col items-center justify-center p-4 font-['Poppins',sans-serif]">
      <div className="w-full flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12 p-4 max-w-7xl mx-auto">
        {/* Left Section (Logo and Info) */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 text-center md:text-left">
          <div className="space-y-8">
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link to="/" className="inline-block group">
                <div className="relative">
                  <img
                    src={LP}
                    alt="MEDHYA Logo"
                    className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-blue-500 via-sky-500 to-blue-600 rounded-3xl shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl border-4 border-white"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-sky-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-transparent leading-tight">
                  Welcome to MEDHYA
                </h1>
                <p className="text-xl text-slate-700 max-w-md mx-auto md:mx-0 font-semibold leading-relaxed">
                  Your secure platform for mental health support and wellness.
                </p>

              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`mt-8 flex gap-8 ${loginType === "student" ? "w-full" : "w-full max-w-sm"
            }`}>
            {loginType === "student" && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-700 mb-1">New Student?</p>
                  <p className="text-sm text-slate-500">Join our community of wellness</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-semibold"
                  onClick={onShowUserSignup}
                  type="button"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Create Student Account
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <div className="text-center md:text-left">
                <p className="text-lg font-semibold text-slate-700 mb-1">Just want to explore?</p>
                <p className="text-sm text-slate-500">Try our demo with sample data</p>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-sky-200 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-semibold"
                onClick={fillDemoCredentials}
                type="button"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Use Demo Credentials
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section (Login Card) */}
        <div className="flex w-full md:w-1/2 p-4 md:p-12 items-center justify-center">
          <Card className="shadow-lg border border-slate-200 bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="space-y-6 p-6">
              <Tabs
                value={loginType}
                onValueChange={(value) => {
                  setLoginType(value);
                  setGoogleOAuthError(null);
                }}
                className="w-full"
              >
                <TabsList className="grid w-full h-12 grid-cols-3 bg-gradient-to-r from-sky-50 to-blue-50 p-1.5 rounded-2xl border border-sky-200">
                  <TabsTrigger
                    value="student"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-600 data-[state=active]:border data-[state=active]:border-sky-200 rounded-xl transition-all duration-300 font-medium hover:bg-white/50"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger
                    value="counselor"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-emerald-600 data-[state=active]:border data-[state=active]:border-emerald-200 rounded-xl transition-all duration-300 font-medium hover:bg-white/50"
                  >
                    <Heart className="w-4 h-4" />
                    Counselor
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 data-[state=active]:border data-[state=active]:border-indigo-200 rounded-xl transition-all duration-300 font-medium hover:bg-white/50"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="text-center pt-2">
                <CardTitle className="flex items-center justify-center gap-2 text-xl font-bold text-slate-800">
                  {loginType === "student" ? (
                    <>
                      <GraduationCap className="w-5 h-5 text-sky-500" />
                      Student Login
                    </>
                  ) : loginType === "counselor" ? (
                    <>
                      <Heart className="w-5 h-5 text-emerald-500" />
                      Counselor Login
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 text-indigo-500" />
                      Administrator Login
                    </>
                  )}
                </CardTitle>
                <CardDescription className="mt-3 text-slate-600 font-medium">
                  {loginType === "student"
                    ? "Access your personal mental health dashboard"
                    : loginType === "counselor"
                      ? "Provide professional counseling and support"
                      : "Manage institutional programs and analytics"}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 font-medium"
                onClick={handleGoogleLogin}
                disabled={loading || loginType === "admin" || loginType === "counselor"}
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
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-2xl">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {googleOAuthError && (
                <Alert className="border-sky-200 bg-sky-50 rounded-2xl">
                  <Globe className="h-4 w-4 text-sky-600" />
                  <AlertDescription className="text-sky-800 font-medium">
                    {googleOAuthError}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`rounded-2xl border-2 border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all duration-300 ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pr-12 rounded-2xl border-2 border-slate-200 focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all duration-300 ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-slate-100 rounded-r-2xl"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-500" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked)}
                      className="border-2 border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                    />
                    <Label htmlFor="remember" className="text-sm font-medium text-slate-700">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-sm p-0 h-auto text-sky-600 hover:text-sky-700 font-medium">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 flex items-center justify-center bg-gradient-to-r from-sky-500 to-mint-100 hover:from-sky-600 hover:to-mint-600 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-semibold text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4  h-4 mr-2" />
                      Sign In Securely
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;