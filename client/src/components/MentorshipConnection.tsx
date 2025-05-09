import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from '@tanstack/react-query';
import { 
  Award, UserPlus, MessageSquare, Calendar, Star, 
  CheckCircle, Target, TrendingUp, Send, Smile, Heart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ConnectionProps {
  mentorId?: number;
  mentorName: string;
  mentorRole?: string;
  mentorAvatar?: string;
  isConnected?: boolean;
  onComplete: () => void;
}

// Animation styles
const animationStyles = `
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes glow {
  0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
  100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
}

.animate-pulse-custom {
  animation: pulse 2s infinite ease-in-out;
}

.animate-bounce-custom {
  animation: bounce 2s infinite ease-in-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

.animate-glow {
  animation: glow 2s infinite ease-in-out;
}
`;

export default function MentorshipConnection({ 
  mentorId, 
  mentorName, 
  mentorRole = "Educational Technology Specialist", 
  mentorAvatar, 
  isConnected = false,
  onComplete
}: ConnectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connectionState, setConnectionState] = useState<'idle' | 'requesting' | 'pending' | 'connected'>(
    isConnected ? 'connected' : 'idle'
  );
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionStrength, setConnectionStrength] = useState(0);
  const [rewards, setRewards] = useState<{ points: number, badges: number }>({ points: 0, badges: 0 });
  const [interactions, setInteractions] = useState<{ 
    messages: number, 
    meetings: number,
    goals: number,
    resources: number 
  }>({ messages: 0, meetings: 0, goals: 0, resources: 0 });
  
  // Animation effects when component mounts
  useEffect(() => {
    // Add animation styles to document head
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    // Clean up style element when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Simulate connection strength based on interactions
  useEffect(() => {
    if (connectionState === 'connected') {
      const total = interactions.messages + interactions.meetings + 
                   interactions.goals + interactions.resources;
      
      // Calculate connection strength (max 100)
      const strength = Math.min(100, total * 5);
      setConnectionStrength(strength);
      
      // Calculate rewards based on connection strength
      setRewards({
        points: Math.floor(strength * 10),
        badges: Math.floor(strength / 25)
      });
    }
  }, [connectionState, interactions]);

  // Mock connection mutation
  const connectionMutation = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    onSuccess: () => {
      setConnectionState('pending');
      setShowAnimation(true);
      
      toast({
        title: "Connection request sent!",
        description: `Your request has been sent to ${mentorName}.`,
      });
      
      // Simulate connection acceptance after delay
      setTimeout(() => {
        setConnectionState('connected');
        setShowConfetti(true);
        
        toast({
          title: "Connection accepted!",
          description: `${mentorName} has accepted your mentorship request.`,
        });
        
        // Hide confetti after a while
        setTimeout(() => {
          setShowConfetti(false);
          // Call the completion callback
          onComplete();
        }, 5000);
        
        // Start with some initial interactions
        setInteractions({
          messages: 1,
          meetings: 0,
          goals: 1,
          resources: 0
        });
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Connection failed",
        description: "There was an error sending your request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleConnect = () => {
    setConnectionState('requesting');
  };

  const handleSendRequest = () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to introduce yourself.",
        variant: "destructive",
      });
      return;
    }
    
    connectionMutation.mutate();
  };

  const handleInteraction = (type: keyof typeof interactions) => {
    // Add an interaction and update connection strength
    setInteractions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    
    // Show success animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000);
    
    toast({
      title: "Interaction added!",
      description: `You've strengthened your connection with ${mentorName}.`,
    });
  };

  // Render connection request form
  const renderConnectionRequest = () => {
    return (
      <Card className="shadow-md border-primary-100 overflow-hidden">
        <div className="h-10 bg-gradient-to-r from-blue-600 to-blue-400 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-10 pattern-dots"></div>
        </div>
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-lg flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-primary-600" />
            Request Mentorship Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <Avatar className="h-16 w-16 border-2 border-white shadow">
              {mentorAvatar ? (
                <AvatarImage src={mentorAvatar} alt={mentorName} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl font-bold">
                  {mentorName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900 text-lg">{mentorName}</h3>
              <p className="text-sm text-gray-500">{mentorRole}</p>
              <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                Potential Mentor
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Introduction Message
              </label>
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you'd like to connect with this mentor..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                A personalized message increases your chances of establishing a connection.
              </p>
            </div>
            
            <div className="pt-2 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setConnectionState('idle')}
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-500 border-2 border-white hover:border-blue-200 shadow-md transition-all duration-200"
                onClick={handleSendRequest}
                disabled={connectionMutation.isPending}
              >
                {connectionMutation.isPending ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Request...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Request <Send className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render connection pending state
  const renderPendingConnection = () => {
    return (
      <Card className="shadow-md border-primary-100 overflow-hidden">
        <div className="h-10 bg-gradient-to-r from-amber-500 to-amber-400 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-amber-500 opacity-10 pattern-dots"></div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative h-20 w-20 mb-2 animate-pulse-custom">
              <div className="absolute inset-0 rounded-full bg-amber-100 border-4 border-white shadow-md"></div>
              <Avatar className="h-20 w-20 absolute inset-0">
                {mentorAvatar ? (
                  <AvatarImage src={mentorAvatar} alt={mentorName} />
                ) : (
                  <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl font-bold">
                    {mentorName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            
            <div className="space-y-1">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mb-2">Pending</Badge>
              <h3 className="font-medium text-gray-900">Connection Request Sent</h3>
              <p className="text-sm text-gray-500">
                Your request to connect with {mentorName} has been sent and is waiting for approval.
              </p>
            </div>
            
            <div className="w-full pt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Request Sent</span>
                <span>Waiting for Approval</span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-amber-500 w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render established connection
  const renderConnection = () => {
    return (
      <div className="space-y-6">
        <Card className="shadow-md border-primary-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-400 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-10 pattern-dots"></div>
          </div>
          <CardContent className="p-0">
            <div className="px-6 pb-6">
              <div className="flex justify-between items-start -mt-12">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 border-4 border-white rounded-full bg-primary-100 shadow-md">
                    {mentorAvatar ? (
                      <AvatarImage src={mentorAvatar} alt={mentorName} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                        {mentorName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                
                <div className="pt-14">
                  <Badge className="bg-green-100 text-green-800 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                </div>
              </div>
              
              <div className="mt-2 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{mentorName}</h3>
                  <p className="text-gray-600">{mentorRole}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Connection Strength</span>
                      <span className="text-sm text-gray-600">{connectionStrength}%</span>
                    </div>
                    <Progress value={connectionStrength} className="h-2" />
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1 bg-yellow-50 text-yellow-800 px-2 py-1 rounded-md">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{rewards.points}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Experience points earned from this mentorship</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-lg mt-4">
                  <div 
                    className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleInteraction('messages')}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{interactions.messages}</span>
                    <span className="text-xs text-gray-500">Messages</span>
                  </div>
                  
                  <div 
                    className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleInteraction('meetings')}
                  >
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-1">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{interactions.meetings}</span>
                    <span className="text-xs text-gray-500">Meetings</span>
                  </div>
                  
                  <div 
                    className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleInteraction('goals')}
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                      <Target className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{interactions.goals}</span>
                    <span className="text-xs text-gray-500">Goals</span>
                  </div>
                  
                  <div 
                    className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleInteraction('resources')}
                  >
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{interactions.resources}</span>
                    <span className="text-xs text-gray-500">Resources</span>
                  </div>
                </div>
                
                {/* Quick message input */}
                <div className="flex items-center space-x-2 mt-4">
                  <Input 
                    placeholder="Send a quick message..." 
                    className="flex-1" 
                  />
                  <Button 
                    size="icon" 
                    className="bg-primary-600 hover:bg-primary-700"
                    onClick={() => handleInteraction('messages')}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Earned badges */}
        {rewards.badges > 0 && (
          <Card className="border border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <h4 className="flex items-center text-sm font-medium text-yellow-800 mb-3">
                <Award className="h-4 w-4 mr-1 text-yellow-600" />
                Earned Recognition
              </h4>
              <div className="flex space-x-2">
                {rewards.badges >= 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                          <Smile className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-medium">First Connection Badge</p>
                        <p className="text-xs">Established your first mentorship</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {rewards.badges >= 2 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-medium">Active Communicator</p>
                        <p className="text-xs">Regularly engaged with your mentor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {rewards.badges >= 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white">
                          <Target className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-medium">Goal Achiever</p>
                        <p className="text-xs">Set and accomplished learning goals</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {rewards.badges >= 4 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white">
                          <Heart className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm font-medium">Community Contributor</p>
                        <p className="text-xs">Shared resources with the community</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Interaction animation effect
  const renderAnimationEffect = () => {
    if (!showAnimation) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="animate-bounce-custom">
          <div className="bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg animate-fade-in flex items-center">
            <Star className="h-5 w-5 text-yellow-300 mr-2" fill="currentColor" />
            <span>Connection strengthened!</span>
          </div>
        </div>
      </div>
    );
  };

  // Confetti celebration effect
  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    // Create 50 confetti pieces
    const confettiPieces = Array(50).fill(0).map((_, i) => {
      const size = Math.random() * 10 + 5;
      const colors = ['#4F46E5', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 3 + 2}s`;
      const animationDelay = `${Math.random() * 0.5}s`;
      
      return (
        <div 
          key={i}
          className="absolute rounded-full opacity-80"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            left,
            top: '-5%',
            animation: `fall ${animationDuration} ease-in forwards ${animationDelay}`,
          }}
        />
      );
    });
    
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
        <style>
          {`
            @keyframes fall {
              from {
                transform: translateY(-10px) rotate(0deg);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}
        </style>
        {confettiPieces}
      </div>
    );
  };

  // Main render method
  return (
    <div>
      {connectionState === 'idle' && (
        <Button 
          className="bg-gradient-to-r from-primary-600 to-primary-500 border-2 border-white hover:border-blue-200 shadow-md transform hover:scale-105 transition-all duration-200 animate-glow"
          onClick={handleConnect}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Connect with {mentorName}
        </Button>
      )}
      
      {connectionState === 'requesting' && renderConnectionRequest()}
      {connectionState === 'pending' && renderPendingConnection()}
      {connectionState === 'connected' && renderConnection()}
      
      {renderAnimationEffect()}
      {renderConfetti()}
    </div>
  );
}