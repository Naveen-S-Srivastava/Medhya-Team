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
import { Alert, AlertDescription } from "../ui/Alert";
import {
  Heart,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
  Globe,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Building2,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const CounselorLogin = ({ onLogin, onBack }) => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password, "counselor");
      
      // Check if user profile is complete
      if (!user.phone || !user.specialization || !user.license) {
        // Profile incomplete - redirect to counselor profile completion
        navigate('/counselor-signup', { state: { user, isProfileCompletion: true } });
      } else {
        // Profile complete - redirect to counselor dashboard
        if (onLogin) {
          onLogin("counselor");
        }
        navigate("/counselor-dashboard");
      }
    } catch (err) {
      console.error('Counselor login failed:', err);
      // If login fails, show error but don't redirect
    } finally {
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
    email: "counselor@university.edu",
    password: "demo123456"
  };

  const fillDemoCredentials = () => {
    setFormData((prev) => ({
      ...prev,
      email: demoCredentials.email,
      password: demoCredentials.password,
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
              Professional mental health counseling platform
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Counselor Login
              </CardTitle>
              <CardDescription className="mt-2">
                Access your professional counseling dashboard and client management tools
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Professional Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="counselor@university.edu"
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
                  <input
                    type="checkbox"
                    id="remember"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      handleInputChange("rememberMe", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
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
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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
                    Sign In as Counselor
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 shadow-sm space-y-3 border border-green-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-semibold text-green-700">
                  Instant Demo Access
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Try out MEDHYA counselor features without signing up. Explore the platform
                with demo data instantly.
              </p>
              <Button
                variant="outline"
                className="w-full border-green-200 hover:bg-green-100 hover:text-green-800 transition"
                onClick={fillDemoCredentials}
                type="button"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Use Demo Credentials
              </Button>
            </div>

            {/* Back to Main Login */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm space-y-3 border border-purple-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-purple-700">
                  Not a Counselor?
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Are you a student or administrator? Return to the main login page
                to access your account.
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-100 hover:text-purple-800 transition"
                onClick={onBack}
                type="button"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Back to Main Login
              </Button>
            </div>

            {/* Security Notice */}
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Professional access secured.</strong> All counselor sessions are
                encrypted and HIPAA compliant. Client confidentiality is maintained
                at the highest standards.
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

export default CounselorLogin;
