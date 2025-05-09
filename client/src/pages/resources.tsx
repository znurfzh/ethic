import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Search, Download, Bookmark, Share2, ExternalLink, Clock, Tag, FileText, PlusCircle, 
         ImageIcon, HelpCircle, Link2, Plus, X, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Sample resource data
const mockResources = [
  {
    id: 1,
    title: "Community-Based Learning: Applying Educational Sociology in Practice",
    type: "PDF",
    description: "A case study on how social interactions and dynamics influence learning outcomes in community education initiatives",
    url: "#",
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorOrganization: "EdTech Solutions Indonesia",
    topics: ["Educational Sociology", "Community Learning", "Practical Application"],
    createdAt: "2024-02-15T10:30:00Z",
    downloadCount: 427,
    featured: true
  },
  {
    id: 2,
    title: "Mobile Learning: Best Practices for Indonesian Educators",
    type: "Video",
    description: "Learn how to effectively implement mobile learning strategies in various educational contexts",
    url: "#",
    authorId: 4,
    authorName: "Rizki Pratama",
    topics: ["Mobile Learning", "Instructional Design"],
    createdAt: "2024-03-05T14:45:00Z",
    downloadCount: 519
  },
  {
    id: 3,
    title: "Designing Effective Online Assessments",
    type: "Presentation",
    description: "Strategies and tools for creating engaging and effective online assessments for distance learning",
    url: "#", 
    authorId: 5,
    authorName: "Nia Putri",
    topics: ["Assessment", "Online Learning"],
    createdAt: "2024-01-22T09:15:00Z",
    downloadCount: 423
  },
  {
    id: 4,
    title: "Gamification Elements in Educational Apps",
    type: "PDF",
    description: "Research-based recommendations for integrating game mechanics into educational applications",
    url: "#",
    authorId: 6, 
    authorName: "Maya Anggraini",
    topics: ["Gamification", "App Development"],
    createdAt: "2024-04-10T11:00:00Z",
    downloadCount: 256
  },
  {
    id: 5,
    title: "Open Educational Resources for Indonesian Curriculum",
    type: "Website",
    description: "Curated collection of OERs aligned with Indonesian K-12 and higher education curricula",
    url: "#",
    authorId: 2,
    authorName: "Dr. Wulan Sari",
    topics: ["OER", "Curriculum Development"],
    createdAt: "2024-03-20T16:30:00Z",
    downloadCount: 178
  },
  {
    id: 6,
    title: "AI Tools for Educational Content Creation",
    type: "Tutorial",
    description: "Step-by-step guide to using AI tools for creating educational materials and assessments",
    url: "#",
    authorId: 4,
    authorName: "Rizki Pratama",
    topics: ["AI in Education", "Content Creation"],
    createdAt: "2024-04-05T13:20:00Z",
    downloadCount: 312
  }
];

// Sample topic data for filtering
const resourceTopics = [
  "Assessment",
  "AI in Education", 
  "App Development",
  "Content Creation",
  "Curriculum Development",
  "EdTech Tools",
  "Gamification",
  "Inclusive Education", 
  "Instructional Design",
  "Mobile Learning",
  "OER",
  "Online Learning"
];

