import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  Clock,
  Laptop,
  MessageCircle,
  MessageSquare,
  PenTool,
  PlusCircle,
  Reply,
  Search,
  Share2,
  ThumbsUp,
  TrendingUp,
  Video,
  Zap,
  Bookmark,
  Send,
  Briefcase,
  Mail,
  MapPin,
  Users,
  GraduationCap,
  Award,
} from "lucide-react";

// Sample forum data
const forumTopics = [
  {
    id: "instructional-design",
    name: "Instructional Design",
    color: "blue",
    count: 34,
    icon: <PenTool className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "ed-technology",
    name: "Educational Technology",
    color: "purple",
    count: 23,
    icon: <Laptop className="h-5 w-5 text-purple-500" />,
  },
  {
    id: "multimedia-learning",
    name: "Multimedia Learning",
    color: "pink",
    count: 17,
    icon: <Video className="h-5 w-5 text-pink-500" />,
  },
  {
    id: "learning-analytics",
    name: "Learning Analytics",
    color: "green",
    count: 12,
    icon: <TrendingUp className="h-5 w-5 text-green-500" />,
  },
  {
    id: "innovation",
    name: "Innovation & Research",
    color: "orange",
    count: 9,
    icon: <Zap className="h-5 w-5 text-orange-500" />,
  },
];

// Sample forum threads
const forumThreads = [
  {
    id: 1,
    title: "Best practices for designing effective online quizzes?",
    content:
      "I'm designing a series of online quizzes for university students and want to ensure they're effective for learning rather than just assessment. What are some best practices you've found that work well?",
    authorId: 1,
    authorName: "Maya Pratama",
    authorRole: "Student",
    authorAvatar: null,
    topicId: "instructional-design",
    tags: ["online-quizzes", "assessment", "higher-education"],
    createdAt: "2025-04-15T08:30:00Z",
    views: 324,
    likes: 28,
    comments: 12,
    isPinned: true,
    isHot: true,
    lastActivity: "2025-04-18T14:20:00Z",
  },
  {
    id: 2,
    title: "Recommendations for learning analytics tools for K-12 schools?",
    content:
      "Our school is looking to implement a learning analytics solution to better track student progress. Has anyone used any tools they would recommend? We're particularly interested in something that integrates well with our existing LMS.",
    authorId: 2,
    authorName: "Dr. Wulan Sari",
    authorRole: "Faculty",
    authorAvatar: null,
    topicId: "learning-analytics",
    tags: ["learning-analytics", "k-12", "tools"],
    createdAt: "2025-04-14T15:45:00Z",
    views: 289,
    likes: 34,
    comments: 18,
    isPinned: false,
    isHot: true,
    lastActivity: "2025-04-18T09:15:00Z",
  },
  {
    id: 3,
    title: "Transitioning from educational to corporate instructional design",
    content:
      "I'm a student about to graduate with a degree in Educational Technology. I'm interested in pursuing a career in corporate instructional design. What are the key differences between educational and corporate settings? Any advice for making this transition successfully?",
    authorId: 1,
    authorName: "Maya Pratama",
    authorRole: "Student",
    authorAvatar: null,
    topicId: "instructional-design",
    tags: ["career-transition", "corporate-training", "portfolio"],
    createdAt: "2025-04-12T10:15:00Z",
    views: 412,
    likes: 47,
    comments: 24,
    isPinned: false,
    isHot: true,
    lastActivity: "2025-04-17T16:30:00Z",
  },
  {
    id: 4,
    title: "Industry tools for e-learning development in 2025",
    content:
      "I'm currently mentoring a few students who are transitioning to industry roles. I'd like to get perspectives from other practitioners about which tools are currently most in-demand for e-learning development. Which tools should new instructional designers prioritize learning?",
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorAvatar: null,
    topicId: "ed-technology",
    tags: ["e-learning", "industry-tools", "professional-development"],
    createdAt: "2025-04-08T13:45:00Z",
    views: 376,
    likes: 42,
    comments: 31,
    isPinned: false,
    isHot: true,
    lastActivity: "2025-04-16T11:20:00Z",
  },
  {
    id: 5,
    title: "Portfolio advice for new instructional designers",
    content:
      "I'm working with a mentee who is building their portfolio for industry roles. What types of projects do hiring managers want to see in an instructional design portfolio? Any advice on how to showcase academic projects in a way that appeals to corporate recruiters?",
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorAvatar: null,
    topicId: "instructional-design",
    tags: ["portfolio", "job-search", "career-development"],
    createdAt: "2025-04-03T09:30:00Z",
    views: 298,
    likes: 36,
    comments: 22,
    isPinned: false,
    isHot: false,
    lastActivity: "2025-04-14T10:45:00Z",
  },
  {
    id: 6,
    title: "Using AI for personalized learning pathways",
    content:
      "I'm researching how AI can be used to create adaptive learning pathways for students. Has anyone implemented AI-driven personalization in their educational technology projects? Looking for both theoretical frameworks and practical implementation examples.",
    authorId: 4,
    authorName: "Arti Hanani",
    authorRole: "Student",
    authorAvatar: null,
    topicId: "learning-analytics",
    tags: ["AI", "personalization", "adaptive-learning"],
    createdAt: "2025-04-01T14:20:00Z",
    views: 267,
    likes: 29,
    comments: 16,
    isPinned: false,
    isHot: false,
    lastActivity: "2025-04-12T15:10:00Z",
  },
  {
    id: 7,
    title: "Engaging interactive activities for mobile learning",
    content:
      "I'm working on a project to develop mobile learning modules for university students. What are some effective interactive activities that work well on mobile devices? Looking for ideas beyond simple quizzes and flashcards that maintain engagement while being mobile-friendly.",
    authorId: 1,
    authorName: "Maya Pratama",
    authorRole: "Student",
    authorAvatar: null,
    topicId: "multimedia-learning",
    tags: ["mobile-learning", "interactivity", "engagement"],
    createdAt: "2025-03-27T11:05:00Z",
    views: 325,
    likes: 38,
    comments: 27,
    isPinned: false,
    isHot: false,
    lastActivity: "2025-04-09T13:30:00Z",
  }
];

