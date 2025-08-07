import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { hashPassword, comparePassword, createToken } from '../utils/auth';
import { validateRequest, loginSchema, registerSchema } from '../utils/validation';
import { LoginRequest, RegisterRequest, UserResponse, AuthenticatedRequest } from '../types';

// Hilfsfunktion für Role-Type-Assertion
const assertRole = (role: string): 'ADMIN' | 'PARTICIPANT' => {
  if (role === 'ADMIN' || role === 'PARTICIPANT') {
    return role;
  }
  throw new Error(`Invalid role: ${role}`);
};

/**
 * Benutzer registrieren
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: RegisterRequest = validateRequest(registerSchema, req.body);

    // Prüfen ob E-Mail bereits existiert
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'E-Mail bereits registriert',
        message: 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits'
      });
    }

    // Passwort hashen
    const passwordHash = await hashPassword(password);

    // Benutzer erstellen
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "PARTICIPANT" // Standardrolle
      }
    });

    // Token erstellen
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: assertRole(user.role)
    });

    // Response ohne Passwort-Hash
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: assertRole(user.role),
      hasPaid: user.hasPaid,
      registeredAt: user.registeredAt
    };

    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
      user: userResponse,
      token
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    throw error; // Wird vom errorHandler behandelt
  }
};

/**
 * Benutzer anmelden
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = validateRequest(loginSchema, req.body);

    // Benutzer finden
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Anmeldung fehlgeschlagen',
        message: 'Ungültige E-Mail-Adresse oder Passwort'
      });
    }

    // Passwort überprüfen
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Anmeldung fehlgeschlagen',
        message: 'Ungültige E-Mail-Adresse oder Passwort'
      });
    }

    // Token erstellen
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: assertRole(user.role)
    });

    // Response ohne Passwort-Hash
    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: assertRole(user.role),
      hasPaid: user.hasPaid,
      registeredAt: user.registeredAt
    };

    res.json({
      message: 'Erfolgreich angemeldet',
      user: userResponse,
      token
    });

  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Aktueller Benutzer abrufen (für Token-Validierung)
 */
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Nicht authentifiziert',
        message: 'Benutzer ist nicht authentifiziert'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Benutzer nicht gefunden',
        message: 'Der Benutzer existiert nicht mehr'
      });
    }

    const userResponse: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: assertRole(user.role),
      hasPaid: user.hasPaid,
      registeredAt: user.registeredAt
    };

    res.json({ user: userResponse });

  } catch (error: any) {
    console.error('Get current user error:', error);
    throw error;
  }
};