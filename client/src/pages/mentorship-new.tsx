import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Users, UserPlus, GraduationCap, Calendar, Search, Star, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { PageSkeleton } from "@/components/page-skeleton";
import MentorProfile from "@/components/MentorProfile";

export type MentorUser = User & {
  role?: string;
  expertise?: string;
  position?: string;
  university?: string;
  location?: string;
  languages?: string;
  menteeCount?: number;
};

const base = { password: "", userType: "mentor", avatarUrl: null, jobTitle: null, organization: null, graduationYear: null, createdAt: new Date() };

const mockMentors: MentorUser[] = [
  { ...base, id: 1, username: "rina_wijaya", displayName: "Rina Wijaya", email: "rina@example.com",
    bio: "Senior instructional designer with 8+ years in higher education and corporate training.",
    position: "Senior Learning Designer", university: "Universitas Indonesia",
    location: "Jakarta, Indonesia", expertise: "Instructional Design, E-Learning, LMS Administration",
    languages: "Indonesian, English", menteeCount: 12 },
  { ...base, id: 2, username: "budi_santoso", displayName: "Budi Santoso", email: "budi@example.com",
    bio: "Educational technology researcher focused on adaptive learning systems.",
    position: "EdTech Researcher", university: "Universitas Gadjah Mada",
    location: "Yogyakarta, Indonesia", expertise: "Learning Analytics, Adaptive Learning, Research Methods",
    languages: "Indonesian, English, Dutch", menteeCount: 7 },
  { ...base, id: 3, username: "dewi_kusuma", displayName: "Dewi Kusuma", email: "dewi@example.com",
    bio: "UX designer specializing in educational app design and accessibility.",
    position: "UX Designer", university: "Institut Teknologi Bandung",
    location: "Bandung, Indonesia", expertise: "UX Design, Accessibility, Figma, User Research",
    languages: "Indonesian, English", menteeCount: 9 },
  { ...base, id: 4, username: "arif_rahman", displayName: "Arif Rahman", email: "arif@example.com",
    bio: "Full-stack developer turned learning engineer. Bridges the gap between tech and pedagogy.",
    position: "Learning Engineer", university: "Universitas Airlangga",
    location: "Surabaya, Indonesia", expertise: "React, Node.js, xAPI, SCORM",
    languages: "Indonesian, English", menteeCount: 5 },
  { ...base, id: 5, username: "siti_hartati", displayName: "Siti Hartati", email: "siti@example.com",
    bio: "Corporate training specialist helping organizations build learning cultures.",
    position: "Corporate L&D Manager", university: "Universitas Brawijaya",
    location: "Malang, Indonesia", expertise: "Corporate Training, Needs Analysis, Blended Learning",
    languages: "Indonesian, English", menteeCount: 15 },
  { ...base, id: 6, username: "fajar_nugroho", displayName: "Fajar Nugroho", email: "fajar@example.com",
    bio: "Game-based learning designer creating engaging experiences for K-12 students.",
    position: "Game Learning Designer", university: "Universitas Negeri Jakarta",
    location: "Jakarta, Indonesia", expertise: "Game Design, Gamification, Unity, K-12 Education",
    languages: "Indonesian, English", menteeCount: 8 },
];

function MentorCard({ mentor, onView }: { mentor: MentorUser; onView: () => void }) {
  return (
    <div className="bg-white rounded-lg border p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border border-primary-100 flex-shrink-0">
          <AvatarImage src={mentor.avatarUrl ?? undefined} />
          <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
            {mentor.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{mentor.displayName}</h3>
          <p className="text-sm text-gray-500">{mentor.position}</p>
          <div className="flex items-center gap-1 mt-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-1">({mentor.menteeCount} mentees)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MapPin className="h-3 w-3 flex-shrink-0" />
        <span>{mentor.location}</span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>

      <div className="flex flex-wrap gap-1.5">
        {mentor.expertise?.split(",").slice(0, 3).map((skill, i) => (
          <Badge key={i} variant="outline" className="text-xs bg-primary-50 text-primary-700 border-primary-200">
            {skill.trim()}
          </Badge>
        ))}
      </div>

      <Button onClick={onView} className="w-full mt-auto" variant="outline">
        View Profile
      </Button>
    </div>
  );
}

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("mentors-list");
  const [search, setSearch] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<MentorUser | null>(null);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    staleTime: 1000 * 60 * 5,
  });

  const mentors = (users as MentorUser[] | undefined) ?? mockMentors;
  const filtered = mentors.filter(m =>
    m.displayName.toLowerCase().includes(search.toLowerCase()) ||
    (m.expertise ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (m.position ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (selectedMentor) {
    return (
      <div className="w-full space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedMentor(null)} className="gap-2 text-gray-600">
          <ArrowLeft className="h-4 w-4" /> Back to Mentors
        </Button>
        <MentorProfile
          mentor={selectedMentor}
          onRequestMentorship={() => {
            setSelectedMentor(null);
            setActiveTab("your-mentors");
          }}
        />
      </div>
    );
  }

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

      <Tabs defaultValue="mentors-list" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="mb-px bg-transparent h-auto gap-0 p-0">
            <TabsTrigger value="mentors-list" className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
              <Users className="mr-2 h-4 w-4" />
              Mentors List
            </TabsTrigger>
            <TabsTrigger value="your-mentors" className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Your Mentors
            </TabsTrigger>
            <TabsTrigger value="your-mentees" className="pb-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600">
              <GraduationCap className="mr-2 h-4 w-4" />
              Your Mentees
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mentors List */}
        <TabsContent value="mentors-list" className="pt-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, expertise, or role…"
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <PageSkeleton variant="members" count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Users className="h-7 w-7" />}
              title="No mentors found"
              description={search ? `No mentors match "${search}". Try a different search term.` : "No mentors are available yet. Check back soon."}
              action={search ? { label: "Clear search", onClick: () => setSearch("") } : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(mentor => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onView={() => setSelectedMentor(mentor)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Your Mentors */}
        <TabsContent value="your-mentors" className="pt-6">
          <EmptyState
            icon={<UserPlus className="h-7 w-7" />}
            title="No mentors yet"
            description="You haven't connected with any mentors. Browse the list and request a mentorship to get started."
            action={{ label: "Browse mentors", onClick: () => setActiveTab("mentors-list") }}
          />
        </TabsContent>

        {/* Your Mentees */}
        <TabsContent value="your-mentees" className="pt-6">
          <EmptyState
            icon={<GraduationCap className="h-7 w-7" />}
            title="No mentees yet"
            description="You're not mentoring anyone yet. Become a mentor to start guiding others in the EdTech community."
            action={{ label: "Become a mentor", onClick: () => {} }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
