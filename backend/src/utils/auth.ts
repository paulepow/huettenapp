import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

/**
 * Hash ein Passwort mit bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Vergleicht ein Klartext-Passwort mit einem Hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Erstellt ein JWT Token
 */
export const createToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET ist nicht definiert');
  }
  
  return jwt.sign(payload, secret, { 
    expiresIn: '7d' // Token läuft nach 7 Tagen ab
  });
};

/**
 * Verifiziert und dekodiert ein JWT Token
 */
export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET ist nicht definiert');
  }
  
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Ungültiges Token');
  }
};