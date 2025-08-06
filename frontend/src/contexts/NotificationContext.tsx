import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notificationAPI, getApiErrorMessage } from '../services/api';
import { useAuth } from './AuthContext';
import type { Notification, NotificationContextType } from '../types';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Benachrichtigungen laden wenn Benutzer eingeloggt ist
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const fetchNotifications = async (): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { notifications } = await notificationAPI.getMyNotifications();
      setNotifications(notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const { unreadCount } = await notificationAPI.getUnreadCount();
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', getApiErrorMessage(error));
    }
  };

  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      // Lokalen State aktualisieren
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Unread count aktualisieren
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', getApiErrorMessage(error));
      throw new Error(getApiErrorMessage(error));
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Lokalen State aktualisieren
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', getApiErrorMessage(error));
      throw new Error(getApiErrorMessage(error));
    }
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};