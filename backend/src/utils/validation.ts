import { z } from 'zod';

// Validierungs-Schemas mit Zod
export const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(100, 'Name darf maximal 100 Zeichen lang sein'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein')
});

export const createActivitySchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich').max(100, 'Titel darf maximal 100 Zeichen lang sein'),
  description: z.string().optional(),
  startTime: z.string().datetime('Ungültiges Startdatum'),
  endTime: z.string().datetime('Ungültiges Enddatum').optional(),
  location: z.string().max(255, 'Ort darf maximal 255 Zeichen lang sein').optional()
});

export const updateActivitySchema = createActivitySchema.partial();

export const createNotificationSchema = z.object({
  userId: z.string().uuid('Ungültige Benutzer-ID').optional(),
  title: z.string().min(1, 'Titel ist erforderlich').max(100, 'Titel darf maximal 100 Zeichen lang sein'),
  body: z.string().min(1, 'Nachricht ist erforderlich')
});

export const updatePaymentStatusSchema = z.object({
  userId: z.string().uuid('Ungültige Benutzer-ID'),
  hasPaid: z.boolean()
});

// Helper Funktion für Validierung
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(firstError.message);
    }
    throw new Error('Validierungsfehler');
  }
};