export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  
  // Learning path and modules state
  const [createPathOpen, setCreatePathOpen] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<number | null>(null);
  const [showPathDetails, setShowPathDetails] = useState(false);
  const [learningPathForm, setLearningPathForm] = useState({
    title: "",
    description: "",
    duration: "medium",
    category: "technical",
    level: "intermediate",
    provideCertificate: true
  });
  
  // Mock learning path modules data
  const pathModules = [
    {
      id: 1,
      pathId: 2, // Digital Assessment Strategies path
      title: "Introduction to Digital Assessment",
      description: "Understanding the fundamentals of digital assessment in education",
      resourceId: 3, // Link to "Designing Effective Online Assessments" resource
      order: 1,
      type: "Reading",
      estimatedTime: "45 min",
      completed: true
    },
    {
      id: 2,
      pathId: 2,
      title: "Assessment Types and Tools",
      description: "Exploring different types of digital assessments and available tools",
      resourceId: 2, // Link to "Mobile Learning: Best Practices for Indonesian Educators" resource
      order: 2,
      type: "Video",
      estimatedTime: "1 hour",
      completed: true
    },
    {
      id: 3,
      pathId: 2,
      title: "Creating Effective Rubrics",
      description: "Learn to design clear and effective assessment rubrics",
      resourceId: 1, // Link to "Integrating Technology in Inclusive Classrooms" resource
      order: 3,
      type: "Interactive",
      estimatedTime: "1.5 hours",
      completed: true
    },
    {
      id: 4,
      pathId: 2,
      title: "Providing Meaningful Feedback",
      description: "Strategies for providing constructive feedback in digital environments",
      resourceId: 6, // Link to "AI Tools for Educational Content Creation" resource
      order: 4,
      type: "Discussion",
      estimatedTime: "1 hour",
      completed: true
    },
    {
      id: 5,
      pathId: 2,
      title: "Assessment Analytics",
      description: "Using data from digital assessments to improve teaching and learning",
      resourceId: 4, // Link to "Gamification Elements in Educational Apps" resource
      order: 5,
      type: "Project",
      estimatedTime: "2 hours",
      completed: false
    },
    {
      id: 6,
      pathId: 2,
      title: "Final Assessment",
      description: "Create your own comprehensive digital assessment strategy",
      resourceId: 5, // Link to "Open Educational Resources for Indonesian Curriculum" resource
      order: 6,
      type: "Assignment",
      estimatedTime: "3 hours",
      completed: false
    }
  ];

  const { data: resources = mockResources, isLoading } = useQuery({
    queryKey: ["/api/resources"],
    // This is mock data, so we're not actually fetching
    queryFn: () => Promise.resolve(mockResources),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort resources, ensuring Kari's resource (ID 1) is always at the top
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "All" || resource.type === typeFilter;
    
    const matchesTopic = topicFilter === "All" || 
      resource.topics.some(topic => topic === topicFilter);
    
    return matchesSearch && matchesType && matchesTopic;
  }).sort((a, b) => {
    // Always keep Kari's resource (ID 1) at the top
    if (a.id === 1) return -1;
    if (b.id === 1) return 1;
    
    // Then apply the regular sort
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "popular") {
      return b.downloadCount - a.downloadCount;
    }
    return 0;
  });

  const uniqueTypes = Array.from(new Set(resources.map(r => r.type)));

  return (
      <div className="w-full space-y-6">
        {/* Page Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">ThinkTank</h1>
              
        {/* Create New Post Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                // Logic to open post creation modal here
              }}
            >
              Share knowledge, resources, or ask a question...
            </div>
          </div>
          <div className="flex mt-3 border-t pt-3">
            <button className="flex items-center text-gray-600 mr-4">
              <FileText className="h-4 w-4 mr-1" />
              Article
            </button>
            <button className="flex items-center text-gray-600 mr-4">
              <ImageIcon className="h-4 w-4 mr-1" />
              Media
            </button>
            <button className="flex items-center text-gray-600 mr-4">
              <Link2 className="h-4 w-4 mr-1" />
              Resource
            </button>
            <button className="flex items-center text-gray-600">
              <HelpCircle className="h-4 w-4 mr-1" />
              Question
            </button>
          </div>
        </div>
        
        {/* ThinkTank Navigation Tabs */}
        <Tabs defaultValue="repository" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="repository">
              <FileText className="h-4 w-4 mr-2" />
              Repository
            </TabsTrigger>
            <TabsTrigger value="learningpaths">
              <BookOpen className="h-4 w-4 mr-2" />
              Learning Pathways
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="repository">
            {/* Repository Title and Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Educational Resources</h2>
              <p className="text-gray-600">Explore and share valuable educational technology resources with the community</p>
            </div>
          
            {/* Resource Search and Filter Bar */}
            <div className="mb-8">
              <div className="flex mb-4">
                <div className="relative flex-1 mr-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search resources..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="All Topics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Topics</SelectItem>
                      {resourceTopics.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Most Recent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("All");
                    setTopicFilter("All");
                  }}>
                    Reset Filters
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
              </div>
            </div>
              
            {/* Resource List */}
            <div className="space-y-6">
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-all">
                    <div className="flex justify-between items-start px-6 pt-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          {resource.id === 1 ? (
                            <Link href={`/resources/${resource.id}`}>
                              {resource.title}
                            </Link>
                          ) : (
                            <span onClick={(e) => {
                              e.preventDefault();
                              alert("This resource is not yet available. Only Kari's Community-Based Learning resource is accessible for this prototype.");
                            }} className="cursor-pointer">
                              {resource.title}
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {resource.description}
                        </p>
                      </div>
                      <Badge className="ml-2">{resource.type}</Badge>
                    </div>
                    
                    <div className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.topics.map((topic, i) => (
                          <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          By {resource.authorName === "Kari Dewanto" ? (
                            <Link href={`/hub?tab=members&user=${resource.authorId}`} className="text-primary-600 hover:underline ml-1">
                              {resource.authorName}
                            </Link>
                          ) : (
                            <span 
                              className="text-gray-600 ml-1 cursor-not-allowed"
                              onClick={(e) => {
                                e.preventDefault();
                                alert("Only Kari Dewanto's profile is available in this prototype.");
                              }}
                            >
                              {resource.authorName}
                            </span>
                          )}
                          {resource.authorRole && (
                            <span className="ml-1 text-xs text-gray-500">({resource.authorRole})</span>
                          )}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(resource.createdAt)}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {resource.downloadCount} downloads
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end px-6 py-4 border-t">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Bookmark className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" size="sm" className="mr-2">
                        <Share2 className="h-4 w-4 mr-1" /> Share
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No resources found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
        </div>
          </TabsContent>
          
          <TabsContent value="learningpaths">
            {/* Learning Pathways */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Learning Pathways</h2>
                <p className="text-gray-600">Structured learning journeys to help you master educational technology skills</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex items-center gap-2"
                  variant="outline"
                  onClick={() => {
                    // Trigger the Ethos Assistant with a predefined message
                    const ethosElement = document.getElementById('ethos-trigger');
                    if (ethosElement) {
                      ethosElement.click();
                      // You can dispatch a custom event to be caught by the EthosAssistant component
                      window.dispatchEvent(new CustomEvent('ethos-create-learning-path', {
                        detail: { message: "I'd like to create a custom learning pathway" }
                      }));
                    }
                  }}
                >
                  <HelpCircle className="h-4 w-4" />
                  AI Assistant
                </Button>
                
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setCreatePathOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Manually
                </Button>
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="mb-6 flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search learning paths..." 
                  className="pl-10 border-gray-300"
                />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="core">Core Skills</SelectItem>
                  <SelectItem value="technical">Technical Skills</SelectItem>
                  <SelectItem value="pedagogical">Pedagogical Skills</SelectItem>
                  <SelectItem value="community">Community Created</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="popular">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="duration-asc">Duration (Shortest)</SelectItem>
                  <SelectItem value="duration-desc">Duration (Longest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Learning Paths List View */}
            <div className="space-y-5">
              {/* Path 1 - System Core Skill */}
              <Card className="hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/3 p-5">
                    <div className="flex items-start gap-4">
                      <Badge className="h-6 bg-blue-100 text-blue-700 mt-1">Core Skill</Badge>
                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">Introduction to EdTech Tools</h3>
                          <Badge variant="outline" className="ml-2 text-xs">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Created by Dr. Wulan Sari
                            </span>
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">Master the essentials of educational technology tools for teaching and learning</p>
                        
                        <div className="mt-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500">Progress</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <Progress value={35} className="h-2 w-full max-w-md" />
                        </div>
                        
                        <div className="flex flex-wrap gap-6 mt-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">8 modules</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">4 weeks</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-sm">123 learners enrolled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 p-5 flex items-center bg-gray-50 lg:border-l border-t lg:border-t-0">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                          </svg>
                          Beginner Level
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                          </svg>
                          Certificate
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          className="w-full" 
                          variant="default"
                          onClick={() => {
                            // In a real app, this would be linked to the actual learning path
                          }}
                        >
                          View Modules
                        </Button>
                        <Button className="w-full" variant="outline">Continue Learning</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Path 2 - System Technical Skill - This path can be expanded */}
              <Card className={`hover:shadow-md transition-all ${selectedPathId === 2 ? 'ring-2 ring-primary-500' : ''}`}>
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/3 p-5">
                    <div className="flex items-start gap-4">
                      <Badge className="h-6 bg-purple-100 text-purple-700 mt-1">Technical Skill</Badge>
                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">Digital Assessment Strategies</h3>
                          <Badge variant="outline" className="ml-2 text-xs">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Created by Nia Putri
                            </span>
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">Learn to create and implement effective digital assessments for various contexts</p>
                        
                        <div className="mt-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500">Progress</span>
                            <span className="text-sm font-medium">75%</span>
                          </div>
                          <Progress value={75} className="h-2 w-full max-w-md" />
                        </div>
                        
                        <div className="flex flex-wrap gap-6 mt-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">6 modules</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">3 weeks</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-sm">98 learners enrolled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 p-5 flex items-center bg-gray-50 lg:border-l border-t lg:border-t-0">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-orange-100 text-orange-700 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                          </svg>
                          Intermediate Level
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                          </svg>
                          Certificate
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {selectedPathId === 2 ? (
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => setSelectedPathId(null)}
                          >
                            Hide Details
                          </Button>
                        ) : (
                          <Button 
                            className="w-full" 
                            variant="default"
                            onClick={() => {
                              setSelectedPathId(2);
                              // Scroll to this element after state update
                              setTimeout(() => {
                                const element = document.getElementById('path-details');
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              }, 100);
                            }}
                          >
                            View Modules
                          </Button>
                        )}
                        <Button className="w-full" variant="outline">Continue Learning</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Path Modules Section (Expanded) */}
                {selectedPathId === 2 && (
                  <div id="path-details" className="border-t border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Learning Path Modules</h3>
                      <div className="text-sm text-gray-500">4 of 6 completed</div>
                    </div>
                    
                    <div className="space-y-4">
                      {pathModules.filter(module => module.pathId === 2).map(module => {
                        // Find the associated resource
                        const resource = resources.find(r => r.id === module.resourceId);
                        
                        return (
                          <div 
                            key={module.id} 
                            className={`p-4 border rounded-lg ${
                              module.completed 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`flex items-center justify-center h-6 w-6 rounded-full mr-3 mt-1 flex-shrink-0 ${
                                module.completed 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {module.order}
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex flex-wrap items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{module.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 ml-2">
                                    <Badge variant="outline" className="bg-gray-50">
                                      {module.type}
                                    </Badge>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {module.estimatedTime}
                                    </Badge>
                                  </div>
                                </div>
                                
                                {resource && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-start">
                                      <FileText className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                                      <div>
                                        <div className="font-medium text-sm">Resource: {resource.title}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          By {resource.authorName} • {resource.type} • 
                                          <span className="ml-1 text-blue-600 hover:underline cursor-pointer">
                                            View Resource
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <Button 
                                size="sm" 
                                variant={module.completed ? "outline" : "default"} 
                                className="ml-2 shrink-0"
                              >
                                {module.completed ? "Completed" : "Start"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
              
              {/* Path 3 - Community Created */}
              <Card className="hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/3 p-5">
                    <div className="flex items-start gap-4">
                      <Badge className="h-6 bg-green-100 text-green-700 mt-1">Community Created</Badge>
                      <div className="w-full">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-gray-900">AI in Education</h3>
                          <Badge variant="outline" className="ml-2 text-xs">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Created by Rizki Pratama
                            </span>
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">Explore how artificial intelligence is transforming educational practices</p>
                        
                        <div className="mt-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500">Progress</span>
                            <span className="text-sm font-medium">0%</span>
                          </div>
                          <Progress value={0} className="h-2 w-full max-w-md" />
                        </div>
                        
                        <div className="flex flex-wrap gap-6 mt-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">10 modules</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">6 weeks</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen className="h-4 w-4" />
                            <span className="text-sm">45 learners enrolled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3 p-5 flex items-center bg-gray-50 lg:border-l border-t lg:border-t-0">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
                          </svg>
                          Advanced Level
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                          </svg>
                          Certificate
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          className="w-full" 
                          variant="default"
                          onClick={() => {
                            // In a real app, this would be linked to the actual learning path
                          }}
                        >
                          View Modules
                        </Button>
                        <Button className="w-full" variant="outline">Start Learning</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Create Learning Path Dialog */}
            <Dialog open={createPathOpen} onOpenChange={setCreatePathOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Learning Path</DialogTitle>
                  <DialogDescription>
                    Design a structured learning journey to help others master educational technology skills
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Mobile Learning Implementation Strategies"
                      value={learningPathForm.title}
                      onChange={(e) => setLearningPathForm({...learningPathForm, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a brief overview of what learners will achieve through this path"
                      value={learningPathForm.description}
                      onChange={(e) => setLearningPathForm({...learningPathForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Duration</Label>
                    <RadioGroup 
                      value={learningPathForm.duration}
                      onValueChange={(value) => setLearningPathForm({...learningPathForm, duration: value})}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="short" id="duration-short" />
                        <Label htmlFor="duration-short" className="font-normal">Short (2-4 weeks)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="duration-medium" />
                        <Label htmlFor="duration-medium" className="font-normal">Medium (1-2 months)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="long" id="duration-long" />
                        <Label htmlFor="duration-long" className="font-normal">Long (3+ months)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={learningPathForm.category}
                      onValueChange={(value) => setLearningPathForm({...learningPathForm, category: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="core">Core Skill</SelectItem>
                        <SelectItem value="technical">Technical Skill</SelectItem>
                        <SelectItem value="pedagogical">Pedagogical Skill</SelectItem>
                        <SelectItem value="research">Research Methodology</SelectItem>
                        <SelectItem value="design">Instructional Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="level">Skill Level</Label>
                    <Select
                      value={learningPathForm.level}
                      onValueChange={(value) => setLearningPathForm({...learningPathForm, level: value})}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="certificate"
                      checked={learningPathForm.provideCertificate}
                      onChange={(e) => setLearningPathForm({...learningPathForm, provideCertificate: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="certificate" className="font-normal">Provide certificate upon completion</Label>
                  </div>
                </div>
                
                <DialogFooter className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="flex items-center">
                      <Plus className="h-4 w-4 mr-1" />
                      You'll be able to add milestones in the next step
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCreatePathOpen(false)}>Cancel</Button>
                    <Button>Create & Continue</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
  );
}