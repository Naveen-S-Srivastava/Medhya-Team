
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Alert, AlertDescription } from '../ui/Alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, Users, MessageCircle, Calendar, AlertTriangle, TrendingUp, Download, Filter, Eye, Shield } from 'lucide-react';
import ScoresChart from './ScoresChart';
import CrisisChart from './CrisisChart';
import { runAssessmentTests } from '../utils/testAssessmentData';

const AdminDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const analytics = {
    totalUsers: 1247,
    chatSessions: 156,
    appointments: 89,
    forumPosts: 234,
    criticalAlerts: 3
  };

  const usageData = [
    { name: 'Mon', chatSessions: 24, appointments: 8, forumPosts: 15 },
    { name: 'Tue', chatSessions: 18, appointments: 12, forumPosts: 22 },
    { name: 'Wed', chatSessions: 32, appointments: 15, forumPosts: 18 },
    { name: 'Thu', chatSessions: 28, appointments: 10, forumPosts: 25 },
    { name: 'Fri', chatSessions: 35, appointments: 18, forumPosts: 30 },
    { name: 'Sat', chatSessions: 22, appointments: 6, forumPosts: 20 },
    { name: 'Sun', chatSessions: 19, appointments: 4, forumPosts: 12 }
  ];

  const trendData = [
    { month: 'Jan', anxiety: 45, depression: 32, stress: 58, sleep: 28 },
    { month: 'Feb', anxiety: 52, depression: 38, stress: 62, sleep: 35 },
    { month: 'Mar', anxiety: 48, depression: 35, stress: 71, sleep: 42 },
    { month: 'Apr', anxiety: 61, depression: 45, stress: 68, sleep: 38 },
    { month: 'May', anxiety: 55, depression: 42, stress: 75, sleep: 45 },
    { month: 'Jun', anxiety: 58, depression: 48, stress: 82, sleep: 52 }
  ];

  const categoryData = [
    { name: 'Academic Stress', value: 35, color: '#6366F1' },
    { name: 'Anxiety', value: 28, color: '#3B82F6' },
    { name: 'Depression', value: 18, color: '#F97316' },
    { name: 'Sleep Issues', value: 12, color: '#EC4899' },
    { name: 'Relationships', value: 7, color: '#22D3EE' }
  ];

  return (
    
    <div className="min-h-screen  text-gray-800 bg-gradient-to-br from-sky-100 via-white to-blue-100 transition-colors duration-300">
<div className="container mx-auto px-4 py-8 shadow-2xl shadow-gray-800 rounded-lg">
        <Card className="shadow-2xl rounded-2xl mb-8 transform transition-transform duration-500 hover:scale-[1.005]">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 text-4xl font-extrabold text-indigo-800">
              <BarChart3 className="w-10 h-10 text-indigo-600" />
              Administrator Dashboard
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 mt-2">
              Monitor system usage, user trends, and safety alerts with a modern overview.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 gap-4">
          <div className="flex flex-wrap gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-full md:w-[150px] border-indigo-300 bg-white shadow-lg transition-all duration-300 hover:border-indigo-600 hover:shadow-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-2xl rounded-lg">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2 text-indigo-600 border-indigo-600 hover:bg-indigo-50 transition-colors duration-300 transform hover:scale-105" onClick={runAssessmentTests}>
              <TrendingUp className="w-4 h-4" />
              Test Assessment Data
            </Button>
            <Button className="flex items-center gap-2 bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600 px-3 py-1 text-sm rounded-full animate-pulse transition-colors duration-300">
            <Shield className="w-3 h-3" />
            HIPAA Compliant
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Total Users</CardTitle>
              <Users className="h-6 w-6 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{analytics.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">Registered students</p>
            </CardContent>
          </Card>

         

          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Chat Sessions</CardTitle>
              <MessageCircle className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{analytics.chatSessions}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Appointments</CardTitle>
              <Calendar className="h-6 w-6 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{analytics.appointments}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Forum Posts</CardTitle>
              <Users className="h-6 w-6 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">{analytics.forumPosts}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Critical Alerts</CardTitle>
              <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">{analytics.criticalAlerts}</div>
              <p className="text-xs text-gray-500 mt-1">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usage" className="my-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-200 rounded-2xl p-1 mb-8 shadow-inner">
            <TabsTrigger value="usage" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300 hover:text-indigo-800">Usage Analytics</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300 hover:text-indigo-800">Mental Health Trends</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300 hover:text-indigo-800">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <ScoresChart
                timeRange="7d"
                title="Weekly Assessment Patterns"
              />
              <CrisisChart timeRange="30d" title="Crisis Management Analytics" />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="shadow-lg rounded-2xl p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Mental Health Trends (6 Months)</CardTitle>
                <CardDescription className="text-md text-gray-600">
                  Anonymized data showing trends in mental health concerns across the student population
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Line type="monotone" dataKey="anxiety" stroke="#F43F5E" name="Anxiety" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="depression" stroke="#10B981" name="Depression" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="stress" stroke="#FBBF24" name="Academic Stress" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="sleep" stroke="#6366F1" name="Sleep Issues" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="shadow-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Academic stress increasing by 15%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Sleep issues more common in final years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Early intervention showing positive results</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Peak Usage Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  <div className="text-sm text-gray-600">
                    <strong>Chat Support:</strong> 8-10 PM weekdays
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Appointments:</strong> Tuesday-Thursday afternoons
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Forum Activity:</strong> Late evenings & weekends
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0 text-sm text-gray-600">
                  <div>• Increase counselor availability during exam periods</div>
                  <div>• Implement stress management workshops</div>
                  <div>• Promote sleep hygiene resources</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-lg rounded-2xl p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">System Reports</CardTitle>
                <CardDescription className="text-md text-gray-600">Generate comprehensive reports for institutional review</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Monthly Usage Report</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Comprehensive overview of system usage, user engagement, and feature adoption
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Mental Health Trends Analysis</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Anonymized analysis of mental health trends and intervention effectiveness
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Safety & Compliance Report</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Safety protocols, alert responses, and compliance with regulations
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Resource Utilization Report</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Analysis of resource usage, counselor workload, and capacity planning
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Alert className="border-indigo-200 bg-indigo-50 text-indigo-800 rounded-lg shadow-md">
              <Shield className="h-5 w-5" />
              <AlertDescription className="text-md font-medium">
                All reports are generated with anonymized data to protect student privacy. No personally identifiable information is included in institutional reports.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;