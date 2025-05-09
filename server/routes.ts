import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertCommentSchema, insertPostSchema, insertLikeSchema, 
  insertBookmarkSchema, insertResourceSchema, insertEventSchema, 
  insertConnectionSchema, insertTopicSchema, insertPostTopicSchema,
  insertLearningPathSchema, insertLearningPathStepSchema, insertUserLearningProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth routes
  setupAuth(app);

  // Posts API
  app.get("/api/posts", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const posts = await storage.getPosts(limit, offset);
    res.json(posts);
  });
  
  app.get("/api/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await storage.getPost(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.json(post);
  });
  
  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Professionals cannot create posts
    if (req.user!.userType === "professional") {
      return res.status(403).json({ message: "EdTech Professionals are not allowed to create posts" });
    }
    
    try {
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost({
        ...postData,
        authorId: req.user!.id
      });
      
      // If topics are provided, associate them with the post
      if (req.body.topics && Array.isArray(req.body.topics)) {
        for (const topicId of req.body.topics) {
          await storage.associatePostTopic({
            postId: post.id,
            topicId: parseInt(topicId)
          });
        }
      }
      
      // If resources are provided, create them
      if (req.body.resources && Array.isArray(req.body.resources)) {
        for (const resourceData of req.body.resources) {
          await storage.createResource({
            ...resourceData,
            postId: post.id
          });
        }
      }
      
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Comments API
  app.get("/api/posts/:postId/comments", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const comments = await storage.getCommentsByPost(postId);
    
    // Get user details for each comment
    const commentsWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await storage.getUser(comment.authorId);
        return {
          ...comment,
          author: user ? {
            id: user.id,
            displayName: user.displayName,
            userType: user.userType,
            avatarUrl: user.avatarUrl,
          } : null
        };
      })
    );
    
    res.json(commentsWithUser);
  });
  
  app.post("/api/posts/:postId/comments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Professionals cannot comment on posts
    if (req.user!.userType === "professional") {
      return res.status(403).json({ message: "EdTech Professionals are not allowed to comment on posts" });
    }
    
    const postId = parseInt(req.params.postId);
    
    try {
      const commentData = insertCommentSchema.parse({
        ...req.body,
        postId,
        authorId: req.user!.id
      });
      
      const comment = await storage.createComment(commentData);
      
      // Create notification for post author
      const post = await storage.getPost(postId);
      if (post && post.authorId !== req.user!.id) {
        await storage.createNotification({
          userId: post.authorId,
          type: "comment",
          content: `${req.user!.displayName} commented on your post`,
          sourceId: comment.id,
          sourceType: "comment",
          read: false
        });
      }
      
      const user = await storage.getUser(req.user!.id);
      
      return res.status(201).json({
        ...comment,
        author: user ? {
          id: user.id,
          displayName: user.displayName,
          userType: user.userType,
          avatarUrl: user.avatarUrl,
        } : null
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Likes API
  app.post("/api/posts/:postId/likes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    // Check if already liked
    const existingLike = await storage.getLikeByUserAndPost(userId, postId);
    if (existingLike) {
      return res.status(400).json({ message: "Already liked" });
    }
    
    try {
      const likeData = insertLikeSchema.parse({
        postId,
        userId
      });
      
      const like = await storage.createLike(likeData);
      
      // Create notification for post author
      const post = await storage.getPost(postId);
      if (post && post.authorId !== userId) {
        await storage.createNotification({
          userId: post.authorId,
          type: "like",
          content: `${req.user!.displayName} liked your post`,
          sourceId: like.id,
          sourceType: "like",
          read: false
        });
      }
      
      return res.status(201).json(like);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/posts/:postId/likes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    const like = await storage.getLikeByUserAndPost(userId, postId);
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }
    
    await storage.deleteLike(like.id);
    return res.status(204).send();
  });
  
  app.get("/api/posts/:postId/likes", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const likes = await storage.getLikesByPost(postId);
    res.json(likes);
  });
  
  // Bookmarks API
  app.post("/api/posts/:postId/bookmarks", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    // Check if already bookmarked
    const existingBookmark = await storage.getBookmarkByUserAndPost(userId, postId);
    if (existingBookmark) {
      return res.status(400).json({ message: "Already bookmarked" });
    }
    
    try {
      const bookmarkData = insertBookmarkSchema.parse({
        postId,
        userId
      });
      
      const bookmark = await storage.createBookmark(bookmarkData);
      return res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/posts/:postId/bookmarks", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    const bookmark = await storage.getBookmarkByUserAndPost(userId, postId);
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    
    await storage.deleteBookmark(bookmark.id);
    return res.status(204).send();
  });
  
  app.get("/api/bookmarks", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const bookmarks = await storage.getBookmarksByUser(req.user!.id);
    
    // Get post details for each bookmark
    const bookmarksWithPosts = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await storage.getPost(bookmark.postId);
        return {
          ...bookmark,
          post
        };
      })
    );
    
    res.json(bookmarksWithPosts);
  });
  
  // Resources API
  app.get("/api/posts/:postId/resources", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const resources = await storage.getResourcesByPost(postId);
    res.json(resources);
  });
  
  // Topics API
  app.get("/api/topics", async (req, res) => {
    const topics = await storage.getTopics();
    res.json(topics);
  });
  
  app.post("/api/topics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Professionals cannot create topics
    if (req.user!.userType === "professional") {
      return res.status(403).json({ message: "EdTech Professionals are not allowed to create topics" });
    }
    
    try {
      const topicData = insertTopicSchema.parse(req.body);
      const topic = await storage.createTopic(topicData);
      return res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Events API
  app.get("/api/events", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const events = await storage.getEvents(limit);
    res.json(events);
  });
  
  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const eventData = insertEventSchema.parse({
        ...req.body,
        createdBy: req.user!.id
      });
      
      const event = await storage.createEvent(eventData);
      return res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Connection API
  app.post("/api/connections", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const connectionData = insertConnectionSchema.parse({
        ...req.body,
        requesterId: req.user!.id,
        status: "pending"
      });
      
      const connection = await storage.createConnection(connectionData);
      
      // Create notification for receiver
      await storage.createNotification({
        userId: connectionData.receiverId,
        type: "connection",
        content: `${req.user!.displayName} wants to connect with you`,
        sourceId: connection.id,
        sourceType: "connection",
        read: false
      });
      
      return res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/connections/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!status || !["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const connection = await storage.updateConnection(id, status);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    
    // Create notification for requester
    await storage.createNotification({
      userId: connection.requesterId,
      type: "connection",
      content: `${req.user!.displayName} ${status === "accepted" ? "accepted" : "rejected"} your connection request`,
      sourceId: connection.id,
      sourceType: "connection",
      read: false
    });
    
    return res.json(connection);
  });
  
  app.get("/api/connections", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const connections = await storage.getConnectionsByUser(req.user!.id);
    
    // Get user details for each connection
    const connectionsWithUsers = await Promise.all(
      connections.map(async (connection) => {
        const otherUserId = connection.requesterId === req.user!.id
          ? connection.receiverId
          : connection.requesterId;
        
        const user = await storage.getUser(otherUserId);
        return {
          ...connection,
          user: user ? {
            id: user.id,
            displayName: user.displayName,
            userType: user.userType,
            avatarUrl: user.avatarUrl,
            jobTitle: user.jobTitle,
            organization: user.organization,
          } : null
        };
      })
    );
    
    res.json(connectionsWithUsers);
  });
  
  // Notifications API
  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const notifications = await storage.getNotificationsByUser(req.user!.id);
    res.json(notifications);
  });
  
  app.put("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    await storage.markNotificationAsRead(id);
    return res.status(204).send();
  });
  
  // User API
  // Get all users
  app.get("/api/users", async (req, res) => {
    const users = await Promise.all(
      Array.from(storage.getUsers() || []).map(async (user) => {
        // Don't return password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      })
    );
    res.json(users);
  });
  
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Update user profile
  app.put("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const id = parseInt(req.params.id);
    if (id !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    // Remove sensitive fields that shouldn't be updated
    const { id: userId, password, createdAt, username, ...updateData } = req.body;
    
    const updatedUser = await storage.updateUser(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return password
    const { password: pwd, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  });
  
  // Get posts by user
  app.get("/api/users/:id/posts", async (req, res) => {
    const id = parseInt(req.params.id);
    const posts = await storage.getPostsByAuthor(id);
    res.json(posts);
  });
  
  // Search API endpoint
  app.get("/api/search", async (req, res) => {
    const query = req.query.q as string;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const searchQuery = query.toLowerCase();
    
    try {
      // Get all posts and filter by query
      const allPosts = await storage.getPosts(100);  // Fetch a reasonable number of posts
      const filteredPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery) || 
        post.content.toLowerCase().includes(searchQuery)
      );
      
      // Get all users and filter by query
      const allUsers = [];
      for (let i = 1; i <= 50; i++) {  // Assuming we have fewer than 50 users for demo
        const user = await storage.getUser(i);
        if (user) allUsers.push(user);
      }
      const filteredUsers = allUsers.filter(user => 
        user.displayName.toLowerCase().includes(searchQuery) || 
        user.username.toLowerCase().includes(searchQuery)
      );
      
      // Get all topics and filter by query
      const allTopics = await storage.getTopics();
      const filteredTopics = allTopics.filter(topic => 
        topic.name.toLowerCase().includes(searchQuery)
      );
      
      return res.json({
        posts: filteredPosts.slice(0, 5),  // Return top 5 results for each category
        users: filteredUsers.slice(0, 5).map(user => {
          // Don't return passwords
          const { password, ...safeUser } = user;
          return safeUser;
        }),
        topics: filteredTopics.slice(0, 5)
      });
    } catch (error) {
      console.error('Search error:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Learning Paths API
  app.get("/api/learning-paths", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const learningPaths = await storage.getLearningPaths(limit, offset);
    
    // Get creator details for each learning path
    const pathsWithCreator = await Promise.all(
      learningPaths.map(async (path) => {
        const creator = await storage.getUser(path.createdBy);
        return {
          ...path,
          creator: creator ? {
            id: creator.id,
            displayName: creator.displayName,
            userType: creator.userType,
          } : null
        };
      })
    );
    
    res.json(pathsWithCreator);
  });
  
  app.get("/api/learning-paths/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const learningPath = await storage.getLearningPath(id);
    
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    // Get creator details
    const creator = await storage.getUser(learningPath.createdBy);
    
    // Get steps for the learning path
    const steps = await storage.getLearningPathSteps(id);
    
    // For each step, get associated resource or post details
    const stepsWithDetails = await Promise.all(
      steps.map(async (step) => {
        let resource = null;
        let post = null;
        
        if (step.resourceId) {
          resource = await storage.getResourceById(step.resourceId);
        }
        
        if (step.postId) {
          post = await storage.getPost(step.postId);
        }
        
        return {
          ...step,
          resource,
          post
        };
      })
    );
    
    const result = {
      ...learningPath,
      creator: creator ? {
        id: creator.id,
        displayName: creator.displayName,
        userType: creator.userType,
      } : null,
      steps: stepsWithDetails
    };
    
    res.json(result);
  });
  
  app.post("/api/learning-paths", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Professionals cannot create learning paths
    if (req.user!.userType === "professional") {
      return res.status(403).json({ message: "EdTech Professionals are not allowed to create learning paths" });
    }
    
    try {
      const learningPathData = insertLearningPathSchema.parse({
        ...req.body,
        createdBy: req.user!.id
      });
      
      const learningPath = await storage.createLearningPath(learningPathData);
      
      // If steps are provided, create them
      if (req.body.steps && Array.isArray(req.body.steps)) {
        for (let i = 0; i < req.body.steps.length; i++) {
          const stepData = req.body.steps[i];
          await storage.createLearningPathStep({
            ...stepData,
            learningPathId: learningPath.id,
            order: i + 1
          });
        }
      }
      
      return res.status(201).json(learningPath);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/learning-paths/:id/steps", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const learningPathId = parseInt(req.params.id);
    const learningPath = await storage.getLearningPath(learningPathId);
    
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    // Only the creator can add steps
    if (learningPath.createdBy !== req.user!.id) {
      return res.status(403).json({ message: "You can only add steps to your own learning paths" });
    }
    
    try {
      // Get the highest order to append the new step
      const existingSteps = await storage.getLearningPathSteps(learningPathId);
      const highestOrder = existingSteps.length > 0 
        ? Math.max(...existingSteps.map(step => step.order))
        : 0;
      
      const stepData = insertLearningPathStepSchema.parse({
        ...req.body,
        learningPathId,
        order: highestOrder + 1
      });
      
      const step = await storage.createLearningPathStep(stepData);
      return res.status(201).json(step);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // User Learning Progress API
  app.get("/api/users/:userId/learning-progress/:pathId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = parseInt(req.params.userId);
    
    // Only allow users to view their own progress
    if (userId !== req.user!.id) {
      return res.status(403).json({ message: "You can only view your own learning progress" });
    }
    
    const pathId = parseInt(req.params.pathId);
    const progress = await storage.getUserLearningProgress(userId, pathId);
    
    // Get the learning path and its steps
    const learningPath = await storage.getLearningPath(pathId);
    const steps = await storage.getLearningPathSteps(pathId);
    
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    // Calculate overall progress
    const completedSteps = progress.filter(p => p.completed).length;
    const totalSteps = steps.length;
    const percentComplete = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    
    const result = {
      learningPath,
      progress,
      stats: {
        completedSteps,
        totalSteps,
        percentComplete
      }
    };
    
    res.json(result);
  });
  
  app.post("/api/users/:userId/learning-progress/:pathId/steps/:stepId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = parseInt(req.params.userId);
    
    // Only allow users to update their own progress
    if (userId !== req.user!.id) {
      return res.status(403).json({ message: "You can only update your own learning progress" });
    }
    
    const pathId = parseInt(req.params.pathId);
    const stepId = parseInt(req.params.stepId);
    
    // Verify learning path and step exist
    const learningPath = await storage.getLearningPath(pathId);
    const step = await storage.getLearningPathStep(stepId);
    
    if (!learningPath) {
      return res.status(404).json({ message: "Learning path not found" });
    }
    
    if (!step || step.learningPathId !== pathId) {
      return res.status(404).json({ message: "Step not found in this learning path" });
    }
    
    try {
      // Check if progress already exists
      const existingProgress = await storage.getUserLearningProgress(userId, pathId);
      const progressForStep = existingProgress.find(p => p.stepId === stepId);
      
      if (progressForStep) {
        // Update existing progress
        const { completed } = req.body;
        const updatedProgress = await storage.updateLearningProgress(progressForStep.id, completed);
        return res.json(updatedProgress);
      } else {
        // Create new progress
        const progressData = insertUserLearningProgressSchema.parse({
          userId,
          learningPathId: pathId,
          stepId,
          completed: req.body.completed || false,
          completedAt: req.body.completed ? new Date() : null,
          notes: req.body.notes
        });
        
        const progress = await storage.createUserLearningProgress(progressData);
        return res.status(201).json(progress);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
