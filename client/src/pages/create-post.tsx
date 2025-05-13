import { useAuth } from "@/hooks/use-auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertPostSchema, Topic } from "@shared/schema";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, X, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["book", "video", "tool", "article", "link"]),
  url: z.string().url("Invalid URL").optional(),
  description: z.string().optional(),
});

const createPostSchema = insertPostSchema.extend({
  topicIds: z.array(z.number()).optional(),
  resources: z.array(resourceSchema).optional(),
});

export default function CreatePost() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("article");
  const [resources, setResources] = useState<Array<z.infer<typeof resourceSchema>>>([]);

  const { data: topics, isLoading: isTopicsLoading } = useQuery<Topic[]>({
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
      resources: [],
    }
  });

  const resourceForm = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      type: "article",
      url: "",
      description: "",
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createPostSchema>) => {
      const postData = {
        title: data.title,
        content: data.content,
        postType: activeTab, // Use the active tab as post type
        authorId: user!.id,
        imageUrl: data.imageUrl,
        topics: data.topicIds,
        resources: resources,
      };

      const res = await apiRequest("POST", "/api/posts", postData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post created",
        description: "Your post has been created successfully.",
      });
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
    createPostMutation.mutate({
      ...data,
      resources, // Add resources to the form data
    });
  };

  const addResource = () => {
    const resourceData = resourceForm.getValues();
    setResources([...resources, resourceData]);
    resourceForm.reset();
  };

  const removeResource = (index: number) => {
    const newResources = [...resources];
    newResources.splice(index, 1);
    setResources(newResources);
  };

  if (!user) {
    return null; // ProtectedRoute will handle this case
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Post</h1>

            <Tabs
              defaultValue="article"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value)}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-4 h-auto p-1 mb-4">
                <TabsTrigger value="article" className="px-4 py-2">Article</TabsTrigger>
                <TabsTrigger value="question" className="px-4 py-2">Question</TabsTrigger>
                <TabsTrigger value="resource" className="px-4 py-2">Resource</TabsTrigger>
                <TabsTrigger value="discussion" className="px-4 py-2">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="article">
                <p className="text-gray-600 mb-4">
                  Share your knowledge, insights, or experiences with the community.
                </p>
              </TabsContent>

              <TabsContent value="question">
                <p className="text-gray-600 mb-4">
                  Ask a question to get help or insights from the community.
                </p>
              </TabsContent>

              <TabsContent value="resource">
                <p className="text-gray-600 mb-4">
                  Share valuable learning resources, tools, or references.
                </p>
              </TabsContent>

              <TabsContent value="discussion">
                <p className="text-gray-600 mb-4">
                  Start a discussion or conversation about a topic of interest.
                </p>
              </TabsContent>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            activeTab === "article" ? "Enter a descriptive title..." :
                            activeTab === "question" ? "Ask your question..." :
                            activeTab === "resource" ? "Name of resource collection..." :
                            "Start your discussion..."
                          }
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
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            activeTab === "article" ? "Write your article..." :
                            activeTab === "question" ? "Provide details about your question..." :
                            activeTab === "resource" ? "Describe these resources..." :
                            "What would you like to discuss?"
                          }
                          className="h-40 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="URL to a relevant image"
                          {...field}
                          value={field.value || ""}
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
                      <FormLabel>Topics</FormLabel>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Select topics relevant to your post (up to 3)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {isTopicsLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            topics?.map((topic) => (
                              <div
                                key={topic.id}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ${
                                  form.watch("topicIds")?.includes(topic.id)
                                    ? "bg-primary-100 text-primary-800 border-2 border-primary-300"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                                onClick={() => {
                                  const currentTopics = form.watch("topicIds") || [];
                                  if (currentTopics.includes(topic.id)) {
                                    field.onChange(currentTopics.filter((id) => id !== topic.id));
                                  } else if (currentTopics.length < 3) {
                                    field.onChange([...currentTopics, topic.id]);
                                  }
                                }}
                              >
                                {topic.name}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {activeTab === "resource" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-900">Add Resources</h3>

                    <div className="space-y-4">
                      {resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-white p-3 rounded-lg border"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{resource.title}</div>
                            <div className="text-sm text-gray-500">
                              {resource.type} {resource.url && "• "}
                              {resource.url && (
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:underline"
                                >
                                  Link
                                </a>
                              )}
                            </div>
                            {resource.description && (
                              <div className="text-sm mt-1">{resource.description}</div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResource(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={resourceForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resource Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={resourceForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resource Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="book">Book</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="tool">Tool</SelectItem>
                                  <SelectItem value="article">Article</SelectItem>
                                  <SelectItem value="link">Link</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={resourceForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={resourceForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Briefly describe this resource..."
                                className="h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={addResource}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="px-8"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}