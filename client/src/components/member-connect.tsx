import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

// Sample member data
const suggestedMembers = [
  {
    id: 1,
    name: "Dr. Wulan Sari",
    role: "Faculty",
    skills: ["Adaptive Learning", "EdTech Research"],
    avatar: null,
  },
  {
    id: 2,
    name: "Rizki Pratama",
    role: "Practitioner",
    skills: ["UX Design", "Product Management"],
    avatar: null,
  },
  {
    id: 3,
    name: "Kari Nugraha",
    role: "Alumni",
    skills: ["Community Learning", "Educational Sociology"],
    avatar: null,
  },
];

export default function MemberConnect() {
  const [members] = useState(suggestedMembers);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Connect With Members</CardTitle>
        <CardDescription>
          Suggested members to connect with based on your interests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-50 text-primary-700">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role}</div>
                  <div className="flex gap-1 mt-1">
                    {member.skills.slice(0, 2).map((skill, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs px-1 py-0 h-5"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Connect</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}