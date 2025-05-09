import { useQuery } from "@tanstack/react-query";
import { Topic } from "@shared/schema";

// Mock data for topic posts count - in a real app, this would come from the API
const topicPostsCount = {
  "Instructional Design": 32,
  "Remote Learning": 19,
  "EdTech Startups": 14,
  "AIinEducation": 12
};

export default function TrendingTopics() {
  const { data: topics } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });
  
  // Display only a subset of topics
  const displayTopics = topics?.slice(0, 4) || [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Trending Topics</h3>
      
      <div className="space-y-2">
        {displayTopics.map(topic => (
          <div key={topic.id} className="block p-2 bg-gray-50 rounded-md">
            <span className="text-sm font-medium text-gray-900">#{topic.name}</span>
            <p className="text-xs text-gray-500 mt-1">
              {topicPostsCount[topic.name as keyof typeof topicPostsCount] || 5} new posts this week
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
