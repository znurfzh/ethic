import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { 
  Users, UserPlus, GraduationCap, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

// Extended user type with mentorship-specific fields
export type MentorUser = User & {
  role?: string;
  expertise?: string;
  position?: string;
  university?: string;
  location?: string;
  languages?: string;
  menteeCount?: number;
};

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("mentors-list");
  
  // Simplified version to get the app running again
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mentorship</h1>
          <p className="text-gray-500 mt-1">
            Connect with experienced mentors in educational technology to accelerate your growth.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" className="text-primary-600">
            <Calendar className="mr-2 h-4 w-4" />
            Scheduled Sessions
          </Button>
          <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Become a Mentor
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="mentors-list" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="mb-px">
            <TabsTrigger value="mentors-list" className="pb-3">
              <Users className="mr-2 h-4 w-4" />
              Mentors List
            </TabsTrigger>
            <TabsTrigger value="your-mentors" className="pb-3">
              <UserPlus className="mr-2 h-4 w-4" />
              Your Mentors
            </TabsTrigger>
            <TabsTrigger value="your-mentees" className="pb-3">
              <GraduationCap className="mr-2 h-4 w-4" />
              Your Mentees
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Tab Content */}
        <TabsContent value="mentors-list" className="pt-6">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium">Mentors List</h3>
            <p className="text-gray-500 mt-2">This section will display a list of available mentors.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="your-mentors" className="pt-6">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium">Your Mentors</h3>
            <p className="text-gray-500 mt-2">This section will display your current mentors.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="your-mentees" className="pt-6">
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium">Your Mentees</h3>
            <p className="text-gray-500 mt-2">This section will display your current mentees.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}