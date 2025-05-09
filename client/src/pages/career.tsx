import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Building, 
  Calendar, 
  BookOpen, 
  Award, 
  Star, 
  Bookmark, 
  Users, 
  TrendingUp, 
  Backpack, 
  GraduationCap, 
  FileText 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Sample career data
const jobListings = [
  {
    id: 1,
    title: "Educational Content Developer",
    company: "EdTech Indonesia",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "Rp 10,000,000 - 15,000,000 / month",
    description: "Design and develop interactive educational content for K-12 subjects aligned with Indonesian curriculum standards.",
    requirements: [
      "Bachelor's degree in Education, Instructional Design, or related field",
      "2+ years experience in educational content development",
      "Proficiency in content authoring tools",
      "Strong understanding of Indonesian curriculum"
    ],
    postedDate: "2025-04-15T10:30:00Z",
    skills: ["Content Development", "Instructional Design", "Curriculum Alignment"],
    featured: true
  },
  {
    id: 2,
    title: "Learning Experience Designer",
    company: "Ruangguru",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "Rp 12,000,000 - 18,000,000 / month",
    description: "Create engaging learning experiences that leverage technology to enhance student outcomes and engagement.",
    requirements: [
      "Bachelor's degree in UX Design, Education, or related field",
      "3+ years experience in learning experience design",
      "Portfolio of educational product designs",
      "Knowledge of educational technology trends"
    ],
    postedDate: "2025-04-10T14:00:00Z",
    skills: ["UX Design", "Learning Design", "Educational Technology"],
    featured: true
  },
  {
    id: 3,
    title: "Educational Data Analyst",
    company: "Zenius Education",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "Rp 11,000,000 - 16,000,000 / month",
    description: "Analyze learning data to derive insights that improve educational products and student outcomes.",
    requirements: [
      "Bachelor's degree in Data Science, Statistics, or related field",
      "2+ years experience in data analysis",
      "Proficiency in SQL, Python, and data visualization tools",
      "Experience with educational data preferred"
    ],
    postedDate: "2025-04-05T09:15:00Z",
    skills: ["Data Analysis", "SQL", "Python", "Data Visualization"],
    featured: false
  },
  {
    id: 4,
    title: "Educational Technology Specialist",
    company: "Ministry of Education",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "Rp 9,000,000 - 13,000,000 / month",
    description: "Support the implementation of educational technology initiatives in public schools across Indonesia.",
    requirements: [
      "Bachelor's degree in Education, Technology, or related field",
      "3+ years experience in educational technology implementation",
      "Strong communication and training skills",
      "Experience working with government systems preferred"
    ],
    postedDate: "2025-04-02T11:45:00Z",
    skills: ["EdTech Implementation", "Training", "Public Sector"],
    featured: false
  },
  {
    id: 5,
    title: "Instructional Designer (Remote)",
    company: "Global Learn",
    location: "Remote (Indonesia-based)",
    type: "Contract",
    salary: "Rp 8,000,000 - 12,000,000 / month",
    description: "Design online courses and learning materials for professional development programs in the education sector.",
    requirements: [
      "Bachelor's degree in Instructional Design, Education, or related field",
      "2+ years experience in instructional design",
      "Experience with e-learning platforms and authoring tools",
      "Strong project management skills"
    ],
    postedDate: "2025-04-08T13:30:00Z",
    skills: ["Instructional Design", "E-Learning", "Project Management"],
    featured: false
  },
  {
    id: 6,
    title: "EdTech Product Manager",
    company: "Harukaedu",
    location: "Jakarta, Indonesia",
    type: "Full-time",
    salary: "Rp 15,000,000 - 22,000,000 / month",
    description: "Lead the development of innovative educational technology products for higher education institutions.",
    requirements: [
      "Bachelor's degree in Product Management, Business, or related field",
      "4+ years experience in product management, preferably in education",
      "Strong understanding of higher education needs",
      "Experience with agile methodology"
    ],
    postedDate: "2025-04-12T16:00:00Z",
    skills: ["Product Management", "Agile", "Higher Education", "EdTech"],
    featured: true
  }
];

