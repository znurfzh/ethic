import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Search, Users } from "lucide-react";
import { Link } from "wouter";

export default function HubEventsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch events from the API
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  // Filter events based on search query
  const filteredEvents = events?.filter(event => 
    searchQuery === "" || 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  return (
    <div className="w-full">
      {/* Events Title and Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Community Events</h2>
        <p className="text-gray-600">Connect with like-minded professionals at our educational technology events</p>
      </div>
          
      {/* Events Content */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search events" 
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {filteredEvents.map(event => (
              <Card key={event.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="bg-primary-100 text-primary-600 p-4 rounded text-center min-w-[100px] h-fit">
                      <div className="text-sm font-semibold">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-3xl font-bold">
                        {new Date(event.eventDate).getDate()}
                      </div>
                      <div className="text-xs mt-1">
                        {new Date(event.eventDate).getFullYear()}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" /> 
                          {new Date(event.eventDate).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" /> 
                          {new Date(event.eventDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} WIB
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" /> 
                          {event.location || "Online"}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">
                        {event.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button variant="default">Register Now</Button>
                        <Button variant="outline">Add to Calendar</Button>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" /> 
                          Registration open
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        )}
        
        {/* Fallback for when there are no events from API */}
        {events?.length === 0 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded text-center min-w-[100px] h-fit">
                    <div className="text-sm font-semibold">Apr</div>
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-xs mt-1">2025</div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Future of EdTech in Indonesia</h3>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> Wednesday, April 24, 2025
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> 7:00 PM - 9:00 PM WIB
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> Online (Zoom)
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">
                      Join us for an insightful webinar discussing the future landscape of Educational Technology in Indonesia. 
                      Industry leaders and educators will share their insights on upcoming trends, challenges, and opportunities.
                    </p>
                    
                    <div className="flex gap-2">
                      <Button variant="default">Register Now</Button>
                      <Button variant="outline">Add to Calendar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded text-center min-w-[100px] h-fit">
                    <div className="text-sm font-semibold">Apr</div>
                    <div className="text-3xl font-bold">30</div>
                    <div className="text-xs mt-1">2025</div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Workshop: Interactive Learning Design</h3>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> Tuesday, April 30, 2025
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> 10:00 AM - 3:00 PM WIB
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> Jakarta Convention Center
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">
                      A hands-on workshop focused on designing engaging and interactive learning experiences.
                      Participants will learn practical techniques for creating educational content that captivates students.
                    </p>
                    
                    <div className="flex gap-2">
                      <Button variant="default">Register Now</Button>
                      <Button variant="outline">Add to Calendar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-primary-100 text-primary-600 p-4 rounded text-center min-w-[100px] h-fit">
                    <div className="text-sm font-semibold">May</div>
                    <div className="text-3xl font-bold">5</div>
                    <div className="text-xs mt-1">2025</div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Networking: EdTech Alumni Gathering</h3>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" /> Monday, May 5, 2025
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> 4:00 PM - 8:00 PM WIB
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> Bandung Digital Hub
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">
                      Connect with fellow educational technology professionals and alumni at this networking event.
                      Share experiences, build connections, and explore collaboration opportunities.
                    </p>
                    
                    <div className="flex gap-2">
                      <Button variant="default">Register Now</Button>
                      <Button variant="outline">Add to Calendar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}