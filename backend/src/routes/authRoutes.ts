import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Benutzer registrieren
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @desc Benutzer anmelden
 * @access Public
 */
router.post('/login', login);

/**
 * @route GET /api/auth/me
 * @desc Aktuellen Benutzer abrufen
 * @access Private
 */
router.get('/me', authenticateToken, getCurrentUser);

export default router;