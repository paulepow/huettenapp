# 🏔️ Hüttenapp - Hüttenurlaub Organisationsapp

Eine moderne, skalierbare Webanwendung zur Organisation von jährlichen Hüttenurlauben. Die App ermöglicht es einem Organisator (Admin) und mehreren Teilnehmern, gemeinsam einen Hüttenurlaub zu planen und zu verwalten.

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Technologie-Stack](#-technologie-stack)
- [Schnellstart](#-schnellstart)
- [Installation](#-installation)
- [Konfiguration](#-konfiguration)
- [API Dokumentation](#-api-dokumentation)
- [Projektstruktur](#-projektstruktur)
- [Sicherheit](#-sicherheit)
- [Deployment](#-deployment)
- [Mitwirken](#-mitwirken)

## 🚀 Features

### Für alle Benutzer
- **Authentifizierung**: Sichere Registrierung und Anmeldung mit E-Mail und Passwort
- **Dashboard**: Übersichtliche Startseite mit Hütteninformationen und Zahlungsstatus
- **Aktivitäten**: Anzeige aller geplanten Aktivitäten in Listen- oder Kalenderansicht
- **Zahlungsstatus**: Einsicht in den eigenen Zahlungsstatus
- **Benachrichtigungen**: Empfang wichtiger Updates und Nachrichten

### Für Administratoren
- **Benutzerverwaltung**: Übersicht aller Teilnehmer mit Zahlungsstatus
- **Aktivitätsverwaltung**: Erstellen, Bearbeiten und Löschen von Aktivitäten
- **Zahlungsmanagement**: Markieren von Zahlungen als eingegangen/offen
- **Benachrichtigungen**: Senden von Nachrichten an einzelne oder alle Teilnehmer

## 🛠 Technologie-Stack

### Backend
- **Node.js** mit **Express.js** (TypeScript)
- **PostgreSQL** mit **Prisma ORM**
- **JWT** für Authentifizierung
- **bcrypt** für sichere Passwort-Hashes
- **Zod** für Validierung

### Frontend
- **React 18** mit **TypeScript**
- **Vite** als Build-Tool
- **Tailwind CSS** für Styling
- **React Router** für Navigation
- **Axios** für API-Kommunikation
- **React Hook Form** mit **Zod** für Formular-Handling

## ⚡ Schnellstart

### Voraussetzungen
- Node.js 18+ 
- PostgreSQL 14+
- npm oder yarn

### 1. Repository klonen
\`\`\`bash
git clone <repository-url>
cd huettenapp
\`\`\`

### 2. Backend starten
\`\`\`bash
cd backend
npm install
cp env.example .env
# Datenbankverbindung in .env konfigurieren
npm run db:push
npm run db:seed
npm run dev
\`\`\`

### 3. Frontend starten
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Die App ist jetzt unter http://localhost:3000 erreichbar!

## 📦 Installation

### Backend Installation

\`\`\`bash
cd backend
npm install
\`\`\`

**Umgebungsvariablen konfigurieren:**
\`\`\`bash
cp env.example .env
\`\`\`

Bearbeite die `.env` Datei:
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/huettenapp"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000"
\`\`\`

**Datenbank einrichten:**
\`\`\`bash
npm run db:push        # Schema in die Datenbank übertragen
npm run db:seed         # Testdaten laden
\`\`\`

**Backend starten:**
\`\`\`bash
npm run dev             # Entwicklungsmodus
npm run build           # Produktions-Build
npm run start           # Produktionsmodus
\`\`\`

### Frontend Installation

\`\`\`bash
cd frontend
npm install
npm run dev             # Entwicklungsserver starten
\`\`\`

## ⚙️ Konfiguration

### Backend Konfiguration

Die Backend-Konfiguration erfolgt über Umgebungsvariablen in der `.env` Datei:

| Variable | Beschreibung | Standard |
|----------|--------------|----------|
| `DATABASE_URL` | PostgreSQL Verbindungs-URL | - |
| `JWT_SECRET` | Secret für JWT Token | - |
| `PORT` | Server Port | 3001 |
| `NODE_ENV` | Umgebung (development/production) | development |
| `CORS_ORIGINS` | Erlaubte Frontend URLs | http://localhost:3000 |

### Frontend Konfiguration

Das Frontend verwendet Vite's Proxy-Konfiguration für API-Aufrufe. Siehe `vite.config.ts`.

## 📚 API Dokumentation

### Authentifizierung

**POST** `/api/auth/register`
- Benutzer registrieren
- Body: `{ name, email, password }`

**POST** `/api/auth/login`
- Benutzer anmelden
- Body: `{ email, password }`

**GET** `/api/auth/me`
- Aktuellen Benutzer abrufen
- Authentifizierung erforderlich

### Benutzer

**GET** `/api/users`
- Alle Benutzer abrufen (Admin only)

**GET** `/api/users/payment-status`
- Eigenen Zahlungsstatus abrufen

**PUT** `/api/users/:userId/payment-status`
- Zahlungsstatus aktualisieren (Admin only)

### Aktivitäten

**GET** `/api/activities`
- Alle Aktivitäten abrufen

**POST** `/api/activities`
- Neue Aktivität erstellen (Admin only)

**PUT** `/api/activities/:id`
- Aktivität bearbeiten (Admin only)

**DELETE** `/api/activities/:id`
- Aktivität löschen (Admin only)

### Benachrichtigungen

**GET** `/api/notifications`
- Eigene Benachrichtigungen abrufen

**GET** `/api/notifications/unread-count`
- Anzahl ungelesener Benachrichtigungen

**POST** `/api/notifications`
- Benachrichtigung erstellen (Admin only)

**PUT** `/api/notifications/:id/read`
- Benachrichtigung als gelesen markieren

### Hütteninformationen

**GET** `/api/cabin-info`
- Hütteninformationen abrufen

## 📁 Projektstruktur

\`\`\`
huettenapp/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API Controller
│   │   ├── middleware/      # Express Middleware
│   │   ├── routes/          # API Routen
│   │   ├── utils/           # Hilfsfunktionen
│   │   ├── types/           # TypeScript Types
│   │   └── index.ts         # Server Entry Point
│   ├── prisma/
│   │   └── schema.prisma    # Datenbankschema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React Komponenten
│   │   ├── contexts/        # React Contexts
│   │   ├── pages/           # Seiten-Komponenten
│   │   ├── services/        # API Services
│   │   ├── types/           # TypeScript Types
│   │   └── App.tsx          # Haupt-App Komponente
│   └── package.json
└── README.md
\`\`\`

## 🔒 Sicherheit

### Authentifizierung & Autorisierung
- **JWT Tokens** für Benutzer-Sessions
- **bcrypt** mit 12 Salt Rounds für Passwort-Hashing
- **Role-based Access Control** (Admin/Participant)
- Serverseitige Autorisierung auf allen geschützten Routen

### Datenschutz
- Keine Klartext-Passwörter in der Datenbank
- Keine sensiblen Daten im Frontend-State
- CORS-Konfiguration für erlaubte Origins

### Validierung
- **Zod** Schema-Validierung auf Backend und Frontend
- Input-Sanitization und Error-Handling
- SQL-Injection-Schutz durch Prisma ORM

## 🌐 Deployment

### Produktionsbuilds erstellen

**Backend:**
\`\`\`bash
cd backend
npm run build
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm run build
\`\`\`

### Deployment-Optionen

#### Render / Heroku
1. Separate Services für Backend und Frontend
2. PostgreSQL Addon konfigurieren
3. Umgebungsvariablen setzen
4. Build-Commands anpassen

#### Vercel
- Frontend: Automatic deployment via Git
- Backend: Als separate API-Service deployen

### Umgebungsvariablen für Produktion

\`\`\`env
DATABASE_URL="postgresql://prod-connection-string"
JWT_SECRET="strong-random-secret-key"
NODE_ENV="production"
CORS_ORIGINS="https://your-frontend-domain.com"
\`\`\`

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm test
\`\`\`

## 🤝 Mitwirken

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push den Branch (`git push origin feature/amazing-feature`)
5. Öffne eine Pull Request

## 📞 Support

Bei Fragen oder Problemen:
1. Überprüfe die [Dokumentation](#-api-dokumentation)
2. Schaue in die [Issues](../../issues)
3. Erstelle ein neues Issue mit detaillierter Beschreibung

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe `LICENSE` für Details.

---

## 🔑 Demo-Accounts

Für Tests stehen folgende Accounts zur Verfügung:

**Admin:**
- E-Mail: admin@huettenapp.de
- Passwort: admin123

**Teilnehmer:**
- E-Mail: max@example.com
- Passwort: test123

**Weitere Teilnehmer:**
- anna@example.com / test123 (nicht bezahlt)
- tom@example.com / test123 (bezahlt)

---

*Entwickelt mit ❤️ für unvergessliche Hüttenurlaube*