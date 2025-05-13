import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, Clock, User, Share2, Bookmark, MessageCircle, ThumbsUp, 
         ChevronLeft, FileText, Award, DownloadIcon, ExternalLink } from "lucide-react";

// This is Kari's Community-Based Learning resource
const resourceData = {
  id: 1,
  title: "Community-Based Learning: Applying Educational Sociology in Practice",
  type: "PDF",
  description: "A case study on how social interactions and dynamics influence learning outcomes in community education initiatives",
  fullDescription: `This resource presents a detailed case study on implementing community-based learning initiatives through the lens of educational sociology. It explores how understanding social dynamics and interactions can significantly impact learning outcomes in diverse community settings.

The paper provides both theoretical frameworks and practical examples from a project conducted in rural Indonesia, where educational technology was integrated with traditional community learning approaches. The results demonstrate how sociological principles can be applied to create more effective and culturally relevant educational experiences.

Key topics covered include:
- Theoretical foundations of educational sociology
- Community dynamics and their impact on learning
- Practical application methods and challenges
- Evaluation metrics for community-based educational initiatives
- Success stories and lessons learned from implementation

This resource is particularly valuable for educators, educational technology specialists, and program designers looking to create more socially aware and community-integrated learning experiences.`,
  url: "#",
  fileSize: "2.4 MB",
  pageCount: 28,
  authorId: 3,
  authorName: "Kari Dewanto",
  authorRole: "Alumni",
  authorOrganization: "EdTech Solutions Indonesia",
  topics: ["Educational Sociology", "Community Learning", "Practical Application"],
  createdAt: "2024-02-15T10:30:00Z",
  downloadCount: 427,
  citations: 12,
  featured: true,
  relatedResources: [
    {
      id: 2,
      title: "Mobile Learning: Best Practices for Indonesian Educators",
      type: "Video",
      authorName: "Kari Dewanto"
    },
    {
      id: 3,
      title: "Designing Effective Online Assessments",
      type: "Presentation",
      authorName: "Kari Dewanto"
    }
  ]
};