// Sample career resources
const careerResources = [
  {
    id: 1,
    title: "Educational Technology Career Paths in Indonesia",
    type: "Guide",
    description: "Comprehensive overview of career options in the EdTech sector in Indonesia, including roles, skills, and growth opportunities.",
    url: "#",
    author: "ETHIC Career Center",
    publishedDate: "2025-03-10T00:00:00Z",
    tags: ["Career Planning", "EdTech", "Professional Development"],
    popularityScore: 92
  },
  {
    id: 2,
    title: "Resume Workshop for EdTech Professionals",
    type: "Workshop Recording",
    description: "Recorded workshop providing specific guidance on creating resumes tailored for educational technology positions.",
    url: "#",
    author: "Nia Putri, Career Coach",
    publishedDate: "2025-02-15T00:00:00Z",
    tags: ["Resume", "Job Search", "Professional Development"],
    popularityScore: 87
  },
  {
    id: 3,
    title: "Transitioning from Teaching to Educational Technology",
    type: "Article",
    description: "Step-by-step guide for teachers looking to leverage their experience to transition into educational technology roles.",
    url: "#",
    author: "Dr. Wulan Sari, Education Expert",
    publishedDate: "2025-03-28T00:00:00Z",
    tags: ["Career Transition", "Teachers", "Skill Development"],
    popularityScore: 95
  },
  {
    id: 4,
    title: "Building a Portfolio for Learning Design Positions",
    type: "Tutorial",
    description: "Practical guidance on creating an effective portfolio that showcases your instructional design and learning experience skills.",
    url: "#",
    author: "Rizki Pratama, Learning Designer",
    publishedDate: "2025-01-20T00:00:00Z",
    tags: ["Portfolio Development", "Learning Design", "Job Search"],
    popularityScore: 89
  }
];

