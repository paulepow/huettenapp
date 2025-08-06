import { Response } from 'express';
import { prisma } from '../utils/database';
import { validateRequest, createNotificationSchema } from '../utils/validation';
import { AuthenticatedRequest, NotificationResponse, CreateNotificationRequest } from '../types';

/**
 * Benachrichtigungen des aktuellen Benutzers abrufen
 */
export const getMyNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Nicht authentifiziert',
        message: 'Benutzer ist nicht authentifiziert'
      });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const notificationResponses: NotificationResponse[] = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt,
      isRead: notification.isRead
    }));

    res.json({ notifications: notificationResponses });

  } catch (error: any) {
    console.error('Get my notifications error:', error);
    throw error;
  }
};

/**
 * Anzahl ungelesener Benachrichtigungen abrufen
 */
export const getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Nicht authentifiziert',
        message: 'Benutzer ist nicht authentifiziert'
      });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });

    res.json({ unreadCount });

  } catch (error: any) {
    console.error('Get unread count error:', error);
    throw error;
  }
};

/**
 * Benachrichtigung als gelesen markieren
 */
export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        error: 'Nicht authentifiziert',
        message: 'Benutzer ist nicht authentifiziert'
      });
    }

    // Prüfen ob Benachrichtigung dem Benutzer gehört
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      return res.status(404).json({
        error: 'Benachrichtigung nicht gefunden',
        message: 'Die Benachrichtigung existiert nicht oder gehört nicht zu Ihnen'
      });
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    res.json({ message: 'Benachrichtigung als gelesen markiert' });

  } catch (error: any) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

/**
 * Alle Benachrichtigungen als gelesen markieren
 */
export const markAllNotificationsAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Nicht authentifiziert',
        message: 'Benutzer ist nicht authentifiziert'
      });
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ message: 'Alle Benachrichtigungen als gelesen markiert' });

  } catch (error: any) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
};

/**
 * Neue Benachrichtigung erstellen (nur für Admins)
 */
export const createNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, title, body }: CreateNotificationRequest = 
      validateRequest(createNotificationSchema, req.body);

    if (userId) {
      // Benachrichtigung an spezifischen Benutzer
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          error: 'Benutzer nicht gefunden',
          message: 'Der angegebene Benutzer existiert nicht'
        });
      }

      await prisma.notification.create({
        data: {
          userId,
          title,
          body
        }
      });

      res.status(201).json({
        message: 'Benachrichtigung erfolgreich gesendet'
      });

    } else {
      // Benachrichtigung an alle Teilnehmer
      const allUsers = await prisma.user.findMany({
        where: { role: 'PARTICIPANT' },
        select: { id: true }
      });

      await prisma.notification.createMany({
        data: allUsers.map(user => ({
          userId: user.id,
          title,
          body
        }))
      });

      res.status(201).json({
        message: `Benachrichtigung an ${allUsers.length} Teilnehmer gesendet`
      });
    }

  } catch (error: any) {
    console.error('Create notification error:', error);
    throw error;
  }
};

/**
 * Alle Benachrichtigungen abrufen (nur für Admins)
 */
export const getAllNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const notificationResponses = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt,
      isRead: notification.isRead,
      user: notification.user
    }));

    res.json({ notifications: notificationResponses });

  } catch (error: any) {
    console.error('Get all notifications error:', error);
    throw error;
  }
};