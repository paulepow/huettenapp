import express from 'express';
import { 
  getAllActivities, 
  getActivityById, 
  createActivity, 
  updateActivity, 
  deleteActivity 
} from '../controllers/activityController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * @route GET /api/activities
 * @desc Alle Aktivitäten abrufen
 * @access Private
 */
router.get('/', authenticateToken, getAllActivities);

/**
 * @route GET /api/activities/:activityId
 * @desc Einzelne Aktivität abrufen
 * @access Private
 */
router.get('/:activityId', authenticateToken, getActivityById);

/**
 * @route POST /api/activities
 * @desc Neue Aktivität erstellen
 * @access Private (Admin only)
 */
router.post('/', authenticateToken, requireAdmin, createActivity);

/**
 * @route PUT /api/activities/:activityId
 * @desc Aktivität aktualisieren
 * @access Private (Admin only)
 */
router.put('/:activityId', authenticateToken, requireAdmin, updateActivity);

/**
 * @route DELETE /api/activities/:activityId
 * @desc Aktivität löschen
 * @access Private (Admin only)
 */
router.delete('/:activityId', authenticateToken, requireAdmin, deleteActivity);

export default router;