// Sample member data
const mockMembers = [
  {
    id: 2,
    name: "Dr. Wulan Sari",
    username: "wulansari",
    role: "Faculty",
    organization: "Universitas Indonesia",
    location: "Jakarta, Indonesia",
    tags: ["Adaptive Learning", "EdTech Research", "AI in Education"],
    bio: "Professor of Educational Technology with 15 years experience in adaptive learning systems and AI applications in education. Open to mentoring students interested in educational research.",
    isMentor: true,
    mentees: 3,
    avatar: null,
  },
  {
    id: 3,
    name: "Kari Dewanto",
    username: "karidew",
    role: "Alumni",
    organization: "EdTech Solutions Indonesia",
    location: "Bandung, Indonesia",
    tags: ["Instructional Design", "E-Learning", "Content Development"],
    bio: "Instructional designer with 5 years of industry experience, specializing in corporate e-learning solutions. Currently mentoring junior designers and students interested in breaking into the industry.",
    isMentor: true,
    mentees: 2,
    avatar: null,
  },
  {
    id: 4,
    name: "Arti Hanani",
    username: "artihanani",
    role: "Student",
    organization: "Universitas Pendidikan Indonesia",
    location: "Bandung, Indonesia",
    tags: ["Educational Assessment", "Learning Analytics", "Data Visualization"],
    bio: "Educational technology graduate student researching learning analytics and assessment methods. Seeking guidance in data analytics applications in education.",
    isMentor: false,
    avatar: null,
  },
  {
    id: 5,
    name: "Dr. Iman Santoso",
    username: "imansantoso",
    role: "Faculty",
    organization: "Universitas Gadjah Mada",
    location: "Yogyakarta, Indonesia",
    tags: ["Learning Design", "Digital Literacy", "Higher Education"],
    bio: "Associate Professor specializing in digital literacy and learning design for higher education. Open to collaborating with students on research projects.",
    isMentor: true,
    mentees: 4,
    avatar: null,
  },
  {
    id: 6,
    name: "Mira Puspita",
    username: "mirapuspita",
    role: "Practitioner",
    organization: "Ministry of Education",
    location: "Jakarta, Indonesia",
    tags: ["Educational Policy", "Teacher Training", "Rural Education"],
    bio: "Educational policy advisor working on technology implementation in rural schools. Passionate about bridging the digital divide in Indonesian education.",
    isMentor: true,
    mentees: 1,
    avatar: null,
  }
];

// Mentorship data
const mentorshipPrograms = [
  {
    id: 1,
    title: "Instructional Design Career Pathways",
    description: "A structured mentorship program to help students transition into instructional design roles in the industry or academic settings.",
    mentor: {
      id: 3,
      name: "Kari Dewanto",
      role: "Alumni",
      organization: "EdTech Solutions Indonesia",
      avatar: null
    },
    duration: "3 months",
    commitment: "4 hours/week",
    topics: ["Portfolio Development", "Industry Tools", "Design Methodologies", "Client Management"],
    openings: 1,
    mentees: [
      {
        id: 8,
        name: "Maya Pratama",
        progress: 65,
        startDate: "2025-03-15T00:00:00Z",
        status: "active"
      }
    ]
  },
  {
    id: 2,
    title: "AI in Educational Research",
    description: "Learn how to apply AI methodologies in educational research and develop machine learning models for learning analytics.",
    mentor: {
      id: 2,
      name: "Dr. Wulan Sari",
      role: "Faculty",
      organization: "Universitas Indonesia",
      avatar: null
    },
    duration: "6 months",
    commitment: "6 hours/week",
    topics: ["Research Methodologies", "Data Analysis", "Machine Learning Basics", "Publication Strategies"],
    openings: 1,
    mentees: [
      {
        id: 4,
        name: "Arti Hanani",
        progress: 35,
        startDate: "2025-02-01T00:00:00Z",
        status: "active"
      }
    ]
  },
  {
    id: 3,
    title: "Digital Literacy for Teachers",
    description: "A program to help new educational technology graduates develop workshops and training materials for teacher professional development.",
    mentor: {
      id: 5,
      name: "Dr. Iman Santoso",
      role: "Faculty",
      organization: "Universitas Gadjah Mada",
      avatar: null
    },
    duration: "4 months",
    commitment: "3 hours/week",
    topics: ["Workshop Design", "Assessment Creation", "Training Materials", "Facilitation Skills"],
    openings: 2,
    mentees: []
  },
  {
    id: 4,
    title: "EdTech for Rural Schools",
    description: "Work on projects to implement educational technology solutions in rural and under-resourced Indonesian schools.",
    mentor: {
      id: 6,
      name: "Mira Puspita",
      role: "Practitioner",
      organization: "Ministry of Education",
      avatar: null
    },
    duration: "6 months",
    commitment: "5 hours/week",
    topics: ["Context Analysis", "Low-Tech Solutions", "Community Engagement", "Impact Assessment"],
    openings: 2,
    mentees: [
      {
        id: 7,
        name: "Budi Hidayat",
        progress: 75,
        startDate: "2025-01-10T00:00:00Z",
        status: "active"
      }
    ]
  }
];

