import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  X,
  ArrowRight,
  Info,
  Award,
  Book,
  Users,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
}

export default function OnboardingTutorial() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(
    null,
  );
  const [overlayPosition, setOverlayPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // Define tutorial steps
  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "Welcome to ETHIC!",
      description:
        "This is your central hub for educational technology in Indonesia. Let's explore the key features together!",
      icon: <Info className="h-6 w-6 text-primary-600" />,
      position: "center",
    },
    {
      id: 2,
      title: "Explore Educational Resources",
      description:
        "Discover the latest educational technology resources, articles, and best practices in the ThinkTank section.",
      icon: <Book className="h-6 w-6 text-primary-600" />,
      highlight: ".sidebar-thinktank",
      position: "right",
    },
    {
      id: 3,
      title: "Connect with the Community",
      description:
        "Engage with other members, join discussions, and attend events in the Hub section.",
      icon: <Users className="h-6 w-6 text-primary-600" />,
      highlight: ".sidebar-hub",
      position: "right",
    },
    {
      id: 4,
      title: "Find a Mentor",
      description:
        "Connect with experienced professionals for guidance on your educational technology journey.",
      icon: <Award className="h-6 w-6 text-primary-600" />,
      highlight: ".sidebar-career, .career-mentorship",
      position: "right",
    },
    {
      id: 5,
      title: "Participate in Innovation Challenges",
      description:
        "Showcase your skills by joining innovation challenges and contributing to educational solutions.",
      icon: <Lightbulb className="h-6 w-6 text-primary-600" />,
      highlight: ".sidebar-innovation",
      position: "right",
    },
    {
      id: 6,
      title: "Track Your Learning Journey",
      description:
        "Follow structured learning paths and track your progress in developing educational technology skills.",
      icon: <GraduationCap className="h-6 w-6 text-primary-600" />,
      highlight: ".learning-paths",
      position: "bottom",
    },
  ];

  const currentStep = tutorialSteps[currentStepIndex];

  useEffect(() => {
    // Check if user is new and hasn't completed tutorial
    const hasCompletedTutorial = localStorage.getItem("tutorialCompleted");

    // Temporarily remove user check to ensure tutorial shows
    if (!hasCompletedTutorial) {
      // Show welcome dialog after a short delay
      const timer = setTimeout(() => {
        setShowWelcomeDialog(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    // Update highlighted element when step changes
    if (currentStep && currentStep.highlight) {
      const element = document.querySelector(
        currentStep.highlight,
      ) as HTMLElement;
      setHighlightElement(element);

      if (element) {
        const rect = element.getBoundingClientRect();
        setOverlayPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });

        // Scroll element into view
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      setHighlightElement(null);
    }
  }, [currentStep, isVisible]);

  // Handle window resize to update highlight position
  useEffect(() => {
    const handleResize = () => {
      if (highlightElement) {
        const rect = highlightElement.getBoundingClientRect();
        setOverlayPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [highlightElement]);

  const startTutorial = () => {
    setShowWelcomeDialog(false);
    setIsVisible(true);
    setCurrentStepIndex(0);
  };

  const nextStep = () => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    setIsVisible(false);
    setTutorialCompleted(true);
    localStorage.setItem("tutorialCompleted", "true");
  };

  const restartTutorial = () => {
    setTutorialCompleted(false);
    setCurrentStepIndex(0);
    setIsVisible(true);
  };

  // Calculate which side to display the tooltip based on position
  const getTooltipPosition = () => {
    if (!highlightElement)
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const rect = highlightElement.getBoundingClientRect();

    switch (currentStep.position) {
      case "top":
        return {
          top: `${rect.top - 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          top: `${rect.bottom + 10}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: "translate(-50%, 0)",
        };
      case "left":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 10}px`,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 10}px`,
          transform: "translate(0, -50%)",
        };
      default:
        return {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
    }
  };

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to ETHIC</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Educational Technology Hub for Indonesian Community
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center">
              <Award className="h-12 w-12 text-primary-600" />
            </div>
            <p className="text-center text-gray-700">
              Would you like a quick tour of ETHIC to discover all the features
              and how to make the most of this platform?
            </p>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => setShowWelcomeDialog(false)}
            >
              Maybe Later
            </Button>
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-primary-500"
              onClick={startTutorial}
            >
              Take the Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutorial Overlay */}
      {isVisible && (
        <>
          {/* Semi-transparent overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[999]"
            onClick={skipTutorial}
          />

          {/* Highlight cut-out */}
          {highlightElement && (
            <div
              className="absolute z-[1000] pointer-events-none"
              style={{
                top: `${overlayPosition.top}px`,
                left: `${overlayPosition.left}px`,
                width: `${overlayPosition.width}px`,
                height: `${overlayPosition.height}px`,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
                borderRadius: "4px",
              }}
            />
          )}

          {/* Tutorial tooltip */}
          <div className="fixed z-[1001] w-80" style={getTooltipPosition()}>
            <Card className="shadow-lg border-primary-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {currentStep.icon}
                    <CardTitle className="text-lg font-semibold">
                      {currentStep.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={skipTutorial}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600">
                  {currentStep.description}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between pt-0">
                <div className="flex-1">
                  <Progress
                    value={
                      ((currentStepIndex + 1) / tutorialSteps.length) * 100
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Step {currentStepIndex + 1} of {tutorialSteps.length}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {currentStepIndex > 0 && (
                    <Button variant="outline" size="sm" onClick={previousStep}>
                      Back
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-primary-600 to-primary-500"
                  >
                    {currentStepIndex < tutorialSteps.length - 1 ? (
                      <>
                        Next <ArrowRight className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      "Finish"
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </>
      )}

      {/* Restart tutorial button - only shown to users who completed tutorial */}
      {tutorialCompleted && (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 z-50 bg-blue-50 shadow-lg border-2 border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-medium"
          onClick={restartTutorial}
        >
          <Info className="mr-2 h-4 w-4" />
          Restart Tutorial
        </Button>
      )}
    </>
  );
}
