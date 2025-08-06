import axios, { AxiosError } from 'axios';
import type { 
  User, 
  Activity, 
  Notification, 
  CabinInfo,
  LoginData, 
  RegisterData, 
  CreateActivityData, 
  CreateNotificationData,
  AuthResponse,
  ApiError 
} from '../types';

// Axios-Instanz konfigurieren
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor für Authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor für Error Handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Bei 401 Token entfernen und zur Login-Seite weiterleiten
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  }
};

// User API
export const userAPI = {
  getAllUsers: async (): Promise<{ users: User[] }> => {
    const response = await api.get<{ users: User[] }>('/users');
    return response.data;
  },

  getUserById: async (userId: string): Promise<{ user: User }> => {
    const response = await api.get<{ user: User }>(`/users/${userId}`);
    return response.data;
  },

  getMyPaymentStatus: async (): Promise<{ id: string; name: string; hasPaid: boolean }> => {
    const response = await api.get<{ id: string; name: string; hasPaid: boolean }>('/users/payment-status');
    return response.data;
  },

  updatePaymentStatus: async (userId: string, hasPaid: boolean): Promise<{ message: string; user: User }> => {
    const response = await api.put<{ message: string; user: User }>(`/users/${userId}/payment-status`, { hasPaid });
    return response.data;
  }
};

// Activity API
export const activityAPI = {
  getAllActivities: async (): Promise<{ activities: Activity[] }> => {
    const response = await api.get<{ activities: Activity[] }>('/activities');
    return response.data;
  },

  getActivityById: async (activityId: string): Promise<{ activity: Activity }> => {
    const response = await api.get<{ activity: Activity }>(`/activities/${activityId}`);
    return response.data;
  },

  createActivity: async (data: CreateActivityData): Promise<{ message: string; activity: Activity }> => {
    const response = await api.post<{ message: string; activity: Activity }>('/activities', data);
    return response.data;
  },

  updateActivity: async (activityId: string, data: Partial<CreateActivityData>): Promise<{ message: string; activity: Activity }> => {
    const response = await api.put<{ message: string; activity: Activity }>(`/activities/${activityId}`, data);
    return response.data;
  },

  deleteActivity: async (activityId: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/activities/${activityId}`);
    return response.data;
  }
};

// Notification API
export const notificationAPI = {
  getMyNotifications: async (): Promise<{ notifications: Notification[] }> => {
    const response = await api.get<{ notifications: Notification[] }>('/notifications');
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const response = await api.get<{ unreadCount: number }>('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>('/notifications/read-all');
    return response.data;
  },

  createNotification: async (data: CreateNotificationData): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/notifications', data);
    return response.data;
  },

  getAllNotifications: async (): Promise<{ notifications: any[] }> => {
    const response = await api.get<{ notifications: any[] }>('/notifications/all');
    return response.data;
  }
};

// Cabin Info API
export const cabinAPI = {
  getCabinInfo: async (): Promise<CabinInfo> => {
    const response = await api.get<CabinInfo>('/cabin-info');
    return response.data;
  }
};

// Error Helper
export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.message || 'Ein unbekannter Fehler ist aufgetreten';
  }
  return 'Ein unbekannter Fehler ist aufgetreten';
};