// Mentorship meetings and milestones for Kari and Maya
const kariAndMayaMentorship = {
  program: "Instructional Design Career Pathways",
  mentor: "Kari Dewanto",
  mentee: "Maya Pratama",
  startDate: "2025-03-15T00:00:00Z",
  endDate: "2025-06-15T00:00:00Z",
  status: "active",
  completedMilestones: [
    {
      id: 1,
      title: "Initial Assessment & Goal Setting",
      description: "Evaluate current skills and set specific career goals",
      completedDate: "2025-03-18T00:00:00Z",
      feedback: "Maya has strong technical skills but needs to develop more industry awareness. We've set clear goals focusing on portfolio development and industry tool proficiency."
    },
    {
      id: 2,
      title: "Learning Path Creation",
      description: "Create personalized learning path and timeline",
      completedDate: "2025-03-25T00:00:00Z",
      feedback: "We've mapped out a comprehensive learning path focusing on industry tools, design methodologies, and practical project work. Maya is enthusiastic and committed to the schedule."
    },
    {
      id: 3,
      title: "Portfolio Review & Planning",
      description: "Review existing work and plan portfolio improvements",
      completedDate: "2025-04-10T00:00:00Z",
      feedback: "Maya's academic projects provide a good foundation, but we identified key areas to enhance for industry relevance. We've outlined 3 new projects to add professional context to the portfolio."
    }
  ],
  upcomingMilestones: [
    {
      id: 4,
      title: "Industry Tool Workshop",
      description: "Hands-on workshop with industry-standard tools",
      dueDate: "2025-05-01T00:00:00Z"
    },
    {
      id: 5,
      title: "Design Methodology Practice",
      description: "Apply advanced methodologies to a sample project",
      dueDate: "2025-05-15T00:00:00Z"
    },
    {
      id: 6,
      title: "Client Communication Simulation",
      description: "Practice client interactions and requirements gathering",
      dueDate: "2025-06-01T00:00:00Z"
    },
    {
      id: 7,
      title: "Final Portfolio Review",
      description: "Complete review of enhanced portfolio and future steps",
      dueDate: "2025-06-15T00:00:00Z"
    }
  ],
  meetings: [
    {
      id: 1,
      title: "Kickoff Meeting",
      date: "2025-03-15T14:00:00Z",
      duration: 60,
      status: "completed",
      notes: "Discussed program structure, expectations, and communication channels. Maya is interested in corporate e-learning design for tech companies."
    },
    {
      id: 2,
      title: "Skills Assessment",
      date: "2025-03-18T15:00:00Z",
      duration: 90,
      status: "completed",
      notes: "Reviewed Maya's current skills. Strengths in game design and interactive elements. Areas for growth: industry tools, client management, accessibility considerations."
    },
    {
      id: 3,
      title: "Learning Path Design",
      date: "2025-03-25T14:00:00Z",
      duration: 60,
      status: "completed",
      notes: "Created structured learning path with timeline and resource recommendations. Maya will focus on Articulate Storyline, Vyond, and advanced Figma skills."
    },
    {
      id: 4,
      title: "Portfolio Review Session",
      date: "2025-04-10T16:00:00Z",
      duration: 120,
      status: "completed",
      notes: "Reviewed existing projects. Strong academic work but needs more industry-focused examples. Outlined 3 new projects to develop focusing on corporate training."
    },
    {
      id: 5,
      title: "Weekly Check-in",
      date: "2025-04-17T14:00:00Z",
      duration: 30,
      status: "completed",
      notes: "Maya has made good progress on learning Articulate Storyline. Discussed challenges with branching scenarios and provided resources for advanced techniques."
    },
    {
      id: 6,
      title: "Industry Tools Workshop",
      date: "2025-05-01T15:00:00Z",
      duration: 180,
      status: "scheduled"
    },
    {
      id: 7,
      title: "Weekly Check-in",
      date: "2025-05-08T14:00:00Z",
      duration: 30,
      status: "scheduled"
    }
  ],
  resources: [
    {
      id: 1,
      title: "Articulate Storyline Essential Training",
      type: "Course",
      url: "#",
      assigned: "2025-03-25"
    },
    {
      id: 2,
      title: "Vyond Animation Basics",
      type: "Tutorial",
      url: "#",
      assigned: "2025-03-25"
    },
    {
      id: 3,
      title: "Corporate E-learning Style Guide",
      type: "Document",
      url: "#",
      assigned: "2025-04-10"
    },
    {
      id: 4,
      title: "Instructional Design Project Examples",
      type: "Portfolio",
      url: "#",
      assigned: "2025-04-10"
    }
  ]
};

// Sample events data
const mockEvents = [
  {
    id: 1,
    title: "Educational Innovation Conference 2025",
    description:
      "Annual conference focused on innovations in educational technology for Southeast Asian educators.",
    date: "2025-06-15T09:00:00Z",
    endDate: "2025-06-17T17:00:00Z",
    location: "Jakarta Convention Center",
    isVirtual: false,
    isHybrid: true,
    organizer: "ETHIC Association",
    registrationUrl: "#",
    imageUrl: null,
    tags: ["Conference", "Innovation", "Networking"],
  },
  {
    id: 2,
    title: "Workshop: Designing Inclusive Learning Experiences",
    description:
      "A hands-on workshop for educators to learn practical techniques for creating inclusive digital learning experiences.",
    date: "2025-05-20T13:00:00Z",
    endDate: "2025-05-20T16:00:00Z",
    location: "Online",
    isVirtual: true,
    isHybrid: false,
    organizer: "Indonesian Educational Technology Association",
    registrationUrl: "#",
    imageUrl: null,
    tags: ["Workshop", "Inclusivity", "Design"],
  },
  {
    id: 3,
    title: "Industry Tools Workshop: Articulate Storyline & Vyond",
    description:
      "A hands-on workshop covering industry-standard tools for e-learning development. Part of the Instructional Design Career Pathways mentorship program.",
    date: "2025-05-01T15:00:00Z",
    endDate: "2025-05-01T18:00:00Z",
    location: "EdTech Solutions Indonesia Office, Bandung",
    isVirtual: false,
    isHybrid: true,
    organizer: "Kari Dewanto, EdTech Solutions Indonesia",
    registrationUrl: "#",
    imageUrl: null,
    tags: ["Workshop", "Industry Tools", "E-Learning"],
    relatedToMentorship: true,
    mentorshipId: 1,
    attendees: [
      {
        id: 8,
        name: "Maya Pratama"
      },
      {
        id: 14,
        name: "Sinta Raharja"
      },
      {
        id: 9,
        name: "Bima Putra"
      }
    ]
  },
  {
    id: 4,
    title: "Portfolio Review Session for Emerging ID Professionals",
    description:
      "Group portfolio review session for new instructional designers. Get feedback from experienced professionals and connect with peers in the industry.",
    date: "2025-05-15T14:00:00Z",
    endDate: "2025-05-15T17:00:00Z",
    location: "Online",
    isVirtual: true,
    isHybrid: false,
    organizer: "ETHIC Mentorship Committee",
    registrationUrl: "#",
    imageUrl: null,
    tags: ["Portfolio", "Career Development", "Feedback"],
    relatedToMentorship: true,
    mentorshipId: 1,
    attendees: [
      {
        id: 8,
        name: "Maya Pratama"
      },
      {
        id: 3,
        name: "Kari Dewanto"
      },
      {
        id: 10,
        name: "Maya Novitasari"
      },
      {
        id: 11,
        name: "Dian Pratama"
      }
    ]
  },
  {
    id: 5,
    title: "AI in Education Research Symposium",
    description:
      "A symposium featuring research presentations on AI applications in education. Join leading researchers and practitioners to explore the latest developments.",
    date: "2025-05-10T09:00:00Z",
    endDate: "2025-05-10T16:00:00Z",
    location: "Universitas Indonesia, Jakarta",
    isVirtual: false,
    isHybrid: true,
    organizer: "Dr. Wulan Sari, UI Department of Educational Technology",
    registrationUrl: "#",
    imageUrl: null,
    tags: ["AI", "Research", "Symposium"],
    relatedToMentorship: true,
    mentorshipId: 2,
    attendees: [
      {
        id: 2,
        name: "Dr. Wulan Sari"
      },
      {
        id: 4,
        name: "Arti Hanani"
      },
      {
        id: 12,
        name: "Prof. Ahmad Ridwan"
      },
      {
        id: 13,
        name: "Dr. Sri Mulyani"
      }
    ]
  },
  {
    id: 6,
    title: "Mentorship Networking Event: EdTech Career Paths",
    description:
      "Connect with mentors and mentees in the ETHIC community. Share experiences, build relationships, and explore potential mentorship opportunities.",
    date: "2025-04-25T18:00:00Z",
    endDate: "2025-04-25T20:00:00Z",
    location: "Universitas Negeri Jakarta, Jakarta",
    isVirtual: false,
    isHybrid: false,
    organizer: "ETHIC Mentorship Committee",
    registrationUrl: "#",
    imageUrl: null,
    tags: ["Networking", "Mentorship", "Career Development"],
    highlights: "This was where Maya and Kari first connected before starting their formal mentorship relationship."
  },
  {
    id: 7,
    title: "Client Communication Workshop for Instructional Designers",
    description:
      "Learn effective strategies for communicating with clients, gathering requirements, and managing stakeholder expectations in instructional design projects.",
    date: "2025-06-01T13:00:00Z",
    endDate: "2025-06-01T16:00:00Z",
    location: "Online",
    isVirtual: true,
    isHybrid: false,
    organizer: "Kari Dewanto, EdTech Solutions Indonesia",
    registrationUrl: "#",
    imageUrl: null,
    tags: ["Communication", "Client Management", "Instructional Design"],
    relatedToMentorship: true,
    mentorshipId: 1,
    attendees: [
      {
        id: 8,
        name: "Maya Pratama"
      },
      {
        id: 3,
        name: "Kari Dewanto"
      },
      {
        id: 8,
        name: "Sinta Raharja"
      },
      {
        id: 9,
        name: "Bima Putra"
      }
    ]
  }
];