export default function ResourceDetailPage() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get resource ID from URL
  const resourceId = location.split('/').pop();
  
  // In a real app, we would fetch data based on the ID
  // Here we're using mock data for Kari's resource
  const { data: resource, isLoading } = useQuery({
    queryKey: ["/api/resources", resourceId],
    // This is mock data, so we're not actually fetching
    queryFn: () => Promise.resolve(resourceData),
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  if (isLoading) {
    return <div className="py-12 text-center">Loading resource details...</div>;
  }
  
  if (!resource) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
        <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/resources">Back to Resources</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4"
          onClick={() => setLocation('/resources')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Resources
        </Button>
      </div>
      
      {/* Resource header section */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary-100 text-primary-800">
                {resource.type}
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                {formatDate(resource.createdAt)}
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                Featured
              </Badge>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {resource.title}
            </h1>
            
            <p className="text-gray-600 mb-4 max-w-3xl">
              {resource.description}
            </p>
            
            <div className="flex items-center text-sm text-gray-600">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                By <Link href={`/hub?tab=members&user=${resource.authorId}`} className="text-primary-600 hover:underline ml-1">
                  {resource.authorName}
                </Link>
                <span className="ml-1 text-gray-500">({resource.authorRole} • {resource.authorOrganization})</span>
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm" onClick={(e) => {
              e.preventDefault();
              alert("This would download the resource. This feature is not yet implemented in the prototype.");
            }}>
              <DownloadCloud className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>
      
      {/* Resource content tabs */}
      <Tabs defaultValue="overview" className="bg-white border rounded-lg p-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-6">
          <TabsTrigger value="overview" onClick={() => setActiveTab("overview")} className="px-4 py-2">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="reviews" onClick={() => setActiveTab("reviews")} className="px-4 py-2">
            <MessageCircle className="h-4 w-4 mr-2" />
            Discussion
          </TabsTrigger>
          <TabsTrigger value="citations" onClick={() => setActiveTab("citations")} className="px-4 py-2">
            <Award className="h-4 w-4 mr-2" />
            Citations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About this Resource</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{resource.fullDescription}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Related Resources</h2>
                <div className="space-y-4">
                  {resource.relatedResources.map(relatedResource => (
                    <Card key={relatedResource.id} className="overflow-hidden hover:shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              <span 
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert("This related resource is not yet available. Only the main Community-Based Learning resource is accessible in this prototype.");
                                }}
                                className="cursor-pointer hover:text-primary-600 transition-colors"
                              >
                                {relatedResource.title}
                              </span>
                            </h4>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Badge className="mr-2" variant="secondary">{relatedResource.type}</Badge>
                              <span>By {relatedResource.authorName}</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("This related resource is not yet available. Only the main Community-Based Learning resource is accessible in this prototype.");
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resource Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Resource Type</span>
                    <span className="font-medium">{resource.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">File Size</span>
                    <span className="font-medium">{resource.fileSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pages</span>
                    <span className="font-medium">{resource.pageCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Downloads</span>
                    <span className="font-medium">{resource.downloadCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Published</span>
                    <span className="font-medium">{formatDate(resource.createdAt)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={(e) => {
                    e.preventDefault();
                    alert("This would download the resource. This feature is not yet implemented in the prototype.");
                  }}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download Resource
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resource.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Added to Learning Paths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Digital Assessment Strategies</p>
                      <p className="text-xs text-gray-500">34 learners enrolled</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Educational Research Methods</p>
                      <p className="text-xs text-gray-500">21 learners enrolled</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Discussion (7)</h2>
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Discussion
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Sample discussion thread */}
            <Card>
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                    F
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Maya Pratama</p>
                        <p className="text-sm text-gray-500">Student</p>
                      </div>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-700">Thank you for sharing this resource! I'm currently taking an Educational Sociology course, and I'm struggling to see how theoretical concepts apply to real-world situations. Could you share more specific examples of how you implemented these sociological principles in your community project?</p>
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        3 Likes
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-gray-700">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Reply
                      </button>
                    </div>
                    
                    {/* Reply to the discussion */}
                    <div className="mt-4 pl-6 border-l-2 border-gray-100">
                      <div className="flex gap-3 mt-4">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                          K
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Kari Dewanto</p>
                              <p className="text-sm text-gray-500">Author • Alumni</p>
                            </div>
                            <p className="text-sm text-gray-500">1 day ago</p>
                          </div>
                          <div className="mt-2">
                            <p className="text-gray-700">Hi Maya, thanks for your question! In our project, we applied Vygotsky's zone of proximal development theory by having community elders work alongside younger members in collaborative tasks. This created natural scaffolding where cultural knowledge and technical skills were exchanged between generations. We documented these interactions and found that learning outcomes improved significantly compared to more traditional approaches. I'd be happy to discuss this more - feel free to message me directly!</p>
                          </div>
                          <div className="flex gap-4 mt-3 text-sm">
                            <button className="flex items-center text-gray-500 hover:text-gray-700">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              5 Likes
                            </button>
                            <button className="flex items-center text-gray-500 hover:text-gray-700">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="citations" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Citation Information</h2>
            <p className="text-gray-600">Use the following information to cite this resource in your papers, projects, and presentations.</p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">APA 7th Edition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                  Dewanto, K. (2024). <em>Community-Based Learning: Applying Educational Sociology in Practice</em>. EdTech Solutions Indonesia. ETHIC Educational Resource Repository.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Copy Citation
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">MLA 9th Edition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                  Dewanto, Kari. "Community-Based Learning: Applying Educational Sociology in Practice." <em>ETHIC Educational Resource Repository</em>, EdTech Solutions Indonesia, 15 Feb. 2024.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Copy Citation
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chicago Style</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                  Dewanto, Kari. 2024. "Community-Based Learning: Applying Educational Sociology in Practice." ETHIC Educational Resource Repository. EdTech Solutions Indonesia. February 15, 2024.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Copy Citation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}