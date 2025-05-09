import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  Target, Award, BookOpen, Check, Lock, Trophy, 
  ChevronRight, ChevronDown, ChevronUp, Lightbulb, Star, Play, X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Milestone {
  id: number;
  title: string;
  points: number;
  unlocked: boolean;
  completed: boolean;
  icon: React.ReactNode;
  skills: string[];
  description: string;
}

interface LearningPath {
  id: number;
  title: string;
  description: string;
  progress: number;
  milestones: Milestone[];
}

export default function AdaptiveLearningPathViz({ pathId = 1 }: { pathId?: number }) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const [completedNodes, setCompletedNodes] = useState<number[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  
  // Mock learning paths data
  const learningPaths: LearningPath[] = [
    {
      id: 1,
      title: "Educational Technology Foundations",
      description: "Master the fundamentals of educational technology design and implementation",
      progress: 45,
      milestones: [
        {
          id: 101,
          title: "Foundations of EdTech",
          points: 100,
          unlocked: true,
          completed: true,
          icon: <BookOpen className="h-5 w-5" />,
          skills: ["Learning Theories", "Instructional Design", "Digital Literacy"],
          description: "Understand the fundamental theories and principles that underpin educational technology"
        },
        {
          id: 102,
          title: "Digital Tool Mastery",
          points: 150,
          unlocked: true,
          completed: true,
          icon: <Target className="h-5 w-5" />,
          skills: ["LMS Management", "Content Creation", "Assessment Tools"],
          description: "Learn to effectively utilize digital tools for content creation and delivery"
        },
        {
          id: 103,
          title: "Instructional Design",
          points: 200,
          unlocked: true,
          completed: false,
          icon: <Lightbulb className="h-5 w-5" />,
          skills: ["ADDIE Model", "Learning Objectives", "Course Structure"],
          description: "Apply instructional design principles to create effective educational experiences"
        },
        {
          id: 104,
          title: "Learning Analytics",
          points: 200,
          unlocked: false,
          completed: false,
          icon: <Target className="h-5 w-5" />,
          skills: ["Data Interpretation", "Student Progress", "Intervention Design"],
          description: "Use data to understand student engagement and improve educational outcomes"
        },
        {
          id: 105,
          title: "Educational Technology Leadership",
          points: 250,
          unlocked: false,
          completed: false,
          icon: <Award className="h-5 w-5" />,
          skills: ["Implementation Planning", "Faculty Training", "Technology Selection"],
          description: "Develop skills to lead educational technology initiatives in organizational settings"
        }
      ]
    },
    {
      id: 2,
      title: "Digital Content Creation",
      description: "Develop skills to create engaging digital learning content",
      progress: 25,
      milestones: []
    },
    {
      id: 3,
      title: "Learning Experience Design",
      description: "Master the art of designing effective learning experiences",
      progress: 10,
      milestones: []
    }
  ];

  useEffect(() => {
    // Set initial path based on pathId
    const path = learningPaths.find(p => p.id === pathId) || learningPaths[0];
    setActivePath(path);
    
    // Set initial completed nodes
    const completed = path.milestones
      .filter(milestone => milestone.completed)
      .map(milestone => milestone.id);
    setCompletedNodes(completed);
    
    // Calculate initial points
    const points = path.milestones
      .filter(milestone => milestone.completed)
      .reduce((sum, milestone) => sum + milestone.points, 0);
    setEarnedPoints(points);
  }, [pathId]);

  const handleNodeClick = (index: number) => {
    if (activePath?.milestones[index].unlocked) {
      setActiveNodeIndex(index);
    }
  };

  const markAsCompleted = (milestoneId: number) => {
    if (!activePath) return;
    
    // Update the active path with the completed milestone
    const updatedPath = { ...activePath };
    const milestoneIndex = updatedPath.milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex !== -1 && !updatedPath.milestones[milestoneIndex].completed) {
      // Mark the current milestone as completed
      updatedPath.milestones[milestoneIndex].completed = true;
      
      // Unlock the next milestone if it exists
      if (milestoneIndex + 1 < updatedPath.milestones.length) {
        updatedPath.milestones[milestoneIndex + 1].unlocked = true;
      }
      
      // Recalculate progress
      const completedCount = updatedPath.milestones.filter(m => m.completed).length;
      updatedPath.progress = Math.round((completedCount / updatedPath.milestones.length) * 100);
      
      // Update state
      setActivePath(updatedPath);
      setCompletedNodes([...completedNodes, milestoneId]);
      setEarnedPoints(earnedPoints + updatedPath.milestones[milestoneIndex].points);
      
      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000);
    }
  };

  if (!activePath) return null;

  return (
    <div className="w-full">
      <Card className="border-primary-100 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 border-b pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg text-primary-900">
                {activePath.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {activePath.description}
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-yellow-700">{earnedPoints} XP</span>
              </div>
              <div className="w-36 mt-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{activePath.progress}%</span>
                </div>
                <Progress value={activePath.progress} className="h-2" />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`p-0 ${isExpanded ? '' : 'max-h-[320px] overflow-hidden'}`}>
          {/* Path Visualization */}
          <div className="pt-6 pb-2 px-6">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>
              
              {/* Milestones */}
              <div className="space-y-8 relative z-10">
                {activePath.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative">
                    {/* Connection line to next milestone */}
                    {index < activePath.milestones.length - 1 && (
                      <div 
                        className={`absolute left-[22px] top-10 w-0.5 h-8 ${
                          milestone.completed ? 'bg-primary-500' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                    
                    {/* Milestone Node */}
                    <div className="flex items-start">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`relative flex items-center justify-center h-11 w-11 rounded-full border-2 ${
                                milestone.completed
                                  ? 'bg-primary-100 border-primary-500 text-primary-600'
                                  : milestone.unlocked
                                    ? 'bg-white border-gray-300 text-gray-500 cursor-pointer hover:border-primary-300'
                                    : 'bg-gray-100 border-gray-200 text-gray-400'
                              } ${
                                !milestone.unlocked ? 'cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              onClick={() => milestone.unlocked && handleNodeClick(index)}
                            >
                              {milestone.completed ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Check className="h-5 w-5 text-primary-600" />
                                </div>
                              ) : !milestone.unlocked ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  {milestone.icon}
                                </div>
                              )}
                              
                              {/* Points indicator */}
                              <div className="absolute -top-1 -right-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-1.5 rounded-full border border-yellow-200">
                                {milestone.points}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <div className="text-sm font-medium">{milestone.title}</div>
                            <div className="text-xs text-gray-500">{milestone.unlocked ? 'Click to view details' : 'Complete previous milestones to unlock'}</div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <div className="ml-4 flex-1">
                        <h4 className={`text-base font-medium ${
                          milestone.completed 
                            ? 'text-primary-900' 
                            : !milestone.unlocked
                              ? 'text-gray-400'
                              : 'text-gray-800'
                        }`}>
                          {milestone.title}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {milestone.skills.map((skill, i) => (
                            <Badge 
                              key={i}
                              variant={milestone.completed ? "default" : "outline"}
                              className={`text-xs ${
                                milestone.completed 
                                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200' 
                                  : !milestone.unlocked
                                    ? 'bg-gray-100 text-gray-400'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action buttons only for unlocked milestones */}
                      {milestone.unlocked && !milestone.completed && (
                        <Button 
                          size="sm"
                          variant="outline"
                          className="ml-2 text-primary-600 border-primary-200 hover:bg-primary-50"
                          onClick={() => markAsCompleted(milestone.id)}
                        >
                          <Play className="mr-1 h-3 w-3" /> Start
                        </Button>
                      )}
                      
                      {/* Completed indicator */}
                      {milestone.completed && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                          <Check className="mr-1 h-3 w-3" /> Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Selected Node Details */}
          {activeNodeIndex >= 0 && (
            <div className="mt-4 p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {activePath.milestones[activeNodeIndex].title}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveNodeIndex(-1)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-gray-600">
                {activePath.milestones[activeNodeIndex].description}
              </p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <h4 className="text-sm font-medium flex items-center">
                    <BookOpen className="h-4 w-4 mr-1 text-primary-600" /> Learning Resources
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 text-primary-500 mr-1" />
                      <span>Introduction to {activePath.milestones[activeNodeIndex].title}</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 text-primary-500 mr-1" />
                      <span>Best Practices and Case Studies</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 text-primary-500 mr-1" />
                      <span>Practical Implementation Guide</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <h4 className="text-sm font-medium flex items-center">
                    <Target className="h-4 w-4 mr-1 text-primary-600" /> Activities & Assessments
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 text-primary-500 mr-1" />
                      <span>Knowledge Check Quiz</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 text-primary-500 mr-1" />
                      <span>Hands-on Project</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-3 w-3 text-primary-500 mr-1" />
                      <span>Peer Discussion Forum</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-primary-600 to-primary-500"
                  onClick={() => markAsCompleted(activePath.milestones[activeNodeIndex].id)}
                  disabled={activePath.milestones[activeNodeIndex].completed}
                >
                  {activePath.milestones[activeNodeIndex].completed 
                    ? <><Check className="mr-2 h-4 w-4" /> Completed</> 
                    : <><Play className="mr-2 h-4 w-4" /> Begin This Milestone</>
                  }
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Show/Hide button */}
        <div className="border-t px-6 py-2 bg-gray-50">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center justify-center text-gray-600"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </Card>
      
      {/* Success Animation */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-primary-900/80 text-white px-6 py-4 rounded-lg flex items-center space-x-3 animate-bounce">
            <Award className="h-6 w-6 text-yellow-400" />
            <div>
              <h4 className="font-bold">Milestone Completed!</h4>
              <p className="text-sm">+{activePath.milestones[activeNodeIndex]?.points || "200"} experience points</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}