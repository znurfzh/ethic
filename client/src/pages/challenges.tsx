import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  User,
  Clock,
  Lightbulb,
  Award,
  Users,
  Calendar as CalendarIcon,
  Trophy,
  Vote,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Sample challenge data
const mockChallenges = [
  {
    id: 1,
    title: "Mobile Learning App Challenge",
    description:
      "Design an innovative mobile learning application that addresses a specific educational need in Indonesian schools",
    status: "active",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-05-15T23:59:59Z",
    participantsCount: 78,
    prize: "Rp 10,000,000 and mentorship opportunity",
    organizer: "EdTech Indonesia",
    skills: ["App Development", "UX Design", "Educational Content"],
  },
  {
    id: 2,
    title: "AI for Student Assessment",
    description:
      "Develop an AI-powered solution to help teachers assess student work more efficiently and effectively",
    status: "active",
    startDate: "2025-03-15T00:00:00Z",
    endDate: "2025-05-01T23:59:59Z",
    participantsCount: 42,
    prize: "Rp 7,500,000 and startup acceleration program",
    organizer: "Indonesia AI Initiative",
    skills: ["Machine Learning", "Assessment Design", "Data Analysis"],
  },
  {
    id: 3,
    title: "Inclusive Education Technology",
    description:
      "Create a technological solution that makes education more accessible to students with disabilities",
    status: "upcoming",
    startDate: "2025-05-01T00:00:00Z",
    endDate: "2025-06-15T23:59:59Z",
    participantsCount: 0,
    prize: "Rp 12,000,000 and product development support",
    organizer: "Ministry of Education",
    skills: ["Accessibility", "Inclusive Design", "Educational Software"],
  },
  {
    id: 4,
    title: "Rural Education Access Hackathon",
    description:
      "Hack solutions to improve educational access and quality in remote and rural Indonesian communities",
    status: "upcoming",
    startDate: "2025-05-20T00:00:00Z",
    endDate: "2025-06-01T23:59:59Z",
    participantsCount: 0,
    prize: "Rp 15,000,000 and pilot program funding",
    organizer: "EdTech for All Foundation",
    skills: ["Offline Learning", "Low-Resource Solutions", "Rural Technology"],
  },
  {
    id: 5,
    title: "Educational Gaming Challenge",
    description:
      "Design an educational game that makes learning core curriculum subjects engaging and effective",
    status: "active",
    startDate: "2025-04-10T00:00:00Z",
    endDate: "2025-05-25T23:59:59Z",
    participantsCount: 56,
    prize: "Rp 8,000,000 and publishing opportunity",
    organizer: "Game Developers Association",
    skills: ["Game Development", "Gamification", "Subject Matter Expertise"],
  },
  {
    id: 6,
    title: "Digital Learning System Integration",
    description:
      "Create a solution to better integrate various digital learning tools into a unified system for schools",
    status: "completed",
    startDate: "2025-01-15T00:00:00Z",
    endDate: "2025-03-01T23:59:59Z",
    participantsCount: 64,
    prize: "Rp 9,000,000 and implementation opportunity",
    organizer: "Indonesia School Consortium",
    skills: ["System Integration", "API Development", "School Technology"],
    winner: "Team TechEd Solutions",
    winnerProject: "EduSync Platform",
  },
];

// Spotlight projects - these would be featured innovative projects
const spotlightProjects = [
  {
    id: 1,
    title: "EduSync Platform",
    creator: "Team TechEd Solutions",
    description:
      "An integrated platform that synchronizes various educational tools and systems, providing a seamless experience for schools.",
    image: null,
    tags: ["System Integration", "School Management", "EdTech"],
    likes: 287,
    featured: true,
  },
  {
    id: 2,
    title: "AccessLearn",
    creator: "Inclusive Tech Group",
    description:
      "An accessibility-focused learning platform with features designed for students with visual, hearing, and cognitive impairments.",
    image: null,
    tags: ["Accessibility", "Inclusive Education", "Assistive Technology"],
    likes: 246,
    featured: true,
  },
  {
    id: 3,
    title: "RuralEd Connect",
    creator: "Digital Village Initiative",
    description:
      "Low-bandwidth education solution for rural areas with offline capabilities and solar-powered devices.",
    image: null,
    tags: ["Rural Education", "Offline Learning", "Low-Resource"],
    likes: 312,
    featured: true,
  },
];

