import express from 'express';
import { 
  getMyNotifications, 
  getUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  createNotification, 
  getAllNotifications 
} from '../controllers/notificationController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * @route GET /api/notifications
 * @desc Eigene Benachrichtigungen abrufen
 * @access Private
 */
router.get('/', authenticateToken, getMyNotifications);

/**
 * @route GET /api/notifications/all
 * @desc Alle Benachrichtigungen abrufen (für Admins)
 * @access Private (Admin only)
 */
router.get('/all', authenticateToken, requireAdmin, getAllNotifications);

/**
 * @route GET /api/notifications/unread-count
 * @desc Anzahl ungelesener Benachrichtigungen abrufen
 * @access Private
 */
router.get('/unread-count', authenticateToken, getUnreadCount);

/**
 * @route POST /api/notifications
 * @desc Neue Benachrichtigung erstellen
 * @access Private (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, createNotification);

/**
 * @route PUT /api/notifications/:notificationId/read
 * @desc Benachrichtigung als gelesen markieren
 * @access Private
 */
router.put('/:notificationId/read', authenticateToken, markNotificationAsRead);

/**
 * @route PUT /api/notifications/read-all
 * @desc Alle Benachrichtigungen als gelesen markieren
 * @access Private
 */
router.put('/read-all', authenticateToken, markAllNotificationsAsRead);

export default router;