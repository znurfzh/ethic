import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  userType: text("user_type").notNull(), // "student", "alumni", "faculty", "professional"
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  jobTitle: text("job_title"),
  organization: text("organization"),
  graduationYear: integer("graduation_year"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Post table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  postType: text("post_type").notNull(), // "article", "resource", "question", "discussion"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  imageUrl: text("image_url"),
});

// Comments table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  authorId: integer("author_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Topics table
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
});

// PostTopics junction table
export const postTopics = pgTable("post_topics", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  topicId: integer("topic_id").notNull().references(() => topics.id),
});

// Resources table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // "book", "video", "tool", "article", "link"
  resourceType: text("resource_type"), // "document", "pdf", "spreadsheet", "toolkit", "checklist", "code"
  url: text("url"),
  description: text("description"),
  difficultyLevel: text("difficulty_level"), // "beginner", "intermediate", "advanced"
  estimatedTime: text("estimated_time"), // e.g. "30 minutes", "2 hours"
  targetAudience: text("target_audience"), // e.g. "Students", "Professionals", "Both"
});

// Likes table
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
});

// Bookmarks table
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventDate: timestamp("event_date").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  color: text("color").notNull(),
  location: text("location"),
  imageUrl: text("image_url"),
  registrationLink: text("registration_link"),
});

// Connections table
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  status: text("status").notNull(), // "pending", "accepted", "rejected"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "like", "comment", "connection", "post", "mention"
  content: text("content").notNull(),
  sourceId: integer("source_id"), // ID of the related content (post, comment, etc.)
  sourceType: text("source_type"), // Type of source ("post", "comment", "connection")
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Learning Paths table
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  difficulty: text("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  estimatedTimeToComplete: text("estimated_time_to_complete"), // e.g. "2 weeks", "1 month"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  imageUrl: text("image_url"),
});

// Learning Path Steps table
export const learningPathSteps = pgTable("learning_path_steps", {
  id: serial("id").primaryKey(),
  learningPathId: integer("learning_path_id").notNull().references(() => learningPaths.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  resourceId: integer("resource_id").references(() => resources.id),
  postId: integer("post_id").references(() => posts.id),
  externalUrl: text("external_url"),
});

// User Learning Progress table
export const userLearningProgress = pgTable("user_learning_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  learningPathId: integer("learning_path_id").notNull().references(() => learningPaths.id),
  stepId: integer("step_id").notNull().references(() => learningPathSteps.id),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });
export const insertPostTopicSchema = createInsertSchema(postTopics).omit({ id: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true });
export const insertLikeSchema = createInsertSchema(likes).omit({ id: true });
export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({ id: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertConnectionSchema = createInsertSchema(connections).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({ id: true, createdAt: true });
export const insertLearningPathStepSchema = createInsertSchema(learningPathSteps).omit({ id: true });
export const insertUserLearningProgressSchema = createInsertSchema(userLearningProgress).omit({ id: true });

// Select Types
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type PostTopic = typeof postTopics.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Connection = typeof connections.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type LearningPath = typeof learningPaths.$inferSelect;
export type LearningPathStep = typeof learningPathSteps.$inferSelect;
export type UserLearningProgress = typeof userLearningProgress.$inferSelect;

// Insert Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertPostTopic = z.infer<typeof insertPostTopicSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type InsertLearningPathStep = z.infer<typeof insertLearningPathStepSchema>;
export type InsertUserLearningProgress = z.infer<typeof insertUserLearningProgressSchema>;

// Extended schemas for specific operations
export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginData = z.infer<typeof loginSchema>;
