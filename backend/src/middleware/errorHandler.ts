import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Globaler Error Handler für Express
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Prisma Fehler behandeln
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint fehler
        return res.status(409).json({
          error: 'Konflikt',
          message: 'Ein Eintrag mit diesen Daten existiert bereits'
        });
      case 'P2025':
        // Record nicht gefunden
        return res.status(404).json({
          error: 'Nicht gefunden',
          message: 'Der angeforderte Eintrag wurde nicht gefunden'
        });
      default:
        return res.status(500).json({
          error: 'Datenbankfehler',
          message: 'Ein Fehler bei der Datenbankabfrage ist aufgetreten'
        });
    }
  }

  // Validation Fehler (von Zod oder manuell)
  if (error.message.includes('Validierung') || error.message.includes('erforderlich')) {
    return res.status(400).json({
      error: 'Validierungsfehler',
      message: error.message
    });
  }

  // JWT/Auth Fehler
  if (error.message.includes('Token') || error.message.includes('JWT')) {
    return res.status(401).json({
      error: 'Authentifizierungsfehler',
      message: error.message
    });
  }

  // Standard Serverfehler
  return res.status(500).json({
    error: 'Interner Serverfehler',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Etwas ist schiefgelaufen'
  });
};

/**
 * 404 Handler für nicht existierende Routen
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route nicht gefunden',
    message: `Die Route ${req.method} ${req.path} existiert nicht`
  });
};