import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Alert, AlertDescription } from '../ui/Alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Users, MessageCircle, Calendar, AlertTriangle, TrendingUp, Download, Filter, Eye, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const analytics = {
    totalUsers: 1247,
    activeUsers: 342,
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
    { name: 'Academic Stress', value: 35, color: '#8884d8' },
    { name: 'Anxiety', value: 28, color: '#82ca9d' },
    { name: 'Depression', value: 18, color: '#ffc658' },
    { name: 'Sleep Issues', value: 12, color: '#ff7300' },
    { name: 'Relationships', value: 7, color: '#8dd1e1' }
  ];

  const criticalAlerts = [
    {
      id: '1',
      type: 'High Risk User',
      description: 'User showing signs of severe depression in chat logs',
      timestamp: '2 hours ago',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      type: 'Forum Content',
      description: 'Post containing potential self-harm references flagged',
      timestamp: '4 hours ago',
      status: 'reviewed',
      priority: 'high'
    },
    {
      id: '3',
      type: 'Emergency Keywords',
      description: 'Multiple emergency keywords detected in chat session',
      timestamp: '1 day ago',
      status: 'resolved',
      priority: 'critical'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Administrator Dashboard
          </CardTitle>
          <CardDescription>
            Monitor system usage, user trends, and safety alerts for institutional oversight
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Shield className="w-3 h-3 mr-1" />
          HIPAA Compliant
        </Badge>
      </div>

      {/* Critical Alerts */}
      {analytics.criticalAlerts > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{analytics.criticalAlerts} critical alerts</strong> require immediate attention from mental health professionals.
            <Button variant="link" className="text-red-600 p-0 h-auto ml-2">
              Review alerts →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.chatSessions}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.appointments}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.forumPosts}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{analytics.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="trends">Mental Health Trends</TabsTrigger>
          <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Usage Patterns</CardTitle>
                <CardDescription>System usage across different features</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="chatSessions" fill="#8884d8" name="Chat Sessions" />
                    <Bar dataKey="appointments" fill="#82ca9d" name="Appointments" />
                    <Bar dataKey="forumPosts" fill="#ffc658" name="Forum Posts" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issue Categories</CardTitle>
                <CardDescription>Distribution of mental health concerns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Trends (6 Months)</CardTitle>
              <CardDescription>
                Anonymized data showing trends in mental health concerns across the student population
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="anxiety" stroke="#8884d8" name="Anxiety" />
                  <Line type="monotone" dataKey="depression" stroke="#82ca9d" name="Depression" />
                  <Line type="monotone" dataKey="stress" stroke="#ffc658" name="Academic Stress" />
                  <Line type="monotone" dataKey="sleep" stroke="#ff7300" name="Sleep Issues" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Chat Support:</strong> 8-10 PM weekdays
                </div>
                <div className="text-sm">
                  <strong>Appointments:</strong> Tuesday-Thursday afternoons
                </div>
                <div className="text-sm">
                  <strong>Forum Activity:</strong> Late evenings & weekends
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  • Increase counselor availability during exam periods
                </div>
                <div className="text-sm">
                  • Implement stress management workshops
                </div>
                <div className="text-sm">
                  • Promote sleep hygiene resources
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Safety & Critical Alerts</CardTitle>
              <CardDescription>
                Automated alerts requiring professional attention to ensure student safety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <div>
                          <h4 className="font-medium">{alert.type}</h4>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      <div className="flex gap-2">
                        {alert.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">
                              Review
                            </Button>
                            <Button size="sm">
                              Contact Professional
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Alert Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Emergency Keywords</span>
                  <Badge variant="destructive">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Risk Behavior</span>
                  <Badge variant="outline">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Forum Moderation</span>
                  <Badge variant="outline">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Repeated Crisis Contacts</span>
                  <Badge variant="outline">3</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Protocols</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <strong>Critical:</strong> Immediate professional intervention required
                </div>
                <div>
                  <strong>High:</strong> Review within 2 hours, contact if needed
                </div>
                <div>
                  <strong>Medium:</strong> Review within 24 hours
                </div>
                <div>
                  <strong>Low:</strong> Weekly review and follow-up
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Generate comprehensive reports for institutional review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Monthly Usage Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive overview of system usage, user engagement, and feature adoption
                  </p>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Mental Health Trends Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Anonymized analysis of mental health trends and intervention effectiveness
                  </p>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Safety & Compliance Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Safety protocols, alert responses, and compliance with regulations
                  </p>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Resource Utilization Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analysis of resource usage, counselor workload, and capacity planning
                  </p>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              All reports are generated with anonymized data to protect student privacy. 
              No personally identifiable information is included in institutional reports.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;