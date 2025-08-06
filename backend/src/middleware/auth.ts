import { Request, Response, NextFunction } from 'express';
// Role ist jetzt ein String - kein Import nötig
import { verifyToken } from '../utils/auth';
import { AuthenticatedRequest } from '../types';

/**
 * Middleware zur Authentifizierung
 * Überprüft ob ein gültiges JWT Token vorhanden ist
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Zugriff verweigert', 
      message: 'Kein Token bereitgestellt' 
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Ungültiges Token', 
      message: 'Das bereitgestellte Token ist ungültig oder abgelaufen' 
    });
  }
};

/**
 * Middleware zur Autorisierung für Admin-Zugriff
 * Muss nach authenticateToken verwendet werden
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Nicht authentifiziert', 
      message: 'Benutzer ist nicht authentifiziert' 
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Zugriff verweigert', 
      message: 'Admin-Berechtigung erforderlich' 
    });
  }

  next();
};

/**
 * Middleware zur Überprüfung ob der Benutzer auf seine eigenen Daten zugreift
 * oder Admin-Berechtigung hat
 */
export const requireOwnershipOrAdmin = (userIdParam: string = 'userId') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Nicht authentifiziert', 
        message: 'Benutzer ist nicht authentifiziert' 
      });
    }

    const targetUserId = req.params[userIdParam];
    
    // Admin hat immer Zugriff
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Benutzer hat nur Zugriff auf seine eigenen Daten
    if (req.user.userId !== targetUserId) {
      return res.status(403).json({ 
        error: 'Zugriff verweigert', 
        message: 'Sie können nur auf Ihre eigenen Daten zugreifen' 
      });
    }

    next();
  };
};