"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import { Alert, AlertDescription } from "../ui/Alert"
import { Progress } from "../ui/Progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Checkbox } from "../ui/Checkbox"
import {
  Heart,
  Shield,
  Eye,
  EyeOff,
  GraduationCap,
  UserPlus,
  Lock,
  Globe,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Clock,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { API_URL } from "../config/environment.js"
import { useAuth } from "../hooks/useAuth.js"

const Signup = ({ onLogin, onShowLogin, userData, onBackToUserSignup }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    // Basic User Information (from UserSignup)
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    dateOfBirth: userData?.dateOfBirth || "",
    gender: userData?.gender || "",

    // Step 1: Academic Information
    institutionId: "",
    studentId: "",
    course: "",
    year: "",
    department: "",

    // Step 2: Account Security
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",

    // Step 3: Consent & Privacy
    privacyConsent: false,
    dataProcessingConsent: false,
    emergencyContact: "",
    emergencyPhone: "",
    mentalHealthConsent: false,
    communicationConsent: false,
  })

  const [errors, setErrors] = useState({})

  // Update form data when userData changes or from location state
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth || "",
        gender: userData.gender || "",
      }))
    }

    // Handle Google OAuth flow from location state
    if (location.state?.userData) {
      console.log("🔍 Setting form data from location state:", location.state.userData)
      setFormData((prev) => ({
        ...prev,
        firstName: location.state.userData.firstName || "",
        lastName: location.state.userData.lastName || "",
        email: location.state.userData.email || "",
        phone: location.state.userData.phone || "",
        dateOfBirth: location.state.userData.dateOfBirth || "",
        gender: location.state.userData.gender || "",
      }))
    }

    // Handle Google data from login flow (user not found)
    if (location.state?.googleData) {
      console.log("🔍 Setting form data from Google login flow:", location.state.googleData)
      setFormData((prev) => ({
        ...prev,
        firstName: location.state.googleData.firstName || "",
        lastName: location.state.googleData.lastName || "",
        email: location.state.googleData.email || "",
        phone: location.state.googleData.phone || "",
        dateOfBirth: location.state.googleData.dateOfBirth || "",
        gender: location.state.googleData.gender || "",
      }))
    }
  }, [userData, location.state])

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
  ]

  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite book?",
    "What city were you born in?",
  ]

  const courses = [
    "B.Tech - Computer Science",
    "B.Tech - Electronics",
    "B.Tech - Mechanical",
    "B.Tech - Civil",
    "M.Tech - Computer Science",
    "MBA",
    "BBA",
    "B.Sc - Physics",
    "B.Sc - Chemistry",
    "B.Sc - Mathematics",
    "BA - English",
    "BA - Psychology",
    "Other",
  ]

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.institutionId) newErrors.institutionId = "Institution is required"
        if (!formData.studentId) newErrors.studentId = "Student ID is required"
        if (!formData.course) newErrors.course = "Course is required"
        if (!formData.year) newErrors.year = "Academic year is required"
        break

      case 2:
        if (!formData.password) {
          newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters"
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          newErrors.password = "Password must contain uppercase, lowercase, and number"
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match"
        }
        if (!formData.securityQuestion) newErrors.securityQuestion = "Security question is required"
        if (!formData.securityAnswer) newErrors.securityAnswer = "Security answer is required"
        break

      case 3:
        if (!formData.privacyConsent) newErrors.privacyConsent = "Privacy consent is required"
        if (!formData.dataProcessingConsent) newErrors.dataProcessingConsent = "Data processing consent is required"
        if (!formData.mentalHealthConsent) newErrors.mentalHealthConsent = "Mental health service consent is required"
        if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency contact is required"
        if (!formData.emergencyPhone) newErrors.emergencyPhone = "Emergency contact phone is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const fromGoogle = Boolean(location.state?.fromGoogle)
  const originalUser = location.state?.originalUser || null

  async function completeGoogleProfile(payload) {
    const body = JSON.stringify({
      ...payload,
      email: originalUser?.email || payload.email,
      googleId: originalUser?.googleId,
    })

    const response = await fetch(`${API_URL}/api/users/complete-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body,
    })

    let data;
    try {
      data = await response.json()
    } catch (error) {
      throw new Error("Server error - please try again later")
    }

    if (!response.ok) {
      throw new Error(data?.message || `Profile completion failed (${response.status})`)
    }

    return data
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)

    try {
      // Generate username from first and last name
      const username = `${(formData.firstName || "").toLowerCase()}${(formData.lastName || "").toLowerCase()}${Date.now()}`

      // Prepare the complete user data
      const compiledUserData = {
        // Basic information (from UserSignup)
        firstName: formData.firstName,
        lastName: formData.lastName,
        username,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,

        // Academic information
        institutionId: formData.institutionId,
        studentId: formData.studentId,
        course: formData.course,
        year: formData.year,
        department: formData.department,

        // Security information
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,

        // Consent information
        privacyConsent: formData.privacyConsent,
        dataProcessingConsent: formData.dataProcessingConsent,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        mentalHealthConsent: formData.mentalHealthConsent,
        communicationConsent: formData.communicationConsent,
      }

      // Check if this is from Google login flow (user not found)
      const isFromGoogleLogin = location.state?.googleData;
      
      // Check if this is from UserSignup flow
      const isFromUserSignup = location.state?.fromUserSignup;
      
      if (fromGoogle) {
        await completeGoogleProfile(compiledUserData)

        // Success - profile completed; redirect
        if (onLogin) onLogin("student")
        navigate("/contact-choice")
        return
      }

      if (isFromUserSignup && user && localStorage.getItem('token')) {
        console.log('🚀 UserSignup flow - saving to user details schema');
        console.log('🔍 Current user from useAuth:', user);
        console.log('🔍 Token from localStorage:', localStorage.getItem('token'));
        
        // Get the current user's token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        // Prepare the user details data
        const userDetailsData = {
          // Basic information (from UserSignup)
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: `${(formData.firstName || "").toLowerCase()}${(formData.lastName || "").toLowerCase()}${Date.now()}`,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,

          // Academic information
          institutionId: formData.institutionId,
          studentId: formData.studentId,
          course: formData.course,
          year: formData.year,
          department: formData.department,

          // Security information
          securityQuestion: formData.securityQuestion,
          securityAnswer: formData.securityAnswer,

          // Consent information
          privacyConsent: formData.privacyConsent,
          dataProcessingConsent: formData.dataProcessingConsent,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          mentalHealthConsent: formData.mentalHealthConsent,
          communicationConsent: formData.communicationConsent,
        };

        console.log('🔍 Saving user details:', userDetailsData);

        // Get user ID from the current user context
        if (!user || !user._id) {
          throw new Error('User not found. Please log in again.');
        }
        const userId = user._id;

        // Save user details
        const detailsResponse = await fetch(`${API_URL}/api/user-details/${userId}`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(userDetailsData),
        });

        if (!detailsResponse.ok) {
          const detailsResult = await detailsResponse.json();
          throw new Error(detailsResult.message || 'Failed to save user details');
        }

        // Mark profile as complete
        const completeResponse = await fetch(`${API_URL}/api/user-details/${userId}/complete`, {
          method: "PATCH",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
          }
        });

        if (!completeResponse.ok) {
          const completeResult = await completeResponse.json();
          throw new Error(completeResult.message || 'Failed to mark profile complete');
        }

        console.log('✅ Profile completed successfully!');

        // Success - redirect to student dashboard
        alert("Profile completed successfully! Welcome to MindCare.");
        navigate('/dashboard');
        return;
      }

      if (isFromGoogleLogin) {
        // User came from Google login (not found in database) - create user with Google data
        console.log('🚀 Creating user from Google login flow');
        
        // Add Google data to the user registration
        const googleUserData = {
          ...compiledUserData,
          googleId: location.state.googleData.googleId,
          profilePicture: location.state.googleData.profilePicture,
          isEmailVerified: true
        };

        const response = await fetch(`${API_URL}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googleUserData),
        });

        let result;
        try {
          result = await response.json();
        } catch {
          throw new Error("Server error - please try again later");
        }

        if (!response.ok) {
          if (response.status === 409 || /duplicate|exists/i.test(result?.message || "")) {
            throw new Error("An account with this email already exists. Please sign in instead.");
          }
          throw new Error(result?.message || `Signup failed (${response.status})`);
        }

                 // Success - redirect to ContactChoice
         console.log('🚀 Google user registered, redirecting to ContactChoice');
         if (onLogin) {
           onLogin("student", result.data?.user || googleUserData);
         }
         navigate('/contact-choice');
         return;
      }

             // Regular signup flow (new user registration)
               const response = await fetch(`${API_URL}/api/users/register`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(compiledUserData),
       })

      let result;
      try {
        result = await response.json()
      } catch {
        throw new Error("Server error - please try again later")
      }

      if (!response.ok) {
        // If duplicate email happens here, surface a friendlier message
        if (response.status === 409 || /duplicate|exists/i.test(result?.message || "")) {
          throw new Error("An account with this email already exists. Please sign in instead.")
        }
        throw new Error(result?.message || `Signup failed (${response.status})`)
      }

             // Check if user came from login (user not found scenario)
       const isFromLogin = location.state?.fromLogin;
       
       if (isFromLogin) {
         // User came from login (not found in database) - redirect to ContactChoice
         console.log('🚀 User registered from login flow, redirecting to ContactChoice');
         if (onLogin) {
           onLogin("student", result.data?.user || compiledUserData);
         }
         navigate('/contact-choice');
       } else {
        // Regular signup flow - show success message and redirect to login
        alert("Account created successfully! Please check your email for verification.")
        onShowLogin?.()
      }
    } catch (error) {
      console.error("❌ Signup error:", error)
      alert(`Signup failed: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (step) => {
    const icons = {
      1: <GraduationCap className="w-5 h-5" />,
      2: <Lock className="w-5 h-5" />,
      3: <Shield className="w-5 h-5" />,
    }
    return icons[step]
  }

  const getStepTitle = (step) => {
    const titles = {
      1: "Academic Details",
      2: "Account Security",
      3: "Consent & Privacy",
    }
    return titles[step]
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Educational Institution *</Label>
              <Select
                value={formData.institutionId}
                onValueChange={(value) => handleInputChange("institutionId", value)}
              >
                <SelectTrigger className={errors.institutionId ? "border-red-500" : ""}>
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
              {errors.institutionId && <p className="text-sm text-red-600">{errors.institutionId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                placeholder="Enter your student ID"
                className={errors.studentId ? "border-red-500" : ""}
              />
              {errors.studentId && <p className="text-sm text-red-600">{errors.studentId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course/Program *</Label>
              <Select value={formData.course} onValueChange={(value) => handleInputChange("course", value)}>
                <SelectTrigger className={errors.course ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your course" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course && <p className="text-sm text-red-600">{errors.course}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Academic Year *</Label>
                <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                  <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                    <SelectItem value="5">5th Year</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
                {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Create a strong password"
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">
                Password must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityQuestion">Security Question *</Label>
              <Select
                value={formData.securityQuestion}
                onValueChange={(value) => handleInputChange("securityQuestion", value)}
              >
                <SelectTrigger className={errors.securityQuestion ? "border-red-500" : ""}>
                  <SelectValue placeholder="Choose a security question" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                  {securityQuestions.map((question, index) => (
                    <SelectItem key={index} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.securityQuestion && <p className="text-sm text-red-600">{errors.securityQuestion}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityAnswer">Security Answer *</Label>
              <Input
                id="securityAnswer"
                value={formData.securityAnswer}
                onChange={(e) => handleInputChange("securityAnswer", e.target.value)}
                placeholder="Enter your answer"
                className={errors.securityAnswer ? "border-red-500" : ""}
              />
              {errors.securityAnswer && <p className="text-sm text-red-600">{errors.securityAnswer}</p>}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Emergency Contact Information</h3>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="Parent/Guardian name"
                  className={errors.emergencyContact ? "border-red-500" : ""}
                />
                {errors.emergencyContact && <p className="text-sm text-red-600">{errors.emergencyContact}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className={errors.emergencyPhone ? "border-red-500" : ""}
                />
                {errors.emergencyPhone && <p className="text-sm text-red-600">{errors.emergencyPhone}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Privacy & Consent Agreements</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacyConsent"
                    checked={formData.privacyConsent}
                    onCheckedChange={(checked) => handleInputChange("privacyConsent", checked)}
                    className={errors.privacyConsent ? "border-red-500" : ""}
                  />
                  <div className="text-sm">
                    <label htmlFor="privacyConsent" className="font-medium cursor-pointer">
                      Privacy Policy Agreement *
                    </label>
                    <p className="text-muted-foreground mt-1">
                      I agree to the privacy policy and understand how my data will be processed and protected.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dataProcessingConsent"
                    checked={formData.dataProcessingConsent}
                    onCheckedChange={(checked) => handleInputChange("dataProcessingConsent", checked)}
                    className={errors.dataProcessingConsent ? "border-red-500" : ""}
                  />
                  <div className="text-sm">
                    <label htmlFor="dataProcessingConsent" className="font-medium cursor-pointer">
                      Data Processing Consent *
                    </label>
                    <p className="text-muted-foreground mt-1">
                      I consent to the processing of my personal data for mental health support services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="mentalHealthConsent"
                    checked={formData.mentalHealthConsent}
                    onCheckedChange={(checked) => handleInputChange("mentalHealthConsent", checked)}
                    className={errors.mentalHealthConsent ? "border-red-500" : ""}
                  />
                  <div className="text-sm">
                    <label htmlFor="mentalHealthConsent" className="font-medium cursor-pointer">
                      Mental Health Services Consent *
                    </label>
                    <p className="text-muted-foreground mt-1">
                      I understand this platform provides mental health support and consent to receive such services.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="communicationConsent"
                    checked={formData.communicationConsent}
                    onCheckedChange={(checked) => handleInputChange("communicationConsent", checked)}
                  />
                  <div className="text-sm">
                    <label htmlFor="communicationConsent" className="font-medium cursor-pointer">
                      Communication Preferences
                    </label>
                    <p className="text-muted-foreground mt-1">
                      I agree to receive important updates about mental health resources and services.
                    </p>
                  </div>
                </div>
              </div>

              {Object.keys(errors).some((key) =>
                ["privacyConsent", "dataProcessingConsent", "mentalHealthConsent"].includes(key),
              ) && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Please accept all required consent agreements to proceed.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {userData ? "Complete Your Registration" : "Join MEDHYA"}
            </h1>
            <p className="text-muted-foreground">
              {userData
                ? "Continue with academic details and security setup"
                : "Create your secure student account for mental health support"}
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{userData ? `Step ${currentStep + 1} of 4` : `Step ${currentStep} of 3`}</span>
                <span>
                  {userData ? Math.round(((currentStep + 1) / 4) * 100) : Math.round((currentStep / 3) * 100)}% Complete
                </span>
              </div>
              <Progress value={userData ? ((currentStep + 1) / 4) * 100 : (currentStep / 3) * 100} className="h-2" />
            </div>

            {/* Step Indicator */}
            <div className="flex justify-between items-center">
              {userData
                ? [1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          step === 1
                            ? "bg-green-600 border-green-600 text-white"
                            : step <= currentStep + 1
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {step === 1 ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : step < currentStep + 1 ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          getStepIcon(step - 1)
                        )}
                      </div>
                      {step < 4 && (
                        <div className={`w-12 h-0.5 mx-2 ${step < currentStep + 1 ? "bg-blue-600" : "bg-gray-300"}`} />
                      )}
                    </div>
                  ))
                : [1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          step <= currentStep
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {step < currentStep ? <CheckCircle className="w-5 h-5" /> : getStepIcon(step)}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-300"}`} />
                      )}
                    </div>
                  ))}
            </div>

            <div className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                {getStepIcon(currentStep)}
                {getStepTitle(currentStep)}
              </CardTitle>
              <CardDescription className="mt-2">
                {userData ? (
                  <>
                    {currentStep === 1 && "Tell us about your academic background"}
                    {currentStep === 2 && "Secure your account with a strong password"}
                    {currentStep === 3 && "Review and accept our privacy agreements"}
                  </>
                ) : (
                  <>
                    {currentStep === 1 && "Tell us about your academic background"}
                    {currentStep === 2 && "Secure your account with a strong password"}
                    {currentStep === 3 && "Review and accept our privacy agreements"}
                  </>
                )}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <div>
                {userData && currentStep === 1 ? (
                  <Button variant="outline" onClick={onBackToUserSignup}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Basic Info
                  </Button>
                ) : currentStep > 1 ? (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                ) : null}
              </div>

              <div className="flex gap-2">
                {currentStep < 3 ? (
                  <Button onClick={nextStep} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={onShowLogin}>
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Your data is secure.</strong> We use industry-standard encryption and comply with privacy
            regulations to protect your mental health information.
          </AlertDescription>
        </Alert>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>15+ Languages</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>24/7 Support</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 MEDHYA - Built for Smart India Hackathon</p>
        </div>
      </div>
    </div>
  )
}

export default Signup
