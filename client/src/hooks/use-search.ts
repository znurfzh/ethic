import { useState, useCallback, useRef } from "react";

interface SearchUser {
  id: number;
  displayName: string;
  username: string;
}

interface SearchTopic {
  id: number;
  name: string;
  color: string;
}

interface SearchPost {
  id: number;
  title: string;
  content: string;
}

interface SearchResults {
  users: SearchUser[];
  topics: SearchTopic[];
  posts: SearchPost[];
}

const mockUsers: SearchUser[] = [
  { id: 1, displayName: "Maya Pratama", username: "mayapratama" },
  { id: 2, displayName: "Dr. Wulan Sari", username: "wulansari" },
  { id: 3, displayName: "Rizki Pratama", username: "rizkipratama" },
  { id: 4, displayName: "Nia Putri", username: "niaputri" },
  { id: 5, displayName: "Budi Santoso", username: "budisantoso" },
];

const mockTopics: SearchTopic[] = [
  { id: 1, name: "Instructional Design", color: "blue" },
  { id: 2, name: "Educational Technology", color: "green" },
  { id: 3, name: "UX for Learning", color: "purple" },
  { id: 4, name: "EdTech Research", color: "amber" },
  { id: 5, name: "Gamification", color: "red" },
];

const mockPosts: SearchPost[] = [
  { id: 1, title: "Introduction to Constructivist Learning Theory", content: "Constructivism posits that learners construct knowledge through experience and reflection." },
  { id: 2, title: "Designing Effective E-Learning Modules", content: "Key principles for creating engaging online learning experiences." },
  { id: 3, title: "The Role of AI in Personalized Education", content: "How artificial intelligence is transforming adaptive learning systems." },
  { id: 4, title: "Gamification Strategies in Corporate Training", content: "Using game mechanics to improve learner engagement and retention." },
  { id: 5, title: "Accessibility in Digital Learning", content: "Ensuring inclusive design so all learners can access educational content." },
];

const EMPTY_RESULTS: SearchResults = { users: [], topics: [], posts: [] };

export function useSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setIsOpen(false);
      setResults(EMPTY_RESULTS);
      return;
    }

    setIsOpen(true);
    setIsLoading(true);

    debounceRef.current = setTimeout(() => {
      const q = value.toLowerCase();
      setResults({
        users: mockUsers.filter(
          (u) =>
            u.displayName.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q),
        ),
        topics: mockTopics.filter((t) => t.name.toLowerCase().includes(q)),
        posts: mockPosts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q),
        ),
      });
      setIsLoading(false);
    }, 200);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults(EMPTY_RESULTS);
  }, []);

  return { results, isLoading, isOpen, query, handleSearch, closeSearch };
}
