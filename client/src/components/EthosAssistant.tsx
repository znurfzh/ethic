import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  MessageSquare,
  X,
  SendHorizontal,
  Lightbulb,
  CornerUpRight,
  Check,
  Loader2,
  Info,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: number;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

export default function EthosAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm Ethos, your AI assistant for the Educational Technology Hub. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [hasPerplexityKey, setHasPerplexityKey] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Check if PERPLEXITY_API_KEY is available
  useEffect(() => {
    // In real app, we would make an API call to check if the key exists
    const checkApiKey = async () => {
      try {
        // Mock call to check if the API key exists
        // const response = await fetch('/api/check-perplexity-key');
        // const data = await response.json();
        // setHasPerplexityKey(data.hasKey);
        setHasPerplexityKey(false); // Set to false for now
      } catch (error) {
        console.error("Error checking Perplexity API key:", error);
        setHasPerplexityKey(false);
      }
    };

    checkApiKey();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Listen for custom events to trigger Ethos Assistant
  useEffect(() => {
    const handleCreateLearningPath = (event: CustomEvent) => {
      // Open the chat if it's not already open
      if (!isOpen) {
        setIsOpen(true);
        setIsMinimized(false);
      }
      
      // Set the input value from the event
      if (event.detail?.message) {
        setUserInput(event.detail.message);
        
        // Auto-submit the message
        const userMessage: Message = {
          id: messages.length + 1,
          role: "user",
          content: event.detail.message,
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, userMessage]);
        setUserInput("");
        setIsLoadingResponse(true);
        
        // Simulate typing indicator
        setIsTyping(true);
        
        // Create assistant response with learning path creation guidance
        setTimeout(() => {
          const assistantMessage: Message = {
            id: messages.length + 2,
            role: "assistant",
            content: `I'd be happy to help you create a custom learning pathway! Here's how we can proceed:

1. **Topic Selection**: What specific educational technology topic would you like to focus on?

2. **Time Estimation**: How much time can you dedicate to this learning path?
   - Short path (2-4 weeks)
   - Medium path (1-2 months)
   - Long path (3+ months)

3. **Milestones**: We'll need to define key milestones with specific skills to acquire.

4. **Resources**: We can include specific resources for each milestone.

Let me know your preferences for each of these aspects, and I'll help you create a well-structured learning pathway tailored to your needs.`,
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoadingResponse(false);
        }, 1500);
      }
    };
    
    // Add event listener for custom event
    window.addEventListener('ethos-create-learning-path', handleCreateLearningPath as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('ethos-create-learning-path', handleCreateLearningPath as EventListener);
    };
  }, [isOpen, messages, isLoadingResponse]);

  // Simulate typing indicator
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isTyping]);

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  // Toggle minimize/maximize
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  // Handle user message submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    // Start loading state
    setIsLoadingResponse(true);

    if (hasPerplexityKey) {
      // In a real implementation, we would call the Perplexity API here
      try {
        // Call Perplexity API (mocked for now)
        // const response = await apiRequest("POST", "/api/perplexity", {
        //   prompt: userInput,
        //   context: getContextFromCurrentPage()
        // });
        // const data = await response.json();

        // For now, simulate a delay and show a mock response
        setTimeout(() => {
          const assistantMessage: Message = {
            id: messages.length + 2,
            role: "assistant",
            content: getMockResponse(userInput),
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoadingResponse(false);
        }, 2000);
      } catch (error) {
        console.error("Error calling Perplexity API:", error);

        // Show error message
        toast({
          title: "Error",
          description: "Failed to get a response. Please try again.",
          variant: "destructive",
        });

        setIsLoadingResponse(false);
      }
    } else {
      // Simulated intelligent response without API
      setTimeout(() => {
        const assistantMessage: Message = {
          id: messages.length + 2,
          role: "assistant",
          content: getMockResponse(userInput),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoadingResponse(false);
      }, 1500);
    }
  };

  // Generate a contextual mock response based on user input
  const getMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return `Hello! I'm Ethos, your educational technology assistant. How can I help you today?`;
    } else if (
      lowerInput.includes("create") && (lowerInput.includes("learning path") || lowerInput.includes("pathway"))
    ) {
      return `I'd be happy to help you create a custom learning pathway! Here's how we can proceed:

1. **Topic Selection**: What specific educational technology topic would you like to focus on?

2. **Time Estimation**: How much time can you dedicate to this learning path?
   - Short path (2-4 weeks)
   - Medium path (1-2 months)
   - Long path (3+ months)

3. **Milestones**: We'll need to define key milestones with specific skills to acquire.

4. **Resources**: We can include specific resources for each milestone.

Let me know your preferences for each of these aspects, and I'll help you create a well-structured learning pathway tailored to your needs.`;
    } else if (
      lowerInput.includes("learning path") ||
      lowerInput.includes("course")
    ) {
      return `The learning paths in ETHIC are carefully designed educational journeys that help you master specific educational technology skills. Each path consists of multiple milestones with relevant resources and assessments. You can track your progress and earn experience points as you complete milestones.`;
    } else if (
      lowerInput.includes("mentorship") ||
      lowerInput.includes("mentor")
    ) {
      return `Mentorship in ETHIC connects you with experienced educational technology professionals who can guide your learning journey. You can find potential mentors in the Member Directory or through forum interactions, and send them connection requests with a personalized message. Once connected, you can strengthen your relationship through regular interactions and collaborative activities.`;
    } else if (
      lowerInput.includes("forum") ||
      lowerInput.includes("discussion")
    ) {
      return `The forum is a community space where members can ask questions, share insights, and engage in discussions about educational technology topics. You can create new posts, comment on existing ones, and filter discussions by topics of interest. It's a great way to learn from peers and build your professional network.`;
    } else if (
      lowerInput.includes("profile") ||
      lowerInput.includes("account")
    ) {
      return `Your profile showcases your educational technology journey, including your expertise, learning paths, forum contributions, and mentorship connections. You can customize your profile by adding a bio, professional background, and areas of interest to help others understand your EdTech focus.`;
    } else if (
      lowerInput.includes("event") ||
      lowerInput.includes("workshop")
    ) {
      return `ETHIC hosts various educational technology events including workshops, webinars, and conferences. You can find upcoming events in the Events tab, register to attend, and even propose your own events. These are excellent opportunities for networking and hands-on learning.`;
    } else if (
      lowerInput.includes("resource") ||
      lowerInput.includes("material")
    ) {
      return `The ThinkTank repository contains curated educational technology resources including articles, research papers, tools, templates, and case studies. You can filter resources by topic, format, or difficulty level, and bookmark your favorites for easy access later.`;
    } else if (lowerInput.includes("how do i") || lowerInput.includes("help")) {
      return `I'd be happy to help! To get the most out of ETHIC, try exploring the different sections: ThinkTank for resources and learning paths, Hub for community forums and events, Innovation for challenges, and Career for mentorship opportunities. If you're looking for something specific, feel free to ask me about any feature or functionality.`;
    } else {
      return `That's an interesting question about educational technology! While I don't have real-time AI capabilities in this demo, in the full version of ETHIC, I would provide personalized assistance based on your specific query. Is there something specific about learning paths, mentorship, forums, or resources that you'd like to know more about?`;
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        id="ethos-trigger"
        className={`fixed bottom-6 right-6 rounded-full shadow-xl p-0 h-14 w-14 z-50 border-2 flex items-center justify-center ${
          isOpen 
            ? "bg-gray-800 border-gray-600 text-white" 
            : "bg-blue-600 border-blue-300 text-white hover:bg-blue-700"
        }`}
        onClick={toggleChat}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquare className="h-8 w-8" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs shadow-md">
              1
            </span>
          </div>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed right-6 ${
            isMinimized
              ? "bottom-20 h-auto w-72"
              : "bottom-20 w-80 sm:w-96 h-[70vh] max-h-[500px]"
          } bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50 border border-gray-200 transition-all duration-200`}
        >
          {/* Chat Header */}
          <div className="bg-primary-500 text-white p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 border-2 border-white">
                <AvatarImage src="/assets/ethos-icon.svg" alt="Ethos" />
                <AvatarFallback className="bg-primary-700 text-white">
                  E
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-black text-sm">
                  Ethos Assistant
                </h3>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="text-xs bg-primary-700/30 text-white border-primary-400 px-1.5 h-4"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></div>
                    <span className="text-[10px] text-black">Online</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-primary-400 text-white"
                onClick={toggleMinimize}
              >
                {isMinimized ? (
                  <Maximize className="h-4 w-4" />
                ) : (
                  <Minimize className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-primary-400 text-white"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Minimized State */}
          {isMinimized && (
            <div className="p-3 text-sm">
              <p className="text-gray-500">Chat minimized. Click to expand.</p>
            </div>
          )}

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                        <AvatarImage src="/assets/ethos-icon.svg" alt="Ethos" />
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          ET
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "assistant"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-primary-500 text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                        <AvatarImage
                          src={user?.avatarUrl || ""}
                          alt={user?.displayName || "User"}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {user?.displayName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src="/assets/ethos-icon.svg" alt="Ethos" />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        ET
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex space-x-1 items-center h-4">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading indicator */}
                {isLoadingResponse && (
                  <div className="flex justify-start">
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src="/assets/ethos-icon.svg" alt="Ethos" />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        ET
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center h-4">
                        <Loader2 className="h-4 w-4 text-gray-500 animate-spin mr-2" />
                        <span className="text-sm text-gray-500">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* No API Key Message */}
              {!hasPerplexityKey && (
                <div className="px-3 py-1 bg-amber-50 border-t border-amber-200">
                  <p className="text-xs text-amber-700 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Using simulated responses</span>
                  </p>
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="border-t p-3">
                <div className="flex items-end">
                  <Textarea
                    placeholder="Ask Ethos a question..."
                    className="flex-1 resize-none text-sm"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="ml-2 h-9 w-9 rounded-full bg-primary-500 hover:bg-primary-600"
                    disabled={!userInput.trim() || isLoadingResponse}
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded"
                            onClick={() =>
                              setUserInput(
                                (prev) => prev + "How do learning paths work?",
                              )
                            }
                          >
                            <Lightbulb className="h-3 w-3 text-amber-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Ask about learning paths</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded"
                            onClick={() =>
                              setUserInput(
                                (prev) => prev + "How does mentorship work?",
                              )
                            }
                          >
                            <CornerUpRight className="h-3 w-3 text-blue-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Ask about mentorship</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded"
                            onClick={() =>
                              setUserInput(
                                (prev) =>
                                  prev + "Can you help me find resources?",
                              )
                            }
                          >
                            <Check className="h-3 w-3 text-green-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Ask for resources</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <p className="text-xs text-gray-500">
                    {isLoadingResponse
                      ? "Generating response..."
                      : "Ethos Assistant"}
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
