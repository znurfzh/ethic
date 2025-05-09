import { Link } from "wouter";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Post, Resource, Event } from "@shared/schema";
import { 
  ArrowRight, Clock, Calendar, Users, MessageSquare, FileText,
  Sparkles, Search, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  // Fetch latest posts, resources, and events
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const [latestResources, setLatestResources] = useState<Resource[]>([]);
  
  // Get resources for the posts
  useEffect(() => {
    if (posts?.length) {
      // Get resources from first 3 posts
      const fetchResources = async () => {
        try {
          const resources: Resource[] = [];
          for (const post of posts.slice(0, 3)) {
            const res = await fetch(`/api/posts/${post.id}/resources`);
            if (res.ok) {
              const postResources = await res.json();
              resources.push(...postResources);
            }
          }
          setLatestResources(resources.slice(0, 4));
        } catch (error) {
          console.error("Error fetching resources:", error);
        }
      };
      
      fetchResources();
    }
  }, [posts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-700">ETHIC</h1>
              <p className="ml-3 text-gray-700 hidden sm:block">
                Educational Technology Hub for Indonesian Community
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth">
                <Button variant="outline" size="sm" className="mr-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-primary-600">Learn, Innovate, and Grow Together</span> with Indonesia's Educational Technology Community
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Join a vibrant community of educators, students, researchers, and professionals dedicated to advancing educational technology across Indonesia.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Join the Community
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">5,000+ Members</p>
                  <p className="text-sm text-gray-600">Active community</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">1,200+ Resources</p>
                  <p className="text-sm text-gray-600">Educational materials</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">300+ Projects</p>
                  <p className="text-sm text-gray-600">Innovation challenges</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1627556704302-624286467c65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1672&q=80" 
              alt="Indonesian students studying with technology" 
              className="rounded-lg shadow-xl max-h-[600px] object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* Latest Content Section */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Latest from Our Community</h2>
            <p className="mt-4 text-lg text-gray-600">
              Explore recent discussions, resources, and events from the ETHIC community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Latest Forum Posts */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary-600" />
                  Latest Discussions
                </h3>
                <Link href="/auth">
                  <Button variant="link" className="text-primary-600" size="sm">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {posts?.slice(0, 3).map(post => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="bg-primary-50 text-primary-700 py-1 px-2 rounded-full">
                          0 comments
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!posts || posts.length === 0) && (
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 text-center text-gray-500">
                      <p>Sign in to see the latest discussions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Latest Resources */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
                  Latest Resources
                </h3>
                <Link href="/auth">
                  <Button variant="link" className="text-primary-600" size="sm">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {latestResources?.slice(0, 3).map(resource => (
                  <Card key={resource.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{resource.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {resource.type}
                        </Badge>
                        <span className="text-gray-500">0 downloads</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!latestResources || latestResources.length === 0) && (
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 text-center text-gray-500">
                      <p>Sign in to see the latest resources</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Upcoming Events
                </h3>
                <Link href="/auth">
                  <Button variant="link" className="text-primary-600" size="sm">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {events?.slice(0, 3).map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description.substring(0, 100)}...</p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(event.eventDate).toLocaleDateString()}
                        </div>
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          {event.location}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {(!events || events.length === 0) && (
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 text-center text-gray-500">
                      <p>Sign in to see upcoming events</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Ready to join Indonesia's largest educational technology community?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
            Connect with peers, access valuable resources, participate in innovation challenges, and advance your career in educational technology.
          </p>
          <Link href="/auth">
            <Button size="lg" className="px-8">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ETHIC</h3>
              <p className="text-gray-400 mb-4">
                Educational Technology Hub for Indonesian Community
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Forum</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Events</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mentorship</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Information</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Code of Conduct</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ETHIC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}