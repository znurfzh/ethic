import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/app-layout";
import PostCard from "@/components/post-card";

import { useParams } from "wouter";
import { User, Post } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Building, Briefcase, Calendar } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const profileUpdateSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters" }),
  bio: z.string().optional(),
  organization: z.string().optional(),
  jobTitle: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.string().length(0)),
});

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  const { data: profileUser, isLoading: isUserLoading } = useQuery<User>({
    queryKey: [`/api/users/${id || "0"}`],
    enabled: !!id,
  });
  
  const { data: userPosts, isLoading: isPostsLoading } = useQuery<Post[]>({
    queryKey: [`/api/users/${id || "0"}/posts`],
    enabled: !!id,
  });
  
  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: profileUser?.displayName || "",
      bio: profileUser?.bio || "",
      organization: profileUser?.organization || "",
      jobTitle: profileUser?.jobTitle || "",
      avatarUrl: profileUser?.avatarUrl || "",
    }
  });
  
  // Update form values when profile data loads
  useState(() => {
    if (profileUser) {
      form.reset({
        displayName: profileUser.displayName,
        bio: profileUser.bio || "",
        organization: profileUser.organization || "",
        jobTitle: profileUser.jobTitle || "",
        avatarUrl: profileUser.avatarUrl || "",
      });
    }
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileUpdateSchema>) => {
      const res = await apiRequest("PUT", `/api/users/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${id}`] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (data: z.infer<typeof profileUpdateSchema>) => {
    updateProfileMutation.mutate(data);
  };
  
  const isOwnProfile = currentUser?.id === parseInt(id || "0");
  
  const connectionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/connections", {
        receiverId: parseInt(id || "0")
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent."
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending connection request",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
          <p className="text-gray-600 mt-2">The user you're looking for does not exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <AppLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-800"></div>
            
            <div className="px-6 py-5 flex flex-col sm:flex-row">
              <div className="-mt-16 sm:-mt-24 mb-4 sm:mb-0 sm:mr-6">
                <div className="h-32 w-32 bg-white rounded-full p-1 shadow-md">
                  <div className="h-full w-full rounded-full bg-primary-600 flex items-center justify-center text-white text-4xl font-semibold">
                    {profileUser.displayName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profileUser.displayName}</h1>
                    <div className="flex items-center mt-1">
                      <span className="px-2 py-1 text-xs rounded-full text-white capitalize bg-primary-600">
                        {profileUser.userType}
                      </span>
                      
                      {profileUser.jobTitle && (
                        <span className="ml-2 text-sm text-gray-500 flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {profileUser.jobTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isOwnProfile ? (
                    <div className="mt-4 sm:mt-0">
                      {/* No edit button here anymore, using tab instead */}
                    </div>
                  ) : (
                    <div className="mt-4 sm:mt-0 space-x-2">
                      <Button
                        onClick={() => connectionMutation.mutate()}
                        disabled={connectionMutation.isPending}
                      >
                        {connectionMutation.isPending ? "Sending..." : "Connect"}
                      </Button>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  )}
                </div>
                
                {profileUser.bio && (
                  <p className="mt-4 text-gray-600">{profileUser.bio}</p>
                )}
                
                <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-500">
                  {profileUser.organization && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{profileUser.organization}</span>
                    </div>
                  )}
                  
                  {profileUser.graduationYear && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {profileUser.userType === "student"
                          ? `Expected graduation: ${profileUser.graduationYear}`
                          : `Class of ${profileUser.graduationYear}`
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{profileUser.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Tabs defaultValue="posts">
              <TabsList className="mb-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                {isOwnProfile && <TabsTrigger value="settings">Edit Profile</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="posts">
                {isPostsLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                ) : userPosts && userPosts.length > 0 ? (
                  <div className="space-y-6">
                    {userPosts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "Share your knowledge and experiences with the community!"
                        : `${profileUser.displayName} hasn't shared any posts yet.`
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comments">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Comments coming soon</h3>
                  <p className="text-gray-600">This feature is under development.</p>
                </div>
              </TabsContent>
              
              {isOwnProfile && (
                <TabsContent value="settings">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Your Profile</h3>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about yourself" 
                                  {...field} 
                                  className="resize-none h-20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization/Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="Where do you work or study?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="jobTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Your position" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}