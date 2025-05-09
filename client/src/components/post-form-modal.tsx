import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertPostSchema, Topic } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X, Plus, Image, Link, FileText, Code } from "lucide-react";

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createPostSchema = insertPostSchema.extend({
  topicIds: z.array(z.number()).optional(),
  visibility: z.enum(["public", "students", "alumni", "faculty"]).default("public"),
});

export default function PostFormModal({ isOpen, onClose }: PostFormModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [postType, setPostType] = useState<string>("article");
  
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });
  
  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      postType: "article",
      authorId: user?.id,
      topicIds: [],
      visibility: "public",
    }
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createPostSchema>) => {
      const postData = {
        title: data.title,
        content: data.content,
        postType: postType,
        authorId: user!.id,
        topicIds: data.topicIds
      };
      
      const res = await apiRequest("POST", "/api/posts", postData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      });
      onClose();
      navigate(`/posts/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof createPostSchema>) => {
    createPostMutation.mutate(data);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Create Post</DialogTitle>
        </DialogHeader>
        
        <div className="p-1">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={`${user.displayName}'s avatar`} 
                  className="h-full w-full object-cover"
                />
              ) : user ? (
                <div className="h-full w-full flex items-center justify-center bg-primary-600 text-white">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              ) : (
                <div className="h-full w-full bg-gray-300" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{user?.displayName}</h4>
              <div className="flex items-center mt-1">
                <Select defaultValue="public">
                  <SelectTrigger className="text-xs bg-gray-100 border border-gray-300 rounded-md px-2 py-1 h-auto">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="alumni">Alumni Only</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Add a descriptive title..." 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Share knowledge, resources, or ask a question..." 
                        rows={6} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="topicIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 flex items-center">
                        <span>Select topic:</span>
                        <Select
                          onValueChange={(value) => {
                            const topicId = parseInt(value);
                            const currentTopics = form.watch("topicIds") || [];
                            if (!currentTopics.includes(topicId) && currentTopics.length < 3) {
                              field.onChange([...currentTopics, topicId]);
                            }
                          }}
                        >
                          <SelectTrigger className="ml-2 bg-transparent border-none focus:outline-none text-primary-600 font-medium p-0 h-auto">
                            <SelectValue placeholder="Choose" />
                          </SelectTrigger>
                          <SelectContent>
                            {topics?.map(topic => (
                              <SelectItem key={topic.id} value={topic.id.toString()}>
                                {topic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {form.watch("topicIds")?.map(topicId => {
                        const topic = topics?.find(t => t.id === topicId);
                        if (!topic) return null;
                        
                        return (
                          <div key={topic.id} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-md text-sm flex items-center">
                            {topic.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-1 p-0 h-auto"
                              onClick={() => {
                                const currentTopics = form.watch("topicIds") || [];
                                field.onChange(currentTopics.filter(id => id !== topicId));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="px-3 py-1.5 border border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add topic
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border-t border-gray-200 pt-4 pb-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add to your post:</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                    onClick={() => setPostType("article")}
                  >
                    <Image className="mr-2 h-4 w-4 text-green-600" />
                    Photo/Video
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                    onClick={() => setPostType("resource")}
                  >
                    <Link className="mr-2 h-4 w-4 text-blue-600" />
                    Link
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                    onClick={() => setPostType("resource")}
                  >
                    <FileText className="mr-2 h-4 w-4 text-amber-600" />
                    Document
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex items-center px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
                    onClick={() => setPostType("resource")}
                  >
                    <Code className="mr-2 h-4 w-4 text-purple-600" />
                    Code
                  </Button>
                </div>
              </div>
              
              <div className="px-0 py-4 border-t border-gray-200 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium mr-2 hover:bg-gray-300"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700"
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