export default function CareerPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  
  // Query for job listings
  const { data: jobs = jobListings, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/job-listings"],
    // Mock data for now
    queryFn: () => Promise.resolve(jobListings),
  });
  
  // Query for career resources
  const { data: resources = careerResources, isLoading: resourcesLoading } = useQuery({
    queryKey: ["/api/career-resources"],
    // Mock data for now
    queryFn: () => Promise.resolve(careerResources),
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Today";
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Filter jobs based on search query and job type
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Get unique job types for filtering
  const jobTypes = Array.from(new Set(jobs.map(job => job.type)));
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Career</h1>
        
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="toolkit">
            <Backpack className="h-4 w-4 mr-2" />
            Toolkit
          </TabsTrigger>
          <TabsTrigger value="opportunities">
            <Briefcase className="h-4 w-4 mr-2" />
            Job Opportunities
          </TabsTrigger>
          <TabsTrigger value="education">
            <GraduationCap className="h-4 w-4 mr-2" />
            Continuing Education
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Educational Technology Career Trends</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Trend Card 1 */}
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">AI Integration Specialists</CardTitle>
                  <CardDescription>Highest growth potential</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4">
                    Demand for professionals who can integrate AI into educational experiences 
                    has grown by 120% in the past year. Indonesian tech companies are actively 
                    seeking talent in this area.
                  </p>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Growth Rate</span>
                      <span className="font-medium">120%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {["AI", "Educational Programming", "LMS Integration"].map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trend Card 2 */}
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Learning Experience Designers</CardTitle>
                  <CardDescription>High demand across sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4">
                    Learning experience design has emerged as a critical role across corporate, 
                    higher education, and tech sectors. Salary growth of 25% in the past year.
                  </p>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Growth Rate</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {["UX Design", "Learning Design", "Instructional Design"].map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trend Card 3 */}
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Educational Data Scientists</CardTitle>
                  <CardDescription>Growing analytics demand</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm mb-4">
                    As educational institutions embrace data-driven decision making, demand for 
                    specialists who can analyze learning data has increased 65% since 2023.
                  </p>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Growth Rate</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {["Data Analysis", "Python", "Learning Analytics"].map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Indonesian EdTech Market Insights</CardTitle>
                <CardDescription>The educational technology sector in Indonesia continues to grow rapidly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center py-4">
                  <div>
                    <p className="text-3xl font-bold text-primary-600 mb-1">42%</p>
                    <p className="text-sm text-gray-600">Annual EdTech growth rate in Indonesia</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary-600 mb-1">15,000+</p>
                    <p className="text-sm text-gray-600">New EdTech jobs created in 2024</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary-600 mb-1">Rp 12.5M</p>
                    <p className="text-sm text-gray-600">Average EdTech professional salary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Toolkit Tab */}
        <TabsContent value="toolkit">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Career Development Toolkit</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {resources.map(resource => (
                <Card key={resource.id} className="hover:shadow-md transition-all h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg hover:text-primary-600 transition-colors">
                          <span className="cursor-pointer hover:text-primary-600">
                            {resource.title}
                          </span>
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <BookOpen className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {resource.type} by {resource.author}
                        </CardDescription>
                      </div>
                      <Badge className="ml-2" variant="outline">{resource.type}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <p className="text-gray-700 text-sm mb-3">
                      {resource.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {resource.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                      <span>{resource.popularityScore}% found this helpful</span>
                      <span className="mx-2">•</span>
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Published {formatDate(resource.publishedDate)}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 border-t flex justify-end">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => { }}>
                      <Bookmark className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button variant="default" size="sm" onClick={() => { }}>
                      <BookOpen className="h-4 w-4 mr-1" /> View Resource
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Resume Templates Section */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume Templates for EdTech Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {["Instructional Designer", "Learning Experience Designer", "EdTech Product Manager"].map((role, i) => (
                <Card key={i} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{role} Resume Template</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="aspect-w-8 aspect-h-11 bg-gray-100 rounded-md flex items-center justify-center mb-3">
                      <FileText className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Optimized template highlighting key skills and experiences for {role} roles.
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex justify-end">
                    <Button size="sm">
                      Download Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Job Opportunities Tab */}
        <TabsContent value="opportunities">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Job Opportunities
                </h2>
                
                <Button className="my-1 md:my-0">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Post a Job Opportunity
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search jobs..." 
                    className="pl-10 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select 
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                >
                  <option value="All">All Job Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-6 mb-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <Card key={job.id} className={`overflow-hidden hover:shadow-md transition-all ${job.featured ? 'border-primary-100 bg-primary-50/30' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row justify-between md:items-center">
                        <div>
                          <div className="flex items-center">
                            <CardTitle className="text-lg hover:text-primary-600 transition-colors">
                              <span className="cursor-pointer hover:text-primary-600">
                                {job.title}
                              </span>
                            </CardTitle>
                            {job.featured && (
                              <Badge className="ml-2 bg-primary-100 text-primary-700">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                              <span className="flex items-center">
                                <Building className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {job.company}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {job.location}
                              </span>
                              <span className="flex items-center">
                                <Briefcase className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                {job.type}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                        <div className="text-sm font-medium text-primary-600 mt-2 md:mt-0">
                          Posted {formatDate(job.postedDate)}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      <p className="text-gray-700 mb-4">
                        {job.description}
                      </p>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-4">
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center text-sm font-medium text-gray-900 mb-3">
                        <span>Salary: </span>
                        <span className="ml-1 text-gray-700">{job.salary}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between border-t pt-3">
                      <Button variant="outline" size="sm" onClick={() => { }}>
                        <Bookmark className="h-4 w-4 mr-1" /> Save Job
                      </Button>
                      <Button variant="default" size="sm" onClick={() => { }}>
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No job listings found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>

            {/* Removed duplicated button that was moved to the top */}
          </div>
        </TabsContent>

        {/* Continuing Education Tab */}
        <TabsContent value="education">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Continuing Education</h2>
            
            {/* University Programs */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Educational Technology University Programs</h3>
              <div className="space-y-4">
                {[
                  {name: "Universitas Indonesia", program: "M.Ed in Educational Technology", location: "Jakarta", details: "Focuses on educational innovation and technology integration in Indonesian educational contexts."},
                  {name: "Institut Teknologi Bandung", program: "M.Sc in Educational Innovation", location: "Bandung", details: "Engineering-focused approach to educational technology and innovation."},
                  {name: "Universitas Gadjah Mada", program: "Postgraduate Certificate in EdTech Leadership", location: "Yogyakarta", details: "Part-time program designed for working professionals in education."}
                ].map((university, i) => (
                  <Card key={i} className="hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{university.program}</CardTitle>
                          <CardDescription>
                            {university.name} - {university.location}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-700">{university.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Workshops & Certifications */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Workshops & Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {title: "Instructional Design Certification", provider: "Indonesian E-Learning Association", duration: "3 months", format: "Hybrid"},
                  {title: "Educational Data Analytics", provider: "SEAMEO SEAMOLEC", duration: "6 weeks", format: "Online"},
                  {title: "Advanced Learning Experience Design", provider: "Ruangguru Academy", duration: "8 weeks", format: "Hybrid"},
                  {title: "AI in Education Bootcamp", provider: "Google for Education Indonesia", duration: "2 weeks", format: "In-person"}
                ].map((workshop, i) => (
                  <Card key={i} className="hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{workshop.title}</CardTitle>
                      <CardDescription>
                        {workshop.provider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex gap-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {workshop.duration}
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {workshop.format}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                      <Button variant="outline" size="sm">Learn More</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Scholarships */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Scholarships for Educational Technology</h3>
              <div className="space-y-4">
                {[
                  {name: "LPDP Educational Innovation Scholarship", sponsor: "Ministry of Education", deadline: "October 15, 2025", amount: "Full tuition and stipend", eligibility: "Indonesian citizens with min. 2 years experience in education or technology."},
                  {name: "Digital Talent Scholarship - EdTech Track", sponsor: "Ministry of Communication and IT", deadline: "July 30, 2025", amount: "Full tuition", eligibility: "Recent graduates or early career professionals in technology or education fields."},
                  {name: "Tanoto Foundation EdTech Fellowship", sponsor: "Tanoto Foundation", deadline: "September 1, 2025", amount: "Partial tuition and research funding", eligibility: "Educators focused on rural education innovation."}
                ].map((scholarship, i) => (
                  <Card key={i} className="hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{scholarship.name}</CardTitle>
                          <CardDescription>
                            Sponsored by {scholarship.sponsor}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Deadline: {scholarship.deadline}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Award Amount:</span> {scholarship.amount}
                        </div>
                        <div>
                          <span className="font-medium">Eligibility:</span> {scholarship.eligibility}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3">
                      <Button variant="default" size="sm">Apply Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}