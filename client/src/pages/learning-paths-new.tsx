import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/app-layout";

import AdaptiveLearningPathViz from "@/components/AdaptiveLearningPathViz";
import { Button } from "@/components/ui/button";
import { LearningPath, User } from "@shared/schema";
import { Loader2, ChevronRight, Clock, Award, Users, BarChart2, Bookmark } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LearningPathsPage() {
  const { user } = useAuth();

  const { data: learningPaths, isLoading } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
    // In UI-only mode, we would add a placeholder value here
  });

  // Sample data for UI-only mode
  const mockLearningPaths: LearningPath[] = [
    {
      id: 1,
      title: "Fundamentals of Education Technology",
      description: "Learn the core concepts and principles of educational technology and how to apply them in various learning contexts.",
      createdBy: 2,
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3",
      difficulty: "beginner",
      estimatedTimeToComplete: "4 weeks",
      createdAt: new Date("2023-10-05")
    },
    {
      id: 2,
      title: "Digital Assessment Strategies",
      description: "Explore effective methods for assessing student learning in digital environments using various tools and platforms.",
      createdBy: 3,
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3",
      difficulty: "intermediate",
      estimatedTimeToComplete: "3 weeks",
      createdAt: new Date("2023-09-15")
    },
    {
      id: 3,
      title: "Inclusive Design for Digital Learning",
      description: "Master the principles of creating inclusive and accessible educational experiences for diverse learners.",
      createdBy: 2,
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2342&ixlib=rb-4.0.3",
      difficulty: "advanced",
      estimatedTimeToComplete: "6 weeks",
      createdAt: new Date("2023-08-20")
    },
    {
      id: 4,
      title: "Educational Data Analytics",
      description: "Learn how to analyze and interpret educational data to improve teaching strategies and student outcomes.",
      createdBy: 4,
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3",
      difficulty: "advanced",
      estimatedTimeToComplete: "8 weeks",
      createdAt: new Date("2023-07-10")
    }
  ];

  // Progress data (in a full implementation, this would come from the backend)
  const mockProgress: Record<number, number> = {
    1: 75, // 75% complete for learning path 1
    2: 30, // 30% complete for learning path 2
    3: 0,  // Not started
    4: 10  // Just started
  };

  // Sample creators for UI-only mode
  const mockCreators: {[key: number]: User} = {
    2: {
      id: 2,
      username: "profsmith",
      password: "", // Not shown in UI
      displayName: "Dr. Smith",
      email: "smith@university.edu",
      userType: "faculty",
      avatarUrl: null,
      bio: "Educational Technology Professor with 15 years of experience",
      jobTitle: "Associate Professor",
      organization: "University of Technology",
      graduationYear: null,
      createdAt: new Date("2023-01-01")
    },
    3: {
      id: 3,
      username: "techexpert",
      password: "", // Not shown in UI
      displayName: "Alex Johnson",
      email: "alex@edtech.com",
      userType: "alumni",
      avatarUrl: null,
      bio: "EdTech specialist working with K-12 schools",
      jobTitle: "Educational Consultant",
      organization: "EdTech Solutions",
      graduationYear: 2018,
      createdAt: new Date("2023-01-15")
    },
    4: {
      id: 4,
      username: "dataprof",
      password: "", // Not shown in UI
      displayName: "Prof. Williams",
      email: "williams@college.edu",
      userType: "faculty",
      avatarUrl: null,
      bio: "Specializing in learning analytics and data-driven education",
      jobTitle: "Professor",
      organization: "Data College",
      graduationYear: null,
      createdAt: new Date("2023-02-01")
    }
  };

  // Use mock data for UI-only demonstration
  const displayPaths = learningPaths || mockLearningPaths;

  function getDifficultyColor(difficulty: string) {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  return (
    <AppLayout>
      <div className="w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ThinkTank</h1>
          
          {/* ThinkTank Navigation Tabs */}
          <div className="w-full mb-6 flex border-b">
            <Link href="/resources" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
              Repository
            </Link>
            <Link href="/learning-paths" className="px-4 py-2 font-medium text-primary-600 border-b-2 border-primary-600">
              Learning Pathway
            </Link>
            <Link href="/analytics" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
              Analytics
            </Link>
            <Link href="/bookmarks" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
              Bookmarks
            </Link>
          </div>
          
          {/* Learning Paths Content */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Learning Paths</h2>
            <p className="text-gray-600">Structured educational content to help you master educational technology</p>
          </div>
          
          {/* Learning Paths Tabs */}
          <Tabs defaultValue="paths" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-4">
              <TabsTrigger value="paths" className="px-4 py-2">All Paths</TabsTrigger>
              <TabsTrigger value="in-progress" className="px-4 py-2">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="px-4 py-2">Completed</TabsTrigger>
            </TabsList>
            
            {/* Learning Paths Tab */}
            <TabsContent value="paths">
              {/* Content Filters */}
              <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-600">
                    All Paths
                  </button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">
                    In Progress
                  </button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">
                    Completed
                  </button>
                  <button className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100">
                    Not Started
                  </button>
                </div>
                <div className="relative inline-block text-left">
                  <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                    <span>Recent</span>
                    <i className="ml-1 fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              
              {/* Learning Paths Content */}
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                ) : displayPaths.length > 0 ? (
                  displayPaths.map(path => (
                    <div key={path.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {/* Path Image */}
                        <div className="md:w-1/3 relative h-48 md:h-auto">
                          {path.imageUrl ? (
                            <img 
                              src={path.imageUrl} 
                              alt={path.title} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400">No image</span>
                            </div>
                          )}
                          <Badge 
                            className={`absolute top-3 left-3 ${getDifficultyColor(path.difficulty)}`}
                          >
                            {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                          </Badge>
                        </div>
                        
                        {/* Path Content */}
                        <div className="p-5 md:p-6 md:w-2/3 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                            <p className="text-gray-600 mb-4">{path.description}</p>
                            
                            <div className="flex flex-wrap items-center space-x-4 mb-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {path.estimatedTimeToComplete}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Award className="h-4 w-4 mr-1" />
                                Certificate Available
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Users className="h-4 w-4 mr-1" />
                                143 learners
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Your progress</span>
                                <span className="font-medium">{mockProgress[path.id] || 0}%</span>
                              </div>
                              <Progress value={mockProgress[path.id] || 0} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden mr-2">
                                <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white text-xs">
                                  {mockCreators[path.createdBy]?.displayName.charAt(0).toUpperCase() || '?'}
                                </div>
                              </div>
                              <span className="text-sm text-gray-600">
                                Created by <span className="font-medium">{mockCreators[path.createdBy]?.displayName || 'Unknown'}</span>
                              </span>
                            </div>
                            
                            <Link href={`/learning-paths/${path.id}`}>
                              <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                                Continue
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No learning paths found</h3>
                    <p className="text-gray-600 mb-4">Be the first to create a learning path!</p>
                    <Button>Create Learning Path</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* In Progress Tab */}
            <TabsContent value="in-progress">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Educational Technology Foundations</h3>
                    <p className="text-gray-600">Master the fundamentals of educational technology design and implementation</p>
                  </div>
                  
                  {/* Adaptive Learning Path Visualization */}
                  <AdaptiveLearningPathViz pathId={1} />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Assessment Strategies</h3>
                    <p className="text-gray-600">Explore effective methods for assessing student learning in digital environments</p>
                  </div>
                  
                  {/* Adaptive Learning Path Visualization */}
                  <AdaptiveLearningPathViz pathId={2} />
                </div>
              </div>
            </TabsContent>
            
            {/* Completed Tab */}
            <TabsContent value="completed">
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No completed learning paths yet</h3>
                <p className="text-gray-600 mb-6">Complete your in-progress paths to see them here.</p>
              </div>
            </TabsContent>
            
            {/* Learning Analytics Tab */}
            <TabsContent value="analytics">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <BarChart2 className="h-6 w-6 text-primary-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Your Learning Analytics</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Progress Overview</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>All Paths (4)</span>
                          <span>28%</span>
                        </div>
                        <Progress value={28} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Educational Technology Foundations</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Digital Assessment Strategies</span>
                          <span>30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Learning Activity</h4>
                    <div className="text-center py-8 text-gray-500">
                      <p>Activity visualization will appear here</p>
                      <p className="mt-2 text-sm">Continue learning to see your activity patterns</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Bookmark className="h-6 w-6 text-primary-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Your Bookmarks</h3>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <p>You haven't bookmarked any learning resources yet.</p>
                  <p className="mt-2 text-sm">Explore learning paths and bookmark resources for quick access later.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}