import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { format } from "date-fns";
import { Calendar, PlusCircle } from "lucide-react";

export default function UpcomingEvents() {
  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Events</h3>
      
      {events && events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className={`border-l-4 border-${event.color}-500 pl-3`}>
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {format(new Date(event.eventDate), "MMM d, yyyy")} • {format(new Date(event.eventDate), "h:mm a")}
                </span>
              </div>
              <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
              <button className="mt-2 text-xs text-primary-600 font-medium hover:text-primary-700">
                <PlusCircle className="h-3 w-3 mr-1 inline" />
                Add to calendar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No upcoming events</p>
        </div>
      )}
      
      <a href="#" className="block mt-3 text-sm text-primary-600 font-medium hover:text-primary-700">
        View all events
      </a>
    </div>
  );
}
