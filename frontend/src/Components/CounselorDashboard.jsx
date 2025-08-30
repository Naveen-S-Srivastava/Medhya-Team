import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Progress } from '../ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { 
  Calendar, Users, DollarSign, FileText, Clock, Star, TrendingUp, 
  CheckCircle, AlertTriangle, Phone, MessageCircle, Brain, Heart,
  ChevronRight, BarChart3, Target, Award, IndianRupee, Eye,
  UserPlus, CalendarClock, Activity, CreditCard, Wallet
} from 'lucide-react';

export default function CounselorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  // Mock data for counselor dashboard
  const counselorStats = {
    totalPatients: 47,
    activePatients: 32,
    monthlyEarnings: 85000,
    sessionsThisMonth: 156,
    averageRating: 4.8,
    completionRate: 94,
    nextAppointment: '2:30 PM',
    upcomingToday: 6,
    pendingPayments: 12000
  };

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Aarav Kumar',
      time: '2:30 PM',
      type: 'Follow-up Session',
      priority: 'high',
      status: 'confirmed',
      sessionType: 'Video Call',
      notes: 'Anxiety management progress review'
    },
    {
      id: 2,
      patient: 'Priya Sharma',
      time: '3:00 PM',
      type: 'Initial Consultation',
      priority: 'medium',
      status: 'confirmed',
      sessionType: 'Phone Call',
      notes: 'College stress and academic pressure'
    },
    {
      id: 3,
      patient: 'Rahul Patel',
      time: '4:15 PM',
      type: 'Crisis Support',
      priority: 'urgent',
      status: 'pending',
      sessionType: 'Video Call',
      notes: 'Emergency session - depression concerns'
    },
    {
      id: 4,
      patient: 'Ananya Singh',
      time: '5:00 PM',
      type: 'Family Therapy',
      priority: 'medium',
      status: 'confirmed',
      sessionType: 'Video Call',
      notes: 'Family relationship counseling'
    }
  ];

  const recentPatients = [
    {
      id: 1,
      name: 'Aarav Kumar',
      age: 20,
      institution: 'IIT Delhi',
      lastSession: '2 days ago',
      totalSessions: 12,
      progress: 'Good',
      condition: 'Anxiety Disorder',
      nextAppointment: 'Today 2:30 PM',
      paymentStatus: 'Paid',
      monthlyFee: 4000
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 19,
      institution: 'Jamia Millia',
      lastSession: '1 week ago',
      totalSessions: 8,
      progress: 'Excellent',
      condition: 'Academic Stress',
      nextAppointment: 'Today 3:00 PM',
      paymentStatus: 'Pending',
      monthlyFee: 3500
    },
    {
      id: 3,
      name: 'Rahul Patel',
      age: 21,
      institution: 'NIT Bhopal',
      lastSession: '3 days ago',
      totalSessions: 15,
      progress: 'Moderate',
      condition: 'Depression',
      nextAppointment: 'Today 4:15 PM',
      paymentStatus: 'Paid',
      monthlyFee: 4500
    },
    {
      id: 4,
      name: 'Ananya Singh',
      age: 22,
      institution: 'DU',
      lastSession: '5 days ago',
      totalSessions: 6,
      progress: 'Good',
      condition: 'Family Issues',
      nextAppointment: 'Tomorrow 10:00 AM',
      paymentStatus: 'Paid',
      monthlyFee: 3000
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      month: 'November 2024',
      totalEarnings: 85000,
      sessions: 156,
      patients: 32,
      status: 'Completed',
      payoutDate: '30 Nov 2024'
    },
    {
      id: 2,
      month: 'October 2024',
      totalEarnings: 78000,
      sessions: 142,
      patients: 29,
      status: 'Paid',
      payoutDate: '31 Oct 2024'
    },
    {
      id: 3,
      month: 'September 2024',
      totalEarnings: 72000,
      sessions: 128,
      patients: 26,
      status: 'Paid',
      payoutDate: '30 Sep 2024'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    switch (progress) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Moderate': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{counselorStats.activePatients}</div>
            <div className="flex items-center gap-1 mt-2">
              <UserPlus className="w-3 h-3 text-green-600" />
              <p className="text-xs text-green-700">+3 new this week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Monthly Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹{counselorStats.monthlyEarnings.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <p className="text-xs text-green-700">+12% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Sessions This Month</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{counselorStats.sessionsThisMonth}</div>
            <p className="text-xs text-purple-700">Avg 5.2 sessions/day</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Patient Rating</CardTitle>
            <Star className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{counselorStats.averageRating}/5.0</div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <p className="text-xs text-orange-700">Based on 124 reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="finances" className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Finances
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-blue-600" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  {counselorStats.upcomingToday} appointments scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{appointment.patient}</p>
                        <Badge variant="outline" className={getPriorityColor(appointment.priority)}>
                          {appointment.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.time} - {appointment.type}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  View All Appointments
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently used counselor tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Session Notes
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Therapy Assistant
                </Button>
                <Button variant="outline" className="w-full justify-start border-orange-200 hover:bg-orange-50">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Protocol
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Performance Overview
              </CardTitle>
              <CardDescription>Your counseling effectiveness metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Session Completion Rate</span>
                    <span className="text-green-600 font-medium">{counselorStats.completionRate}%</span>
                  </div>
                  <Progress value={counselorStats.completionRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Patient Satisfaction</span>
                    <span className="text-blue-600 font-medium">{counselorStats.averageRating}/5.0</span>
                  </div>
                  <Progress value={(counselorStats.averageRating / 5) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Treatment Adherence</span>
                    <span className="text-purple-600 font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Appointment Management
              </CardTitle>
              <CardDescription>Manage your scheduled sessions and consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-bold text-lg">{appointment.time}</p>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{appointment.patient}</h3>
                            <Badge variant="outline" className={getPriorityColor(appointment.priority)}>
                              {appointment.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.type}</p>
                          <p className="text-xs text-blue-600">{appointment.sessionType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          Start Session
                        </Button>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="bg-muted/30 p-2 rounded text-sm">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Patient Records
              </CardTitle>
              <CardDescription>Manage your patient roster and treatment progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-semibold">{patient.name}</h3>
                          <Badge variant="secondary">{patient.age} years</Badge>
                          <Badge variant="outline">{patient.institution}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Condition</p>
                            <p className="font-medium">{patient.condition}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sessions</p>
                            <p className="font-medium">{patient.totalSessions} completed</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Progress</p>
                            <p className={`font-medium ${getProgressColor(patient.progress)}`}>
                              {patient.progress}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Monthly Fee</p>
                            <p className="font-medium">₹{patient.monthlyFee}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">
                          View Records
                        </Button>
                        <Badge variant={patient.paymentStatus === 'Paid' ? 'default' : 'destructive'}>
                          {patient.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t pt-3">
                      <p className="text-muted-foreground">
                        Last session: {patient.lastSession}
                      </p>
                      <p className="text-blue-600 font-medium">
                        Next: {patient.nextAppointment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Month Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-green-600" />
                  Current Month Summary
                </CardTitle>
                <CardDescription>November 2024 financial overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Earnings</span>
                    <span className="font-bold text-green-600">₹{counselorStats.monthlyEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sessions Completed</span>
                    <span className="font-medium">{counselorStats.sessionsThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average per Session</span>
                    <span className="font-medium">₹{Math.round(counselorStats.monthlyEarnings / counselorStats.sessionsThisMonth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Payments</span>
                    <span className="font-medium text-orange-600">₹{counselorStats.pendingPayments.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button className="w-full">
                    Request Payout
                    <CreditCard className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Fee Structure
                </CardTitle>
                <CardDescription>Your consultation rates and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Initial Consultation</p>
                      <p className="text-sm text-muted-foreground">60 minutes</p>
                    </div>
                    <p className="font-bold">₹800</p>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Follow-up Session</p>
                      <p className="text-sm text-muted-foreground">45 minutes</p>
                    </div>
                    <p className="font-bold">₹600</p>
                  </div>
                  <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">Group Therapy</p>
                      <p className="text-sm text-muted-foreground">90 minutes</p>
                    </div>
                    <p className="font-bold">₹400</p>
                  </div>
                  <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">Crisis Intervention</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                    <p className="font-bold">₹1000</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment History
              </CardTitle>
              <CardDescription>Your monthly earnings and payout history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-semibold">{payment.month}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{payment.sessions} sessions</span>
                        <span>{payment.patients} patients</span>
                        <span>Paid: {payment.payoutDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{payment.totalEarnings.toLocaleString()}</p>
                      <Badge variant={payment.status === 'Paid' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Counseling Analytics
              </CardTitle>
              <CardDescription>Insights into your practice effectiveness and patient outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Patient Outcomes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Significant Improvement</span>
                      <span className="font-medium text-green-600">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                    <div className="flex justify-between">
                      <span>Moderate Improvement</span>
                      <span className="font-medium text-blue-600">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    <div className="flex justify-between">
                      <span>No Change</span>
                      <span className="font-medium text-gray-600">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Session Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Individual Therapy</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <div className="flex justify-between">
                      <span>Group Sessions</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <Progress value={18} className="h-2" />
                    <div className="flex justify-between">
                      <span>Crisis Interventions</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Patient Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">92%</div>
                <p className="text-sm text-muted-foreground">6-month retention rate</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Treatment Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">89%</div>
                <p className="text-sm text-muted-foreground">Goals achieved successfully</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  Avg Session Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">52min</div>
                <p className="text-sm text-muted-foreground">Effective session length</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}