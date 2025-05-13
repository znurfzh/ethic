import AppLayout from "@/components/app-layout";

import MentorshipConnection from "@/components/MentorshipConnection";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { 
  Search, Filter, Award, MessageSquare, Star, BarChart, Calendar, 
  MapPin, Briefcase, GraduationCap, School, ChevronDown, Heart, Users, 
  UserPlus, BookOpen
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock mentors data
const mockMentors = [
  {
    id: 1,
    name: "Kari Nugraha",
    role: "Educational Technology Specialist",
    organization: "EdTech Solutions Inc.",
    avatarUrl: null,
    expertise: ["Learning Design", "Educational Sociology", "Community Learning"],
    experience: "7 years",
    rating: 4.9,
    reviewCount: 28,
    bio: "Educational technologist with expertise in applying sociology principles to community-based learning initiatives. I help educators design effective learning environments that leverage social dynamics.",
    availability: "2-3 hours/week",
    location: "Jakarta",
    isAlumni: true,
    graduationYear: 2016,
    university: "University of Indonesia",
    tags: ["Community Learning", "Educational Sociology", "Digital Learning"]
  },
  {
    id: 2,
    name: "Dr. Ahmad Wijaya",
    role: "Associate Professor",
    organization: "University of Indonesia",
    avatarUrl: null,
    expertise: ["Digital Resources", "Curriculum Development", "Research Methods"],
    experience: "15 years",
    rating: 4.8,
    reviewCount: 47,
    bio: "Associate Professor specializing in digital textbook development and implementation. My research focuses on interactive learning resources and their impact on student engagement.",
    availability: "1-2 hours/week",
    location: "Jakarta",
    isAlumni: false,
    faculty: true,
    department: "Educational Technology",
    tags: ["Digital Resources", "Curriculum Development", "Educational Research"]
  },
  {
    id: 3,
    name: "Siti Rahayu",
    role: "Learning Experience Designer",
    organization: "EduLab Indonesia",
    avatarUrl: null,
    expertise: ["UI/UX for Learning", "Gamification", "Instructional Design"],
    experience: "5 years",
    rating: 4.7,
    reviewCount: 19,
    bio: "Learning experience designer passionate about creating engaging educational interfaces. I specialize in gamification principles and user-centered design for educational applications.",
    availability: "3-4 hours/week",
    location: "Bandung",
    isAlumni: true,
    graduationYear: 2018,
    university: "Bandung Institute of Technology",
    tags: ["Gamification", "UI/UX", "Instructional Design"]
  },
  {
    id: 4,
    name: "Budi Santoso",
    role: "Game-Based Learning Specialist",
    organization: "Edutainment Studios",
    avatarUrl: null,
    expertise: ["Educational Game Design", "Assessment in Games", "Digital Storytelling"],
    experience: "6 years",
    rating: 4.6,
    reviewCount: 22,
    bio: "Educational game designer focused on creating meaningful learning experiences through gameplay. I help educators integrate game-based approaches to achieve learning objectives.",
    availability: "2-3 hours/week",
    location: "Surabaya",
    isAlumni: true,
    graduationYear: 2017,
    university: "Surabaya State University",
    tags: ["Game-Based Learning", "Digital Storytelling", "Assessment Design"]
  },
  {
    id: 5,
    name: "Maya Putri",
    role: "Corporate Learning Manager",
    organization: "TechGlobal Indonesia",
    avatarUrl: null,
    expertise: ["Corporate Training", "Adult Learning", "Leadership Development"],
    experience: "9 years",
    rating: 4.8,
    reviewCount: 31,
    bio: "Corporate learning specialist with experience designing and implementing training programs for technology companies. I help professionals enhance their skills and career development.",
    availability: "1-2 hours/week",
    location: "Jakarta",
    isAlumni: true,
    graduationYear: 2014,
    university: "University of Indonesia",
    tags: ["Corporate Training", "Professional Development", "Leadership"]
  }
];

// Mock mentees data for the "Your Mentees" tab
const mockMentees = [
  {
    id: 101,
    name: "Maya Pratama",
    role: "3rd Year Student",
    organization: "University of Indonesia",
    avatarUrl: null,
    interests: ["Educational Sociology", "Community Learning", "Digital Textbooks"],
    bio: "Passionate educational technology student seeking guidance on applying theoretical concepts to real-world scenarios. Particularly interested in community-based learning approaches.",
    status: "Active",
    program: "Bachelor of Educational Technology",
    university: "University of Indonesia",
    connectDate: "2023-03-15"
  },
  {
    id: 102,
    name: "Rina Sari",
    role: "4th Year Student",
    organization: "Jakarta State University",
    avatarUrl: null,
    interests: ["Educational Game Design", "Mobile Learning", "Assessment"],
    bio: "Final year student working on a thesis about assessment strategies in educational games. Looking for mentorship on research methods and industry connections.",
    status: "Active",
    program: "Bachelor of Educational Technology",
    university: "Jakarta State University",
    connectDate: "2023-01-10"
  }
];

// Demo connection between Maya and Kari based on user story
const demoConnection = {
  mentor: mockMentors[0], // Kari
  mentee: mockMentees[0], // Maya
  status: "Active",
  messages: [
    {
      id: 1,
      sender: "mentee",
      content: "Hello Kari, I'm Maya, a third-year student in the Educational Technology program. I read your case study on community-based learning and was really impressed. I'm currently taking Educational Sociology and struggling to see how to apply it in practical situations. Would you have time to discuss your work and share some insights?",
      timestamp: "2023-03-15T13:24:00Z"
    },
    {
      id: 2,
      sender: "mentor",
      content: "Hi Maya! Thank you for reaching out. I'd be happy to discuss my work with you and share how I've applied sociological concepts in learning design. Educational Sociology can seem theoretical, but it has powerful applications. Let's set up a time to talk about your specific challenges and interests.",
      timestamp: "2023-03-15T14:10:00Z" 
    },
    {
      id: 3,
      sender: "mentee",
      content: "That would be wonderful! I'm especially interested in your community-based learning initiative. In my course, we're studying social interactions and dynamics, but I'm having trouble visualizing how these concepts translate to real educational settings.",
      timestamp: "2023-03-15T14:30:00Z"
    },
    {
      id: 4,
      sender: "mentor",
      content: "I understand that challenge. In my experience, the best way to grasp these concepts is through concrete examples. When are you available for a short video call? I can walk you through a specific project where we designed learning activities based on community dynamics and social interaction patterns.",
      timestamp: "2023-03-15T15:05:00Z"
    },
    {
      id: 5,
      sender: "mentee",
      content: "I'm available this Thursday afternoon or Friday morning. A video call sounds perfect! I really appreciate your willingness to help.",
      timestamp: "2023-03-15T15:20:00Z"
    }
  ],
  meetings: [
    {
      id: 1,
      title: "Initial Mentorship Discussion",
      date: "2023-03-17T14:00:00Z",
      duration: 45,
      type: "Video Call",
      status: "Completed",
      notes: "Discussed application of sociological concepts in community learning. Kari shared examples from her project with rural communities in East Java."
    },
    {
      id: 2,
      title: "Follow-up on Project Ideas",
      date: "2023-03-31T14:00:00Z",
      duration: 30,
      type: "Video Call",
      status: "Scheduled"
    }
  ],
  goals: [
    {
      id: 1,
      title: "Understand practical applications of Educational Sociology",
      progress: 60,
      deadline: "2023-04-30T00:00:00Z"
    },
    {
      id: 2,
      title: "Develop research project proposal",
      progress: 25,
      deadline: "2023-05-15T00:00:00Z"
    },
    {
      id: 3,
      title: "Build portfolio with community learning project",
      progress: 10,
      deadline: "2023-06-30T00:00:00Z"
    }
  ]
};

export default function MentorshipPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("All");
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [activeConnectionTab, setActiveConnectionTab] = useState("chat");
  const [mentorshipRequestSuccess, setMentorshipRequestSuccess] = useState(false);
  
  // Get the request parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const requestedMentor = urlParams.get("request");
  
  // For the Maya-Kari demo connection
  const [showDemoConnection, setShowDemoConnection] = useState(!!requestedMentor || false);
  
  // Filter mentors based on search term and expertise
  const filteredMentors = mockMentors.filter(mentor => {
    // Search name and bio
    const matchesSearch = searchTerm === "" || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by expertise
    const matchesExpertise = expertiseFilter === "All" || 
      mentor.expertise.some(exp => exp === expertiseFilter) ||
      mentor.tags.some(tag => tag === expertiseFilter);
    
    return matchesSearch && matchesExpertise;
  });
  
  // Get all unique expertise areas for filter dropdown
  const expertiseAreas = ["All"];
  mockMentors.forEach(mentor => {
    mentor.expertise.forEach(exp => {
      if (!expertiseAreas.includes(exp)) {
        expertiseAreas.push(exp);
      }
    });
  });
  
  const handleMentorSelect = (mentor: any) => {
    setSelectedMentor(mentor);
    
    // If this is Kari (mentor id 1), enable the demo connection view
    if (mentor.id === 1) {
      setShowDemoConnection(true);
    } else {
      setShowDemoConnection(false);
    }
  };
  
  const handleConnectionComplete = () => {
    // This will be called when the MentorshipConnection component signals completion
    setShowDemoConnection(true);
    setMentorshipRequestSuccess(true);
  };
  
  return (
    <AppLayout>
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Career</h1>
          </div>
          
          {/* Career Navigation Tabs */}
          <div className="w-full mb-6 flex border-b">
            <Link href="/career" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600">
              Resources
            </Link>
            <Link href="/mentorship" className="px-4 py-2 font-medium text-primary-600 border-b-2 border-primary-600">
              Mentorship
            </Link>
          </div>
          
          {/* Mentorship Title and Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mentorship Program</h2>
            <p className="text-gray-600">Connect with mentors and grow your skills and career</p>
          </div>
          
          {/* Mentorship Dashboard */}
          {/* Show mentorship request confirmation if coming from a request */}
          {requestedMentor && !mentorshipRequestSuccess && (
            <div className="mb-6">
              <Card className="border border-primary-200 bg-primary-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-full">
                      <Award className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Request mentorship from Kari Nugraha
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Kari is an Educational Technology Specialist with expertise in community learning and educational sociology. Send a personalized message to request mentorship.
                      </p>
                      <Button 
                        className="bg-gradient-to-r from-primary-600 to-primary-500"
                        onClick={() => {
                          setMentorshipRequestSuccess(true);
                          // Schedule tab switch after state update
                          setTimeout(() => {
                            document.getElementById('your-mentors-tab')?.click();
                          }, 100);
                        }}
                      >
                        Send Mentorship Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Show success message after sending request */}
          {mentorshipRequestSuccess && (
            <div className="mb-6">
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-full">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Mentorship request sent successfully!
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Your request has been sent to Kari Nugraha. You can now view your mentorship in the Your Mentors tab.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        
          <Tabs defaultValue={mentorshipRequestSuccess ? "your-mentors" : "find-mentors"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-6">
              <TabsTrigger value="find-mentors" className="px-4 py-2">
                <Search className="h-4 w-4 mr-2" />
                Find Mentors
              </TabsTrigger>
              <TabsTrigger value="your-mentors" className="px-4 py-2">
                <GraduationCap className="h-4 w-4 mr-2" />
                Your Mentors
              </TabsTrigger>
              <TabsTrigger value="your-mentees" className="px-4 py-2">
                <UserPlus className="h-4 w-4 mr-2" />
                Your Mentees
              </TabsTrigger>
            </TabsList>
            
            {/* Find Mentors Tab */}
            <TabsContent value="find-mentors">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Search and filters */}
                <div className="lg:col-span-1 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Find the right mentor</CardTitle>
                      <CardDescription>Search for mentors based on expertise, background, or keywords</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search mentors..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Filter by expertise</label>
                        <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="All expertise areas" />
                          </SelectTrigger>
                          <SelectContent>
                            {expertiseAreas.map((area, index) => (
                              <SelectItem key={index} value={area}>{area}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Why find a mentor?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <GraduationCap className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Academic guidance</h4>
                          <p className="text-sm text-gray-600">Get help with coursework and research projects</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <BookOpen className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Practical insights</h4>
                          <p className="text-sm text-gray-600">Learn how to apply theoretical knowledge</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <Briefcase className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Career development</h4>
                          <p className="text-sm text-gray-600">Prepare for your future professional path</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary-100 p-2 rounded-full">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Networking</h4>
                          <p className="text-sm text-gray-600">Build valuable connections in your field</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right column - Mentor listings and details */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedMentor ? (
                    <div className="space-y-6">
                      <div>
                        <Button variant="outline" onClick={() => setSelectedMentor(null)}>
                          Back to list
                        </Button>
                      </div>
                      
                      <MentorshipConnection 
                        mentorId={selectedMentor.id}
                        mentorName={selectedMentor.name}
                        mentorRole={selectedMentor.role}
                        mentorAvatar={selectedMentor.avatarUrl}
                        isConnected={selectedMentor.id === 1}
                        onComplete={handleConnectionComplete}
                      />
                      
                      {/* Keep original dialog hidden for compatibility */}
                      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="hidden">Request Mentorship</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Mentorship from {selectedMentor.name}</DialogTitle>
                            <DialogDescription>
                              Send a personalized message explaining why you'd like to connect and what you hope to learn.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Your message</label>
                              <Textarea 
                                placeholder="Introduce yourself and explain what you hope to learn..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                rows={6}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" id="consent" className="rounded" />
                              <label htmlFor="consent" className="text-sm">I understand that mentors volunteer their time and will respect their availability</label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={() => {
                              setRequestDialogOpen(false);
                              setShowDemoConnection(true);
                              setMentorshipRequestSuccess(true);
                            }}>
                              Send Request
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    // Mentor listings
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                          Available Mentors 
                          <span className="text-gray-500 text-sm ml-2 font-normal">
                            ({filteredMentors.length} mentors)
                          </span>
                        </h2>
                      </div>
                      
                      {filteredMentors.map(mentor => (
                        <Card 
                          key={mentor.id} 
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() => handleMentorSelect(mentor)}
                        >
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-xl bg-primary-100 text-primary-600">
                                  {mentor.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-grow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                  <div>
                                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                                    <p className="text-gray-600">{mentor.role} at {mentor.organization}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {mentor.expertise.slice(0, 3).map((skill, i) => (
                                        <Badge key={i} variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end">
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                      <span className="font-medium">{mentor.rating}</span>
                                      <span className="text-gray-500 text-sm ml-1">({mentor.reviewCount})</span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      <span className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" /> {mentor.location}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 mt-3 line-clamp-2">{mentor.bio}</p>
                                
                                <div className="mt-4 flex flex-wrap justify-between items-center">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Available {mentor.availability}</span>
                                  </div>
                                  
                                  {mentor.isAlumni && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      Alumni • {mentor.graduationYear}
                                    </Badge>
                                  )}
                                  
                                  {mentor.faculty && (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                      Faculty • {mentor.department}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Your Mentors Tab */}
            <TabsContent value="your-mentors">
              <div className="space-y-6">
                {showDemoConnection ? (
                  <Card>
                    <CardContent className="p-6">
                      <MentorshipConnection 
                        mentorId={demoConnection.mentor.id}
                        mentorName={demoConnection.mentor.name}
                        mentorRole={demoConnection.mentor.role}
                        mentorAvatar={demoConnection.mentor.avatarUrl || ""}
                        isConnected={true}
                        onComplete={() => {}}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="py-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <UserPlus className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors yet</h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any active mentorship connections. Find a mentor to get started!
                    </p>
                    <Button onClick={() => document.querySelector('[data-state="inactive"][data-value="find-mentors"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    )}>
                      Find Mentors
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Your Mentees Tab */}
            <TabsContent value="your-mentees">
              <div className="space-y-6">
                {mockMentees.length > 0 ? (
                  mockMentees.map(mentee => (
                    <Card key={mentee.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl bg-primary-100 text-primary-600">
                              {mentee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{mentee.name}</h3>
                                <p className="text-gray-600">{mentee.role} at {mentee.organization}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {mentee.interests.slice(0, 3).map((interest, i) => (
                                    <Badge key={i} variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <Badge className="mt-2 sm:mt-0 bg-green-100 text-green-800 border-green-200 self-start">
                                {mentee.status}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-700 mt-3">{mentee.bio}</p>
                            
                            <div className="mt-4 flex flex-wrap gap-4">
                              <Button>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button variant="outline">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Meeting
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Heart className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No mentees yet</h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any mentees yet. When students request your mentorship, they'll appear here.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Hidden button for programmatically switching to your-mentors tab */}
      <button 
        id="your-mentors-tab" 
        className="hidden"
        onClick={() => {
          // This will be triggered when mentorship request is successful
          const yourMentorsTab = document.querySelector('[data-state="inactive"][data-value="your-mentors"]');
          if (yourMentorsTab) {
            (yourMentorsTab as HTMLElement).click();
          }
        }}
      ></button>
    </AppLayout>
  );
}