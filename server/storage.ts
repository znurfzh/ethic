import { users, type User, type InsertUser, posts, type Post, type InsertPost, 
  comments, type Comment, type InsertComment, topics, type Topic, type InsertTopic,
  postTopics, type PostTopic, type InsertPostTopic, resources, type Resource, type InsertResource,
  likes, type Like, type InsertLike, bookmarks, type Bookmark, type InsertBookmark,
  events, type Event, type InsertEvent, connections, type Connection, type InsertConnection,
  notifications, type Notification, type InsertNotification,
  learningPaths, type LearningPath, type InsertLearningPath, 
  learningPathSteps, type LearningPathStep, type InsertLearningPathStep,
  userLearningProgress, type UserLearningProgress, type InsertUserLearningProgress } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPost(id: number): Promise<Post | undefined>;
  getPosts(limit?: number, offset?: number): Promise<Post[]>;
  getPostsByAuthor(authorId: number): Promise<Post[]>;
  getPostsByTopic(topicId: number): Promise<Post[]>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPost(postId: number): Promise<Comment[]>;
  
  // Topic operations
  createTopic(topic: InsertTopic): Promise<Topic>;
  getTopics(): Promise<Topic[]>;
  associatePostTopic(postTopic: InsertPostTopic): Promise<PostTopic>;
  
  // Resource operations
  createResource(resource: InsertResource): Promise<Resource>;
  getResourcesByPost(postId: number): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  
  // Like operations
  createLike(like: InsertLike): Promise<Like>;
  getLikesByPost(postId: number): Promise<Like[]>;
  getLikeByUserAndPost(userId: number, postId: number): Promise<Like | undefined>;
  deleteLike(id: number): Promise<void>;
  
  // Bookmark operations
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  getBookmarksByUser(userId: number): Promise<Bookmark[]>;
  getBookmarkByUserAndPost(userId: number, postId: number): Promise<Bookmark | undefined>;
  deleteBookmark(id: number): Promise<void>;
  
  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(limit?: number): Promise<Event[]>;
  
  // Connection operations
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnectionsByUser(userId: number): Promise<Connection[]>;
  updateConnection(id: number, status: string): Promise<Connection | undefined>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  
  // Learning Path operations
  createLearningPath(learningPath: InsertLearningPath): Promise<LearningPath>;
  getLearningPath(id: number): Promise<LearningPath | undefined>;
  getLearningPaths(limit?: number, offset?: number): Promise<LearningPath[]>;
  getLearningPathsByCreator(creatorId: number): Promise<LearningPath[]>;
  
  // Learning Path Step operations
  createLearningPathStep(step: InsertLearningPathStep): Promise<LearningPathStep>;
  getLearningPathSteps(learningPathId: number): Promise<LearningPathStep[]>;
  getLearningPathStep(id: number): Promise<LearningPathStep | undefined>;
  
  // User Learning Progress operations
  createUserLearningProgress(progress: InsertUserLearningProgress): Promise<UserLearningProgress>;
  getUserLearningProgress(userId: number, learningPathId: number): Promise<UserLearningProgress[]>;
  updateLearningProgress(id: number, completed: boolean): Promise<UserLearningProgress | undefined>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private topics: Map<number, Topic>;
  private postTopics: Map<number, PostTopic>;
  private resources: Map<number, Resource>;
  private likes: Map<number, Like>;
  private bookmarks: Map<number, Bookmark>;
  private events: Map<number, Event>;
  private connections: Map<number, Connection>;
  private notifications: Map<number, Notification>;
  private learningPaths: Map<number, LearningPath>;
  private learningPathSteps: Map<number, LearningPathStep>;
  private userLearningProgress: Map<number, UserLearningProgress>;
  
  sessionStore: session.SessionStore;
  
  private userId: number = 1;
  private postId: number = 1;
  private commentId: number = 1;
  private topicId: number = 1;
  private postTopicId: number = 1;
  private resourceId: number = 1;
  private likeId: number = 1;
  private bookmarkId: number = 1;
  private eventId: number = 1;
  private connectionId: number = 1;
  private notificationId: number = 1;
  private learningPathId: number = 1;
  private learningPathStepId: number = 1;
  private userLearningProgressId: number = 1;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.topics = new Map();
    this.postTopics = new Map();
    this.resources = new Map();
    this.likes = new Map();
    this.bookmarks = new Map();
    this.events = new Map();
    this.connections = new Map();
    this.notifications = new Map();
    this.learningPaths = new Map();
    this.learningPathSteps = new Map();
    this.userLearningProgress = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize default topics
    this.createTopic({ name: "Instructional Design", color: "amber" });
    this.createTopic({ name: "EdTech Tools", color: "secondary" });
    this.createTopic({ name: "Learning Experience", color: "blue" });
    this.createTopic({ name: "Career Development", color: "purple" });
    this.createTopic({ name: "Industry Insights", color: "purple" });
    this.createTopic({ name: "Remote Learning", color: "blue" });
    this.createTopic({ name: "Internships", color: "amber" });
    this.createTopic({ name: "Help Needed", color: "red" });
    this.createTopic({ name: "Resources", color: "purple" });
  }

  // User operations
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Post operations
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postId++;
    const now = new Date();
    const post: Post = { ...insertPost, id, createdAt: now };
    this.posts.set(id, post);
    return post;
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPosts(limit = 20, offset = 0): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }
  
  async getPostsByAuthor(authorId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter((post) => post.authorId === authorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getPostsByTopic(topicId: number): Promise<Post[]> {
    const relevantPostIds = Array.from(this.postTopics.values())
      .filter((pt) => pt.topicId === topicId)
      .map((pt) => pt.postId);
    
    return Array.from(this.posts.values())
      .filter((post) => relevantPostIds.includes(post.id))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Comment operations
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const now = new Date();
    const comment: Comment = { ...insertComment, id, createdAt: now };
    this.comments.set(id, comment);
    return comment;
  }
  
  async getCommentsByPost(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  // Topic operations
  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.topicId++;
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }
  
  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }
  
  async associatePostTopic(insertPostTopic: InsertPostTopic): Promise<PostTopic> {
    const id = this.postTopicId++;
    const postTopic: PostTopic = { ...insertPostTopic, id };
    this.postTopics.set(id, postTopic);
    return postTopic;
  }
  
  // Resource operations
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceId++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }
  
  async getResourcesByPost(postId: number): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter((resource) => resource.postId === postId);
  }
  
  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  // Like operations
  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = this.likeId++;
    const like: Like = { ...insertLike, id };
    this.likes.set(id, like);
    return like;
  }
  
  async getLikesByPost(postId: number): Promise<Like[]> {
    return Array.from(this.likes.values())
      .filter((like) => like.postId === postId);
  }
  
  async getLikeByUserAndPost(userId: number, postId: number): Promise<Like | undefined> {
    return Array.from(this.likes.values())
      .find((like) => like.userId === userId && like.postId === postId);
  }
  
  async deleteLike(id: number): Promise<void> {
    this.likes.delete(id);
  }
  
  // Bookmark operations
  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.bookmarkId++;
    const bookmark: Bookmark = { ...insertBookmark, id };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }
  
  async getBookmarksByUser(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values())
      .filter((bookmark) => bookmark.userId === userId);
  }
  
  async getBookmarkByUserAndPost(userId: number, postId: number): Promise<Bookmark | undefined> {
    return Array.from(this.bookmarks.values())
      .find((bookmark) => bookmark.userId === userId && bookmark.postId === postId);
  }
  
  async deleteBookmark(id: number): Promise<void> {
    this.bookmarks.delete(id);
  }
  
  // Event operations
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  async getEvents(limit = 5): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
      .slice(0, limit);
  }
  
  // Connection operations
  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = this.connectionId++;
    const now = new Date();
    const connection: Connection = { ...insertConnection, id, createdAt: now };
    this.connections.set(id, connection);
    return connection;
  }
  
  async getConnectionsByUser(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values())
      .filter((connection) => 
        connection.requesterId === userId || connection.receiverId === userId);
  }
  
  async updateConnection(id: number, status: string): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;
    
    const updatedConnection = { ...connection, status };
    this.connections.set(id, updatedConnection);
    return updatedConnection;
  }
  
  // Notification operations
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const now = new Date();
    const notification: Notification = { ...insertNotification, id, createdAt: now };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      this.notifications.set(id, { ...notification, read: true });
    }
  }
  
  // Learning Path operations
  async createLearningPath(insertLearningPath: InsertLearningPath): Promise<LearningPath> {
    const id = this.learningPathId++;
    const now = new Date();
    const learningPath: LearningPath = { ...insertLearningPath, id, createdAt: now };
    this.learningPaths.set(id, learningPath);
    return learningPath;
  }
  
  async getLearningPath(id: number): Promise<LearningPath | undefined> {
    return this.learningPaths.get(id);
  }
  
  async getLearningPaths(limit = 20, offset = 0): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }
  
  async getLearningPathsByCreator(creatorId: number): Promise<LearningPath[]> {
    return Array.from(this.learningPaths.values())
      .filter((path) => path.createdBy === creatorId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Learning Path Step operations
  async createLearningPathStep(insertStep: InsertLearningPathStep): Promise<LearningPathStep> {
    const id = this.learningPathStepId++;
    const step: LearningPathStep = { ...insertStep, id };
    this.learningPathSteps.set(id, step);
    return step;
  }
  
  async getLearningPathSteps(learningPathId: number): Promise<LearningPathStep[]> {
    return Array.from(this.learningPathSteps.values())
      .filter((step) => step.learningPathId === learningPathId)
      .sort((a, b) => a.order - b.order);
  }
  
  async getLearningPathStep(id: number): Promise<LearningPathStep | undefined> {
    return this.learningPathSteps.get(id);
  }
  
  // User Learning Progress operations
  async createUserLearningProgress(insertProgress: InsertUserLearningProgress): Promise<UserLearningProgress> {
    const id = this.userLearningProgressId++;
    const progress: UserLearningProgress = { ...insertProgress, id };
    this.userLearningProgress.set(id, progress);
    return progress;
  }
  
  async getUserLearningProgress(userId: number, learningPathId: number): Promise<UserLearningProgress[]> {
    return Array.from(this.userLearningProgress.values())
      .filter((progress) => 
        progress.userId === userId && progress.learningPathId === learningPathId);
  }
  
  async updateLearningProgress(id: number, completed: boolean): Promise<UserLearningProgress | undefined> {
    const progress = this.userLearningProgress.get(id);
    if (!progress) return undefined;
    
    const completedAt = completed ? new Date() : null;
    const updatedProgress = { ...progress, completed, completedAt };
    this.userLearningProgress.set(id, updatedProgress);
    return updatedProgress;
  }
}

export const storage = new MemStorage();