export default function ChallengesPage() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: challenges = mockChallenges, isLoading: challengesLoading } =
    useQuery({
      queryKey: ["/api/challenges"],
      // This is mock data, so we're not actually fetching
      queryFn: () => Promise.resolve(mockChallenges),
    });

  const { data: spotlights = spotlightProjects, isLoading: spotlightsLoading } =
    useQuery({
      queryKey: ["/api/spotlight-projects"],
      // This is mock data, so we're not actually fetching
      queryFn: () => Promise.resolve(spotlightProjects),
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining or status text
  const getChallengeTimeStatus = (challenge: (typeof mockChallenges)[0]) => {
    const now = new Date();
    const endDate = new Date(challenge.endDate);

    if (challenge.status === "completed") {
      return "Completed";
    }

    if (challenge.status === "upcoming") {
      const startDate = new Date(challenge.startDate);
      const daysToStart = Math.ceil(
        (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      return `Starts in ${daysToStart} days`;
    }

    if (now > endDate) {
      return "Ended";
    }

    const daysLeft = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${daysLeft} days left`;
  };

  // Filter challenges by status
  const filteredChallenges = challenges.filter((challenge) => {
    if (filterStatus === "all") return true;
    return challenge.status === filterStatus;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Innovation
      </h1>

      <Tabs defaultValue="spotlight" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="spotlight">
              <Lightbulb className="h-4 w-4 mr-2" />
              Spotlight
            </TabsTrigger>
            <TabsTrigger value="challenge">
              <Trophy className="h-4 w-4 mr-2" />
              Challenge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spotlight">
            {/* Featured Innovation Projects */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {spotlights.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Lightbulb className="h-12 w-12 text-white opacity-50" />
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {project.title}
                        </CardTitle>
                        {project.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{project.creator}</CardDescription>
                    </CardHeader>

                    <CardContent className="pb-3">
                      <p className="text-sm text-gray-600 mb-3">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {project.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t flex justify-between items-center pt-3">
                      <div className="flex items-center text-gray-600">
                        <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                        <span className="text-sm">
                          {project.likes} likes
                        </span>
                      </div>

                      <Button variant="default" size="sm">
                        View Project
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Submit Your Innovation
                </h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Have an innovative education project to showcase?
                  </CardTitle>
                  <CardDescription>
                    Submit your project to be featured in our innovation
                    spotlight and get recognized by the community
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    We're looking for innovative solutions that address
                    educational challenges in Indonesia. Share your
                    project, get feedback, and connect with potential
                    collaborators.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-600 my-6">
                    <div>
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 text-primary-500" />
                      <h3 className="font-medium text-gray-900 mb-1">
                        Share Your Innovation
                      </h3>
                      <p className="text-sm">
                        Showcase your work to the educational technology
                        community
                      </p>
                    </div>
                    <div>
                      <Users className="h-8 w-8 mx-auto mb-2 text-primary-500" />
                      <h3 className="font-medium text-gray-900 mb-1">
                        Get Expert Feedback
                      </h3>
                      <p className="text-sm">
                        Receive insights from practitioners and
                        researchers
                      </p>
                    </div>
                    <div>
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-primary-500" />
                      <h3 className="font-medium text-gray-900 mb-1">
                        Win Recognition
                      </h3>
                      <p className="text-sm">
                        Top projects get featured and awarded badges
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary-500 to-indigo-600"
                  >
                    Submit Your Project
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenge">
            {/* Challenge Filter Options */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                Innovation Challenges
              </h2>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All Challenges
                </Button>
                <Button
                  variant={
                    filterStatus === "active" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={
                    filterStatus === "upcoming" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus("upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={
                    filterStatus === "completed" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                >
                  Completed
                </Button>
              </div>
            </div>

            {/* Challenge Call to Action */}
            <Card className="mb-8 bg-gradient-to-r from-primary-500 to-indigo-600 text-black">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold mb-2">
                      Ready to Innovate?
                    </h3>
                    <p className="opacity-90">
                      Join our innovation challenges to solve real
                      educational problems and win prizes.
                    </p>
                  </div>
                  <Button variant="default">
                    Submit a Challenge Idea
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Challenges List */}
            <div className="space-y-6">
              {filteredChallenges.length > 0 ? (
                filteredChallenges.map((challenge) => (
                  <Card
                    key={challenge.id}
                    className="overflow-hidden hover:shadow-md transition-all"
                  >
                    <CardHeader className="pb-3 border-b">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle className="mb-1 hover:text-primary-600 transition-colors">
                            <Link href={`/challenges/${challenge.id}`}>
                              {challenge.title}
                            </Link>
                          </CardTitle>
                          <CardDescription>
                            Organized by {challenge.organizer}
                          </CardDescription>
                        </div>
                        <Badge
                          className={`
                            ${
                              challenge.status === "active"
                                ? "bg-green-100 text-green-800"
                                : challenge.status === "upcoming"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          `}
                        >
                          {challenge.status === "active"
                            ? "Active"
                            : challenge.status === "upcoming"
                              ? "Upcoming"
                              : "Completed"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="py-4">
                      <p className="text-gray-700 mb-4">
                        {challenge.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Timeline
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(challenge.startDate)} -{" "}
                              {formatDate(challenge.endDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Status
                            </p>
                            <p className="text-sm text-gray-500">
                              {getChallengeTimeStatus(challenge)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Participants
                            </p>
                            <p className="text-sm text-gray-500">
                              {challenge.participantsCount} registered
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Skills Needed
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {challenge.skills.map((skill, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-yellow-500 mr-2" />
                        <p className="text-sm font-medium">
                          Prize: {challenge.prize}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t p-4 flex justify-end">
                      {challenge.status === "completed" ? (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Winner: {challenge.winner}
                          </p>
                          <p className="text-sm text-gray-500">
                            Project: {challenge.winnerProject}
                          </p>
                        </div>
                      ) : challenge.status === "active" ? (
                        <Button>Join Challenge</Button>
                      ) : (
                        <Button variant="outline">Get Notified</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No challenges found
                  </h3>
                  <p className="text-gray-500">
                    Try selecting a different filter
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
}