// Comment type for forum threads
type CommentType = {
  id: number;
  threadId: number;
  parentId: number | null;
  authorId: number;
  authorName: string;
  authorRole: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string;
  likes: number;
};

// Sample thread comments
const threadComments: CommentType[] = [
  {
    id: 1,
    threadId: 1,
    parentId: null,
    authorId: 2,
    authorName: "Dr. Wulan Sari",
    authorRole: "Faculty",
    authorAvatar: null,
    content:
      "Great question! In my experience, the most effective online quizzes include: 1) immediate feedback after each question, 2) explanations for correct answers, and 3) varied question types to test different cognitive levels.",
    createdAt: "2025-04-15T09:45:00Z",
    likes: 12,
  },
  {
    id: 2,
    threadId: 1,
    parentId: 1,
    authorId: 1,
    authorName: "Maya Pratama",
    authorRole: "Student",
    authorAvatar: null,
    content:
      "Thank you, Dr. Sari! I've been considering how to incorporate different cognitive levels. Do you have any specific examples of questions that effectively test higher-order thinking skills in an online format?",
    createdAt: "2025-04-15T10:20:00Z",
    likes: 5,
  },
  {
    id: 3,
    threadId: 1,
    parentId: 2,
    authorId: 2,
    authorName: "Dr. Wulan Sari",
    authorRole: "Faculty",
    authorAvatar: null,
    content:
      "Absolutely! For higher-order thinking, consider using: 1) Case studies with multiple-choice questions that require analysis, 2) Scenario-based questions that ask students to evaluate options and justify their choices, 3) Questions that ask students to identify flaws in an argument or methodology. I'd be happy to share some specific examples from my courses if that would be helpful.",
    createdAt: "2025-04-15T11:05:00Z",
    likes: 8,
  },
  {
    id: 4,
    threadId: 1,
    parentId: null,
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorAvatar: null,
    content:
      "From an industry perspective, I'd add that interactive simulations can be extremely effective when integrated with quizzes. We've had great success with branching scenarios where each choice leads to different questions that adapt based on previous responses. This approach works well for professional training where context and application are critical.",
    createdAt: "2025-04-15T13:30:00Z",
    likes: 14,
  },
  {
    id: 5,
    threadId: 1,
    parentId: 4,
    authorId: 1,
    authorName: "Maya Pratama",
    authorRole: "Student",
    authorAvatar: null,
    content:
      "That sounds really interesting, Kari! I've been experimenting with some basic branching in Articulate Storyline for my project. Would you be willing to share any examples of how you structure these adaptive scenarios?",
    createdAt: "2025-04-15T14:15:00Z",
    likes: 3,
  },
  {
    id: 6,
    threadId: 1,
    parentId: 5,
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorAvatar: null,
    content:
      "I'd be happy to share some examples, Maya! In fact, we could go through this during our next mentorship session. I have some templates and best practices that might help with your project. Feel free to message me directly and we can set up a time to discuss this specifically.",
    createdAt: "2025-04-15T15:40:00Z",
    likes: 5,
  },
  {
    id: 7,
    threadId: 3,
    parentId: null,
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorAvatar: null,
    content:
      "Great question, Maya! Having made this transition myself, I can share some key differences: 1) Corporate ID focuses more on business outcomes and ROI, 2) Timelines are usually tighter, 3) Content is often more focused on specific skills or processes rather than broader concepts, 4) Stakeholder management becomes a much bigger part of the job. For your portfolio, I'd recommend including at least 1-2 projects that showcase how your instructional design addresses business needs and demonstrates measurable outcomes.",
    createdAt: "2025-04-12T11:30:00Z",
    likes: 18,
  },
  {
    id: 8,
    threadId: 3,
    parentId: 7,
    authorId: 1,
    authorName: "Maya Pratama",
    authorRole: "Student",
    authorAvatar: null,
    content:
      "Thank you, Kari! That's really helpful. I'm curious about the stakeholder management aspect - how do you handle situations where subject matter experts or business stakeholders have conflicting ideas about what should be included in training?",
    createdAt: "2025-04-12T12:45:00Z",
    likes: 6,
  },
  {
    id: 9,
    threadId: 3,
    parentId: 8,
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorAvatar: null,
    content:
      "That's a common challenge! I use a few strategies: 1) Always tie discussions back to the learning objectives and business goals, 2) Use data when possible to support design decisions, 3) Create a prioritization framework with stakeholders at the beginning of the project, 4) Sometimes facilitate guided discussions between stakeholders to help them reach consensus. The key is positioning yourself as a strategic partner, not just an order-taker. I can help you practice these skills during our mentorship sessions.",
    createdAt: "2025-04-12T14:10:00Z",
    likes: 15,
  },
  {
    id: 10,
    threadId: 3,
    parentId: 9,
    authorId: 6,
    authorName: "Mira Puspita",
    authorRole: "Practitioner",
    authorAvatar: null,
    content:
      "I'd add that building strong relationships with stakeholders early in your career is invaluable. Take time to understand their business context and pain points. When they see that you genuinely care about their goals, the collaboration becomes much more productive. Also, finding an experienced mentor in your target industry (like you've done with Kari) is one of the smartest moves for making this transition!",
    createdAt: "2025-04-12T16:30:00Z",
    likes: 12,
  },
  {
    id: 11,
    threadId: 5,
    parentId: null,
    authorId: 5,
    authorName: "Dr. Iman Santoso",
    authorRole: "Faculty",
    authorAvatar: null,
    content:
      "As someone who reviews portfolios for our graduate hires, I recommend highlighting problem-solving skills. Show examples of how you identified learning challenges and developed creative, evidence-based solutions. Include both the finished product and your design process - wireframes, storyboards, learner personas, etc. This gives potential employers insight into how you think.",
    createdAt: "2025-04-03T10:15:00Z",
    likes: 10,
  },
  {
    id: 12,
    threadId: 5,
    parentId: null,
    authorId: 1,
    authorName: "Maya Pratama",
    authorRole: "Student",
    authorAvatar: null,
    content:
      "As a student currently building my portfolio with my mentor, I've found it helpful to include a brief case study format for each project: the challenge, approach, solution, and results (even if hypothetical). My mentor suggested focusing on showing versatility across different learning approaches and technologies rather than multiple similar projects.",
    createdAt: "2025-04-03T11:20:00Z",
    likes: 8,
  },
  {
    id: 13,
    threadId: 5,
    parentId: 12,
    authorId: 3,
    authorName: "Kari Dewanto",
    authorRole: "Alumni",
    authorAvatar: null,
    content:
      "Excellent points, Maya! You're absolutely on the right track with the case study approach. In our next session, let's refine those case studies to really emphasize the business impact of your design decisions. And you're right about versatility - it's better to have 3-4 diverse, high-quality projects than 10 similar ones. Keep up the good work!",
    createdAt: "2025-04-03T13:45:00Z",
    likes: 9,
  }
];

