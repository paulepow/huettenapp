import { Response } from 'express';
import { prisma } from '../utils/database';
import { validateRequest, updatePaymentStatusSchema } from '../utils/validation';
import { AuthenticatedRequest, UserResponse, UpdatePaymentStatusRequest } from '../types';

/**
 * Alle Benutzer abrufen (nur für Admins)
 */
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { registeredAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hasPaid: true,
        registeredAt: true
      }
    });

    const userResponses: UserResponse[] = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPaid: user.hasPaid,
      registeredAt: user.registeredAt
    }));

    res.json({ users: userResponses });

  } catch (error: any) {
    console.error('Get all users error:', error);
    throw error;
  }
};

/**
 * Einzelnen Benutzer abrufen
 */
export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hasPaid: true,
        registeredAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Benutzer nicht gefunden',
        message: 'Der angeforderte Benutzer existiert nicht'
      });
    }

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPaid: user.hasPaid,
      registeredAt: user.registeredAt
    };

    res.json({ user: userResponse });

  } catch (error: any) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

/**
 * Zahlungsstatus eines Benutzers aktualisieren (nur für Admins)
 */
export const updatePaymentStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, hasPaid }: UpdatePaymentStatusRequest = validateRequest(
      updatePaymentStatusSchema, 
      { ...req.body, userId: req.params.userId }
    );

    // Benutzer aktualisieren
    const user = await prisma.user.update({
      where: { id: userId },
      data: { hasPaid },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        hasPaid: true,
        registeredAt: true
      }
    });

    // Benachrichtigung erstellen
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Zahlungsstatus aktualisiert',
        body: hasPaid 
          ? 'Ihre Zahlung wurde als eingegangen markiert. Vielen Dank!'
          : 'Ihr Zahlungsstatus wurde auf "offen" gesetzt.'
      }
    });

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasPaid: user.hasPaid,
      registeredAt: user.registeredAt
    };

    res.json({
      message: 'Zahlungsstatus erfolgreich aktualisiert',
      user: userResponse
    });

  } catch (error: any) {
    console.error('Update payment status error:', error);
    throw error;
  }
};

/**
 * Eigenen Zahlungsstatus abrufen
 */
export const getMyPaymentStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Nicht authentifiziert',
        message: 'Benutzer ist nicht authentifiziert'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        hasPaid: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Benutzer nicht gefunden',
        message: 'Der Benutzer existiert nicht'
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      hasPaid: user.hasPaid
    });

  } catch (error: any) {
    console.error('Get my payment status error:', error);
    throw error;
  }
};