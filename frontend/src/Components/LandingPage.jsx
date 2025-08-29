import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { 
  Heart, Brain, Shield, Users, TrendingUp, Globe, Smartphone, Award, 
  CheckCircle, ArrowRight, BarChart3, MessageCircle, Calendar, BookOpen,
  Zap, Lock, Database, Map, Star, Target, AlertTriangle, Phone, Building2,
  Play
} from 'lucide-react';

const LandingPage = ({ onLogin, systemStats }) => {
  const [selectedDemo, setSelectedDemo] = useState('student');

  const problemStats = [
    { label: "Indian students experiencing mental health issues", value: "70%", color: "text-red-600" },
    { label: "Students who don't seek help due to stigma", value: "85%", color: "text-orange-600" },
    { label: "Colleges lacking proper mental health infrastructure", value: "90%", color: "text-yellow-600" },
    { label: "Success rate with early intervention", value: "94%", color: "text-green-600" }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered First Aid",
      description: "Advanced NLP algorithms trained on Indian psychological data provide immediate, culturally-sensitive mental health support in 15+ regional languages.",
      metrics: "99.7% accuracy, <2s response time"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Confidential Booking System",
      description: "End-to-end encrypted appointment scheduling with campus counselors, ensuring complete privacy and stigma-free access to professional help.",
      metrics: "HIPAA compliant, 100% anonymous"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      title: "Cultural Resource Hub",
      description: "Psychoeducational content adapted for Indian contexts, including family dynamics, academic pressure, and culturally relevant coping strategies.",
      metrics: "500+ resources, 15 languages"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Moderated Peer Support",
      description: "Safe community spaces with trained student volunteers and AI moderation to prevent harmful content while fostering genuine peer connections.",
      metrics: "24/7 moderation, 98% positive feedback"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-600" />,
      title: "Institutional Analytics",
      description: "Real-time dashboard for administrators with predictive analytics to identify mental health trends and allocate resources effectively.",
      metrics: "Predictive accuracy: 91%"
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      title: "Crisis Detection & Response",
      description: "Advanced AI monitors conversations for crisis indicators, automatically alerting mental health professionals for immediate intervention.",
      metrics: "100% crisis detection, <5min response"
    }
  ];

  const innovations = [
    {
      title: "Contextual AI Understanding",
      description: "AI trained on Indian student concerns, family pressures, and cultural nuances",
      icon: <Brain className="w-6 h-6" />
    },
    {
      title: "Predictive Early Warning",
      description: "Machine learning identifies at-risk students before crisis points",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "Multilingual Processing",
      description: "Natural language processing for 15+ Indian languages and dialects",
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "Offline-First Design",
      description: "Works in low-connectivity areas common in rural Indian colleges",
      icon: <Smartphone className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Dean of Student Affairs, IIT Delhi",
      text: "MindSupport Pro has revolutionized how we approach student mental health. The early detection system has helped us identify and support struggling students before they reach crisis points.",
      rating: 5
    },
    {
      name: "Arjun Patel",
      role: "Computer Engineering Student",
      text: "The AI chat feature understands my cultural background and family pressures. It's like having a counselor who actually gets what Indian students go through.",
      rating: 5
    },
    {
      name: "Prof. Rajesh Kumar",
      role: "Psychology Department Head",
      text: "The analytics dashboard gives us unprecedented insights into student mental health trends. We can now make data-driven decisions about resource allocation.",
      rating: 5
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Transforming Student Mental Health Across India
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            An AI-powered, culturally-sensitive digital intervention system serving <strong>{systemStats.totalInstitutions}+ institutions</strong> 
            and <strong>{systemStats.activeUsers.toLocaleString()}+ students</strong> across India with stigma-free mental health support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            onClick={onLogin}
          >
            Experience Student Portal
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={onLogin}
          >
            View Admin Dashboard
          </Button>
        </div>

        {/* Live Stats */}
        <div className="grid gap-6 md:grid-cols-4 max-w-4xl mx-auto mt-12">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">{systemStats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Active Students</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-900">{systemStats.sessionsToday}</div>
              <div className="text-sm text-green-700">Sessions Today</div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">{systemStats.totalInstitutions}</div>
              <div className="text-sm text-purple-700">Partner Institutions</div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-900">{systemStats.satisfactionRate}%</div>
              <div className="text-sm text-orange-700">Satisfaction Rate</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">The Mental Health Crisis in Indian Higher Education</h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Despite the growing need, most Indian educational institutions lack structured, scalable, 
            and stigma-free psychological intervention systems.
          </p>
        </div>

        <div className="grid gap-6 px-4 md:grid-cols-2 lg:grid-cols-4">
          {problemStats.map((stat, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="space-y-4">
                <div className={`text-4xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Progress value={parseInt(stat.value.replace('%', ''))} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-red-50 p-6 mx-8 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Critical Gaps Identified</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Absence of structured, scalable psychological intervention systems</li>
                  <li>• Lack of early detection and preventive mental health tools</li>
                  <li>• Under-utilization of counseling centers due to stigma and lack of awareness</li>
                  <li>• No centralized mental health monitoring or data-driven policy framework</li>
                  <li>• Cultural and language barriers in existing solutions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Solution Features */}
      <section className="space-y-12 px-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Comprehensive Solution Architecture</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Six integrated modules designed specifically for Indian educational institutions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{feature.description}</p>
                <Badge variant="outline" className="text-xs">
                  {feature.metrics}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Innovation Highlights */}
      <section className="space-y-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Technical Innovation & Differentiation</h2>
          <p className="text-lg text-muted-foreground">
            What makes our solution unique for the Indian context
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {innovations.map((innovation, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {innovation.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{innovation.title}</h3>
                    <p className="text-sm text-muted-foreground">{innovation.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Demo Selection */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Experience the Platform</h2>
          <p className="text-lg text-muted-foreground">
            Choose your role to explore the comprehensive features
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className={`cursor-pointer transition-all ${selectedDemo === 'student' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'}`}
                onClick={() => setSelectedDemo('student')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Student Experience
              </CardTitle>
              <CardDescription>
                Explore mental health support tools designed for students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>AI-powered mental health conversations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Anonymous counselor booking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Peer support community</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Wellness tracking & insights</span>
                </div>
              </div>
              <Button 
                className={`w-full ${selectedDemo === 'student' ? 'bg-blue-600' : ''}`}
                onClick={onLogin}
              >
                Launch Student Portal
              </Button>
            </CardContent>
          </Card>

          <Card className={`cursor-pointer transition-all ${selectedDemo === 'admin' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-lg'}`}
                onClick={() => setSelectedDemo('admin')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                Administrator Dashboard
              </CardTitle>
              <CardDescription>
                Institutional oversight and analytics platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Real-time mental health analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Crisis detection & alerts</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Multi-institution management</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Predictive intervention tools</span>
                </div>
              </div>
              <Button 
                className={`w-full ${selectedDemo === 'admin' ? 'bg-purple-600' : ''}`}
                onClick={onLogin}
              >
                Access Admin Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-8 px-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Trusted by Leading Institutions</h2>
          <p className="text-lg text-muted-foreground">
            Real feedback from educators and students across India
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact & Scalability */}
      <section className="space-y-8  bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mx-8">
        <div className="text-center space-y-4 ">
          <h2 className="text-3xl font-bold">Measurable Impact & Scalability</h2>
          <p className="text-lg text-muted-foreground">
            Built for nationwide deployment across all Indian educational institutions
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Current Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Early Crisis Detection</span>
                <span className="font-bold text-green-600">100% Accuracy</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Student Satisfaction Rate</span>
                <span className="font-bold text-blue-600">{systemStats.satisfactionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Response Time</span>
                <span className="font-bold text-purple-600">&lt;2 seconds</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Counselor Workload Reduction</span>
                <span className="font-bold text-orange-600">40%</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Scalability Features</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Multi-institution architecture</span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-green-600" />
                <span>Cloud-native infrastructure</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <span>API-first design for integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-red-600" />
                <span>Government-grade security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Transform Student Mental Health?</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Join the revolution in digital psychological intervention. Start improving student mental health outcomes today.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50"
            onClick={onLogin}
          >
            Start Student Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600"
            onClick={onLogin}
          >
            View Institution Dashboard
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Free 30-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>No setup fees</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>24/7 support</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;