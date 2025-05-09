import { useState } from "react";
import { Link } from "wouter";
import {
  Search,
  Filter,
  MessageSquare,
  MessageCircle,
  Users,
  Tag,
  TrendingUp,
  Clock,
  Heart,
  Bookmark,
  Share2,
  PlusCircle,
  Flag,
  ThumbsUp,
  Reply,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function ForumPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedThread, setSelectedThread] = useState(null);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTopic, setNewPostTopic] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyToComment, setReplyToComment] = useState(null);

  // Mock data for forum topics
  const forumTopics = [
    {
      id: "instructional-design",
      name: "Instructional Design",
      icon: <BookIcon className="h-5 w-5 text-amber-500 mr-3" />,
      color: "amber",
      count: 28,
    },
    {
      id: "learning-analytics",
      name: "Learning Analytics",
      icon: <ChartIcon className="h-5 w-5 text-blue-500 mr-3" />,
      color: "blue",
      count: 16,
    },
    {
      id: "mobile-learning",
      name: "Mobile Learning",
      icon: <MobileIcon className="h-5 w-5 text-green-500 mr-3" />,
      color: "green",
      count: 22,
    },
    {
      id: "ai-in-education",
      name: "AI in Education",
      icon: <RobotIcon className="h-5 w-5 text-purple-500 mr-3" />,
      color: "purple",
      count: 31,
    },
    {
      id: "assessment",
      name: "Assessment & Evaluation",
      icon: <ClipboardIcon className="h-5 w-5 text-red-500 mr-3" />,
      color: "red",
      count: 18,
    },
  ];

  // Mock data for forum threads
  const forumThreads = [
    {
      id: 1,
      title: "Best practices for designing effective online assessments?",
      content:
        "I'm working on creating summative assessments for an online course on data science. What are some effective practices to ensure academic integrity while also making the assessments meaningful and authentic?",
      authorId: 1,
      authorName: "Maya Wijaya",
      authorRole: "Instructional Designer",
      authorAvatar: null,
      topicId: "assessment",
      tags: ["online learning", "assessment", "academic integrity"],
      createdAt: "2023-03-15T08:30:00",
      views: 124,
      likes: 18,
      comments: 7,
      isPinned: true,
      isHot: true,
      lastActivity: "2023-03-17T14:22:00",
    },
    {
      id: 2,
      title: "Implementing learning analytics dashboard for higher education",
      content:
        "I'm part of a team working on implementing a learning analytics dashboard at our university. We're trying to determine what metrics would be most valuable for both instructors and students. Any experiences or suggestions?",
      authorId: 2,
      authorName: "Dr. Budi Santoso",
      authorRole: "EdTech Researcher",
      authorAvatar: null,
      topicId: "learning-analytics",
      tags: ["learning analytics", "data visualization", "higher ed"],
      createdAt: "2023-03-10T10:15:00",
      views: 89,
      likes: 12,
      comments: 5,
      isPinned: false,
      isHot: true,
      lastActivity: "2023-03-15T09:45:00",
    },
    {
      id: 3,
      title: "Mobile learning strategies for limited connectivity areas",
      content:
        "I'm developing educational apps for rural areas in Indonesia with limited internet connectivity. What strategies have worked well for delivering educational content in similar contexts?",
      authorId: 3,
      authorName: "Rina Putri",
      authorRole: "Educational App Developer",
      authorAvatar: null,
      topicId: "mobile-learning",
      tags: ["mobile learning", "offline access", "rural education"],
      createdAt: "2023-03-08T15:45:00",
      views: 76,
      likes: 14,
      comments: 6,
      isPinned: false,
      isHot: false,
      lastActivity: "2023-03-12T11:30:00",
    },
    {
      id: 4,
      title: "Using AI to personalize learning pathways - ethical considerations",
      content:
        "Our team is exploring using AI to create personalized learning pathways for students. While the potential benefits are significant, I'm concerned about ethical implications. How do we balance personalization with privacy and autonomy?",
      authorId: 4,
      authorName: "Arief Hidayat, Ph.D.",
      authorRole: "AI Ethics Researcher",
      authorAvatar: null,
      topicId: "ai-in-education",
      tags: ["AI", "personalization", "ethics", "privacy"],
      createdAt: "2023-03-05T09:20:00",
      views: 152,
      likes: 27,
      comments: 12,
      isPinned: false,
      isHot: true,
      lastActivity: "2023-03-14T16:50:00",
    },
    {
      id: 5,
      title: "Instructional design models for problem-based learning",
      content:
        "I'm redesigning our engineering curriculum to incorporate more problem-based learning approaches. What instructional design models have worked well for creating authentic problem scenarios?",
      authorId: 5,
      authorName: "Fajar Nugroho",
      authorRole: "Engineering Educator",
      authorAvatar: null,
      topicId: "instructional-design",
      tags: ["PBL", "engineering education", "instructional design"],
      createdAt: "2023-03-02T13:10:00",
      views: 63,
      likes: 9,
      comments: 4,
      isPinned: false,
      isHot: false,
      lastActivity: "2023-03-07T10:25:00",
    },
  ];

  // Get filtered and sorted threads
  const filteredThreads = forumThreads
    .filter((thread) => {
      // Apply topic filter
      if (topicFilter !== "all" && thread.topicId !== topicFilter) {
        return false;
      }

      // Apply search filter if search term exists
      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        return (
          thread.title.toLowerCase().includes(searchLower) ||
          thread.content.toLowerCase().includes(searchLower) ||
          thread.authorName.toLowerCase().includes(searchLower) ||
          thread.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "recent") {
        return (
          new Date(b.lastActivity).getTime() -
          new Date(a.lastActivity).getTime()
        );
      } else if (sortBy === "popular") {
        return b.views + b.likes * 3 - (a.views + a.likes * 3);
      } else if (sortBy === "most-commented") {
        return b.comments - a.comments;
      }

      return 0;
    });

  // Mock comments data for the selected thread
  const mockComments = [
    {
      id: 101,
      threadId: 1,
      parentId: null,
      authorName: "Eko Prabowo",
      authorRole: "Assessment Specialist",
      authorAvatar: null,
      content:
        "Great question! I've found that using authentic assessments tied to real-world scenarios works well. Instead of traditional tests, consider project-based assessments where students apply knowledge to solve realistic problems.",
      createdAt: "2023-03-15T10:15:00",
      likes: 5,
      isVerified: true,
    },
    {
      id: 102,
      threadId: 1,
      parentId: 101,
      authorName: "Maya Wijaya",
      authorRole: "Instructional Designer",
      authorAvatar: null,
      content:
        "Thanks for the suggestion, Eko! Do you have examples of how you've implemented this in STEM subjects?",
      createdAt: "2023-03-15T11:22:00",
      likes: 2,
      isVerified: false,
    },
    {
      id: 103,
      threadId: 1,
      parentId: 102,
      authorName: "Eko Prabowo",
      authorRole: "Assessment Specialist",
      authorAvatar: null,
      content:
        "Absolutely! For data science, you could have students analyze a real dataset and create a dashboard or report with insights. The key is to make it unique enough that solutions can't be easily shared.",
      createdAt: "2023-03-15T14:05:00",
      likes: 3,
      isVerified: true,
    },
    {
      id: 104,
      threadId: 1,
      parentId: null,
      authorName: "Dr. Nadia Rahman",
      authorRole: "Education Researcher",
      authorAvatar: null,
      content:
        "I'd add that using randomized parameters in problems can help maintain academic integrity while still testing the same concepts. Each student gets a slightly different version of the same problem.",
      createdAt: "2023-03-16T09:30:00",
      likes: 7,
      isVerified: true,
    },
    {
      id: 105,
      threadId: 1,
      parentId: 104,
      authorName: "Bima Arya",
      authorRole: "Lecturer",
      authorAvatar: null,
      content:
        "We've implemented this approach at our university. We use a tool that generates different numerical values for each student but tests the same concepts. It's been quite effective!",
      createdAt: "2023-03-16T11:45:00",
      likes: 4,
      isVerified: false,
    },
    {
      id: 106,
      threadId: 1,
      parentId: null,
      authorName: "Siti Aminah",
      authorRole: "Curriculum Developer",
      authorAvatar: null,
      content:
        "Don't forget about the importance of clear rubrics when using authentic assessments. When students understand exactly how they'll be evaluated, they tend to focus more on learning than on finding shortcuts.",
      createdAt: "2023-03-17T08:15:00",
      likes: 6,
      isVerified: false,
    },
  ];

  // Function to create a threaded structure of comments
  const createThreadedComments = (comments) => {
    // Create a map of comments by ID
    const commentsById = comments.reduce((acc, c) => {
      acc[c.id] = { ...c, replies: [] };
      return acc;
    }, {});

    // Create a threaded structure
    const threaded = [];
    comments.forEach((parent) => {
      if (!parent.parentId) {
        threaded.push(commentsById[parent.id]);
      } else {
        commentsById[parent.parentId].replies.push(commentsById[parent.id]);
      }
    });

    return threaded;
  };

  const threadedComments =
    selectedThread && mockComments
      ? createThreadedComments(
          mockComments.filter((c) => c.threadId === selectedThread.id),
        )
      : [];

  const handleSubmitNewPost = () => {
    if (!newPostTitle || !newPostContent) {
      return;
    }

    // Mock submission - in a real app this would call an API
    console.log("New post:", {
      title: newPostTitle,
      content: newPostContent,
      topic: newPostTopic,
      tags: newPostTags.split(",").map((tag) => tag.trim()),
    });

    // Close dialog and reset form
    setNewPostOpen(false);
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostTopic("");
    setNewPostTags("");
  };

  const handleSubmitReply = (commentId = null) => {
    if (!replyContent) return;

    // Mock submission - in a real app this would call an API
    console.log("Reply:", {
      content: replyContent,
      threadId: selectedThread?.id,
      parentId: commentId,
    });

    // Reset form and hide reply box
    setReplyContent("");
    setShowReplyBox(false);
    setReplyToComment(null);
  };

  // Custom icons for forum categories
  function BookIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    );
  }

  function ChartIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    );
  }

  function MobileIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    );
  }

  function RobotIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="10" x="3" y="11" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" x2="8" y1="16" y2="16" />
        <line x1="16" x2="16" y1="16" y2="16" />
      </svg>
    );
  }

  function ClipboardIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      </svg>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Actions */}
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
                    {selectedThread.tags.map((tag) => (
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
                        {selectedThread.authorName?.[0]}
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
                        {new Date(selectedThread.createdAt).toLocaleString()}
                      </p>
                      <div className="prose max-w-none mb-4">
                        <p>{selectedThread.content}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <button className="flex items-center gap-2 hover:text-primary-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{selectedThread.likes}</span>
                        </button>
                        <button
                          className="flex items-center gap-2 hover:text-primary-600"
                          onClick={() => {
                            setShowReplyBox(true);
                            setReplyToComment(null);
                          }}
                        >
                          <Reply className="h-4 w-4" />
                          <span>Reply</span>
                        </button>
                        <span className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{selectedThread.comments} comments</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{selectedThread.views} views</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reply Box */}
              {showReplyBox && !replyToComment && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary-100 text-primary-600">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={4}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowReplyBox(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSubmitReply()}
                          >
                            Post Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Comments ({selectedThread.comments})
                </h3>

                {threadedComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-primary-100 text-primary-600">
                            {comment.authorName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {comment.authorName}
                            </span>
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5"
                            >
                              {comment.authorRole}
                            </Badge>
                            {comment.isVerified && (
                              <Badge className="bg-green-100 text-green-700 border-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                          <div className="prose prose-sm max-w-none mb-3">
                            <p>{comment.content}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <button className="flex items-center gap-1 hover:text-primary-600">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{comment.likes}</span>
                            </button>
                            <button
                              className="flex items-center gap-1 hover:text-primary-600"
                              onClick={() => {
                                setShowReplyBox(true);
                                setReplyToComment(comment.id);
                              }}
                            >
                              <Reply className="h-3 w-3" />
                              <span>Reply</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-red-600">
                              <Flag className="h-3 w-3" />
                              <span>Report</span>
                            </button>
                          </div>

                          {/* Replies to this comment */}
                          {comment.replies.length > 0 && (
                            <div className="pl-6 border-l-2 border-gray-100 space-y-4">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="pt-4"
                                >
                                  <div className="flex space-x-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs bg-primary-100 text-primary-600">
                                        {reply.authorName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">
                                          {reply.authorName}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0 text-[10px]"
                                        >
                                          {reply.authorRole}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        {new Date(
                                          reply.createdAt,
                                        ).toLocaleString()}
                                      </p>
                                      <div className="prose prose-sm max-w-none mb-2">
                                        <p className="text-sm">
                                          {reply.content}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <button className="flex items-center gap-1 hover:text-primary-600">
                                          <ThumbsUp className="h-3 w-3" />
                                          <span>{reply.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-1 hover:text-red-600">
                                          <Flag className="h-3 w-3" />
                                          <span>Report</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply box for this comment */}
                          {showReplyBox && replyToComment === comment.id && (
                            <div className="mt-4 pl-6 border-l-2 border-gray-100">
                              <div className="flex space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-primary-100 text-primary-600">
                                    U
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                  <Textarea
                                    placeholder="Write your reply..."
                                    value={replyContent}
                                    onChange={(e) =>
                                      setReplyContent(e.target.value)
                                    }
                                    rows={3}
                                    className="text-sm"
                                  />
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={() => {
                                        setShowReplyBox(false);
                                        setReplyToComment(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-8 text-xs"
                                      onClick={() =>
                                        handleSubmitReply(comment.id)
                                      }
                                    >
                                      Post Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Forum Threads List View
            <div className="space-y-4">
              {/* Pinned Threads */}
              {filteredThreads.some((thread) => thread.isPinned) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Pinned Topics</h3>
                  {filteredThreads
                    .filter((thread) => thread.isPinned)
                    .map((thread) => (
                      <Card
                        key={thread.id}
                        className="mb-3 hover:shadow-md cursor-pointer transition-shadow"
                        onClick={() => setSelectedThread(thread)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="mt-1">
                              <AvatarFallback className="bg-primary-100 text-primary-600">
                                {thread.authorName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 flex items-center gap-2">
                                {thread.title}
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                  Pinned
                                </Badge>
                                {thread.isHot && (
                                  <Badge className="bg-red-100 text-red-700 border-red-200">
                                    Hot
                                  </Badge>
                                )}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 mb-2 text-sm text-gray-500">
                                <span>By {thread.authorName}</span>
                                <span>
                                  {new Date(
                                    thread.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`bg-${
                                    forumTopics.find(
                                      (t) => t.id === thread.topicId,
                                    )?.color
                                  }-100 text-${
                                    forumTopics.find(
                                      (t) => t.id === thread.topicId,
                                    )?.color
                                  }-700 border-${
                                    forumTopics.find(
                                      (t) => t.id === thread.topicId,
                                    )?.color
                                  }-200`}
                                >
                                  {
                                    forumTopics.find(
                                      (t) => t.id === thread.topicId,
                                    )?.name
                                  }
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {thread.content}
                              </p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {thread.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4" />
                                  {thread.comments}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4" />
                                  {thread.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    Last activity{" "}
                                    {new Date(
                                      thread.lastActivity,
                                    ).toLocaleDateString()}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}

              {/* Regular Threads */}
              <div>
                <h3 className="text-lg font-medium mb-3">Recent Discussions</h3>
                {filteredThreads
                  .filter((thread) => !thread.isPinned)
                  .map((thread) => (
                    <Card
                      key={thread.id}
                      className="mb-3 hover:shadow-md cursor-pointer transition-shadow"
                      onClick={() => setSelectedThread(thread)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="mt-1">
                            <AvatarFallback className="bg-primary-100 text-primary-600">
                              {thread.authorName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 flex items-center gap-2">
                              {thread.title}
                              {thread.isHot && (
                                <Badge className="bg-red-100 text-red-700 border-red-200">
                                  Hot
                                </Badge>
                              )}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 mb-2 text-sm text-gray-500">
                              <span>By {thread.authorName}</span>
                              <span>
                                {new Date(thread.createdAt).toLocaleDateString()}
                              </span>
                              <Badge
                                variant="outline"
                                className={`bg-${
                                  forumTopics.find(
                                    (t) => t.id === thread.topicId,
                                  )?.color
                                }-100 text-${
                                  forumTopics.find(
                                    (t) => t.id === thread.topicId,
                                  )?.color
                                }-700 border-${
                                  forumTopics.find(
                                    (t) => t.id === thread.topicId,
                                  )?.color
                                }-200`}
                              >
                                {
                                  forumTopics.find(
                                    (t) => t.id === thread.topicId,
                                  )?.name
                                }
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {thread.content}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {thread.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {thread.comments}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {thread.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Last activity{" "}
                                  {new Date(
                                    thread.lastActivity,
                                  ).toLocaleDateString()}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {filteredThreads.filter((thread) => !thread.isPinned).length ===
                  0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">
                        No discussions match your filters. Try adjusting your
                        search criteria or{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto text-primary-600"
                          onClick={() => setNewPostOpen(true)}
                        >
                          start a new discussion
                        </Button>
                        .
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
