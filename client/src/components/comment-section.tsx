import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  
  const { data: comments, isLoading } = useQuery<any[]>({
    queryKey: [`/api/posts/${postId}/comments`],
  });
  
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/posts/${postId}/comments`, { content });
      return await res.json();
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    commentMutation.mutate(commentText);
  };
  
  return (
    <div className="bg-gray-50 px-5 py-4 border-t border-gray-100">
      {/* Comment form */}
      {user ? (
        <div className="flex items-start space-x-3 mb-6">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary-600 text-white flex-shrink-0">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={commentMutation.isPending}
                size="sm"
              >
                {commentMutation.isPending ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Commenting...
                  </>
                ) : (
                  "Comment"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4 mb-4 border border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500 text-sm">
            <Link href="/auth" className="text-primary-600 hover:underline">
              Log in
            </Link>{" "}
            to join the conversation
          </p>
        </div>
      )}
      
      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-6">
          <h3 className="font-medium text-gray-900">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </h3>
          
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Link href={`/profile/${comment.authorId}`}>
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary-600 text-white flex-shrink-0 cursor-pointer">
                  {comment.author ? comment.author.displayName.charAt(0).toUpperCase() : "?"}
                </div>
              </Link>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <Link href={`/profile/${comment.authorId}`}>
                    <h4 className="text-sm font-medium text-gray-900 hover:text-primary-600 cursor-pointer">
                      {comment.author?.displayName || "Anonymous"}
                    </h4>
                  </Link>
                  {comment.author?.userType && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full capitalize 
                      bg-blue-100 text-blue-800">
                      {comment.author.userType}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-gray-500">
                    {comment.createdAt && format(new Date(comment.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="text-gray-700 text-sm">
                  {comment.content.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                <div className="mt-2 flex items-center space-x-2">
                  <button className="text-xs text-gray-500 hover:text-primary-600">
                    Like
                  </button>
                  <button className="text-xs text-gray-500 hover:text-primary-600">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
