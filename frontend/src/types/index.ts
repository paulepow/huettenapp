export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PARTICIPANT';
  hasPaid: boolean;
  registeredAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string | null;
  location: string | null;
  creator: {
    id: string;
    name: string;
  };
}

export interface Notification {
  id: string;
  title: string | null;
  body: string | null;
  createdAt: string;
  isRead: boolean;
}

export interface CabinInfo {
  name: string;
  address: string;
  date: string;
  description: string;
  images: string[];
  googleMapsUrl: string;
  features: string[];
  pricing: {
    earlyBird: { deadline: string; price: number };
    regular: { deadline: string; price: number };
    late: { deadline: string; price: number };
    singleNight: { price: number; note: string };
  };
  included: string[];
  program: string[];
  meetingPoint: string;
  rules: string[];
  aftermovie: string;
}

// API Request Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CreateActivityData {
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
}

export interface CreateNotificationData {
  userId?: string;
  title: string;
  body: string;
}

// API Response Types
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  message: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}