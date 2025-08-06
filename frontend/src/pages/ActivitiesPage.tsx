import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, User, List } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { activityAPI, getApiErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Activity } from '../types';

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const { user } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const { activities } = await activityAPI.getAllActivities();
      setActivities(activities);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const formatActivityDate = (dateString: string): string => {
    const date = parseISO(dateString);
    
    if (isToday(date)) return 'Heute';
    if (isTomorrow(date)) return 'Morgen';
    if (isThisWeek(date)) return format(date, 'EEEE', { locale: de });
    
    return format(date, 'dd.MM.yyyy', { locale: de });
  };

  const formatActivityTime = (startTime: string, endTime?: string | null): string => {
    const start = format(parseISO(startTime), 'HH:mm');
    if (endTime) {
      const end = format(parseISO(endTime), 'HH:mm');
      return `${start} - ${end}`;
    }
    return `ab ${start}`;
  };

  const getActivityStatus = (startTime: string): 'upcoming' | 'today' | 'past' => {
    const now = new Date();
    const activityDate = parseISO(startTime);
    
    if (isToday(activityDate)) return 'today';
    if (activityDate < now) return 'past';
    return 'upcoming';
  };

  const getStatusColor = (status: 'upcoming' | 'today' | 'past'): string => {
    switch (status) {
      case 'today': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'past': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: 'upcoming' | 'today' | 'past'): string => {
    switch (status) {
      case 'today': return 'Heute';
      case 'upcoming': return 'Geplant';
      case 'past': return 'Vergangen';
      default: return 'Unbekannt';
    }
  };

  const sortedActivities = [...activities].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Aktivitäten</h1>
          <p className="mt-1 text-gray-600">
            Alle geplanten Aktivitäten für unseren Hüttenurlaub
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 inline mr-1" />
              Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Kalender
            </button>
          </div>

          {/* Admin: Neue Aktivität Button */}
          {user?.role === 'ADMIN' && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Plus className="w-4 h-4 mr-2" />
              Neue Aktivität
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Aktivitäten anzeigen */}
      {activities.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Aktivitäten</h3>
          <p className="mt-1 text-sm text-gray-500">
            Es sind noch keine Aktivitäten geplant.
          </p>
          {user?.role === 'ADMIN' && (
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Erste Aktivität erstellen
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedActivities.map((activity) => {
            const status = getActivityStatus(activity.startTime);
            return (
              <div
                key={activity.id}
                className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                      
                      {activity.description && (
                        <p className="text-gray-600 mb-4">{activity.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatActivityDate(activity.startTime)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatActivityTime(activity.startTime, activity.endTime)}
                        </div>
                        {activity.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {activity.location}
                          </div>
                        )}
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Erstellt von {activity.creator.name}
                        </div>
                      </div>
                    </div>
                    
                    {/* Admin Actions */}
                    {user?.role === 'ADMIN' && (
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;