import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Star, UserPlus, MessageSquare, Calendar, Target, TrendingUp, CheckCircle, Send, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ConnectionProps {
  mentorId: number;
  mentorName: string;
  mentorRole?: string;
  mentorAvatar?: string;
  isConnected?: boolean;
}

export default function MentorshipConnectionSimple({
  mentorId,
  mentorName,
  mentorRole = "Educational Technology Specialist",
  mentorAvatar,
  isConnected = false
}: ConnectionProps) {
  const { toast } = useToast();
  const [connectionState, setConnectionState] = useState<'idle' | 'requesting' | 'pending' | 'connected'>(
    isConnected ? 'connected' : 'idle'
  );
  const [message, setMessage] = useState("");
  const [connectionStrength, setConnectionStrength] = useState(0);
  const [interactions, setInteractions] = useState({
    messages: 0,
    meetings: 0,
    goals: 0,
    resources: 0
  });

  // Simulated API call to establish connection
  const connectionMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    onSuccess: () => {
      setConnectionState('pending');
      
      toast({
        title: "Request sent",
        description: `Your mentorship request has been sent to ${mentorName}.`,
      });
      
      setTimeout(() => {
        setConnectionState('connected');
        
        toast({
          title: "Connection established",
          description: `${mentorName} has accepted your mentorship request.`,
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
    setInteractions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    
    toast({
      title: "Interaction added",
      description: `You've added a ${type.slice(0, -1)} interaction with ${mentorName}.`,
    });
  };

  // Render connection request form
  const renderConnectionRequest = () => {
    return (
      <Card className="shadow-sm border">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-12 w-12">
                {mentorAvatar ? (
                  <AvatarImage src={mentorAvatar} alt={mentorName} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {mentorName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium">{mentorName}</h3>
                <p className="text-sm text-gray-500">{mentorRole}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Introduction Message
              </label>
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself and explain why you'd like to connect..."
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setConnectionState('idle')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendRequest}
                disabled={connectionMutation.isPending}
              >
                {connectionMutation.isPending ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Request
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
      <Card className="shadow-sm border">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <Avatar className="h-16 w-16">
              {mentorAvatar ? (
                <AvatarImage src={mentorAvatar} alt={mentorName} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {mentorName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h3 className="font-medium">{mentorName}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Your request is waiting for approval
              </p>
              <Badge variant="outline" className="bg-amber-50 text-amber-600">
                Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render established connection
  const renderConnection = () => {
    return (
      <Card className="shadow-sm border">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  {mentorAvatar ? (
                    <AvatarImage src={mentorAvatar} alt={mentorName} />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {mentorName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div>
                  <h3 className="text-xl font-medium">{mentorName}</h3>
                  <p className="text-gray-600">{mentorRole}</p>
                </div>
              </div>
              
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" /> Connected
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Connection Strength</span>
                <span className="text-sm text-gray-600">{connectionStrength}%</span>
              </div>
              <Progress value={connectionStrength} className="h-2" />
            </div>
            
            <div className="grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-lg">
              <div 
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleInteraction('messages')}
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">{interactions.messages}</span>
                <span className="text-xs text-gray-500">Messages</span>
              </div>
              
              <div 
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleInteraction('meetings')}
              >
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mb-1">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">{interactions.meetings}</span>
                <span className="text-xs text-gray-500">Meetings</span>
              </div>
              
              <div 
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleInteraction('goals')}
              >
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">{interactions.goals}</span>
                <span className="text-xs text-gray-500">Goals</span>
              </div>
              
              <div 
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => handleInteraction('resources')}
              >
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium">{interactions.resources}</span>
                <span className="text-xs text-gray-500">Resources</span>
              </div>
            </div>
            
            {/* Quick message input */}
            <div className="flex items-center space-x-2 mt-1">
              <Input 
                placeholder="Send a quick message..." 
                className="flex-1" 
              />
              <Button 
                size="icon"
                onClick={() => handleInteraction('messages')}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Main render method
  return (
    <div>
      {connectionState === 'idle' && (
        <Button 
          onClick={handleConnect}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Connect with {mentorName}
        </Button>
      )}
      
      {connectionState === 'requesting' && renderConnectionRequest()}
      {connectionState === 'pending' && renderPendingConnection()}
      {connectionState === 'connected' && renderConnection()}
    </div>
  );
}