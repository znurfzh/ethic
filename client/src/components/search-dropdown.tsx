import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Search, User, BookOpen, FileText, X } from 'lucide-react';
import { useSearch } from '@/hooks/use-search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export default function SearchDropdown() {
  const { 
    results, 
    isLoading, 
    isOpen, 
    query, 
    handleSearch, 
    closeSearch 
  } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeSearch]);

  // Handle keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Ctrl+K or Command+K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
      
      // Escape to close search
      if (event.key === 'Escape' && isOpen) {
        closeSearch();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeSearch]);

  const hasResults = results.posts.length > 0 || results.users.length > 0 || results.topics.length > 0;

  return (
    <div className="relative w-full md:w-64" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          ref={inputRef}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search topics, people, posts..."
          className="w-full pl-10 pr-8 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        {query && (
          <button
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={() => handleSearch('')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="hidden md:flex absolute right-3 top-2.5 text-xs text-gray-400">
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-30 top-12 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : (
            <>
              {!hasResults && query && (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">No results found for "{query}"</p>
                </div>
              )}
              
              {hasResults && (
                <ScrollArea className="max-h-[400px]">
                  {/* Users Section */}
                  {results.users.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-gray-500 px-2 mb-1">PEOPLE</h3>
                      <div className="space-y-1">
                        {results.users.map(user => (
                          <Link 
                            key={user.id} 
                            href={`/profile/${user.id}`}
                            onClick={closeSearch}
                          >
                            <div className={cn(
                              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-gray-100"
                            )}>
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-3 w-3 text-blue-600" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-medium truncate">{user.displayName}</p>
                                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Topics Section */}
                  {results.topics.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 px-2 mb-1">TOPICS</h3>
                      <div className="space-y-1">
                        {results.topics.map(topic => (
                          <Link 
                            key={topic.id} 
                            href={`/topics/${topic.id}`}
                            onClick={closeSearch}
                          >
                            <div className={cn(
                              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-gray-100"
                            )}>
                              <div className={`flex-shrink-0 h-6 w-6 rounded-full bg-${topic.color}-100 flex items-center justify-center`}>
                                <BookOpen className={`h-3 w-3 text-${topic.color}-600`} />
                              </div>
                              <div>
                                <p className="font-medium">{topic.name}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Posts Section */}
                  {results.posts.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-500 px-2 mb-1">POSTS</h3>
                      <div className="space-y-1">
                        {results.posts.map(post => (
                          <Link 
                            key={post.id} 
                            href={`/posts/${post.id}`}
                            onClick={closeSearch}
                          >
                            <div className={cn(
                              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover:bg-gray-100"
                            )}>
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                <FileText className="h-3 w-3 text-green-600" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-medium truncate">{post.title}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {post.content.substring(0, 50)}
                                  {post.content.length > 50 ? '...' : ''}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* View All Results */}
                  <div className="p-2 border-t border-gray-100">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-center py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={closeSearch}
                    >
                      View all results
                    </Button>
                  </div>
                </ScrollArea>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}