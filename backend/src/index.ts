import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routen
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import activityRoutes from './routes/activityRoutes';
import notificationRoutes from './routes/notificationRoutes';

// Umgebungsvariablen laden
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS-Konfiguration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging Middleware für Entwicklung
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routen
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);

// Hütteninformationen (hardcoded wie gewünscht)
app.get('/api/cabin-info', (req, res) => {
  res.json({
    name: 'Gabnalm',
    address: 'Nähe Kufstein, Tirol, Österreich',
    date: '04.06-08.06.2025',
    description: 'Es geht wie die letzten zwei Jahre wieder auf die Gabnalm in Tirol! Die Hütte liegt in der Nähe von Kufstein, knapp 1,5h Fahrzeit von Grafing oder Innsbruck entfernt in kompletter Alleinlage.',
    images: [
      '/images/gabnalm-aussen.jpg',
      '/images/gabnalm-innen.jpg',
      '/images/gabnalm-aussicht.jpg'
    ],
    googleMapsUrl: 'https://maps.google.com/?q=Gabnalm+Kufstein+Tirol',
    features: [
      '27 Schlafplätze total',
      '15 Schlafplätze in Zimmern im 1. Stock',
      '12 Plätze im Bettenlager im 2. Stock',
      'Bettbezüge und Laken vorhanden',
      'Gemeinschaftsküche mit vollständiger Ausstattung',
      'Komplette Alleinlage',
      'Nähe zu Walchensee und Wanderwegen',
      'Parkmöglichkeiten (Tankgeld für große Autos)',
      'Vollpension inkl. Alkohol'
    ],
    pricing: {
      earlyBird: { deadline: '01.05.2025', price: 285 },
      regular: { deadline: '18.05.2025', price: 310 },
      late: { deadline: '01.06.2025', price: 325 },
      singleNight: { price: 75, note: 'nur in Ausnahmefällen' }
    },
    included: [
      'Alle 4 Übernachtungen',
      'Sämtliche Verpflegung inkl. Alkohol',
      'Eintritte am See',
      'Sonstige Kosten während der Hütte',
      'Tankgeld für Fahrer mit großen Autos'
    ],
    program: [
      'Beerpong-Turnier am Freitag und Samstag',
      'Ausflüge zum Walchensee',
      'Wanderungen/Spaziergänge auf nahe gelegene Gipfel',
      'Anspruchsvollere Wanderung übern Zahmen Kaiser',
      'MTB Touren (für Fully-Besitzer)',
      'Mountain Kart in Sankt Johann (optional)'
    ],
    meetingPoint: 'Volksfestplatz Grafing am 04.06 um 13:00 Uhr',
    rules: [
      'Handtücher bitte selbst mitbringen',
      'Kassenzettel für Gemeinschaftskosten sammeln',
      'Kein Rauchen in der Hütte',
      'Alle Teilnehmer müssen bis 3 Tage vor Abfahrt ihre Daten eintragen'
    ],
    aftermovie: 'https://www.youtube.com/watch?v=sQE0VKUn7to'
  });
});

// 404 Handler für nicht existierende Routen
app.use(notFoundHandler);

// Globaler Error Handler
app.use(errorHandler);

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  console.log(`📝 Umgebung: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  }
});

export default app;