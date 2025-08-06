import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Mail, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Fehler beim Markieren als gelesen:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Fehler beim Markieren aller als gelesen:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Gerade eben';
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min.`;
    if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)} Std.`;
    
    return format(date, 'dd.MM.yyyy HH:mm', { locale: de });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Benachrichtigungen</h1>
          <p className="mt-1 text-gray-600">
            {unreadCount > 0 ? `${unreadCount} ungelesene Nachrichten` : 'Alle Nachrichten gelesen'}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Filter */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Alle ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ungelesen ({unreadCount})
            </button>
          </div>

          {/* Alle als gelesen markieren */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Alle als gelesen markieren
            </button>
          )}
        </div>
      </div>

      {/* Benachrichtigungen */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {filter === 'unread' ? 'Keine ungelesenen Benachrichtigungen' : 'Keine Benachrichtigungen'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'unread' 
              ? 'Alle deine Benachrichtigungen sind bereits gelesen.'
              : 'Du hast noch keine Benachrichtigungen erhalten.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow border-l-4 overflow-hidden transition-all duration-200 hover:shadow-md ${
                notification.isRead 
                  ? 'border-l-gray-300' 
                  : 'border-l-primary-500 bg-primary-25'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-2 rounded-full ${
                        notification.isRead ? 'bg-gray-100' : 'bg-primary-100'
                      }`}>
                        <Mail className={`w-4 h-4 ${
                          notification.isRead ? 'text-gray-500' : 'text-primary-600'
                        }`} />
                      </div>
                      
                      {notification.title && (
                        <h3 className={`text-lg font-medium ${
                          notification.isRead ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                      )}
                      
                      {!notification.isRead && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Neu
                        </span>
                      )}
                    </div>
                    
                    {notification.body && (
                      <p className={`text-sm leading-relaxed ${
                        notification.isRead ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {notification.body}
                      </p>
                    )}
                    
                    <div className="flex items-center mt-4 text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                  
                  {/* Aktionen */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Als gelesen markieren
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info-Box für neue Benutzer */}
      {notifications.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">
            📬 Über Benachrichtigungen
          </h3>
          <div className="space-y-2 text-blue-800">
            <p>Hier erhältst du wichtige Updates zum Hüttenurlaub:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Neue Aktivitäten und Programmänderungen</li>
              <li>Updates zu deinem Zahlungsstatus</li>
              <li>Wichtige Mitteilungen vom Organisator</li>
              <li>Erinnerungen und Termine</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;