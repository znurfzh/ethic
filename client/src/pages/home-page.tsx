import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";

import PostCard from "@/components/post-card";
import MemberConnect from "@/components/memberConnect";
import TrendingTopics from "@/components/trending-topics";
import UpcomingEvents from "@/components/upcoming-events";

import PostFormModal from "@/components/post-form-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Post, Topic, User, Event } from "@shared/schema";
import { 
  Loader2, Bell, Calendar, FileText, Users, 
  Sparkles, BookOpen, MessageSquare, Lightbulb, 
  Clock, TrendingUp, Award, Bookmark, PlusCircle,
  Heart, BarChart2, GraduationCap, Briefcase,
  Search, Trash2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

export default function HomePage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [sortBy, setIsSortBy] = useState("recent");
  const { user } = useAuth();
  const [location] = useLocation();
  
  // Get tab from query string if it exists
  const getDefaultTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return tab || "recent";
  };

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: topics } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const filteredPosts = posts ? posts.filter(post => {
    if (filter === "All") return true;
    if (filter === "Articles" && post.postType === "article") return true;
    if (filter === "Discussions" && post.postType === "discussion") return true;
    if (filter === "Resources" && post.postType === "resource") return true;
    return false;
  }) : [];

  // Mock data for personalized recommendations
  const mockRecommendations = [
    {
      id: 1,
      type: "resource",
      title: "Instructional Design for Online Learning Environments",
      author: "Dr. Ahmad Wijaya",
      rating: 4.8,
      downloads: 543,
      categories: ["instructional design", "online learning"],
      thumbnail: null
    },
    {
      id: 2,
      type: "learning path",
      title: "Educational Technology Fundamentals",
      modules: 8,
      duration: "4 weeks",
      progress: 0,
      thumbnail: null,
      categories: [] as string[]
    },
    {
      id: 3,
      type: "mentor",
      name: "Siti Maryam, M.Ed",
      position: "Lead Instructional Designer at EdTech Solutions",
      expertise: ["UX for Learning", "Digital Assessment"],
      availability: "3 slots available",
      avatar: null,
      categories: [] as string[]
    },
    {
      id: 4,
      type: "discussion",
      title: "Integrating AI Tools in Indonesian Classrooms: Ethical Considerations",
      participants: 27,
      lastActivity: "2 hours ago",
      tags: ["AI in education", "ethics", "classroom integration"],
      snippet: "I'm working on a thesis about educational game design and looking for mentorship...",
      expertise: [] as string[],
      categories: [] as string[]
    }
  ];
  
  const mockNotifications = [
    {
      id: 1,
      type: "mention",
      content: "Kari mentioned you in a comment on 'Applying Educational Sociology'",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "like",
      content: "Dr. Wijaya liked your post about Interactive Learning Models",
      time: "1 day ago",
      read: true
    },
    {
      id: 3,
      type: "event",
      content: "Webinar: 'Future of EdTech in Indonesia' starts in 24 hours",
      time: "1 day ago",
      read: false
    },
    {
      id: 4,
      type: "comment",
      content: "New comment on your question about instructional design models",
      time: "2 days ago",
      read: true
    }
  ];
  
  // Mock bookmarks data for the Bookmarks tab
  const mockBookmarks = [
    {
      id: 1,
      type: "post",
      title: "Best Practices for Designing Effective Learning Materials",
      description: "A comprehensive guide to creating engaging and effective educational content for diverse learners.",
      authorName: "Budi Santoso",
      bookmarkedAt: "2024-04-02T09:15:00Z"
    },
    {
      id: 2,
      type: "resource",
      title: "Educational Technology Tools Comparison Chart",
      description: "A detailed comparison of popular educational technology tools with pros, cons, and recommended use cases.",
      authorName: "Dewi Anggraini",
      bookmarkedAt: "2024-03-25T14:30:00Z"
    },
    {
      id: 3,
      type: "learningPath",
      title: "Introduction to Educational Technology",
      description: "A comprehensive learning path covering the fundamentals of educational technology and its applications.",
      authorName: "Ahmad Rizki",
      bookmarkedAt: "2024-04-05T11:45:00Z"
    },
    {
      id: 4,
      type: "event",
      title: "Mobile Learning Workshop Series",
      description: "A series of interactive workshops focused on implementing mobile learning strategies in educational settings.",
      authorName: "Maria Ayu",
      bookmarkedAt: "2024-03-18T16:20:00Z"
    },
    {
      id: 5,
      type: "job",
      title: "Educational Technology Specialist",
      description: "Join a leading university as an Educational Technology Specialist to help implement innovative learning solutions.",
      authorName: "Jakarta University",
      bookmarkedAt: "2024-04-10T10:00:00Z"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getBookmarkIcon = (type: string) => {
    switch (type) {
      case "post":
        return <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>;
      case "resource":
        return <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-amber-600" />
        </div>;
      case "learningPath":
        return <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-green-600" />
        </div>;
      case "event":
        return <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-purple-600" />
        </div>;
      case "job":
        return <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-red-600" />
        </div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
          <Bookmark className="h-5 w-5 text-gray-600" />
        </div>;
    }
  };
  
  const quickLinks = [
    { id: 1, title: "Learning Paths", icon: <BookOpen className="w-4 h-4" />, url: "/learning-paths" },
    { id: 2, title: "Forum Discussions", icon: <MessageSquare className="w-4 h-4" />, url: "/forum" },
    { id: 3, title: "Upcoming Webinars", icon: <Calendar className="w-4 h-4" />, url: "/webinars" },
    { id: 4, title: "Innovation Challenges", icon: <Lightbulb className="w-4 h-4" />, url: "/challenges" },
    { id: 5, title: "Mentorship Program", icon: <Users className="w-4 h-4" />, url: "/mentorship" },
    { id: 6, title: "My Bookmarks", icon: <Bookmark className="w-4 h-4" />, url: "/bookmarks" }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Dashboard Header - Welcome to ETHIC */}
      <div className="mb-8 bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-white">Welcome to ETHIC</h1>
        <p className="text-white opacity-90">Educational Technology Hub for Indonesian Community</p>
        <p className="mt-4 text-sm text-white">
          Connect with fellow educational technology enthusiasts, share knowledge, and grow professionally.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/resources">
            <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
              <FileText className="w-4 h-4 mr-2" /> Browse Resources
            </Button>
          </Link>
          <Link href="/hub?tab=mentorship">
            <Button variant="default" className="bg-white text-primary-600 hover:bg-gray-100">
              <Users className="w-4 h-4 mr-2" /> Find Mentors
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Quick Links - Moved above tabs as requested */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Visited</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {quickLinks.map(link => (
            <Link key={link.id} href={link.url}>
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer h-full">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-2">
                  {link.icon}
                </div>
                <span className="text-sm font-medium text-center">{link.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Activity & Personalized Recommendations */}
      <Tabs defaultValue={getDefaultTab()} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-2" />
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="recommended">
            <Sparkles className="h-4 w-4 mr-2" />
            Recommended For You
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="bookmarks">
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmarks
          </TabsTrigger>
        </TabsList>
        
        {/* Recent Activity Tab */}
        <TabsContent value="recent" className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Updates</h3>
          
          {/* New Repository */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary-500" /> New Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts && posts.length > 0 ? (
                posts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <Avatar>
                        <AvatarFallback className="bg-primary-100 text-primary-600">
                          {post.authorId.toString()[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> 
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No new repository items yet.</p>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-2 border-t">
              <Link href="/resources">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                  View All Repository
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Forum Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-primary-500" /> Recent Forum Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts && posts.length > 0 ? (
                posts.slice(0, 3).map(post => (
                  <div key={post.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <Avatar>
                        <AvatarFallback className="bg-primary-100 text-primary-600">
                          {post.authorId.toString()[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                        {post.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {post.postType}
                        </span>
                        <p className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> 
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent forum activity.</p>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-2 border-t">
              <Link href="/forum">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                  Join the Discussion
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Recently Joining Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2 text-primary-500" /> Recently Joining Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 pb-3 border-b">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src="/avatars/student1.jpg" alt="Arya Wijaya" />
                    <AvatarFallback className="bg-primary-100 text-primary-600">AW</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                    Arya Wijaya
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 
                    Joined 2 days ago
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pb-3 border-b">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src="/avatars/student2.jpg" alt="Dewi Purnama" />
                    <AvatarFallback className="bg-primary-100 text-primary-600">DP</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                    Dewi Purnama
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 
                    Joined 3 days ago
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src="/avatars/student3.jpg" alt="Budi Santoso" />
                    <AvatarFallback className="bg-primary-100 text-primary-600">BS</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                    Budi Santoso
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 
                    Joined 5 days ago
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-2 border-t">
              <Link href="/community-members">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                  View All Members
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Upcoming Webinars */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary-500" /> Upcoming Webinars & Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {events && events.length > 0 ? (
                events.slice(0, 3).map(event => (
                  <div key={event.id} className="flex gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                    <div className="bg-primary-100 text-primary-600 p-2 rounded text-center min-w-[50px]">
                      <div className="text-xs font-semibold">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}</div>
                      <div className="text-lg font-bold">{new Date(event.eventDate).getDate()}</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.description ? event.description.split(' · ')[0] : 'Online'} · {new Date(event.eventDate).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3 pb-3 border-b">
                    <div className="bg-primary-100 text-primary-600 p-2 rounded text-center min-w-[50px]">
                      <div className="text-xs font-semibold">Apr</div>
                      <div className="text-lg font-bold">24</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                        Future of EdTech in Indonesia
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Online · 7:00 PM WIB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pb-3 border-b">
                    <div className="bg-primary-100 text-primary-600 p-2 rounded text-center min-w-[50px]">
                      <div className="text-xs font-semibold">Apr</div>
                      <div className="text-lg font-bold">30</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                        Workshop: Interactive Learning Design
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Jakarta · 10:00 AM WIB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-primary-100 text-primary-600 p-2 rounded text-center min-w-[50px]">
                      <div className="text-xs font-semibold">May</div>
                      <div className="text-lg font-bold">5</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm hover:text-primary-600 cursor-pointer">
                        Networking: EdTech Alumni Gathering
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Bandung · 4:00 PM WIB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-2 border-t">
              <Link href="/hub-events">
                <Button variant="ghost" size="sm" className="w-full text-xs text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                  View All Events
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Recommended For You Tab */}
        <TabsContent value="recommended" className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tailored For You</h3>
          
          <div className="space-y-4">
            {mockRecommendations.map(rec => (
              <Card key={rec.id} className="overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base hover:text-primary-600 cursor-pointer">{rec.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs bg-primary-50 text-primary-600 border-primary-200 capitalize">
                          {rec.type}
                        </Badge>
                        
                        {rec.type === 'resource' && (
                          <span className="text-xs text-gray-500">
                            by {rec.author} · {rec.downloads} downloads
                          </span>
                        )}
                        
                        {rec.type === 'learning path' && (
                          <span className="text-xs text-gray-500">
                            {rec.modules} modules · {rec.duration}
                          </span>
                        )}
                        
                        {rec.type === 'mentor' && (
                          <span className="text-xs text-gray-500">
                            {rec.availability}
                          </span>
                        )}
                        
                        {rec.type === 'discussion' && (
                          <span className="text-xs text-gray-500">
                            {rec.participants} participants · {rec.lastActivity}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    
                    {rec.type === 'learning path' && (
                      <Badge className="bg-primary-100 text-primary-600 border-0">
                        {rec.progress}% Complete
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  {rec.type === 'resource' && rec.categories && (
                    <div className="flex flex-wrap gap-1">
                      {rec.categories.map((cat, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {rec.type === 'mentor' && rec.expertise && (
                    <div className="flex flex-wrap gap-1">
                      {rec.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {rec.type === 'discussion' && rec.tags && (
                    <div className="flex flex-wrap gap-1">
                      {rec.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {rec.type === 'discussion' && rec.snippet && (
                    <p className="text-sm text-gray-700 mt-3 line-clamp-2">
                      {rec.snippet}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="p-0 h-auto text-sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
            <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
          </div>
          
          <Card>
            <CardContent className="p-4 space-y-2">
              {mockNotifications.map(notification => {
                let Icon = Bell;
                if (notification.type === 'like') Icon = Heart;
                if (notification.type === 'event') Icon = Calendar;
                if (notification.type === 'comment') Icon = MessageSquare;
                
                return (
                  <div key={notification.id} className={`flex gap-3 pb-3 border-b last:border-b-0 last:pb-0 ${
                    !notification.read ? 'bg-primary-50 -mx-4 px-4 py-2 rounded' : ''  
                  }`}>
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Icon className="h-4 w-4 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>

          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Learning Analytics</h3>
            <Select defaultValue="last30days" onValueChange={(value) => console.log(value)}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Select time period" />
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
          
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          
          {/* Main Analytics Dashboard */}
          <Tabs defaultValue="activity" className="mb-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="activity">
                <Clock className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="learning">
                <GraduationCap className="h-4 w-4 mr-2" />
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
                        data={[
                          { name: "Week 1", posts: 2, comments: 5, resources: 1, learningProgress: 15 },
                          { name: "Week 2", posts: 3, comments: 7, resources: 2, learningProgress: 22 },
                          { name: "Week 3", posts: 1, comments: 8, resources: 3, learningProgress: 35 },
                          { name: "Week 4", posts: 4, comments: 12, resources: 2, learningProgress: 48 },
                          { name: "Week 5", posts: 2, comments: 6, resources: 4, learningProgress: 57 },
                          { name: "Week 6", posts: 5, comments: 9, resources: 1, learningProgress: 65 },
                          { name: "Week 7", posts: 3, comments: 10, resources: 2, learningProgress: 72 },
                          { name: "Week 8", posts: 4, comments: 8, resources: 3, learningProgress: 85 }
                        ]}
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
                            data={[
                              { name: "Articles", value: 45 },
                              { name: "Videos", value: 30 },
                              { name: "Discussions", value: 15 },
                              { name: "Resources", value: 10 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[
                              { name: "Articles", value: 45 },
                              { name: "Videos", value: 30 },
                              { name: "Discussions", value: 15 },
                              { name: "Resources", value: 10 }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
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
                            data={[
                              { name: "Learning Paths", value: 65 },
                              { name: "Community Discussions", value: 20 },
                              { name: "Resource Library", value: 15 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[
                              { name: "Learning Paths", value: 65 },
                              { name: "Community Discussions", value: 20 },
                              { name: "Resource Library", value: 15 }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
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
                  <div className="space-y-6">
                    {[
                      { name: "Fundamentals of EdTech", progress: 85, total: 100 },
                      { name: "Digital Assessment", progress: 30, total: 100 },
                      { name: "Inclusive Design", progress: 15, total: 100 },
                      { name: "Educational Data Analytics", progress: 0, total: 100 }
                    ].map((path, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{path.name}</span>
                          <span className="text-sm text-gray-500">{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skill Development</CardTitle>
                  <CardDescription>Your proficiency across different educational technology skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Instructional Design", value: 85 },
                          { name: "Ed Technology", value: 70 },
                          { name: "Digital Assessment", value: 65 },
                          { name: "Learning Analytics", value: 40 },
                          { name: "Inclusive Design", value: 55 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Proficiency']} />
                        <Bar dataKey="value" fill="#8884d8">
                          {[
                            { name: "Instructional Design", value: 85 },
                            { name: "Ed Technology", value: 70 },
                            { name: "Digital Assessment", value: 65 },
                            { name: "Learning Analytics", value: 40 },
                            { name: "Inclusive Design", value: 55 }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Completion Trends</CardTitle>
                  <CardDescription>Number of learning paths completed over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Jan", completions: 1 },
                          { name: "Feb", completions: 2 },
                          { name: "Mar", completions: 0 },
                          { name: "Apr", completions: 4 },
                          { name: "May", completions: 3 },
                          { name: "Jun", completions: 5 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completions" name="Completed Paths" fill="#0088FE" />
                      </BarChart>
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
                  <CardDescription>Your participation in the educational technology community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { name: "Jan", active: 30, posts: 15, comments: 25 },
                          { name: "Feb", active: 40, posts: 20, comments: 35 },
                          { name: "Mar", active: 45, posts: 25, comments: 40 },
                          { name: "Apr", active: 55, posts: 30, comments: 50 },
                          { name: "May", active: 60, posts: 35, comments: 55 },
                          { name: "Jun", active: 75, posts: 40, comments: 70 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="active" name="Active Days" stroke="#8884d8" />
                        <Line type="monotone" dataKey="posts" name="Posts Created" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="comments" name="Comments Made" stroke="#ffc658" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Collaborators</CardTitle>
                    <CardDescription>People you interact with most frequently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Maria Ayu", role: "Student", interactions: 24, avatar: null },
                        { name: "Dr. Bambang Prakoso", role: "Faculty", interactions: 18, avatar: null },
                        { name: "Dewi Susanti", role: "Alumni", interactions: 15, avatar: null },
                        { name: "Reza Gunawan", role: "Student", interactions: 12, avatar: null },
                        { name: "Prof. Indah Wijaya", role: "Faculty", interactions: 9, avatar: null }
                      ].map((collaborator, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary-100 text-primary-600">
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{collaborator.name}</p>
                              <p className="text-xs text-gray-500">{collaborator.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{collaborator.interactions}</span>
                            <span className="text-xs text-gray-500">interactions</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Impact</CardTitle>
                    <CardDescription>How your content is helping the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Content Views</span>
                          <span className="text-sm font-medium">1,245</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <p className="text-xs text-gray-500">75th percentile compared to peers</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Resource Downloads</span>
                          <span className="text-sm font-medium">328</span>
                        </div>
                        <Progress value={68} className="h-2" />
                        <p className="text-xs text-gray-500">68th percentile compared to peers</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Discussion Engagement</span>
                          <span className="text-sm font-medium">84%</span>
                        </div>
                        <Progress value={84} className="h-2" />
                        <p className="text-xs text-gray-500">84th percentile compared to peers</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Content Helpfulness Rating</span>
                          <span className="text-sm font-medium">4.6/5</span>
                        </div>
                        <Progress value={92} className="h-2" />
                        <p className="text-xs text-gray-500">92nd percentile compared to peers</p>
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
                    <CardTitle>Upcoming Goals</CardTitle>
                    <CardDescription>Track your learning objectives and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: "Complete Fundamentals of EdTech", dueDate: "July 15, 2023", progress: 85 },
                        { title: "Contribute 5 resources to the community", dueDate: "July 30, 2023", progress: 60 },
                        { title: "Start Digital Assessment Learning Path", dueDate: "August 10, 2023", progress: 30 },
                        { title: "Connect with 3 new alumni", dueDate: "August 15, 2023", progress: 33 }
                      ].map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{goal.title}</span>
                            <span className="text-xs text-gray-500">Due: {goal.dueDate}</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                          <p className="text-xs text-gray-500">{goal.progress}% completed</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Milestones you've reached on your learning journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { title: "First Discussion Started", date: "January 15, 2023", icon: <MessageSquare className="h-8 w-8 text-primary-600" /> },
                        { title: "Resource Contributor", date: "February 22, 2023", icon: <FileText className="h-8 w-8 text-green-600" /> },
                        { title: "Learning Path Pioneer", date: "March 10, 2023", icon: <BookOpen className="h-8 w-8 text-purple-600" /> },
                        { title: "Active Community Member", date: "April 5, 2023", icon: <Users className="h-8 w-8 text-blue-600" /> }
                      ].map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                          <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                            {achievement.icon}
                          </div>
                          <div>
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-gray-500">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skill Growth Over Time</CardTitle>
                  <CardDescription>How your educational technology skills have developed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jan", instructionalDesign: 20, edTech: 10, assessment: 15, analytics: 5, inclusiveDesign: 10 },
                          { month: "Feb", instructionalDesign: 35, edTech: 25, assessment: 25, analytics: 10, inclusiveDesign: 15 },
                          { month: "Mar", instructionalDesign: 45, edTech: 40, assessment: 35, analytics: 15, inclusiveDesign: 25 },
                          { month: "Apr", instructionalDesign: 60, edTech: 55, assessment: 45, analytics: 25, inclusiveDesign: 35 },
                          { month: "May", instructionalDesign: 75, edTech: 65, assessment: 55, analytics: 35, inclusiveDesign: 45 },
                          { month: "Jun", instructionalDesign: 85, edTech: 70, assessment: 65, analytics: 40, inclusiveDesign: 55 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Proficiency']} />
                        <Legend />
                        <Line type="monotone" dataKey="instructionalDesign" name="Instructional Design" stroke="#0088FE" />
                        <Line type="monotone" dataKey="edTech" name="Ed Technology" stroke="#00C49F" />
                        <Line type="monotone" dataKey="assessment" name="Digital Assessment" stroke="#FFBB28" />
                        <Line type="monotone" dataKey="analytics" name="Learning Analytics" stroke="#FF8042" />
                        <Line type="monotone" dataKey="inclusiveDesign" name="Inclusive Design" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Bookmarks Tab */}
        <TabsContent value="bookmarks" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your Bookmarked Items</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search bookmarks..." 
                  className="pl-10 h-9 w-[200px]"
                />
              </div>
              <Select defaultValue="recent">
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Bookmarked</SelectItem>
                  <SelectItem value="oldest">Oldest Bookmarks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Bookmarks</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="learningPaths">Learning Paths</TabsTrigger>
              <TabsTrigger value="posts">Forum Posts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
            </TabsList>
            
            {/* All Bookmarks Tab */}
            <TabsContent value="all" className="space-y-4">
              {mockBookmarks.length > 0 ? (
                <div className="space-y-4">
                  {mockBookmarks.map((bookmark) => (
                    <div 
                      key={`${bookmark.type}-${bookmark.id}`} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getBookmarkIcon(bookmark.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{bookmark.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span>By {bookmark.authorName}</span>
                            <span className="mx-2">•</span>
                            <span>Bookmarked on {formatDate(bookmark.bookmarkedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No bookmarks found</h3>
                  <p className="text-gray-500 mb-4">
                    Start bookmarking posts, resources, and learning paths to access them quickly later
                  </p>
                  <Link href="/">
                    <Button>Explore content</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-4">
              {mockBookmarks.filter(b => b.type === "resource").length > 0 ? (
                <div className="space-y-4">
                  {mockBookmarks.filter(b => b.type === "resource").map((bookmark) => (
                    <div 
                      key={`${bookmark.type}-${bookmark.id}`} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getBookmarkIcon(bookmark.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{bookmark.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span>By {bookmark.authorName}</span>
                            <span className="mx-2">•</span>
                            <span>Bookmarked on {formatDate(bookmark.bookmarkedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No resource bookmarks yet</h3>
                  <p className="text-gray-500 mb-4">
                    Browse the repository and bookmark resources for quick access
                  </p>
                  <Link href="/resources">
                    <Button>Explore Resources</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Learning Paths Tab */}
            <TabsContent value="learningPaths" className="space-y-4">
              {mockBookmarks.filter(b => b.type === "learningPath").length > 0 ? (
                <div className="space-y-4">
                  {mockBookmarks.filter(b => b.type === "learningPath").map((bookmark) => (
                    <div 
                      key={`${bookmark.type}-${bookmark.id}`} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getBookmarkIcon(bookmark.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{bookmark.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span>By {bookmark.authorName}</span>
                            <span className="mx-2">•</span>
                            <span>Bookmarked on {formatDate(bookmark.bookmarkedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No learning path bookmarks yet</h3>
                  <p className="text-gray-500 mb-4">
                    Explore learning paths and bookmark them for your educational journey
                  </p>
                  <Link href="/learning-paths">
                    <Button>Explore Learning Paths</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Forum Posts Tab */}
            <TabsContent value="posts" className="space-y-4">
              {mockBookmarks.filter(b => b.type === "post").length > 0 ? (
                <div className="space-y-4">
                  {mockBookmarks.filter(b => b.type === "post").map((bookmark) => (
                    <div 
                      key={`${bookmark.type}-${bookmark.id}`} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getBookmarkIcon(bookmark.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{bookmark.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span>By {bookmark.authorName}</span>
                            <span className="mx-2">•</span>
                            <span>Bookmarked on {formatDate(bookmark.bookmarkedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No forum post bookmarks yet</h3>
                  <p className="text-gray-500 mb-4">
                    Participate in discussions and bookmark insightful posts
                  </p>
                  <Link href="/forum">
                    <Button>Join Discussions</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              {mockBookmarks.filter(b => b.type === "event").length > 0 ? (
                <div className="space-y-4">
                  {mockBookmarks.filter(b => b.type === "event").map((bookmark) => (
                    <div 
                      key={`${bookmark.type}-${bookmark.id}`} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getBookmarkIcon(bookmark.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{bookmark.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span>By {bookmark.authorName}</span>
                            <span className="mx-2">•</span>
                            <span>Bookmarked on {formatDate(bookmark.bookmarkedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No event bookmarks yet</h3>
                  <p className="text-gray-500 mb-4">
                    Discover upcoming events and bookmark them for your schedule
                  </p>
                  <Link href="/hub-events">
                    <Button>Explore Events</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            {/* Job Opportunities Tab */}
            <TabsContent value="jobs" className="space-y-4">
              {mockBookmarks.filter(b => b.type === "job").length > 0 ? (
                <div className="space-y-4">
                  {mockBookmarks.filter(b => b.type === "job").map((bookmark) => (
                    <div 
                      key={`${bookmark.type}-${bookmark.id}`} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getBookmarkIcon(bookmark.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                            {bookmark.title}
                          </h3>
                          <p className="text-gray-600 mt-1">{bookmark.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span>By {bookmark.authorName}</span>
                            <span className="mx-2">•</span>
                            <span>Bookmarked on {formatDate(bookmark.bookmarkedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No job opportunity bookmarks yet</h3>
                  <p className="text-gray-500 mb-4">
                    Browse career opportunities and bookmark interesting positions
                  </p>
                  <Link href="/career">
                    <Button>Explore Jobs</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button className="rounded-full w-14 h-14 shadow-lg bg-primary-600 hover:bg-primary-700" onClick={() => setIsPostModalOpen(true)}>
          <PlusCircle size={24} />
        </Button>
      </div>
    
      {/* Create Post Modal */}
      <PostFormModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </div>
  );
}
