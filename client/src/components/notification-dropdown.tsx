import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';
import { Notification } from '@shared/schema';
import { useNotifications } from '@/hooks/use-notifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationDropdown() {
  const { 
    notifications, 
    isOpen, 
    toggleNotifications, 
    closeNotifications, 
    unreadCount,
    markAsRead
  } = useNotifications();

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const renderNotificationContent = (notification: Notification) => {
    return (
      <div className="flex flex-col">
        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'font-medium text-gray-900'}`}>
          {notification.content}
        </p>
        <span className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </span>
      </div>
    );
  };

  // Function to get the link based on notification type and source
  const getNotificationLink = (notification: Notification) => {
    if (notification.sourceType === 'post' && notification.sourceId) {
      return `/posts/${notification.sourceId}`;
    } else if (notification.sourceType === 'comment' && notification.sourceId) {
      return `/posts/${notification.sourceId}`;
    } else if (notification.type === 'connection' && notification.sourceType === 'connection') {
      return `/profile/${notification.userId}`;
    }
    return '';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={toggleNotifications}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {unreadCount} New
            </span>
          )}
        </div>
        
        <div className="overflow-y-auto max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <>
              <div>
                {notifications.map((notification) => {
                  const link = getNotificationLink(notification);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id);
                        }
                        closeNotifications();
                      }}
                    >
                      <div className="flex w-full justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 mt-1.5 rounded-full ${notification.read ? 'bg-transparent' : 'bg-blue-600'}`} />
                          {renderNotificationContent(notification)}
                        </div>
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-gray-500"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <span className="sr-only">Mark as read</span>
                            <span className="text-xs">×</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        
        {/* Fixed footer for See All link */}
        <div className="border-t border-gray-100 w-full">
          <Link href="/home?tab=notifications" onClick={closeNotifications}>
            <div className="p-3 text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
              See All Notifications
            </div>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}