// Helper function to nest comments by their parent
function threadCommentToTree(comments: CommentType[]) {
  // First, organize comments by parentId
  const commentsByParent = comments.reduce((acc: any, c) => {
    const parentId = c.parentId || "root";
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(c);
    return acc;
  }, {} as Record<string, CommentType[]>);

  // Generate nested structure
  function buildTree(parent: string | number = "root", level = 0) {
    if (!commentsByParent[parent]) {
      return [];
    }

    return commentsByParent[parent].map((c: any) => ({
      ...c,
      level,
      children: buildTree(c.id, level + 1),
    }));
  }

  return buildTree();
}

// Comment component for thread detail view
function ThreadComment(props: any) {
  const { comment, onReply } = props;
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(replyContent, comment.id);
      setReplyContent("");
      setShowReplyBox(false);
    }
  };

  return (
    <div
      className={`mt-4 ${comment.level > 0 ? "ml-8 border-l-2 pl-4" : ""}`}
    >
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarFallback className="bg-primary-100 text-primary-600">
            {comment.authorName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.authorName}</span>
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5"
            >
              {comment.authorRole}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          <div className="prose prose-sm max-w-none mb-2">
            <p>{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-primary-600">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{comment.likes}</span>
            </button>
            <button
              className="flex items-center gap-1 hover:text-primary-600"
              onClick={() => setShowReplyBox(!showReplyBox)}
            >
              <Reply className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>
          </div>

          {showReplyBox && (
            <div className="mt-3 flex">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="text-sm bg-primary-100 text-primary-600">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReplyBox(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleReply}>
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.children &&
        comment.children.map((reply: any) => (
          <ThreadComment key={reply.id} comment={reply} onReply={onReply} />
        ))}
    </div>
  );
}

export default function HubPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Set default tab or use the one from URL query parameter
  const getDefaultTab = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    const userParam = searchParams.get('user');
    
    // If there's a user parameter, default to members tab to show that user
    if (userParam && userParam === '3') {
      return "members"; // This will show Kari's profile
    }
    
    const validTabs = ["forum", "mentorship", "members", "events"];
    return tabParam && validTabs.includes(tabParam) ? tabParam : "forum";
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  
  // Get the user ID from URL if any
  const getUserIdFromUrl = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('user');
  }
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(getUserIdFromUrl());
  
  // Effect to check URL params when component mounts or URL changes
  useEffect(() => {
    const newTab = getDefaultTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
    
    // Also update selected user if needed
    const newUserId = getUserIdFromUrl();
    if (newUserId !== selectedUserId) {
      setSelectedUserId(newUserId);
    }
  }, [location]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without navigating away
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('tab', value);
    setLocation(`/hub?${newParams.toString()}`, { replace: true });
  };
  
  // Forum tab state
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTopic, setNewPostTopic] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  
  // Member directory tab state
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [mentorFilter, setMentorFilter] = useState<boolean | null>(null);
  
  // Events tab state
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [eventTimeFilter, setEventTimeFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  
  // Tab-related functions already defined above
  
  // Handle forum post submission
  const handleSubmitNewPost = () => {
    if (newPostTitle && newPostContent && newPostTopic) {
      // In a real app, this would be an API call to create a post
      console.log("Creating new post:", {
        title: newPostTitle,
        content: newPostContent,
        topicId: newPostTopic,
        tags: newPostTags.split(",").map(tag => tag.trim()),
      });
      
      // Clear form and close dialog
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostTopic("");
      setNewPostTags("");
      setNewPostOpen(false);
    }
  };
  
  // Handle replying to a comment
  const handleReplyToComment = (content: string, parentId: number | null = null) => {
    // In a real app, this would be an API call to create a comment
    console.log("Creating reply:", { content, parentId, threadId: selectedThread?.id });
  };
  
  // Filter forum threads based on search and filters
  const filteredThreads = forumThreads.filter(thread => {
    const matchesSearch = searchTerm 
      ? thread.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        thread.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesTopic = topicFilter === "all" || thread.topicId === topicFilter;
    
    return matchesSearch && matchesTopic;
  });
  
  // Sort forum threads
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    } else if (sortBy === "popular") {
      return b.likes - a.likes;
    } else if (sortBy === "most-commented") {
      return b.comments - a.comments;
    }
    return 0;
  });
  
  // Get threaded comments for selected thread
  const threadedComments = selectedThread 
    ? threadCommentToTree(threadComments.filter(c => c.threadId === selectedThread.id))
    : [];
  
  // Filter members based on search and filters
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = memberSearchQuery
      ? member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.username.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        member.tags.some(tag => tag.toLowerCase().includes(memberSearchQuery.toLowerCase()))
      : true;
      
    const matchesRole = roleFilter === "all" || member.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesMentor = mentorFilter === null || member.isMentor === mentorFilter;
    
    return matchesSearch && matchesRole && matchesMentor;
  });
  
  // Filter events based on search and filters
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = eventSearchQuery
      ? event.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(eventSearchQuery.toLowerCase())
      : true;
      
    const now = new Date();
    const eventDate = new Date(event.date);
    
    let matchesTime = true;
    if (eventTimeFilter === "upcoming") {
      matchesTime = eventDate > now;
    } else if (eventTimeFilter === "today") {
      const today = new Date();
      matchesTime = eventDate.getDate() === today.getDate() &&
                   eventDate.getMonth() === today.getMonth() &&
                   eventDate.getFullYear() === today.getFullYear();
    } else if (eventTimeFilter === "thisWeek") {
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      matchesTime = eventDate > now && eventDate < nextWeek;
    }
    
    let matchesType = true;
    if (eventTypeFilter === "online") {
      matchesType = event.isVirtual;
    } else if (eventTypeFilter === "inPerson") {
      matchesType = !event.isVirtual && !event.isHybrid;
    } else if (eventTypeFilter === "hybrid") {
      matchesType = event.isHybrid;
    }
    
    return matchesSearch && matchesTime && matchesType;
  });

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Hub</h1>
      </div>

      {/* Hub Navigation Tabs */}
      <Tabs
        defaultValue="forum"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full mb-6"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto p-1">
          <TabsTrigger value="forum" className="px-4 py-2">
            <MessageCircle className="h-4 w-4 mr-2" />
            Forum
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="px-4 py-2">
            <GraduationCap className="h-4 w-4 mr-2" />
            Mentorship
          </TabsTrigger>
          <TabsTrigger value="members" className="px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            Member Directory
          </TabsTrigger>
          <TabsTrigger value="events" className="px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
        </TabsList>

        {/* FORUM TAB CONTENT */}
        <TabsContent value="forum" className="mt-6">
          <div className="w-full space-y-6">
            {/* Forum Actions */}
            <div className="mb-4 flex justify-between items-start">
              <div className="flex-1">
                {/* No title needed as it's in Hub header */}
              </div>

              <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="w-4 h-4 mr-2" /> New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Start a new discussion</DialogTitle>
                    <DialogDescription>
                      Share your question, insight, or topic for discussion
                      with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Enter a descriptive title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        placeholder="Provide details about your topic, question, or insight..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={8}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Topic</label>
                        <Select
                          value={newPostTopic}
                          onValueChange={setNewPostTopic}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {forumTopics.map((topic) => (
                              <SelectItem key={topic.id} value={topic.id}>
                                {topic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <Input
                          placeholder="Enter tags separated by commas"
                          value={newPostTags}
                          onChange={(e) => setNewPostTags(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setNewPostOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmitNewPost}>
                      Post Discussion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Main Forum Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Topics and Filters */}
              <div className="lg:col-span-1 space-y-6">
                {/* Search Bar */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search discussions..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Forum Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                          topicFilter === "all"
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setTopicFilter("all")}
                      >
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 text-gray-500 mr-3" />
                          <span>All Topics</span>
                        </div>
                        <Badge>{forumThreads.length}</Badge>
                      </button>

                      {forumTopics.map((topic) => (
                        <button
                          key={topic.id}
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                            topicFilter === topic.id
                              ? "bg-primary-50 text-primary-700"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setTopicFilter(topic.id)}
                        >
                          <div className="flex items-center">
                            {topic.icon}
                            <span className="ml-3">{topic.name}</span>
                          </div>
                          <Badge>{topic.count}</Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sort Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sort By</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                          sortBy === "recent"
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("recent")}
                      >
                        <Clock className="h-5 w-5 mr-3" />
                        <span>Recent Activity</span>
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                          sortBy === "popular"
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("popular")}
                      >
                        <TrendingUp className="h-5 w-5 mr-3" />
                        <span>Most Popular</span>
                      </button>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                          sortBy === "most-commented"
                            ? "bg-primary-50 text-primary-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSortBy("most-commented")}
                      >
                        <MessageSquare className="h-5 w-5 mr-3" />
                        <span>Most Commented</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content - Thread List or Thread Detail */}
              <div className="lg:col-span-3">
                {selectedThread ? (
                  // Thread Detail View
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mb-2"
                            onClick={() => setSelectedThread(null)}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Back to
                            Discussions
                          </Button>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Bookmark className="h-4 w-4 mr-1" /> Save
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-4 w-4 mr-1" /> Share
                            </Button>
                          </div>
                        </div>

                        <CardTitle className="text-2xl mt-1">
                          {selectedThread.title}
                        </CardTitle>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={`bg-${forumTopics.find((t) => t.id === selectedThread.topicId)?.color}-100 text-${forumTopics.find((t) => t.id === selectedThread.topicId)?.color}-700 border-${forumTopics.find((t) => t.id === selectedThread.topicId)?.color}-200`}
                          >
                            {forumTopics.find((t) => t.id === selectedThread.topicId)?.name}
                          </Badge>
                          {selectedThread.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary-100 text-primary-600">
                              {selectedThread.authorName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {selectedThread.authorName}
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5"
                              >
                                {selectedThread.authorRole}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                              {new Date(
                                selectedThread.createdAt
                              ).toLocaleString()}
                            </p>
                            <div className="prose prose-sm max-w-none mb-6">
                              <p>{selectedThread.content}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <button className="flex items-center gap-1 hover:text-primary-600">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{selectedThread.likes}</span>
                              </button>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{selectedThread.comments}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{selectedThread.views} views</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Comments Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Comments ({selectedThread.comments})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="divide-y space-y-6 pt-0">
                        {/* Comment List */}
                        <div className="space-y-4">
                          {threadedComments.map((comment: any) => (
                            <ThreadComment
                              key={comment.id}
                              comment={comment}
                              onReply={handleReplyToComment}
                            />
                          ))}
                        </div>

                        {/* Add Comment Form */}
                        <div className="pt-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarFallback className="bg-primary-100 text-primary-600">
                                {user?.username?.[0].toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Textarea
                                placeholder="Add a comment to this discussion..."
                                className="mb-2"
                                rows={3}
                                value={newPostContent}
                                onChange={(e) =>
                                  setNewPostContent(e.target.value)
                                }
                              />
                              <Button className="flex items-center gap-2">
                                <Send className="h-4 w-4" />
                                <span>Post Comment</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  // Thread List View
                  <div className="space-y-4">
                    {sortedThreads.map((thread) => (
                      <Card
                        key={thread.id}
                        className={`hover:border-primary-300 hover:shadow-md transition-shadow ${
                          thread.isPinned ? "border-primary-300 shadow-sm" : ""
                        }`}
                      >
                        <CardContent className="p-0">
                          <button
                            className="w-full text-left p-6"
                            onClick={() => setSelectedThread(thread)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="mr-4">
                                <h3 className="text-lg font-medium mb-2 text-gray-900">
                                  {thread.title}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <Badge
                                    variant="outline"
                                    className={`bg-${
                                      forumTopics.find(
                                        (t) => t.id === thread.topicId
                                      )?.color
                                    }-50 text-${
                                      forumTopics.find(
                                        (t) => t.id === thread.topicId
                                      )?.color
                                    }-600 border-${
                                      forumTopics.find(
                                        (t) => t.id === thread.topicId
                                      )?.color
                                    }-200 hover:bg-${
                                      forumTopics.find(
                                        (t) => t.id === thread.topicId
                                      )?.color
                                    }-100`}
                                  >
                                    {
                                      forumTopics.find(
                                        (t) => t.id === thread.topicId
                                      )?.name
                                    }
                                  </Badge>
                                  {thread.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {thread.tags.length > 2 && (
                                    <Badge variant="outline">
                                      +{thread.tags.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                                  {thread.content}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 space-x-4">
                                  <div className="flex items-center">
                                    <Avatar className="h-5 w-5 mr-1">
                                      <AvatarFallback className="text-xs">
                                        {thread.authorName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{thread.authorName}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>
                                      {new Date(
                                        thread.lastActivity
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    <span>{thread.comments} comments</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center space-y-2">
                                <div className="flex flex-col items-center">
                                  <ThumbsUp className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {thread.likes}
                                  </span>
                                </div>
                                {thread.isPinned && (
                                  <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-200">
                                    Pinned
                                  </Badge>
                                )}
                                {thread.isHot && (
                                  <Badge
                                    variant="outline"
                                    className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                  >
                                    Hot
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        </CardContent>
                      </Card>
                    ))}

                    {sortedThreads.length === 0 && (
                      <Card className="p-8 text-center">
                        <CardContent className="pt-6">
                          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            No discussions found
                          </h3>
                          <p className="text-gray-500 mb-4">
                            There are no discussions matching your criteria. Try
                            adjusting your filters or be the first to start a
                            discussion!
                          </p>
                          <Button onClick={() => setNewPostOpen(true)}>
                            <PlusCircle className="w-4 h-4 mr-2" /> Start a
                            Discussion
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* MENTORSHIP TAB CONTENT */}
        <TabsContent value="mentorship" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sidebar - Stats & Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mentorship Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Active Mentorships</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">17</span>
                      <Badge variant="outline" className="text-green-600 bg-green-50">
                        +4 this month
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Available Mentors</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">24</span>
                      <Badge variant="outline" className="text-blue-600 bg-blue-50">
                        8 new openings
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">Students Seeking Mentors</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">43</span>
                      <Badge variant="outline" className="text-orange-600 bg-orange-50">
                        12 matches needed
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-gray-500 mb-2">Top Mentorship Fields</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Instructional Design</span>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: "38%" }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Learning Analytics</span>
                        <span className="text-sm font-medium">24%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: "24%" }}></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Educational Technology</span>
                        <span className="text-sm font-medium">21%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: "21%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Find a Mentor
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Award className="mr-2 h-4 w-4" />
                    Become a Mentor
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule a Meeting
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Join Mentor Community
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content - Current Mentorship or Available Programs */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Active Mentorship</CardTitle>
                  <CardDescription>
                    Instructional Design Career Pathways with Kari Dewanto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary-100 text-primary-600">
                        KD
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Kari Dewanto</div>
                      <div className="text-sm text-gray-500">Alumni • EdTech Solutions Indonesia</div>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="font-medium">12</div>
                      <div className="text-xs text-gray-500">Weeks Total</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="font-medium">5</div>
                      <div className="text-xs text-gray-500">Completed Milestones</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="font-medium">3</div>
                      <div className="text-xs text-gray-500">Weeks Remaining</div>
                    </div>
                  </div>
                  
                  {/* Current Projects - Specifically showing Educational Sociology project */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-3">Current Projects</h4>
                    <Card className="border border-green-100 bg-green-50">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">Educational Sociology Application Project</CardTitle>
                        <CardDescription>Final project support and feedback for Educational Sociology course</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-sm text-gray-600 mb-4">
                          <p>Working with Kari to apply theoretical concepts from Educational Sociology in developing a community-based learning initiative. Developing practical skills through real-world application of coursework concepts.</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">In Progress</Badge>
                          <span className="text-xs text-gray-500">Last updated: Today</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Next Milestone</h4>
                    <Card className="bg-primary-50 border border-primary-100">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">Industry Tool Workshop</div>
                            <div className="text-xs text-gray-500 mt-1">Due: May 1, 2025</div>
                          </div>
                          <Badge variant="outline" className="bg-white">In Progress</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Upcoming Meetings</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-100 text-primary-700 p-2 rounded-md">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">Industry Tools Workshop</div>
                            <div className="text-xs text-gray-500">May 1, 2025 • 3:00 PM • 3 hours</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Details</Button>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-100 text-primary-700 p-2 rounded-md">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">Weekly Check-in</div>
                            <div className="text-xs text-gray-500">May 8, 2025 • 2:00 PM • 30 min</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("This would display a detailed view of all mentorship information. This feature is not yet implemented.");
                    }}
                  >
                    View Full Mentorship Details
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Other Mentorship Programs</CardTitle>
                  <CardDescription>Browse other available mentorship opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mentorshipPrograms.filter(p => p.id !== 1).map(program => (
                    <Card key={program.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{program.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{program.description}</p>
                            </div>
                            <Badge variant={program.openings > 0 ? "default" : "outline"}>
                              {program.openings > 0 ? `${program.openings} openings` : "Full"}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center mt-4 space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary-100 text-primary-600">
                                {program.mentor.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{program.mentor.name}</div>
                              <div className="text-xs text-gray-500">{program.mentor.role} • {program.mentor.organization}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{program.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{program.commitment}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-4">
                            {program.topics.map(topic => (
                              <Badge key={topic} variant="secondary" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border-t p-3 bg-gray-50 flex justify-end">
                          <Button 
                            size="sm" 
                            variant={program.openings > 0 ? "default" : "outline"} 
                            disabled={program.openings === 0}
                            onClick={(e) => {
                              e.preventDefault();
                              // Show instead a notification that this would apply for mentorship
                              alert("Mentorship application would be submitted here. This feature is not yet implemented.");
                            }}
                          >
                            {program.openings > 0 ? "Apply for Mentorship" : "Join Waitlist"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("This would navigate to a page with all mentorship programs. This feature is not yet implemented.");
                    }}
                  >
                    View All Mentorship Programs
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* MEMBERS TAB CONTENT */}
        <TabsContent value="members" className="mt-6">
          <div className="space-y-6">
            {/* Member Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search members by name, username, or skills..." 
                  className="pl-10"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="practitioner">Practitioners</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={mentorFilter === null ? "all" : mentorFilter ? "mentors" : "mentees"} 
                  onValueChange={(value) => {
                    if (value === "all") setMentorFilter(null);
                    else if (value === "mentors") setMentorFilter(true);
                    else setMentorFilter(false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mentor Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    <SelectItem value="mentors">Mentors</SelectItem>
                    <SelectItem value="mentees">Mentees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Member Directory List */}
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <Card 
                  key={member.id} 
                  className={`overflow-hidden ${selectedUserId === member.id.toString() ? 'ring-2 ring-primary-500 shadow-md' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-4 sm:p-6 sm:w-64 flex flex-col items-center sm:border-r">
                      <Avatar className="h-16 w-16 mb-3">
                        <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">@{member.username}</p>
                        {member.isMentor && (
                          <Badge className="bg-primary-100 text-primary-700">
                            Mentor
                          </Badge>
                        )}
                        {member.id === 3 && member.name === "Kari Dewanto" && (
                          <div className="mt-2 text-xs text-primary-600">
                            Educational Sociology Expert
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 p-4 sm:py-6 sm:px-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 sm:flex-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="text-gray-700">{member.role}</span>
                          </div>
                          {member.organization && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                              <span className="text-gray-700">{member.organization}</span>
                            </div>
                          )}
                          {member.location && (
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                              <span className="text-gray-700">{member.location}</span>
                            </div>
                          )}
                          
                          {member.bio && (
                            <p className="text-sm text-gray-600 mt-2">{member.bio}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                          {member.id === 3 && member.name === "Kari Dewanto" ? (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-gray-700">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Message
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                  <DialogHeader>
                                    <DialogTitle>Message to Kari Dewanto</DialogTitle>
                                    <DialogDescription>
                                      Send a message about the community-based learning initiative
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Subject</Label>
                                      <Input 
                                        defaultValue="Question about your Community-Based Learning initiative" 
                                        placeholder="Enter subject"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Message</Label>
                                      <Textarea 
                                        rows={6}
                                        defaultValue="Hi Kari, I'm currently taking an Educational Sociology course and found your resource on community-based learning fascinating. I'm struggling to see practical applications for theoretical concepts in my coursework. Would you be willing to discuss how you applied sociological principles in your project? I'd really appreciate your insights. Thanks, Maya" 
                                        placeholder="Enter your message"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button 
                                      onClick={() => {
                                        setLocation('/hub?tab=mentorship', { replace: true });
                                      }}
                                    >
                                      Send Message
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                size="sm"
                                onClick={() => {
                                  // This simulates the mentorship request in the scenario
                                  setLocation('/hub?tab=mentorship', { replace: true });
                                }}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Request Mentorship
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-gray-700"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`This would open a messaging dialog with ${member.name}. This feature is not yet implemented.`);
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              {member.isMentor ? (
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    alert(`This would allow you to request mentorship from ${member.name}. This feature is not yet implemented.`);
                                  }}
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Request Mentorship
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-gray-700"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    alert(`This would send a connection request to ${member.name}. This feature is not yet implemented.`);
                                  }}
                                >
                                  <Users className="h-4 w-4 mr-2" />
                                  Connect
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {member.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredMembers.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No members found</h3>
                  <p className="text-gray-500">
                    No community members match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* EVENTS TAB CONTENT */}
        <TabsContent value="events" className="mt-6">
          <div className="space-y-6">
            {/* Event Search and Filters */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Add a new event</DialogTitle>
                      <DialogDescription>Share an educational technology event with the community</DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input id="event-title" placeholder="Enter the event title" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea id="event-description" placeholder="What is this event about?" rows={4} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="event-date">Start Date & Time</Label>
                          <Input id="event-date" type="datetime-local" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="event-end-date">End Date & Time</Label>
                          <Input id="event-end-date" type="datetime-local" />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="event-location">Location</Label>
                        <Input id="event-location" placeholder="Where will the event be held?" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Event Type</Label>
                          <Select defaultValue="inPerson">
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">Online</SelectItem>
                              <SelectItem value="inPerson">In Person</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="event-organizer">Organizer</Label>
                          <Input id="event-organizer" placeholder="Who is organizing this event?" />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="event-tags">Tags (comma separated)</Label>
                        <Input id="event-tags" placeholder="Conference, AI, Workshop" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="event-url">Registration URL</Label>
                        <Input id="event-url" placeholder="https://..." />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" type="button">Cancel</Button>
                      <Button 
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          // We'd normally submit the event data here
                          alert("Your event would be submitted here. This feature is not yet implemented.");
                        }}
                      >
                        Submit Event
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search events..." 
                    className="pl-10"
                    value={eventSearchQuery}
                    onChange={(e) => setEventSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                  <Select value={eventTimeFilter} onValueChange={setEventTimeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="inPerson">In Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 bg-primary-50 flex flex-col items-center justify-center p-4 md:p-6">
                      <div className="text-center">
                        <p className="text-primary-700 text-sm font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                        <p className="text-4xl font-bold text-primary-800">
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-primary-700 text-sm">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs text-primary-700">
                            {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="flex-1 p-6">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex space-x-2">
                          {event.isVirtual && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Online
                            </Badge>
                          )}
                          {event.isHybrid && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              Hybrid
                            </Badge>
                          )}
                          {!event.isVirtual && !event.isHybrid && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              In Person
                            </Badge>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          {event.endDate && event.endDate !== event.date && (
                            <> - {new Date(event.endDate).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}</>
                          )}
                        </span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span>Organized by {event.organizer}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex space-x-3 mt-4">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`This would navigate to the registration page for "${event.title}". This feature is not yet implemented.`);
                          }}
                        >
                          Register
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`This would add "${event.title}" to your calendar. This feature is not yet implemented.`);
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Add to Calendar
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
              
              {filteredEvents.length === 0 && (
                <Card className="p-8 text-center">
                  <CardContent className="pt-6">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No events found</h3>
                    <p className="text-gray-500 mb-4">
                      There are no events matching your search criteria. Try adjusting your filters or check back later!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}