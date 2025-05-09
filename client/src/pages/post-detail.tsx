import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CommentSection from "@/components/comment-section";
import { Post, User, Resource } from "@shared/schema";
import { Loader2, ThumbsUp, MessageSquare, Bookmark, Share2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const { data: post, isLoading: isPostLoading } = useQuery<Post>({
    queryKey: [`/api/posts/${id}`],
  });
  
  const { data: author, isLoading: isAuthorLoading } = useQuery<User>({
    queryKey: [`/api/users/${post?.authorId}`],
    enabled: !!post,
  });
  
  const { data: likes } = useQuery<any[]>({
    queryKey: [`/api/posts/${id}/likes`],
    enabled: !!post && !!user,
    onSuccess: (data) => {
      if (data) {
        setIsLiked(!!data.find((like) => like.userId === user?.id));
      }
    }
  });
  
  const { data: resources } = useQuery<Resource[]>({
    queryKey: [`/api/posts/${id}/resources`],
    enabled: !!post && post.postType === "resource",
  });
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        const res = await apiRequest("DELETE", `/api/posts/${id}/likes`);
        return res;
      } else {
        const res = await apiRequest("POST", `/api/posts/${id}/likes`);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${id}/likes`] });
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Post unliked" : "Post liked",
        description: isLiked ? "You have unliked this post" : "You have liked this post",
      });
    },
    onError: (error: Error) => {
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
        const res = await apiRequest("DELETE", `/api/posts/${id}/bookmarks`);
        return res;
      } else {
        const res = await apiRequest("POST", `/api/posts/${id}/bookmarks`);
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
    onError: (error: Error) => {
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
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Post link copied to clipboard",
    });
  };
  
  if (isPostLoading || isAuthorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }
  
  if (!post || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
          <p className="text-gray-600 mt-2">The post you're looking for does not exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex items-center space-x-3 mb-3">
              <Link href={`/profile/${author.id}`}>
                <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
                  {author.avatarUrl ? (
                    <img 
                      src={author.avatarUrl} 
                      alt={`${author.displayName}'s avatar`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white">
                      {author.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
              <div>
                <div className="flex items-center">
                  <Link href={`/profile/${author.id}`}>
                    <h3 className="text-sm font-medium text-gray-900 hover:text-primary-600 cursor-pointer">
                      {author.displayName}
                    </h3>
                  </Link>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full capitalize bg-blue-100 text-blue-800">
                    {author.userType}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {author.jobTitle && `${author.jobTitle} at `}
                  {author.organization && `${author.organization} • `}
                  {post.createdAt && format(new Date(post.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h2>
              <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-auto object-cover rounded-lg mb-4" 
                />
              )}
              
              {post.postType === "resource" && resources && resources.length > 0 && (
                <div className="space-y-3 mb-4">
                  {resources.map(resource => (
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
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-500 hover:text-primary-600"
                  onClick={handleLike}
                  disabled={likeMutation.isPending}
                >
                  <ThumbsUp className={`mr-1 h-5 w-5 ${isLiked ? 'fill-primary-600 text-primary-600' : ''}`} />
                  <span>{likes ? likes.length : 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-500 hover:text-primary-600"
                  onClick={() => {
                    // Scroll to comments section
                    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <MessageSquare className="mr-1 h-5 w-5" />
                  <span>Comments</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-500 hover:text-primary-600"
                  onClick={handleBookmark}
                  disabled={bookmarkMutation.isPending}
                >
                  <Bookmark className={`mr-1 h-5 w-5 ${isBookmarked ? 'fill-primary-600 text-primary-600' : ''}`} />
                  <span>Save</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div id="comments-section">
            <CommentSection postId={parseInt(id || "0")} />
          </div>
        </div>
      </div>
    </div>
  );
}