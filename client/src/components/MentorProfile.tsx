import { User } from "@shared/schema";
import { MentorUser } from "@/pages/mentorship-new";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, MessageSquare, Star, BarChart, ChevronRight,
  MapPin, Briefcase, School, Users, Clock, BookOpen,
  FileText, Award, Check, Heart
} from "lucide-react";

interface MentorProfileProps {
  mentor: MentorUser;
  onRequestMentorship: () => void;
}

export default function MentorProfile({ mentor, onRequestMentorship }: MentorProfileProps) {
  // Use real data from mentor or fallback to demo data
  const mentorData = {
    bio: mentor.bio || "Experienced educational technology specialist with over 8 years of professional experience. I specialize in instructional design, e-learning development, and educational technology implementation in higher education settings. My approach to mentoring is collaborative and goal-oriented, focusing on both practical skills development and career advancement strategies.",
    position: mentor.position || "Senior Learning Designer",
    institution: mentor.university || "Universitas Negeri Jakarta",
    location: mentor.location || "Jakarta, Indonesia",
    languages: mentor.languages || "Indonesian, English",
    expertise: mentor.expertise?.split(",").map(skill => skill.trim()) || ["Instructional Design", "E-Learning Development", "Educational Technology", "Learning Analytics", "User Experience Design", "Project Management"],
    education: [
      { degree: "M.Ed. in Educational Technology", institution: "Universitas Indonesia", year: "2018" },
      { degree: "B.Ed. in Computer Science Education", institution: "Universitas Negeri Jakarta", year: "2015" }
    ],
    experience: [
      { position: "Senior Learning Designer", company: "EdTech Indonesia", duration: "2020 - Present" },
      { position: "Instructional Designer", company: "Global Learning Solutions", duration: "2017 - 2020" },
      { position: "E-Learning Developer", company: "Digital Education Institute", duration: "2015 - 2017" }
    ],
    mentorshipAreas: [
      "Career guidance in educational technology",
      "Instructional design portfolio development",
      "Educational technology project implementation",
      "E-learning content development strategies",
      "Building a professional network in EdTech"
    ],
    testimonials: [
      { author: "Siti Rahayu", role: "Instructional Designer", content: "Working with this mentor transformed my approach to e-learning design. Their guidance helped me secure a position at a leading EdTech company." },
      { author: "Budi Santoso", role: "Learning Experience Designer", content: "The mentorship I received was invaluable. I gained practical skills and insights that traditional education couldn't provide." }
    ]
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column - Profile Info */}
      <div className="lg:w-1/3">
        <div className="flex flex-col items-center text-center bg-white rounded-lg border p-6">
          <Avatar className="h-24 w-24 border-2 border-primary-100">
            <AvatarImage src={mentor.avatarUrl ? mentor.avatarUrl : undefined} />
            <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
              {mentor.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="mt-4 text-xl font-bold">{mentor.displayName}</h2>
          <p className="text-gray-600">{mentorData.position}</p>
          
          <div className="flex items-center mt-2 space-x-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium">5.0</span>
            <span className="text-sm text-gray-500">(12 mentees)</span>
          </div>
          
          <div className="w-full mt-6 space-y-3">
            <div className="flex items-center">
              <School className="h-5 w-5 text-gray-400 mr-3" />
              <span>{mentorData.institution}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3" />
              <span>{mentorData.location}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
              <span>Speaks {mentorData.languages}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-3" />
              <span>12 mentees</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-3" />
              <span>Usually responds within 24 hours</span>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="w-full">
            <h3 className="font-medium text-left mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {mentorData.expertise.map((skill, i) => (
                <Badge key={i} variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button className="w-full mt-6" onClick={onRequestMentorship}>
            Request Mentorship
          </Button>
        </div>
      </div>
      
      {/* Right Column - Tabs */}
      <div className="lg:w-2/3">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="about" className="px-4 py-2">About</TabsTrigger>
            <TabsTrigger value="mentorship" className="px-4 py-2">Mentorship</TabsTrigger>
            <TabsTrigger value="testimonials" className="px-4 py-2">Testimonials</TabsTrigger>
          </TabsList>
          
          {/* About Tab */}
          <TabsContent value="about" className="border rounded-lg mt-6 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Bio</h3>
                <p className="text-gray-700">{mentorData.bio}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Professional Experience</h3>
                <div className="space-y-4">
                  {mentorData.experience.map((exp, i) => (
                    <div key={i} className="flex">
                      <div className="mr-4 mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                        {i < mentorData.experience.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 ml-[3px] mt-1"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Education</h3>
                <div className="space-y-4">
                  {mentorData.education.map((edu, i) => (
                    <div key={i} className="flex">
                      <div className="mr-4 mt-1">
                        <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                        {i < mentorData.education.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 ml-[3px] mt-1"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Mentorship Tab */}
          <TabsContent value="mentorship" className="border rounded-lg mt-6 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Mentorship Approach</h3>
                <p className="text-gray-700">
                  My mentorship style is collaborative and adaptive to each mentee's needs. I believe in providing structured guidance while allowing space for personal growth and exploration. Our sessions will focus on practical skill development, career planning, and building a strong professional network in the educational technology field.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Areas of Focus</h3>
                <ul className="space-y-2">
                  {mentorData.mentorshipAreas.map((area, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">What to Expect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                      <h4 className="font-medium">Regular Sessions</h4>
                    </div>
                    <p className="text-sm text-gray-600">Bi-weekly 60-minute video calls to discuss progress and challenges</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
                      <h4 className="font-medium">Ongoing Support</h4>
                    </div>
                    <p className="text-sm text-gray-600">Message-based support between sessions for quick questions</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-primary-500 mr-2" />
                      <h4 className="font-medium">Resource Sharing</h4>
                    </div>
                    <p className="text-sm text-gray-600">Curated articles, tools, and resources tailored to your goals</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-2">
                      <Award className="h-5 w-5 text-primary-500 mr-2" />
                      <h4 className="font-medium">Goal Setting</h4>
                    </div>
                    <p className="text-sm text-gray-600">Structured goal-setting and progress tracking throughout our journey</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="border rounded-lg mt-6 p-6">
            <div className="space-y-6">
              {mentorData.testimonials.map((testimonial, i) => (
                <div key={i} className="border rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="italic text-gray-700 mb-4">"{testimonial.content}"</p>
                      <div>
                        <p className="font-medium">{testimonial.author}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}