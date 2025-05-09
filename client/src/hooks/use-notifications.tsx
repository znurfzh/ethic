import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Notification } from '@shared/schema';

// Mock notifications to display while backend integration is pending
const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    type: 'mention',
    content: 'Rini Suryani mentioned you in a discussion about "Blended Learning Strategies"',
    read: false,
    sourceType: 'post',
    sourceId: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 2,
    userId: 1,
    type: 'comment',
    content: 'Ahmad Fauzi replied to your post "Mobile Learning Apps for Indonesian Language Education"',
    read: false,
    sourceType: 'post',
    sourceId: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: 3,
    userId: 1,
    type: 'like',
    content: 'Dewi Purnama liked your post about "Instructional Design Approaches"',
    read: true,
    sourceType: 'post',
    sourceId: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: 4,
    userId: 1,
    type: 'connection',
    content: 'Prof. Bambang Prakoso wants to connect with you',
    read: false,
    sourceType: 'connection',
    sourceId: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 5,
    userId: 1,
    type: 'event',
    content: 'New event: "Interactive Learning Tools Workshop" is happening next week',
    read: true,
    sourceType: 'event',
    sourceId: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 6,
    userId: 1,
    type: 'system',
    content: 'Your learning path "Educational Technology Fundamentals" has been updated with new content',
    read: true,
    sourceType: null,
    sourceId: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
  }
];

export function useNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(mockNotifications);

  const { data: backendNotifications = [], isLoading, error } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    // Only fetch if authenticated
    enabled: queryClient.getQueryData(['/api/user']) !== null,
  });

  // Use mock notifications if backend returns empty array
  const notifications = backendNotifications.length > 0 ? backendNotifications : localNotifications;

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      // If using backend notifications
      if (backendNotifications.length > 0) {
        await apiRequest('PUT', `/api/notifications/${notificationId}/read`);
      } else {
        // Update local mock notifications
        setLocalNotifications(prevState => 
          prevState.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true } 
              : notification
          )
        );
      }
    },
    onSuccess: () => {
      // Only invalidate if using backend
      if (backendNotifications.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      }
    }
  });

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const closeNotifications = () => {
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return {
    notifications,
    isLoading,
    error,
    isOpen,
    toggleNotifications,
    closeNotifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate
  };
}