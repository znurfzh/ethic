import { storage } from './storage';
import { InsertTopic, InsertPost, InsertUser, InsertEvent, InsertResource, InsertLearningPath, InsertLearningPathStep, InsertNotification } from '../shared/schema';

export async function seedDatabase() {
  // Create demo users
  const demoUsers: InsertUser[] = [
    {
      username: "anggapurnama",
      password: "password123",
      displayName: "Angga Purnama",
      email: "angga.purnama@ethic.id",
      userType: "faculty",
      organization: "Universitas Indonesia",
      jobTitle: "Assistant Professor",
      graduationYear: undefined,
      bio: "Educational technology researcher specializing in gamification and learning analytics.",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      username: "mariaayu",
      password: "password123",
      displayName: "Maria Ayu",
      email: "maria.ayu@ethic.id",
      userType: "alumni",
      organization: "Telkom Indonesia",
      jobTitle: "Educational Technology Specialist",
      graduationYear: 2019,
      bio: "Former student turned EdTech specialist. Working on digital learning solutions for corporate training.",
      avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      username: "ahmadrizki",
      password: "password123",
      displayName: "Ahmad Rizki",
      email: "ahmad.rizki@ethic.id",
      userType: "student",
      organization: "Universitas Gadjah Mada", // Using organization field for institution
      jobTitle: "",
      graduationYear: 2025,
      bio: "Computer Science student with a passion for educational apps and learning management systems.",
      avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
      username: "sitinuraini",
      password: "password123",
      displayName: "Siti Nuraini",
      email: "siti.nuraini@ethic.id",
      userType: "professional",
      organization: "Ruangguru",
      jobTitle: "Senior Product Manager",
      graduationYear: undefined,
      bio: "Leading product development for Indonesia's largest EdTech platform, focused on K-12 learning solutions.",
      avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    }
  ];

  // Create topics
  const demoTopics: InsertTopic[] = [
    { name: "Instructional Design", color: "amber" },
    { name: "E-Learning Development", color: "blue" },
    { name: "Learning Analytics", color: "green" },
    { name: "Mobile Learning", color: "purple" },
    { name: "Educational Games", color: "red" },
    { name: "Inclusive Learning", color: "emerald" },
    { name: "Virtual Reality in Education", color: "indigo" },
    { name: "Blended Learning Methods", color: "orange" },
    { name: "Digital Assessment", color: "cyan" },
    { name: "Resources for Teachers", color: "teal" }
  ];

  // Create posts
  const demoPosts: InsertPost[] = [
    {
      title: "Best Practices for Designing Effective Learning Modules",
      content: "In this comprehensive guide, I'll share proven strategies for designing engaging and effective learning modules based on my experience teaching at UI. I'll cover content structure, interactive elements, assessment strategies, and feedback mechanisms that boost learner engagement.",
      authorId: 2, // Maria Ayu
      postType: "article",
      imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Implementing Learning Analytics in Higher Education",
      content: "Learning analytics has transformed how we understand student performance and engagement at our university. This post explores our journey implementing analytics tools, the challenges we faced, and how we use data to improve learning outcomes while respecting student privacy.",
      authorId: 1, // Angga Purnama
      postType: "case study",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Mobile Learning Apps for Indonesian Language Education",
      content: "I've been researching the effectiveness of mobile learning applications for Bahasa Indonesia education. This post reviews five top apps, comparing their pedagogical approaches, user experience, and learning outcomes for various student demographics.",
      authorId: 3, // Ahmad Rizki
      postType: "review",
      imageUrl: "https://images.unsplash.com/photo-1605627079912-97c3810a11a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Virtual Reality Field Trips: A Case Study in Geography Education",
      content: "Our team developed VR field trips for geography students who couldn't travel to remote locations. This post details our development process, the technology we used, student reactions, and learning outcomes compared to traditional methods.",
      authorId: 2, // Maria Ayu
      postType: "case study",
      imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Inclusive Design Principles for Educational Technology",
      content: "Making EdTech accessible to all students is not just a legal requirement but a moral imperative. This guide outlines practical inclusive design principles, including considerations for visual, auditory, motor, and cognitive accessibility in digital learning environments.",
      authorId: 1, // Angga Purnama
      postType: "guide",
      imageUrl: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Gamification Strategies for Increasing Student Motivation",
      content: "My research team studied how gamification elements affect student motivation across different courses. We found that points, badges, and leaderboards work differently depending on subject matter and student personality types. This post presents our findings and practical implementation strategies.",
      authorId: 3, // Ahmad Rizki
      postType: "research",
      imageUrl: "https://images.unsplash.com/photo-1511377107391-ba46cae09248?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    }
  ];

  // Create events - adjusted for schema
  const demoEvents: InsertEvent[] = [
    {
      title: "EdTech Innovation Summit 2025",
      description: "Annual conference bringing together educators, researchers, and EdTech companies to showcase the latest innovations in educational technology.",
      eventDate: new Date("2025-07-12"),
      createdBy: 1, // Angga Purnama
      color: "blue",
      location: "Jakarta Convention Center",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
      registrationLink: "https://edtechinnovationsummit2025.id"
    },
    {
      title: "Mobile Learning Workshop Series",
      description: "Three-part workshop on designing, developing, and implementing mobile learning solutions for higher education.",
      eventDate: new Date("2025-05-15"),
      createdBy: 2, // Maria Ayu
      color: "purple",
      location: "Universitas Indonesia, Depok",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
      registrationLink: "https://uilearning.id/workshops/mobile2025"
    },
    {
      title: "Inclusive Education Technology Hackathon",
      description: "48-hour hackathon focused on creating technology solutions for learners with diverse needs. Open to students, professionals, and educators.",
      eventDate: new Date("2025-06-20"),
      createdBy: 3, // Ahmad Rizki
      color: "emerald",
      location: "Bandung Institute of Technology",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
      registrationLink: "https://inclusivetechhack.id"
    },
    {
      title: "Virtual Reality in Education Symposium",
      description: "A full-day symposium exploring the latest research and applications of VR technology in educational settings across Indonesia.",
      eventDate: new Date("2025-08-05"),
      createdBy: 1, // Angga Purnama
      color: "indigo",
      location: "Grand Hyatt Jakarta",
      imageUrl: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
      registrationLink: "https://vredu2025.id"
    },
    {
      title: "Digital Assessment Best Practices Webinar",
      description: "Online webinar covering ethical considerations, technology tools, and pedagogical approaches for effective digital assessment.",
      eventDate: new Date("2025-05-28"),
      createdBy: 2, // Maria Ayu
      color: "cyan",
      location: "Online (Zoom)",
      imageUrl: "https://images.unsplash.com/photo-1553835973-dec43bfddbeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80",
      registrationLink: "https://digitalassess.ethic.id"
    }
  ];

  // Create resources
  const demoResources: InsertResource[] = [
    {
      title: "Instructional Design Templates Bundle",
      description: "A collection of 15 customizable templates for creating learning objectives, storyboards, assessment plans, and more.",
      type: "document",
      resourceType: "document",
      url: "https://ethic.id/resources/id-templates",
      postId: 1
    },
    {
      title: "Learning Analytics Implementation Guide",
      description: "Step-by-step guide for educational institutions looking to implement learning analytics systems.",
      type: "article",
      resourceType: "pdf",
      url: "https://ethic.id/resources/analytics-guide",
      postId: 2
    },
    {
      title: "Mobile Learning Apps Comparison Spreadsheet",
      description: "Detailed feature comparison of 20 mobile learning applications including pricing, platform compatibility, and key features.",
      type: "tool",
      resourceType: "spreadsheet",
      url: "https://ethic.id/resources/mobile-apps-comparison",
      postId: 3
    },
    {
      title: "Virtual Field Trip Development Toolkit",
      description: "Software tools, 360° photography guidelines, and instructional frameworks for creating educational VR experiences.",
      type: "tool",
      resourceType: "toolkit",
      url: "https://ethic.id/resources/vr-toolkit",
      postId: 4
    },
    {
      title: "Inclusive Design Checklist for Educational Materials",
      description: "Comprehensive checklist to ensure learning materials meet accessibility guidelines and inclusive design principles.",
      type: "document",
      resourceType: "checklist",
      url: "https://ethic.id/resources/inclusive-checklist",
      postId: 5
    },
    {
      title: "Gamification Elements Library",
      description: "Collection of ready-to-implement gamification elements with code examples and integration guidelines for learning platforms.",
      type: "tool",
      resourceType: "code",
      url: "https://ethic.id/resources/gamification-library",
      postId: 6
    }
  ];

  // Create learning paths
  const demoLearningPaths: InsertLearningPath[] = [
    {
      title: "Introduction to Educational Technology",
      description: "A foundational path covering the basics of educational technology, its history, current trends, and future directions.",
      createdBy: 1, // Angga Purnama
      difficulty: "beginner",
      estimatedTimeToComplete: "4 weeks",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "E-Learning Course Development",
      description: "Learn to design, develop, and deploy effective e-learning courses using modern authoring tools and pedagogical approaches.",
      createdBy: 2, // Maria Ayu
      difficulty: "intermediate",
      estimatedTimeToComplete: "8 weeks",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Educational Game Design",
      description: "Explore the intersection of game design and learning theory to create engaging educational games for various contexts.",
      createdBy: 3, // Ahmad Rizki
      difficulty: "advanced",
      estimatedTimeToComplete: "10 weeks",
      imageUrl: "https://images.unsplash.com/photo-1511213966740-24f719e1ae9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Learning Analytics for Educators",
      description: "A practical approach to using data and analytics to understand and improve teaching and learning processes.",
      createdBy: 1, // Angga Purnama
      difficulty: "intermediate",
      estimatedTimeToComplete: "6 weeks",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Inclusive Educational Technology",
      description: "Strategies and tools for creating accessible learning experiences that accommodate diverse learner needs and preferences.",
      createdBy: 2, // Maria Ayu
      difficulty: "intermediate",
      estimatedTimeToComplete: "5 weeks",
      imageUrl: "https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80"
    }
  ];

  // Create learning path steps
  const demoLearningPathSteps: InsertLearningPathStep[][] = [
    // Introduction to Educational Technology
    [
      {
        learningPathId: 1,
        title: "Foundations and History of EdTech",
        description: "Explore the historical development of educational technology and key theoretical frameworks.",
        order: 1,
        resourceId: 1
      },
      {
        learningPathId: 1,
        title: "Current EdTech Landscape",
        description: "Survey of current technologies, platforms, and approaches in educational technology.",
        order: 2,
        postId: 1
      },
      {
        learningPathId: 1,
        title: "Evaluating Educational Technology",
        description: "Frameworks and criteria for selecting and evaluating appropriate technology for educational contexts.",
        order: 3,
        resourceId: 2
      }
    ],
    
    // E-Learning Course Development
    [
      {
        learningPathId: 2,
        title: "Instructional Design Models",
        description: "Overview of ADDIE, SAM, and other instructional design models for e-learning development.",
        order: 1,
        resourceId: 1
      },
      {
        learningPathId: 2,
        title: "Content Creation and Multimedia",
        description: "Techniques for creating engaging learning content including video, audio, and interactive elements.",
        order: 2,
        postId: 1
      },
      {
        learningPathId: 2,
        title: "Assessment in Online Learning",
        description: "Strategies for authentic assessment, feedback, and measuring learning outcomes in online environments.",
        order: 3,
        resourceId: 5
      },
      {
        learningPathId: 2,
        title: "Course Deployment and Management",
        description: "Best practices for deploying, managing, and maintaining e-learning courses on various platforms.",
        order: 4,
        postId: 2
      }
    ]
  ];

  // Seed the database
  const usersPromises = demoUsers.map(user => storage.createUser(user));
  await Promise.all(usersPromises);
  console.log("Created demo users");

  const topicsPromises = demoTopics.map(topic => storage.createTopic(topic));
  await Promise.all(topicsPromises);
  console.log("Created demo topics");

  const postsPromises = demoPosts.map(post => storage.createPost(post));
  const posts = await Promise.all(postsPromises);
  console.log("Created demo posts");

  // Associate posts with topics
  const postTopicPromises = [];
  for (let i = 0; i < posts.length; i++) {
    // Associate each post with 1-3 random topics
    const numTopics = Math.floor(Math.random() * 3) + 1;
    const topicIndices = new Set<number>();
    
    while (topicIndices.size < numTopics) {
      topicIndices.add(Math.floor(Math.random() * demoTopics.length) + 1);
    }
    
    // Convert Set to Array for iteration
    const topicIds = Array.from(topicIndices);
    for (const topicId of topicIds) {
      postTopicPromises.push(storage.associatePostTopic({
        postId: posts[i].id,
        topicId
      }));
    }
  }
  await Promise.all(postTopicPromises);
  console.log("Associated posts with topics");

  // Create events with missing fields added
  const eventsWithExtraFields = demoEvents.map(event => {
    // @ts-ignore - adding extra fields that event API might handle
    return { 
      ...event,
      location: event.location || "Online",
      imageUrl: event.imageUrl,
      registrationLink: event.registrationLink
    };
  });
  
  const eventsPromises = eventsWithExtraFields.map(event => storage.createEvent(event));
  await Promise.all(eventsPromises);
  console.log("Created demo events");

  const resourcesPromises = demoResources.map(resource => storage.createResource(resource));
  await Promise.all(resourcesPromises);
  console.log("Created demo resources");

  const learningPathsPromises = demoLearningPaths.map(path => storage.createLearningPath(path));
  const learningPaths = await Promise.all(learningPathsPromises);
  console.log("Created demo learning paths");

  // Create learning path steps
  for (let i = 0; i < Math.min(demoLearningPathSteps.length, learningPaths.length); i++) {
    const stepsPromises = demoLearningPathSteps[i].map(step => {
      return storage.createLearningPathStep({
        ...step,
        learningPathId: learningPaths[i].id
      });
    });
    await Promise.all(stepsPromises);
  }
  console.log("Created demo learning path steps");

  // Create demo notifications
  const demoNotifications: InsertNotification[] = [
    {
      userId: 3, // Ahmad Rizki
      type: 'mention',
      content: 'Rini Suryani mentioned you in a discussion about "Blended Learning Strategies"',
      sourceId: 1,
      sourceType: 'post',
      read: false
    },
    {
      userId: 3, // Ahmad Rizki
      type: 'comment',
      content: 'Maria Ayu replied to your post "Mobile Learning Apps for Indonesian Language Education"',
      sourceId: 3,
      sourceType: 'post',
      read: false
    },
    {
      userId: 3, // Ahmad Rizki
      type: 'like',
      content: 'Angga Purnama liked your post about "Gamification Strategies"',
      sourceId: 6,
      sourceType: 'post',
      read: true
    },
    {
      userId: 3, // Ahmad Rizki
      type: 'connection',
      content: 'Prof. Bambang Prakoso wants to connect with you',
      sourceId: 5,
      sourceType: 'connection',
      read: false
    },
    {
      userId: 3, // Ahmad Rizki
      type: 'event',
      content: 'New event: "Mobile Learning Workshop Series" is happening next week',
      sourceId: 2,
      sourceType: 'event',
      read: true
    },
    {
      userId: 3, // Ahmad Rizki
      type: 'system',
      content: 'Your learning path "Educational Technology Fundamentals" has been updated with new content',
      sourceId: null,
      sourceType: null,
      read: true
    }
  ];

  const notificationsPromises = demoNotifications.map(notification => storage.createNotification(notification));
  await Promise.all(notificationsPromises);
  console.log("Created demo notifications");

  console.log("Database seeding completed");
}