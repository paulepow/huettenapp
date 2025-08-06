import { Response } from 'express';
import { prisma } from '../utils/database';
import { validateRequest, createActivitySchema, updateActivitySchema } from '../utils/validation';
import { AuthenticatedRequest, ActivityResponse, CreateActivityRequest, UpdateActivityRequest } from '../types';

/**
 * Alle Aktivitäten abrufen
 */
export const getAllActivities = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { startTime: 'asc' },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const activityResponses: ActivityResponse[] = activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      creator: {
        id: activity.creator.id,
        name: activity.creator.name
      }
    }));

    res.json({ activities: activityResponses });

  } catch (error: any) {
    console.error('Get all activities error:', error);
    throw error;
  }
};

/**
 * Einzelne Aktivität abrufen
 */
export const getActivityById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { activityId } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!activity) {
      return res.status(404).json({
        error: 'Aktivität nicht gefunden',
        message: 'Die angeforderte Aktivität existiert nicht'
      });
    }

    const activityResponse: ActivityResponse = {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      creator: {
        id: activity.creator.id,
        name: activity.creator.name
      }
    };

    res.json({ activity: activityResponse });

  } catch (error: any) {
    console.error('Get activity by ID error:', error);
    throw error;
  }
};

/**
 * Neue Aktivität erstellen (nur für Admins)
 */
export const createActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Nicht authentifiziert',
        message: 'Benutzer ist nicht authentifiziert'
      });
    }

    const { title, description, startTime, endTime, location }: CreateActivityRequest = 
      validateRequest(createActivitySchema, req.body);

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location,
        createdBy: userId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Benachrichtigung an alle Teilnehmer senden
    const allUsers = await prisma.user.findMany({
      where: { 
        role: 'PARTICIPANT',
        id: { not: userId } // Nicht an den Ersteller
      },
      select: { id: true }
    });

    await prisma.notification.createMany({
      data: allUsers.map(user => ({
        userId: user.id,
        title: 'Neue Aktivität erstellt',
        body: `Eine neue Aktivität "${title}" wurde hinzugefügt!`
      }))
    });

    const activityResponse: ActivityResponse = {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      creator: {
        id: activity.creator.id,
        name: activity.creator.name
      }
    };

    res.status(201).json({
      message: 'Aktivität erfolgreich erstellt',
      activity: activityResponse
    });

  } catch (error: any) {
    console.error('Create activity error:', error);
    throw error;
  }
};

/**
 * Aktivität aktualisieren (nur für Admins)
 */
export const updateActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { activityId } = req.params;
    const updateData: UpdateActivityRequest = validateRequest(updateActivitySchema, req.body);

    // Prüfen ob Aktivität existiert
    const existingActivity = await prisma.activity.findUnique({
      where: { id: activityId }
    });

    if (!existingActivity) {
      return res.status(404).json({
        error: 'Aktivität nicht gefunden',
        message: 'Die zu aktualisierende Aktivität existiert nicht'
      });
    }

    // Update-Daten vorbereiten
    const updateFields: any = {};
    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.startTime !== undefined) updateFields.startTime = new Date(updateData.startTime);
    if (updateData.endTime !== undefined) updateFields.endTime = updateData.endTime ? new Date(updateData.endTime) : null;
    if (updateData.location !== undefined) updateFields.location = updateData.location;

    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: updateFields,
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const activityResponse: ActivityResponse = {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      startTime: activity.startTime,
      endTime: activity.endTime,
      location: activity.location,
      creator: {
        id: activity.creator.id,
        name: activity.creator.name
      }
    };

    res.json({
      message: 'Aktivität erfolgreich aktualisiert',
      activity: activityResponse
    });

  } catch (error: any) {
    console.error('Update activity error:', error);
    throw error;
  }
};

/**
 * Aktivität löschen (nur für Admins)
 */
export const deleteActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { activityId } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id: activityId }
    });

    if (!activity) {
      return res.status(404).json({
        error: 'Aktivität nicht gefunden',
        message: 'Die zu löschende Aktivität existiert nicht'
      });
    }

    await prisma.activity.delete({
      where: { id: activityId }
    });

    res.json({
      message: 'Aktivität erfolgreich gelöscht'
    });

  } catch (error: any) {
    console.error('Delete activity error:', error);
    throw error;
  }
};