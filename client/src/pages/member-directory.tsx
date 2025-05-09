import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  Mail,
  MapPin,
  Search,
  Users,
  BookOpen,
  GraduationCap,
  Award,
} from "lucide-react";

// Sample data since we don't have a real API for this
const mockMembers = [
  {
    id: 1,
    name: "Maya Pratama",
    username: "mayapratama",
    role: "Student",
    organization: "Universitas Negeri Jakarta",
    location: "Jakarta, Indonesia",
    tags: [
      "Instructional Design",
      "Educational Game Design",
      "Mobile Learning",
    ],
    isMentor: false,
    avatar: null,
  },
  {
    id: 2,
    name: "Dr. Wulan Sari",
    username: "wulansari",
    role: "Faculty",
    organization: "Universitas Indonesia",
    location: "Jakarta, Indonesia",
    tags: ["Adaptive Learning", "EdTech Research", "AI in Education"],
    isMentor: true,
    avatar: null,
  },
  {
    id: 3,
    name: "Rizki Pratama",
    username: "rizkipratama",
    role: "Practitioner",
    organization: "EdTech Solutions Inc.",
    location: "Bandung, Indonesia",
    tags: ["UX Design", "Product Management", "Gamification"],
    isMentor: true,
    avatar: null,
  },
  {
    id: 4,
    name: "Nia Putri",
    username: "niaputri",
    role: "Alumni",
    organization: "Google",
    location: "Jakarta, Indonesia",
    tags: ["Learning Design", "Project Management", "Curriculum Development"],
    isMentor: true,
    avatar: null,
  },
  {
    id: 5,
    name: "Budi Santoso",
    username: "budisantoso",
    role: "Student",
    organization: "Institut Teknologi Bandung",
    location: "Bandung, Indonesia",
    tags: ["Programming", "Web Development", "Educational Software"],
    isMentor: false,
    avatar: null,
  },
  {
    id: 6,
    name: "Maya Anggraini",
    username: "mayaanggraini",
    role: "Practitioner",
    organization: "Ruangguru",
    location: "Jakarta, Indonesia",
    tags: ["Content Development", "Video Production", "E-Learning"],
    isMentor: true,
    avatar: null,
  },
  {
    id: 7,
    name: "Kari Nugraha",
    username: "karinugraha",
    role: "Alumni",
    organization: "Universitas Negeri Jakarta",
    location: "Jakarta, Indonesia",
    tags: ["Community Learning", "Informal Learning", "Educational Sociology"],
    isMentor: true,
    avatar: null,
  },
];

export default function MemberDirectoryPage() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Parse the URL to extract highlight parameter
  const urlParams = new URLSearchParams(window.location.search);
  const highlightUsername = urlParams.get("highlight");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // In a real app, we'd fetch this from the API
  const { data: members = mockMembers, isLoading } = useQuery<
    typeof mockMembers
  >({
    queryKey: ["/api/users"],
    // This is mock data, so we're not actually fetching
    queryFn: () => Promise.resolve(mockMembers),
  });

  const featuredMembers = members
    .filter((member) => member.isMentor)
    .slice(0, 3);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchQuery === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesRole = roleFilter === "All" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full">
      {/* Member Directory Title and Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Community Directory
        </h2>
        <p className="text-gray-600">
          Connect with peers, mentors, and professionals in educational
          technology
        </p>
      </div>

      {/* Featured Mentors Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Featured Mentors
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden hover:shadow-md transition-all"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary-100 text-primary-600">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <CardTitle className="text-lg">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm mt-1">
                      <Briefcase className="h-3 w-3 mr-1 text-gray-400" />
                      {member.role} at {member.organization}
                    </CardDescription>
                    <CardDescription className="flex items-center text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {member.location}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-1 mt-2">
                  {member.tags.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                >
                  <Mail className="h-4 w-4 mr-1" /> Message
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary-600"
                >
                  <Users className="h-4 w-4 mr-1" /> Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Member Directory Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Directory
          </h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or skill"
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
                <SelectItem value="Alumni">Alumni</SelectItem>
                <SelectItem value="Faculty">Faculty</SelectItem>
                <SelectItem value="Practitioner">
                  Practitioners
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <Card
                key={member.id}
                className={`hover:shadow-sm transition-shadow ${
                  highlightUsername === member.username
                    ? "border-2 border-primary-500 shadow-md"
                    : ""
                }`}
              >
                <CardContent
                  className={`p-4 ${
                    highlightUsername === member.username
                      ? "bg-primary-50"
                      : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="text-lg bg-primary-100 text-primary-600">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            {member.name}
                            {member.isMentor && (
                              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                Mentor
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="flex items-center mr-3">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {member.role} at {member.organization}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {member.location}
                            </span>
                          </p>
                        </div>

                        <div className="flex mt-3 md:mt-0 space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600"
                          >
                            <Mail className="h-4 w-4 mr-1" /> Message
                          </Button>
                          {member.username === "karinugraha" ? (
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="bg-gradient-to-r from-primary-600 to-primary-500"
                              onClick={() => setLocation("/mentorship?request=karinugraha")}
                            >
                              <Award className="h-4 w-4 mr-1" /> Request Mentorship
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-primary-600"
                            >
                              <Users className="h-4 w-4 mr-1" /> Connect
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No members found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}