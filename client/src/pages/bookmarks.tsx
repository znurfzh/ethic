import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/navbar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, Loader2, Search, Trash2, BookOpen, FileText, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface BookmarkItem {
  id: number;
  type: string;
  title: string;
  description: string;
  authorName: string;
  bookmarkedAt: string;
  url?: string;
}

// Sample bookmarks data
const mockBookmarks: BookmarkItem[] = [
  {
    id: 1,
    type: "post",
    title: "Best Practices for Designing Effective Learning Materials",
    description: "A comprehensive guide to creating engaging and effective educational content for diverse learners.",
    authorName: "Budi Santoso",
    bookmarkedAt: "2024-04-02T09:15:00Z"
  },
  {
    id: 2,
    type: "resource",
    title: "Educational Technology Tools Comparison Chart",
    description: "A detailed comparison of popular educational technology tools with pros, cons, and recommended use cases.",
    authorName: "Dewi Anggraini",
    bookmarkedAt: "2024-03-25T14:30:00Z"
  },
  {
    id: 3,
    type: "learningPath",
    title: "Introduction to Educational Technology",
    description: "A comprehensive learning path covering the fundamentals of educational technology and its applications.",
    authorName: "Ahmad Rizki",
    bookmarkedAt: "2024-04-05T11:45:00Z"
  },
  {
    id: 4,
    type: "resource",
    title: "Mobile Learning Implementation Guide",
    description: "Step-by-step guidance for implementing effective mobile learning solutions in various educational contexts.",
    authorName: "Maria Ayu",
    bookmarkedAt: "2024-03-18T16:20:00Z"
  },
  {
    id: 5,
    type: "post",
    title: "Gamification Elements for Higher Education",
    description: "Strategies for incorporating game-based elements to increase student engagement in higher education settings.",
    authorName: "Irfan Hidayat",
    bookmarkedAt: "2024-04-10T10:00:00Z"
  }
];

export default function BookmarksPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  const { data: bookmarks = mockBookmarks, isLoading } = useQuery({
    queryKey: ["/api/bookmarks"],
    // Using mock data for now
    queryFn: () => Promise.resolve(mockBookmarks),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = searchQuery === "" || 
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "All" || bookmark.type === typeFilter;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.bookmarkedAt).getTime() - new Date(b.bookmarkedAt).getTime();
    }
    return 0;
  });

  const getBookmarkIcon = (type: string) => {
    switch (type) {
      case "post":
        return <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>;
      case "resource":
        return <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-amber-600" />
        </div>;
      case "learningPath":
        return <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-green-600" />
        </div>;
      default:
        return <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center">
          <Bookmark className="h-5 w-5 text-gray-600" />
        </div>;
    }
  };

  const getBookmarkLink = (bookmark: BookmarkItem) => {
    switch (bookmark.type) {
      case "post":
        return `/posts/${bookmark.id}`;
      case "resource":
        return `/resources/${bookmark.id}`;
      case "learningPath":
        return `/learning-paths/${bookmark.id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="pt-[60px] pb-16 lg:pb-0">
        <div className="flex">
          {/* Main Content Area - Adjusted for fixed sidebar */}
          <div className="flex-1 w-full md:pl-64">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Page Header */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">ThinkTank</h1>
              
              {/* ThinkTank Navigation Tabs */}
              <div className="w-full mb-6 flex border-b">
                <Link href="/resources" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
                  Repository
                </Link>
                <Link href="/learning-paths" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
                  Learning Pathway
                </Link>
                <Link href="/analytics" className="px-4 py-2 font-medium text-gray-600 hover:text-primary-600">
                  Analytics
                </Link>
                <Link href="/bookmarks" className="px-4 py-2 font-medium text-primary-600 border-b-2 border-primary-600">
                  Bookmarks
                </Link>
              </div>
              
              {/* Bookmarks Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Saved Items</h2>
                  <p className="text-gray-600">Your bookmarked resources, posts, and learning paths</p>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mr-2">
                    Manage Collections
                  </Button>
                  <Button size="sm">
                    Create
                  </Button>
                </div>
              </div>
              
              {/* Bookmark Search and Filter Bar */}
              <div className="mb-6">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative col-span-1 md:col-span-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search bookmarks..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="post">Posts</SelectItem>
                        <SelectItem value="resource">Resources</SelectItem>
                        <SelectItem value="learningPath">Learning Paths</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently Bookmarked</SelectItem>
                        <SelectItem value="oldest">Oldest Bookmarks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Bookmarks List */}
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                </div>
              ) : filteredBookmarks.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookmarks.map((bookmark) => (
                    <div 
                      key={`${bookmark.type}-${bookmark.id}`} 
                      className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {getBookmarkIcon(bookmark.type)}
                        </div>
                        <div className="flex-1">
                          <Link href={getBookmarkLink(bookmark)}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                              {bookmark.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mt-1">{bookmark.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span>By {bookmark.authorName}</span>
                            <span className="mx-2">•</span>
                            <span>Bookmarked on {formatDate(bookmark.bookmarkedAt)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-600 flex items-center"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10 text-center">
                  <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No bookmarks found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || typeFilter !== "All" 
                      ? "Try changing your search or filter criteria" 
                      : "Start bookmarking posts, resources, and learning paths to access them quickly later"}
                  </p>
                  {searchQuery || typeFilter !== "All" ? (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setTypeFilter("All");
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : (
                    <Link href="/">
                      <Button>Explore content</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      
      
    </div>
  );
}