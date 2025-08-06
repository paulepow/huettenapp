import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updatePaymentStatus, 
  getMyPaymentStatus 
} from '../controllers/userController';
import { authenticateToken, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Alle Benutzer abrufen
 * @access Private (Admin only)
 */
router.get('/', authenticateToken, requireAdmin, getAllUsers);

/**
 * @route GET /api/users/payment-status
 * @desc Eigenen Zahlungsstatus abrufen
 * @access Private
 */
router.get('/payment-status', authenticateToken, getMyPaymentStatus);

/**
 * @route GET /api/users/:userId
 * @desc Einzelnen Benutzer abrufen
 * @access Private (Own data or Admin)
 */
router.get('/:userId', authenticateToken, requireOwnershipOrAdmin(), getUserById);

/**
 * @route PUT /api/users/:userId/payment-status
 * @desc Zahlungsstatus eines Benutzers aktualisieren
 * @access Private (Admin only)
 */
router.put('/:userId/payment-status', authenticateToken, requireAdmin, updatePaymentStatus);

export default router;