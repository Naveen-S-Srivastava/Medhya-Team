import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Alert, AlertDescription } from "../ui/Alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Users, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const CounselorSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    specialization: [],
    license: {
      number: "",
      issuingAuthority: "",
      expiryDate: ""
    },
    experience: "",
    education: {
      degree: "",
      institution: "",
      year: ""
    },
    bio: ""
  });
  const [errors, setErrors] = useState({});

  const specializations = [
    "Anxiety", "Depression", "Stress Management", "Academic Stress", 
    "Relationship Issues", "Social Anxiety", "Career Counseling", 
    "Trauma", "PTSD", "Family Issues", "Eating Disorders", 
    "Substance Abuse", "Grief and Loss", "Self-Esteem", "Mindfulness", "General"
  ];

  const degrees = [
    "Ph.D. in Psychology", "Masters in Clinical Psychology", "Masters in Counseling Psychology",
    "Masters in Social Work", "Masters in Marriage and Family Therapy", "Bachelors in Psychology"
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }

    if (formData.specialization.length === 0) {
      newErrors.specialization = "At least one specialization is required";
    }

    if (!formData.license.number) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!formData.license.issuingAuthority) {
      newErrors.issuingAuthority = "Issuing authority is required";
    }

    if (!formData.license.expiryDate) {
      newErrors.expiryDate = "License expiry date is required";
    }

    if (!formData.experience) {
      newErrors.experience = "Years of experience is required";
    }

    if (!formData.education.degree) {
      newErrors.degree = "Degree is required";
    }

    if (!formData.education.institution) {
      newErrors.institution = "Institution is required";
    }

    if (!formData.education.year) {
      newErrors.year = "Graduation year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just navigate to the dashboard
      console.log('Counselor profile data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to counselor dashboard
      navigate("/counselor-dashboard");
    } catch (err) {
      console.error('Profile completion failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSpecializationChange = (specialization) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(specialization)
        ? prev.specialization.filter(s => s !== specialization)
        : [...prev.specialization, specialization]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Link to="/">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Complete Your Counselor Profile
            </h1>
            <p className="text-muted-foreground">
              Help us set up your professional counseling profile
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Professional Information
            </CardTitle>
            <CardDescription>
              Please provide your professional credentials and experience
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Professional Specializations</h3>
                
                <div className="space-y-2">
                  <Label>Select Your Specializations</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specializations.map((spec) => (
                      <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialization.includes(spec)}
                          onChange={() => handleSpecializationChange(spec)}
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specialization && (
                    <p className="text-sm text-red-600">{errors.specialization}</p>
                  )}
                </div>
              </div>

              {/* License Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Professional License</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="Enter license number"
                      value={formData.license.number}
                      onChange={(e) => handleInputChange("license.number", e.target.value)}
                      className={errors.licenseNumber ? "border-red-500" : ""}
                    />
                    {errors.licenseNumber && (
                      <p className="text-sm text-red-600">{errors.licenseNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                    <Input
                      id="issuingAuthority"
                      placeholder="e.g., State Medical Board"
                      value={formData.license.issuingAuthority}
                      onChange={(e) => handleInputChange("license.issuingAuthority", e.target.value)}
                      className={errors.issuingAuthority ? "border-red-500" : ""}
                    />
                    {errors.issuingAuthority && (
                      <p className="text-sm text-red-600">{errors.issuingAuthority}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">License Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.license.expiryDate}
                    onChange={(e) => handleInputChange("license.expiryDate", e.target.value)}
                    className={errors.expiryDate ? "border-red-500" : ""}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
              </div>

              {/* Experience & Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Experience & Education</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      placeholder="5"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className={errors.experience ? "border-red-500" : ""}
                    />
                    {errors.experience && (
                      <p className="text-sm text-red-600">{errors.experience}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="degree">Highest Degree</Label>
                    <Select
                      value={formData.education.degree}
                      onValueChange={(value) => handleInputChange("education.degree", value)}
                    >
                      <SelectTrigger className={errors.degree ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {degrees.map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.degree && (
                      <p className="text-sm text-red-600">{errors.degree}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      placeholder="University name"
                      value={formData.education.institution}
                      onChange={(e) => handleInputChange("education.institution", e.target.value)}
                      className={errors.institution ? "border-red-500" : ""}
                    />
                    {errors.institution && (
                      <p className="text-sm text-red-600">{errors.institution}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Graduation Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1950"
                      max="2024"
                      placeholder="2020"
                      value={formData.education.year}
                      onChange={(e) => handleInputChange("education.year", e.target.value)}
                      className={errors.year ? "border-red-500" : ""}
                    />
                    {errors.year && (
                      <p className="text-sm text-red-600">{errors.year}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about your approach to counseling and your professional philosophy..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Completing Profile...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CounselorSignup;
