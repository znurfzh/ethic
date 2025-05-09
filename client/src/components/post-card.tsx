import { Link } from "wouter";
import { Post, User, Topic } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ThumbsUp, MessageSquare, Bookmark, Share2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  
  const { data: author } = useQuery<User>({
    queryKey: [`/api/users/${post.authorId}`],
  });
  
  const { data: comments } = useQuery<any[]>({
    queryKey: [`/api/posts/${post.id}/comments`],
  });
  
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });
  
  // Get post topics (from post_topics relation)
  const { data: postTopics } = useQuery<any[]>({
    queryKey: [`/api/posts/${post.id}/topics`],
    enabled: false, // Temporarily disable as endpoint not implemented
    initialData: [], // Provide empty array as initial data
  });
  
  // Get post likes
  const { data: likes } = useQuery<any[]>({
    queryKey: [`/api/posts/${post.id}/likes`],
  });
  
  // Update likes count and check if user liked post
  if (likes) {
    const likeCount = likes.length;
    if (likeCount !== likesCount) {
      setLikesCount(likeCount);
    }
    if (user) {
      const userLikedPost = !!likes.find((like: any) => like.userId === user.id);
      if (userLikedPost !== isLiked) {
        setIsLiked(userLikedPost);
      }
    }
  }
  
  // Get resources for resource posts
  const { data: resources } = useQuery<any[]>({
    queryKey: [`/api/posts/${post.id}/resources`],
    enabled: post.postType === "resource",
  });
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        const res = await apiRequest("DELETE", `/api/posts/${post.id}/likes`);
        return res;
      } else {
        const res = await apiRequest("POST", `/api/posts/${post.id}/likes`);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/likes`] });
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        const res = await apiRequest("DELETE", `/api/posts/${post.id}/bookmarks`);
        return res;
      } else {
        const res = await apiRequest("POST", `/api/posts/${post.id}/bookmarks`);
        return await res.json();
      }
    },
    onSuccess: () => {
      setIsBookmarked(!isBookmarked);
      toast({
        title: isBookmarked ? "Bookmark removed" : "Post bookmarked",
        description: isBookmarked ? "This post has been removed from your bookmarks" : "This post has been added to your bookmarks",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleLike = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }
    
    likeMutation.mutate();
  };
  
  const handleBookmark = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark posts",
        variant: "destructive",
      });
      return;
    }
    
    bookmarkMutation.mutate();
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    toast({
      title: "Link copied",
      description: "Post link copied to clipboard",
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        {/* Author information */}
        <div className="flex items-center space-x-3 mb-3">
          <Link href={`/profile/${post.authorId}`}>
            <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer">
              {author ? (
                <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white">
                  {author.displayName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="h-full w-full bg-gray-300" />
              )}
            </div>
          </Link>
          <div>
            <div className="flex items-center">
              <Link href={`/profile/${post.authorId}`}>
                <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 cursor-pointer">
                  {author?.displayName || "Loading..."}
                </h3>
              </Link>
              {author && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full capitalize 
                  bg-blue-100 text-blue-800">
                  {author.userType}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {author?.jobTitle && `${author.jobTitle} at `}
              {author?.organization && `${author.organization} • `}
              {post.createdAt && format(new Date(post.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        
        {/* Post content */}
        <div>
          <Link href={`/posts/${post.id}`}>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-700 mb-4">
            {post.content.length > 250 
              ? `${post.content.substring(0, 250)}...`
              : post.content}
          </p>
          
          {/* Display topics if available */}
          {postTopics && postTopics.length > 0 && topics && (
            <div className="flex flex-wrap gap-2 mb-4">
              {postTopics.map((postTopic) => {
                const topic = topics.find(t => t.id === postTopic.topicId);
                if (!topic) return null;
                
                return (
                  <span 
                    key={topic.id} 
                    className={`px-2 py-1 bg-${topic.color}-100 text-${topic.color}-800 text-xs rounded-full`}
                  >
                    {topic.name}
                  </span>
                );
              })}
            </div>
          )}
          
          {/* Resource previews for resource posts */}
          {post.postType === "resource" && resources && resources.length > 0 && (
            <div className="space-y-3 mb-4">
              {resources.slice(0, 2).map(resource => (
                <div key={resource.id} className="bg-gray-50 border rounded-lg p-3 flex">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center mr-3 ${
                    resource.type === 'book' ? 'bg-blue-100 text-blue-500' :
                    resource.type === 'video' ? 'bg-red-100 text-red-500' :
                    resource.type === 'tool' ? 'bg-green-100 text-green-500' :
                    'bg-primary-100 text-primary-500'
                  }`}>
                    {resource.type === 'book' && <i className="fas fa-book fa-lg"></i>}
                    {resource.type === 'video' && <i className="fab fa-youtube fa-lg"></i>}
                    {resource.type === 'tool' && <i className="fas fa-tools fa-lg"></i>}
                    {resource.type === 'article' && <i className="far fa-file-alt fa-lg"></i>}
                    {resource.type === 'link' && <i className="fas fa-link fa-lg"></i>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{resource.title}</h4>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </div>
              ))}
              
              {resources.length > 2 && (
                <Link href={`/posts/${post.id}`}>
                  <p className="text-sm text-primary-600 font-medium hover:text-primary-700">
                    View {resources.length - 2} more resources...
                  </p>
                </Link>
              )}
            </div>
          )}
          
          {/* Post image if available */}
          {post.imageUrl && (
            <Link href={`/posts/${post.id}`}>
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer" 
              />
            </Link>
          )}
        </div>
        
        {/* Post actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-500 hover:text-primary-600"
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp 
                className={`mr-1 h-4 w-4 ${isLiked ? "fill-primary-600 text-primary-600" : ""}`} 
              />
              <span>{likesCount}</span>
            </Button>
            <Link href={`/posts/${post.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center text-gray-500 hover:text-primary-600"
              >
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>{comments?.length || 0}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-gray-500 hover:text-primary-600"
              onClick={handleBookmark}
              disabled={bookmarkMutation.isPending}
            >
              <Bookmark 
                className={`mr-1 h-4 w-4 ${isBookmarked ? "fill-primary-600 text-primary-600" : ""}`} 
              />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Comment preview if available */}
      {comments && comments.length > 0 && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-start space-x-3 mb-2">
            <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0">
              {comments[0].author ? (
                <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white">
                  {comments[0].author.displayName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="h-full w-full bg-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {comments[0].author?.displayName || "Anonymous"}
                </h4>
                {comments[0].author?.userType && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full capitalize 
                    bg-blue-100 text-blue-800">
                    {comments[0].author.userType}
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-500">
                  {comments[0].createdAt && format(new Date(comments[0].createdAt), "MMM d")}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comments[0].content}</p>
            </div>
          </div>
          
          {comments.length > 1 && (
            <Link href={`/posts/${post.id}`}>
              <p className="text-sm text-primary-600 font-medium hover:text-primary-700">
                View all {comments.length} comments
              </p>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
