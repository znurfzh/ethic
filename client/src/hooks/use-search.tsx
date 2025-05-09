import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Post, Topic, User } from '@shared/schema';

interface SearchResult {
  posts: Post[];
  users: Omit<User, 'password'>[];
  topics: Topic[];
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<SearchResult>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query || query.trim() === '') return { posts: [], users: [], topics: [] };
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      return response.json();
    },
    enabled: query.trim().length > 0, // Only run if there's an actual query
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim() !== '') {
      setIsOpen(true);
      refetch();
    } else {
      setIsOpen(false);
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
  };

  return {
    results: data || { posts: [], users: [], topics: [] },
    isLoading,
    error,
    isOpen,
    query,
    handleSearch,
    closeSearch
  };
}