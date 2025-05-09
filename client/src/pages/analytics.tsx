import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users, BookOpen, Award, Sparkles, Clock, MessageSquare, FileText, BarChart2, PlusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { useState } from "react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("last30days");
  
  // UI-only mode data for demonstration
  
  // Activity data over time
  const activityData = [
    { name: "Week 1", posts: 2, comments: 5, resources: 1, learningProgress: 15 },
    { name: "Week 2", posts: 3, comments: 7, resources: 2, learningProgress: 22 },
    { name: "Week 3", posts: 1, comments: 8, resources: 3, learningProgress: 35 },
    { name: "Week 4", posts: 4, comments: 12, resources: 2, learningProgress: 48 },
    { name: "Week 5", posts: 2, comments: 6, resources: 4, learningProgress: 57 },
    { name: "Week 6", posts: 5, comments: 9, resources: 1, learningProgress: 65 },
    { name: "Week 7", posts: 3, comments: 10, resources: 2, learningProgress: 72 },
    { name: "Week 8", posts: 4, comments: 8, resources: 3, learningProgress: 85 }
  ];
  
  // Learning path progress data
  const learningPathData = [
    { name: "Fundamentals of EdTech", progress: 85, total: 100 },
    { name: "Digital Assessment", progress: 30, total: 100 },
    { name: "Inclusive Design", progress: 15, total: 100 },
    { name: "Educational Data Analytics", progress: 0, total: 100 }
  ];
  
  // Content engagement by type
  const contentEngagementData = [
    { name: "Articles", value: 45 },
    { name: "Videos", value: 30 },
    { name: "Discussions", value: 15 },
    { name: "Resources", value: 10 }
  ];
  
  // Time spent by category
  const timeSpentData = [
    { name: "Learning Paths", value: 65 },
    { name: "Community Discussions", value: 20 },
    { name: "Resource Library", value: 15 }
  ];
  
  // Skill development data
  const skillDevelopmentData = [
    { name: "Instructional Design", value: 85 },
    { name: "Ed Technology", value: 70 },
    { name: "Digital Assessment", value: 65 },
    { name: "Learning Analytics", value: 40 },
    { name: "Inclusive Design", value: 55 }
  ];
  
  // Community engagement data
  const communityEngagementData = [
    { name: "Jan", active: 30, posts: 15, comments: 25 },
    { name: "Feb", active: 40, posts: 20, comments: 35 },
    { name: "Mar", active: 45, posts: 25, comments: 40 },
    { name: "Apr", active: 55, posts: 30, comments: 50 },
    { name: "May", active: 60, posts: 35, comments: 55 },
    { name: "Jun", active: 75, posts: 40, comments: 70 }
  ];
  
  // Learning completion trends
  const completionTrendsData = [
    { name: "Jan", completions: 1 },
    { name: "Feb", completions: 2 },
    { name: "Mar", completions: 0 },
    { name: "Apr", completions: 4 },
    { name: "May", completions: 3 },
    { name: "Jun", completions: 5 }
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Upcoming goals
  const upcomingGoals = [
    { title: "Complete Fundamentals of EdTech", dueDate: "July 15, 2023", progress: 85 },
    { title: "Contribute 5 resources to the community", dueDate: "July 30, 2023", progress: 60 },
    { title: "Start Digital Assessment Learning Path", dueDate: "August 10, 2023", progress: 30 },
    { title: "Connect with 3 new alumni", dueDate: "August 15, 2023", progress: 33 }
  ];
  
  // Achievements
  const achievements = [
    { title: "First Discussion Started", date: "January 15, 2023", icon: <MessageSquare className="h-8 w-8 text-primary-600" /> },
    { title: "Resource Contributor", date: "February 22, 2023", icon: <FileText className="h-8 w-8 text-green-600" /> },
    { title: "Learning Path Pioneer", date: "March 10, 2023", icon: <BookOpen className="h-8 w-8 text-purple-600" /> },
    { title: "Active Community Member", date: "April 5, 2023", icon: <Users className="h-8 w-8 text-blue-600" /> }
  ];
  
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-[60px] pb-16 lg:pb-0">
        <div className="flex">
          {/* Main Content Area - Adjusted for fixed sidebar */}
          <main className="flex-1 w-full md:pl-64">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

              
              {/* Page Header */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">ThinkTank</h1>
              
              {/* ThinkTank Navigation Tabs */}
              <div className="w-full mb-6 flex border-b">
                <Link href="/resources" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
                  Repository
                </Link>
                <Link href="/learning-paths" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
                  Learning Pathway
                </Link>
                <Link href="/analytics" className="px-4 py-2 font-medium text-primary-600 border-b-2 border-primary-600">
                  Analytics
                </Link>
                <Link href="/bookmarks" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
                  Bookmarks
                </Link>
              </div>
              
              {/* Analytics Header */}
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Learning Analytics</h2>
                  <p className="text-gray-600">Track your learning journey and community engagement</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                      <SelectItem value="last3months">Last 3 months</SelectItem>
                      <SelectItem value="last6months">Last 6 months</SelectItem>
                      <SelectItem value="lastyear">Last year</SelectItem>
                      <SelectItem value="alltime">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Overview Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Learning Progress</p>
                        <p className="text-3xl font-bold text-gray-900">72%</p>
                      </div>
                      <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <Progress value={72} className="h-1.5 mt-3" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Posts & Comments</p>
                        <p className="text-3xl font-bold text-gray-900">48</p>
                      </div>
                      <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-green-600 flex items-center">
                      <span>↑ 12% from last month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Learning Paths</p>
                        <p className="text-3xl font-bold text-gray-900">4</p>
                      </div>
                      <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 flex items-center">
                      <span>1 completed, 3 in progress</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Hours Learning</p>
                        <p className="text-3xl font-bold text-gray-900">37.5</p>
                      </div>
                      <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-green-600 flex items-center">
                      <span>↑ 8% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Dashboard Content */}
              <Tabs defaultValue="activity">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="activity">
                    <Clock className="h-4 w-4 mr-2" />
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="learning">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Learning
                  </TabsTrigger>
                  <TabsTrigger value="engagement">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Engagement
                  </TabsTrigger>
                  <TabsTrigger value="goals">
                    <Award className="h-4 w-4 mr-2" />
                    Goals & Achievements
                  </TabsTrigger>
                </TabsList>
                
                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Activity Over Time</CardTitle>
                      <CardDescription>Track your interactions across the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={activityData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="posts" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="resources" stroke="#ffc658" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Content Engagement</CardTitle>
                        <CardDescription>How you interact with different types of content</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={contentEngagementData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {contentEngagementData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Time Spent Distribution</CardTitle>
                        <CardDescription>Where you spend most of your time on the platform</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={timeSpentData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {timeSpentData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Learning Tab */}
                <TabsContent value="learning" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Path Progress</CardTitle>
                      <CardDescription>Track your progress across different learning paths</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={learningPathData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                            <Legend />
                            <Bar dataKey="progress" fill="#8884d8" radius={[0, 6, 6, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Skill Development</CardTitle>
                      <CardDescription>Areas where you're developing expertise</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {skillDevelopmentData.map((skill) => (
                          <div key={skill.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                              <span className="text-sm font-medium text-gray-700">{skill.value}%</span>
                            </div>
                            <Progress value={skill.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Learning Completion Trends</CardTitle>
                      <CardDescription>Completed learning modules over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={completionTrendsData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="completions" stroke="#8884d8" fill="#8884d8" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Engagement Tab */}
                <TabsContent value="engagement" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Engagement</CardTitle>
                      <CardDescription>Your activity in the educational community</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={communityEngagementData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="posts" stackId="a" fill="#8884d8" />
                            <Bar dataKey="comments" stackId="a" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Learning Progress Trend</CardTitle>
                        <CardDescription>Your progress over the selected time period</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={activityData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="learningProgress" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Connections & Networking</CardTitle>
                        <CardDescription>Your connections with students, alumni and faculty</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Total Connections</span>
                              <span className="text-2xl font-bold">27</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <div className="font-medium text-blue-700 mb-1">Students</div>
                                <div className="text-xl font-bold text-blue-900">12</div>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg text-center">
                                <div className="font-medium text-green-700 mb-1">Alumni</div>
                                <div className="text-xl font-bold text-green-900">8</div>
                              </div>
                              <div className="bg-purple-50 p-4 rounded-lg text-center">
                                <div className="font-medium text-purple-700 mb-1">Faculty</div>
                                <div className="text-xl font-bold text-purple-900">7</div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Connection Growth</span>
                              <span className="text-sm text-green-600">↑ 15% last month</span>
                            </div>
                            <div className="h-10">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={communityEngagementData}>
                                  <Bar dataKey="active" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Goals & Achievements Tab */}
                <TabsContent value="goals" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Learning Goals</CardTitle>
                        <CardDescription>Track your progress towards set goals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingGoals.map((goal, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                                <span className="text-sm text-gray-500">Due: {goal.dueDate}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex-1">
                                  <Progress value={goal.progress} className="h-2" />
                                </div>
                                <span className="text-sm font-medium">{goal.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" className="w-full">
                            Add New Goal
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Achievements</CardTitle>
                        <CardDescription>Milestones you've reached in your learning journey</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start space-x-4 border border-gray-200 rounded-lg p-4">
                              <div className="flex-shrink-0">
                                {achievement.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                                <p className="text-sm text-gray-500">Achieved on {achievement.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            <span className="text-sm font-medium text-gray-700">4 of 12 achievements unlocked</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Growth</CardTitle>
                      <CardDescription>Your overall progress in the educational technology journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <BarChart2 className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium">Learning Completion</h4>
                          </div>
                          <div className="flex items-end space-x-2">
                            <span className="text-3xl font-bold">43%</span>
                            <span className="text-sm text-green-600 pb-1">↑ 12%</span>
                          </div>
                          <Progress value={43} className="h-2" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-green-600" />
                            <h4 className="font-medium">Community Participation</h4>
                          </div>
                          <div className="flex items-end space-x-2">
                            <span className="text-3xl font-bold">62%</span>
                            <span className="text-sm text-green-600 pb-1">↑ 8%</span>
                          </div>
                          <Progress value={62} className="h-2" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-purple-600" />
                            <h4 className="font-medium">Skill Development</h4>
                          </div>
                          <div className="flex items-end space-x-2">
                            <span className="text-3xl font-bold">58%</span>
                            <span className="text-sm text-green-600 pb-1">↑ 15%</span>
                          </div>
                          <Progress value={58} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      
      
      
    </div>
  );
}