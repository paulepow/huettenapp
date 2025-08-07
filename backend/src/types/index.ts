import { User, Activity, Notification, Payment } from '@prisma/client';
import { Request } from 'express';

// Erweiterte Types für API Responses
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PARTICIPANT';
  hasPaid: boolean;
  registeredAt: Date;
}

export interface ActivityResponse {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date | null;
  location: string | null;
  creator: {
    id: string;
    name: string;
  };
}

export interface NotificationResponse {
  id: string;
  title: string | null;
  body: string | null;
  createdAt: Date;
  isRead: boolean;
}

export interface PaymentResponse {
  id: string;
  userId: string;
  amount: number;
  paidAt: Date | null;
  markedBy: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateActivityRequest {
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  location?: string;
}

export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

export interface CreateNotificationRequest {
  userId?: string; // Wenn nicht angegeben, an alle senden
  title: string;
  body: string;
}

export interface UpdatePaymentStatusRequest {
  userId: string;
  hasPaid: boolean;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'PARTICIPANT';
}

// Express Request erweitert um User
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}