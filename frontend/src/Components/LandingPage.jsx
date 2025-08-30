import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { 
  Heart, Brain, Shield, Users, TrendingUp, Globe, Smartphone, Award, 
  CheckCircle, ArrowRight, BarChart3, MessageCircle, Calendar, BookOpen,
  Zap, Lock, Database, Map, Star, Target, AlertTriangle, Phone, Building2,
  Play, Headphones, Clock, UserCheck, Activity, Sparkles, Home, Sun,
  Moon, Coffee, Smile, HandHeart, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = ({ onLogin, systemStats }) => {
  const [selectedDemo, setSelectedDemo] = useState('student');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const crisisResources = [
    { name: "National Crisis Helpline", number: "1-800-273-8255", available: "24/7" },
    { name: "Student Support Chat", number: "Text STUDENT to 741741", available: "24/7" },
    { name: "Campus Emergency", number: "Emergency Services", available: "Immediate" }
  ];

  const problemStats = [
    { 
      label: "Indian students experiencing mental health challenges", 
      value: "74%", 
      color: "text-red-600",
      description: "Academic pressure, career uncertainty, and social challenges"
    },
    { 
      label: "Students who avoid seeking help due to stigma", 
      value: "82%", 
      color: "text-orange-600",
      description: "Fear of judgment and lack of confidential resources"
    },
    { 
      label: "Colleges lacking comprehensive mental health support", 
      value: "88%", 
      color: "text-yellow-600",
      description: "Limited counselors and outdated intervention methods"
    },
    { 
      label: "Improvement with early, accessible intervention", 
      value: "96%", 
      color: "text-green-600",
      description: "Students show significant improvement with proper support"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-emerald-600" />,
      title: "AI Mental Health Companion",
      description: "24/7 empathetic AI counselor trained on Indian student experiences, offering immediate support in your preferred language with complete understanding of academic and family pressures.",
      metrics: "Available in 15+ languages",
      highlight: "Always available when you need support most"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Anonymous & Confidential Care",
      description: "Connect with professional counselors through our secure, stigma-free booking system. Your identity remains completely protected while you receive the care you deserve.",
      metrics: "100% confidential, HIPAA compliant",
      highlight: "Your privacy is our top priority"
    },
    {
      icon: <HandHeart className="w-8 h-8 text-pink-600" />,
      title: "Peer Support Community",
      description: "Join safe spaces with fellow students who understand your journey. Share experiences, coping strategies, and support each other through moderated, positive communities.",
      metrics: "Moderated 24/7 by trained peers",
      highlight: "You're not alone in this journey"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      title: "Personalized Wellness Plans",
      description: "AI-generated wellness strategies tailored to your academic schedule, stress patterns, and personal goals. Track your mental health journey with compassionate insights.",
      metrics: "Personalized for each student",
      highlight: "Wellness plans that fit your life"
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      title: "Crisis Prevention & Response",
      description: "Advanced early warning system identifies stress patterns and connects you with immediate help. Our crisis response team ensures no student suffers in silence.",
      metrics: "Response time under 2 minutes",
      highlight: "Immediate help when you need it most"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Institution-Wide Wellness",
      description: "Help your institution create a mentally healthy campus environment with comprehensive analytics and evidence-based intervention strategies.",
      metrics: "Data-driven mental health policies",
      highlight: "Building healthier campus communities"
    }
  ];

  const wellnessTools = [
    {
      title: "Mood Check-ins",
      description: "Quick daily assessments to track your emotional well-being",
      icon: <Smile className="w-6 h-6 text-green-600" />
    },
    {
      title: "Breathing Exercises",
      description: "Guided breathing and mindfulness practices for stress relief",
      icon: <Activity className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Sleep Tracking",
      description: "Monitor and improve your sleep patterns for better mental health",
      icon: <Moon className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Study Stress Manager",
      description: "Tools to manage exam anxiety and academic pressure",
      icon: <BookOpen className="w-6 h-6 text-purple-600" />
    }
  ];

  const studentChallenges = [
    {
      challenge: "Academic Pressure & Exam Anxiety",
      solution: "AI-powered stress management and study planning tools",
      icon: <BookOpen className="w-5 h-5 text-blue-600" />
    },
    {
      challenge: "Social Isolation & Loneliness",
      solution: "Peer support communities and social connection programs",
      icon: <Users className="w-5 h-5 text-green-600" />
    },
    {
      challenge: "Family Expectations & Career Pressure",
      solution: "Culturally-aware counseling and family therapy resources",
      icon: <Home className="w-5 h-5 text-purple-600" />
    },
    {
      challenge: "Financial Stress & Future Uncertainty",
      solution: "Career guidance and financial wellness support",
      icon: <Target className="w-5 h-5 text-orange-600" />
    }
  ];

  const testimonials = [
    {
      name: "Priya M.",
      role: "Engineering Student, Mumbai",
      text: "During my toughest semester, the AI companion helped me through panic attacks at 3 AM when no one else was available. It understood my cultural context and family pressure better than I expected.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Rahul K.",
      role: "Medical Student, Delhi",
      text: "The anonymous booking system was a game-changer. I could finally seek help without worrying about my family or friends finding out. The counselor really understood student life.",
      rating: 5,
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Anjali S.",
      role: "Arts Student, Bangalore",
      text: "The peer support community made me realize I wasn't alone. Finding other students who faced similar struggles helped me build resilience and find my support network.",
      rating: 5,
      image: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    }
  ];

  const institutionTestimonials = [
    {
      name: "Dr. Meera Gupta",
      role: "Dean of Student Affairs, IIT Mumbai",
      text: "MEDHYA Pro has transformed our approach to student mental health. Early detection has reduced crisis interventions by 60% while increasing student engagement with counseling services.",
      institution: "IIT Mumbai"
    },
    {
      name: "Prof. Suresh Nair", 
      role: "Vice Chancellor",
      text: "The cultural sensitivity and multilingual support make this platform uniquely suited for Indian institutions. Our student satisfaction scores have improved dramatically.",
      institution: "University of Kerala"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      {/* Crisis Support Banner */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Need immediate help? Crisis support available 24/7</span>
          </div>
          <Button 
            size="sm" 
            className="bg-white text-red-600 hover:bg-red-50 text-xs px-3 py-1"
          >
            Get Help Now
          </Button>
        </div>
      </div>

      <div className="space-y-20 pb-16">
        {/* Enhanced Hero Section */}
        <section className={`text-center space-y-8 py-16 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-6">
            
            
            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
              <span className="block text-gray-900">Mental Health Support</span>
              <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
                Made for Students
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Breaking the stigma around mental health in Indian education. Get 24/7 support, 
              connect with understanding peers, and access professional care—all in a safe, 
              confidential space designed specifically for students like you.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-200 to-green-200 rounded-2xl p-1">
              <img 
                src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=2"
                alt="Students supporting each other in a peaceful environment"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={onLogin}
            >
              <Heart className="w-5 h-5 mr-2" />
              Start Your Wellness Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 pt-8">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>15+ Languages</span>
            </div>
          </div>

          {/* Live Stats with Animation */}
          <div className="grid gap-6 md:grid-cols-4 max-w-5xl mx-auto mt-12">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-900 mb-1">{systemStats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-blue-700 font-medium">Students Supported</div>
                <div className="text-xs text-blue-600 mt-1">Growing every day</div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-900 mb-1">2000+</div>
                <div className="text-sm text-green-700 font-medium">Support Sessions Today</div>
                <div className="text-xs text-green-600 mt-1">Real-time help provided</div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-900 mb-1">{systemStats.totalInstitutions}</div>
                <div className="text-sm text-purple-700 font-medium">Partner Colleges</div>
                <div className="text-xs text-purple-600 mt-1">Across India</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-900 mb-1">97%</div>
                <div className="text-sm text-orange-700 font-medium">Student Satisfaction</div>
                <div className="text-xs text-orange-600 mt-1">Positive experiences</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Challenges & Solutions */}
        <section className="space-y-12 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">We Understand What Students Face</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Every challenge you're experiencing is valid. Our platform is built around the real struggles 
              Indian students face every day, offering solutions that actually work.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {studentChallenges.map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-400">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {item.icon}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.challenge}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.solution}</p>
                      <Badge className="bg-blue-100 text-blue-800">
                        Specialized Support Available
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Problem Statement with Enhanced Visuals */}
        <section className="space-y-12 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">The Reality of Student Mental Health in India</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Behind every statistic is a student who deserves support, understanding, and hope.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {problemStats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300">
                <CardContent className="space-y-6">
                  <div className={`text-5xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{stat.label}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                  <Progress value={parseInt(stat.value.replace('%', ''))} className="h-3" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-red-50 to-orange-50 p-8 border-red-200 max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="flex items-start gap-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-900 mb-4 text-xl">Why Traditional Approaches Fall Short</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ul className="space-y-3 text-sm text-red-800">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Limited counselors for massive student populations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Cultural stigma preventing help-seeking behavior</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Reactive rather than preventive mental health care</span>
                      </li>
                    </ul>
                    <ul className="space-y-3 text-sm text-red-800">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Lack of 24/7 support for urgent mental health needs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>No data-driven insights for institutional planning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <span>Language barriers in seeking mental health support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Solution Features with Enhanced Design */}
        <section className="space-y-12 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Comprehensive Mental Health Ecosystem</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Six integrated tools designed with student mental health as the priority, 
              not an afterthought
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold mb-2">
                    {feature.highlight}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {feature.metrics}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Wellness Tools Preview */}
        <section className="space-y-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 mx-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Daily Wellness Tools</h2>
            <p className="text-lg text-gray-600">
              Simple, effective tools you can use anytime to support your mental well-being
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {wellnessTools.map((tool, index) => (
              <Card key={index} className="text-center p-6 bg-white/80 backdrop-blur hover:bg-white transition-all duration-300">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-gray-50 rounded-full">
                      {tool.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{tool.title}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                  <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                    Try Now <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Demo Selection with Enhanced UX */}
        <section className="space-y-8 px-4 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Experience MEDHYA Pro</h2>
            <p className="text-lg text-gray-600">
              Choose your perspective to explore how we're transforming mental health support
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedDemo === 'student' 
                ? 'ring-4 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl' 
                : 'hover:shadow-lg border-gray-200'
            }`}
                  onClick={() => setSelectedDemo('student')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  Student Experience
                </CardTitle>
                <CardDescription className="text-base">
                  Discover mental health tools designed specifically for student life
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {[
                    { icon: MessageCircle, text: "AI companion that understands student stress" },
                    { icon: UserCheck, text: "Anonymous counselor appointments" },
                    { icon: Users, text: "Peer support groups and communities" },
                    { icon: Activity, text: "Personal wellness tracking & insights" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <item.icon className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full py-3 ${selectedDemo === 'student' ? 'bg-blue-600 shadow-lg' : 'bg-gray-600'} transition-all duration-200`}
                  onClick={onLogin}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Launch Student Portal
                </Button>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedDemo === 'admin' 
                ? 'ring-4 ring-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl' 
                : 'hover:shadow-lg border-gray-200'
            }`}
                  onClick={() => setSelectedDemo('admin')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  Institution Dashboard
                </CardTitle>
                <CardDescription className="text-base">
                  Comprehensive oversight and analytics for administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {[
                    { icon: BarChart3, text: "Real-time mental health trends and analytics" },
                    { icon: AlertTriangle, text: "Early warning system for at-risk students" },
                    { icon: Building2, text: "Multi-campus management capabilities" },
                    { icon: Target, text: "Predictive intervention recommendations" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <item.icon className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full py-3 ${selectedDemo === 'admin' ? 'bg-purple-600 shadow-lg' : 'bg-gray-600'} transition-all duration-200`}
                  onClick={handleNavigation}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Access Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Testimonials */}
        <section className="space-y-8 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Stories from Students Like You</h2>
            <p className="text-lg text-gray-600">
              Real experiences from students who found support, hope, and healing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 space-y-6">
                  <div className="flex gap-1 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Institution Testimonials */}
        <section className="space-y-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 mx-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Leading Institutions</h2>
            <p className="text-lg text-gray-600">
              Educational leaders across India are seeing transformational results
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {institutionTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur">
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed text-lg">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.institution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact & Scalability */}
        <section className="space-y-8 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Proven Impact, Unlimited Scale</h2>
            <p className="text-lg text-gray-600">
              Built to serve every student in India with personalized, effective mental health support
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Student Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Crisis Prevention Success", value: "96%", desc: "Students avoided crisis with early intervention" },
                  { label: "Academic Performance", value: "+23%", desc: "Average GPA improvement after 6 months" },
                  { label: "Help-Seeking Behavior", value: "+180%", desc: "Increase in students accessing mental health support" },
                  { label: "Peer Connection", value: "89%", desc: "Students report feeling less isolated" }
                ].map((metric, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{metric.label}</div>
                      <div className="text-xs text-gray-600">{metric.desc}</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{metric.value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-800 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Institutional Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { icon: Database, text: "Cloud-native infrastructure scales automatically", color: "text-blue-600" },
                  { icon: Globe, text: "API-first design for seamless integrations", color: "text-green-600" },
                  { icon: Lock, text: "Enterprise-grade security and compliance", color: "text-red-600" },
                  { icon: Award, text: "Proven ROI with reduced crisis interventions", color: "text-orange-600" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="text-center space-y-8 py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl text-white mx-4">
          <div className="space-y-6 px-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">Your Mental Health Matters</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Take the first step towards better mental health. Join thousands of students who've found 
              support, understanding, and hope through our platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center px-8">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={onLogin}
            >
              <Heart className="w-5 h-5 mr-2" />
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg transition-all duration-200"
              onClick={onLogin}
            >
              <Headphones className="w-5 h-5 mr-2" />
              Talk to Support
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12 px-8">
            {[
              { icon: CheckCircle, text: "Free to start", desc: "No cost barrier to mental health" },
              { icon: Clock, text: "24/7 support", desc: "Help when you need it most" },
              { icon: Shield, text: "Completely private", desc: "Your information stays safe" },
              { icon: Heart, text: "Judgement-free", desc: "Safe space for all students" }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-2">
                <item.icon className="w-6 h-6 mx-auto text-white" />
                <div className="font-semibold text-sm">{item.text}</div>
                <div className="text-xs text-blue-100">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety & Support Information */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 mx-4 max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Safety & Well-being Come First</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              {crisisResources.map((resource, index) => (
                <Card key={index} className="bg-white border-green-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <Phone className="w-8 h-8 text-green-600 mx-auto" />
                    <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                    <p className="text-sm font-medium text-green-700">{resource.number}</p>
                    <Badge className="bg-green-100 text-green-800">
                      {resource.available}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-green-100 rounded-xl p-6 text-center">
              <p className="text-green-800 font-medium">
                If you're experiencing thoughts of self-harm or suicide, please reach out immediately. 
                You matter, your life has value, and help is always available.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;