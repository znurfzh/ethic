import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/app-layout";

import { Button } from "@/components/ui/button";
import { LearningPath, LearningPathStep, UserLearningProgress, User } from "@shared/schema";
import { Loader2, CheckCircle, Circle, Clock, Award, ChevronLeft, Play, BookOpen, ExternalLink, FileText } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LearningPathDetailPage() {
  const { user } = useAuth();
  const [match, params] = useRoute("/learning-paths/:id");
  const pathId = match ? parseInt(params.id) : 0;

  // In a full implementation, we would fetch the learning path details from the API
  // For now, we'll use mockup data for UI development
  
  // Sample learning path data for UI-only mode
  const mockLearningPath: LearningPath = {
    id: pathId,
    title: "Fundamentals of Education Technology",
    description: "Learn the core concepts and principles of educational technology and how to apply them in various learning contexts. This comprehensive path covers everything from basic concepts to practical implementation strategies.",
    createdBy: 2,
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3",
    difficulty: "beginner",
    estimatedTimeToComplete: "4 weeks",
    createdAt: new Date("2023-10-05")
  };
  
  // Sample creator data for UI-only mode
  const mockCreator: User = {
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
  };
  
  // Sample learning path steps for UI-only mode
  const mockSteps: LearningPathStep[] = [
    {
      id: 1,
      title: "Introduction to Educational Technology",
      description: "Overview of the field and key concepts",
      learningPathId: pathId,
      order: 1,
      postId: 101,
      resourceId: null,
      externalUrl: null
    },
    {
      id: 2,
      title: "Understanding Learning Management Systems",
      description: "Explore different LMS platforms and their features",
      learningPathId: pathId,
      order: 2,
      postId: 102,
      resourceId: null,
      externalUrl: null
    },
    {
      id: 3,
      title: "Digital Assessment Tools",
      description: "Learn about various digital assessment strategies and tools",
      learningPathId: pathId,
      order: 3,
      postId: null,
      resourceId: 201,
      externalUrl: null
    },
    {
      id: 4,
      title: "Designing Interactive Learning Experiences",
      description: "Strategies for creating engaging digital learning activities",
      learningPathId: pathId,
      order: 4,
      postId: 103,
      resourceId: null,
      externalUrl: null
    },
    {
      id: 5,
      title: "EdTech Implementation Case Studies",
      description: "Real-world examples of successful educational technology implementation",
      learningPathId: pathId,
      order: 5,
      postId: null,
      resourceId: null,
      externalUrl: "https://www.example.com/edtech-case-studies"
    }
  ];
  
  // Sample progress data for UI-only mode
  const mockProgress: UserLearningProgress[] = [
    {
      id: 1,
      userId: user?.id || 0,
      learningPathId: pathId,
      stepId: 1,
      completed: true,
      completedAt: new Date("2023-10-10"),
      notes: "Great introduction to the fundamentals!"
    },
    {
      id: 2,
      userId: user?.id || 0,
      learningPathId: pathId,
      stepId: 2,
      completed: true,
      completedAt: new Date("2023-10-15"),
      notes: null
    },
    {
      id: 3,
      userId: user?.id || 0,
      learningPathId: pathId,
      stepId: 3,
      completed: false,
      completedAt: null,
      notes: null
    }
  ];
  
  const getCompletedSteps = () => {
    return mockProgress.filter(p => p.completed).length;
  };
  
  const getProgressPercentage = () => {
    return (getCompletedSteps() / mockSteps.length) * 100;
  };
  
  const isStepCompleted = (stepId: number) => {
    return mockProgress.some(p => p.stepId === stepId && p.completed);
  };
  
  const getStepIcon = (step: LearningPathStep) => {
    if (step.postId) return <FileText className="h-5 w-5" />;
    if (step.resourceId) return <BookOpen className="h-5 w-5" />;
    if (step.externalUrl) return <ExternalLink className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };
  
  return (
    <AppLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/learning-paths">
              <a className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Learning Paths
              </a>
            </Link>
          </div>
          
          {/* Learning Path Header */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="relative h-48 md:h-64">
              {mockLearningPath.imageUrl ? (
                <img 
                  src={mockLearningPath.imageUrl} 
                  alt={mockLearningPath.title} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className={`mb-3 ${
                  mockLearningPath.difficulty === 'beginner' 
                    ? 'bg-green-100 text-green-800' 
                    : mockLearningPath.difficulty === 'intermediate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                }`}>
                  {mockLearningPath.difficulty.charAt(0).toUpperCase() + mockLearningPath.difficulty.slice(1)}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{mockLearningPath.title}</h1>
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                    <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white text-xs">
                      {mockCreator.displayName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="text-sm text-white">
                    Created by <span className="font-medium">{mockCreator.displayName}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {mockLearningPath.estimatedTimeToComplete}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-1" />
                  Certificate Available
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Play className="h-4 w-4 mr-1" />
                  {mockSteps.length} Steps
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{mockLearningPath.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Your progress</span>
                  <span className="font-medium">{getCompletedSteps()} of {mockSteps.length} steps completed ({Math.round(getProgressPercentage())}%)</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>
              
              <div className="flex flex-wrap gap-3 justify-between">
                <Button variant="outline" size="lg" onClick={() => {}}>
                  Resume Learning
                </Button>
                
                <Button size="lg" onClick={() => {}}>
                  Continue to Next Step
                </Button>
              </div>
            </div>
          </div>
          
          {/* Learning Path Content */}
          <Tabs defaultValue="curriculum">
            <TabsList className="mb-6">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="notes">My Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curriculum" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Content</h3>
                
                <div className="space-y-4">
                  {mockSteps.map((step, index) => (
                    <Card key={step.id} className={`border ${isStepCompleted(step.id) ? 'border-green-200 bg-green-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5 mr-3">
                            {isStepCompleted(step.id) ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
                              <div className="flex items-center space-x-2">
                                {getStepIcon(step)}
                                <span className="text-xs text-gray-500">
                                  {step.postId ? 'Article' : step.resourceId ? 'Resource' : 'External Link'}
                                </span>
                              </div>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 mb-1">{step.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Estimated time: 15 mins</span>
                              <Link href={step.externalUrl || `/learning-step/${step.id}`}>
                                <a className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                  {isStepCompleted(step.id) ? 'Review' : 'Start'}
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="discussion">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Discussion</h3>
                <p className="text-gray-600 mb-4">Share your thoughts and connect with others taking this learning path.</p>
                
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="text-base font-medium text-gray-800 mb-2">Start a discussion</h4>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3" 
                    rows={3} 
                    placeholder="Share your thoughts, questions, or insights..."
                  ></textarea>
                  <Button onClick={() => {}}>Post Comment</Button>
                </div>
                
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No discussions yet</p>
                  <p className="text-sm text-gray-400">Be the first to start a conversation!</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">My Notes</h3>
                <p className="text-gray-600 mb-4">Keep track of important concepts and ideas as you progress through the learning path.</p>
                
                <div className="border border-gray-200 rounded-lg p-4 mb-6">
                  <h4 className="text-base font-medium text-gray-800 mb-2">Add a new note</h4>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3" 
                    rows={3} 
                    placeholder="Write your notes here..."
                  ></textarea>
                  <Button onClick={() => {}}>Save Note</Button>
                </div>
                
                {mockProgress.some(p => p.notes) ? (
                  <div className="space-y-4">
                    {mockProgress
                      .filter(p => p.notes)
                      .map(progress => (
                        <div key={progress.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-800">
                              {mockSteps.find(s => s.id === progress.stepId)?.title || 'Unknown Step'}
                            </h5>
                            <span className="text-xs text-gray-500">
                              {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="text-gray-600">{progress.notes}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No notes yet</p>
                    <p className="text-sm text-gray-400">Add notes as you progress through the learning path</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}