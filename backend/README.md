# Backend - Hüttenapp API

RESTful API Backend für die Hüttenapp, gebaut mit Node.js, Express, TypeScript und Prisma.

## 🏗️ Technologie-Stack

- **Node.js** mit **Express.js**
- **TypeScript** für Type Safety
- **Prisma** als ORM für PostgreSQL
- **JWT** für Authentifizierung
- **bcrypt** für Passwort-Hashing
- **Zod** für Schema-Validierung
- **CORS** für Cross-Origin Requests

## 📦 Installation

1. **Dependencies installieren:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Umgebungsvariablen konfigurieren:**
   \`\`\`bash
   cp env.example .env
   \`\`\`
   
   Bearbeite die `.env` Datei mit deinen Datenbankdaten.

3. **Datenbank einrichten:**
   \`\`\`bash
   npm run db:generate  # Prisma Client generieren
   npm run db:push      # Schema in DB übertragen
   npm run db:seed      # Testdaten laden
   \`\`\`

4. **Server starten:**
   \`\`\`bash
   npm run dev          # Entwicklungsmodus
   npm run build        # Build für Produktion
   npm run start        # Produktionsmodus
   \`\`\`

## 📁 Projektstruktur

\`\`\`
src/
├── controllers/          # API Controller
│   ├── authController.ts
│   ├── userController.ts
│   ├── activityController.ts
│   └── notificationController.ts
├── middleware/           # Express Middleware
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/              # API Routen
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   ├── activityRoutes.ts
│   └── notificationRoutes.ts
├── utils/               # Hilfsfunktionen
│   ├── auth.ts
│   ├── database.ts
│   └── validation.ts
├── types/               # TypeScript Types
│   └── index.ts
├── index.ts             # Server Entry Point
└── seed.ts              # Seed-Skript für Testdaten
\`\`\`

## 🔗 API Endpunkte

### Authentifizierung
- `POST /api/auth/register` - Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/me` - Aktueller Benutzer

### Benutzer
- `GET /api/users` - Alle Benutzer (Admin only)
- `GET /api/users/payment-status` - Eigener Zahlungsstatus
- `GET /api/users/:userId` - Einzelner Benutzer
- `PUT /api/users/:userId/payment-status` - Zahlungsstatus aktualisieren (Admin only)

### Aktivitäten
- `GET /api/activities` - Alle Aktivitäten
- `GET /api/activities/:activityId` - Einzelne Aktivität
- `POST /api/activities` - Aktivität erstellen (Admin only)
- `PUT /api/activities/:activityId` - Aktivität bearbeiten (Admin only)
- `DELETE /api/activities/:activityId` - Aktivität löschen (Admin only)

### Benachrichtigungen
- `GET /api/notifications` - Eigene Benachrichtigungen
- `GET /api/notifications/unread-count` - Ungelesene Anzahl
- `GET /api/notifications/all` - Alle Benachrichtigungen (Admin only)
- `POST /api/notifications` - Benachrichtigung erstellen (Admin only)
- `PUT /api/notifications/:notificationId/read` - Als gelesen markieren
- `PUT /api/notifications/read-all` - Alle als gelesen markieren

### Hütteninformationen
- `GET /api/cabin-info` - Hütteninformationen

### Health Check
- `GET /health` - Server Status

## 🔒 Authentifizierung

Das API verwendet JWT (JSON Web Tokens) für die Authentifizierung:

1. **Registration/Login** gibt ein JWT Token zurück
2. **Token** muss in Authorization Header mitgesendet werden: `Bearer <token>`
3. **Token** ist 7 Tage gültig
4. **Middleware** überprüft Token-Gültigkeit automatisch

### Rollen-basierte Autorisierung

- **PARTICIPANT**: Standard-Rolle für neue Benutzer
- **ADMIN**: Erweiterte Rechte für Organisatoren

Admin-only Endpunkte sind mit `requireAdmin` Middleware geschützt.

## 🗃️ Datenbank Schema

### User
\`\`\`sql
- id (UUID, Primary Key)
- name (VARCHAR 100)
- email (VARCHAR 255, Unique)
- password_hash (VARCHAR 255)
- role (ENUM: ADMIN, PARTICIPANT)
- has_paid (BOOLEAN, Default: false)
- registered_at (TIMESTAMP)
\`\`\`

### Activity
\`\`\`sql
- id (UUID, Primary Key)
- title (VARCHAR 100)
- description (TEXT, Optional)
- start_time (TIMESTAMP)
- end_time (TIMESTAMP, Optional)
- location (VARCHAR 255, Optional)
- created_by (UUID, Foreign Key)
\`\`\`

### Notification
\`\`\`sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- title (VARCHAR 100, Optional)
- body (TEXT, Optional)
- created_at (TIMESTAMP)
- is_read (BOOLEAN, Default: false)
\`\`\`

### Payment
\`\`\`sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- amount (DECIMAL 10,2)
- paid_at (TIMESTAMP, Optional)
- marked_by (UUID, Foreign Key, Optional)
\`\`\`

## 🛠 Entwicklung

### Neue API Endpunkte hinzufügen

1. **Controller erstellen** in `src/controllers/`
2. **Route definieren** in `src/routes/`
3. **Route registrieren** in `src/index.ts`
4. **Types hinzufügen** in `src/types/`
5. **Validierung** mit Zod Schema

### Beispiel: Neuer Controller

\`\`\`typescript
import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { prisma } from '../utils/database';

export const getExample = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Logik hier
    res.json({ message: 'Success' });
  } catch (error) {
    throw error; // Error Handler fängt das ab
  }
};
\`\`\`

### Neue Middleware

\`\`\`typescript
import { Request, Response, NextFunction } from 'express';

export const exampleMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Middleware Logik
  next();
};
\`\`\`

## 🔧 Konfiguration

### Umgebungsvariablen

\`\`\`env
# Datenbank
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# JWT
JWT_SECRET="your-secret-key"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGINS="http://localhost:3000,https://your-frontend.com"
\`\`\`

### Prisma Commands

\`\`\`bash
npx prisma generate      # Client generieren
npx prisma db push       # Schema zu DB
npx prisma db pull       # Schema von DB
npx prisma studio        # DB Browser
npx prisma migrate dev   # Migration erstellen
\`\`\`

## 🚀 Deployment

### Produktions-Build

\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Setup

1. PostgreSQL Datenbank bereitstellen
2. Umgebungsvariablen setzen
3. `npm run db:push` für Schema
4. Optional: `npm run db:seed` für Testdaten

### Health Check

Das API bietet einen Health Check unter `/health`:

\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production"
}
\`\`\`

## 🐛 Debugging

### Logging

- Development: SQL Queries werden geloggt
- Production: Nur Errors werden geloggt
- Alle API Requests werden in Development geloggt

### Error Handling

Alle Errors werden vom globalen Error Handler abgefangen:

- **Prisma Errors**: Automatische Behandlung von DB-Fehlern
- **Validation Errors**: Zod Validation Fehler
- **Auth Errors**: JWT/Authentication Fehler
- **Unknown Errors**: Generische Fehlerbehandlung

## 📊 Performance

### Optimierungen

- **Prisma Relations**: Effiziente DB Queries
- **JWT Caching**: Benutzer-Info im Token
- **Zod Validation**: Schnelle Schema-Validierung
- **Express Middleware**: Optimierte Request Pipeline

### Monitoring

- Health Check Endpoint
- Error Logging
- Request Logging in Development