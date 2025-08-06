# Frontend - Hüttenapp

React Frontend für die Hüttenapp, gebaut mit TypeScript, Vite und Tailwind CSS.

## 🏗️ Technologie-Stack

- **React 18** mit **TypeScript**
- **Vite** als Build-Tool und Dev-Server
- **Tailwind CSS** für Styling
- **React Router DOM** für Navigation
- **Axios** für API-Kommunikation
- **React Hook Form** für Formulare
- **Zod** für Validierung
- **Lucide React** für Icons
- **date-fns** für Datum-Formatierung

## 📦 Installation

1. **Dependencies installieren:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Development Server starten:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Produktions-Build erstellen:**
   \`\`\`bash
   npm run build
   \`\`\`

4. **Build-Preview:**
   \`\`\`bash
   npm run preview
   \`\`\`

## 📁 Projektstruktur

\`\`\`
src/
├── components/           # React Komponenten
│   ├── Layout/
│   │   ├── Navbar.tsx
│   │   └── Layout.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # React Contexts
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── pages/               # Seiten-Komponenten
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── HomePage.tsx
│   ├── ActivitiesPage.tsx
│   ├── PaymentsPage.tsx
│   └── NotificationsPage.tsx
├── services/            # API Services
│   └── api.ts
├── types/               # TypeScript Types
│   └── index.ts
├── App.tsx              # Haupt-App Komponente
├── main.tsx             # Entry Point
└── index.css            # Globale Styles
\`\`\`

## 🎨 Design System

### Farben

Das Design verwendet ein blaues Farbschema:

\`\`\`css
primary-50:  #f0f9ff
primary-100: #e0f2fe
primary-200: #bae6fd
primary-300: #7dd3fc
primary-400: #38bdf8
primary-500: #0ea5e9
primary-600: #0284c7
primary-700: #0369a1
primary-800: #075985
primary-900: #0c4a6e
\`\`\`

### Icons

Verwendet **Lucide React** für konsistente SVG Icons:

\`\`\`tsx
import { Home, User, Bell } from 'lucide-react';

<Home className="w-5 h-5" />
\`\`\`

### Spacing & Layout

Folgt Tailwind's Spacing-System:
- Container: `max-w-7xl mx-auto`
- Padding: `px-4 sm:px-6 lg:px-8`
- Gaps: `space-y-6`, `gap-4`

## 🔗 API Integration

### API Service

Zentrale API-Kommunikation über `src/services/api.ts`:

\`\`\`tsx
import { authAPI, userAPI, activityAPI } from '../services/api';

// Beispiel: Login
const response = await authAPI.login({ email, password });
\`\`\`

### Error Handling

Einheitliche Fehlerbehandlung:

\`\`\`tsx
import { getApiErrorMessage } from '../services/api';

try {
  await apiCall();
} catch (error) {
  const message = getApiErrorMessage(error);
  setError(message);
}
\`\`\`

### Authentication

JWT Token wird automatisch zu API-Requests hinzugefügt:

\`\`\`tsx
// Token wird automatisch aus localStorage gelesen
// und als Authorization Header gesendet
\`\`\`

## 🧭 Navigation & Routing

### Geschützte Routen

\`\`\`tsx
<Route path="/admin" element={
  <ProtectedRoute requireAdmin>
    <AdminPage />
  </ProtectedRoute>
} />
\`\`\`

### Navigation

Responsive Navbar mit:
- Logo und Hauptnavigation
- Mobile Menu (Hamburger)
- Benutzer-Info und Logout
- Badge für ungelesene Benachrichtigungen

## 📱 Responsive Design

### Breakpoints

Folgt Tailwind's Standard-Breakpoints:
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

### Mobile-First

Alle Komponenten sind mobile-first designed:

\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
\`\`\`

## 🎛️ State Management

### Context Pattern

Verwendet React Context für globalen State:

#### AuthContext
- Benutzer-Authentication
- Login/Logout Funktionen
- Loading States

#### NotificationContext
- Benachrichtigungen verwalten
- Unread Count
- Mark as read Funktionen

### Local State

Komponenten verwenden `useState` für lokalen State:

\`\`\`tsx
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string>('');
\`\`\`

## 📝 Formulare

### React Hook Form + Zod

Alle Formulare verwenden React Hook Form mit Zod-Validierung:

\`\`\`tsx
const schema = z.object({
  email: z.string().email('Ungültige E-Mail'),
  password: z.string().min(6, 'Mindestens 6 Zeichen')
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
\`\`\`

### Error Display

Einheitliche Fehler-Anzeige:

\`\`\`tsx
{errors.email && (
  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
)}
\`\`\`

## 🔔 Benachrichtigungen

### Real-time Updates

Benachrichtigungen werden beim Login geladen und bei Änderungen aktualisiert:

\`\`\`tsx
const { notifications, unreadCount, markAsRead } = useNotifications();
\`\`\`

### Badge System

Ungelesene Benachrichtigungen werden mit Badges angezeigt:

\`\`\`tsx
{unreadCount > 0 && (
  <span className="bg-red-500 text-white rounded-full px-2 py-1">
    {unreadCount}
  </span>
)}
\`\`\`

## 📅 Datum & Zeit

### date-fns Integration

Verwendung von date-fns für Datum-Formatierung:

\`\`\`tsx
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const formattedDate = format(parseISO(dateString), 'dd.MM.yyyy', { locale: de });
\`\`\`

### Relative Zeitangaben

\`\`\`tsx
if (isToday(date)) return 'Heute';
if (isTomorrow(date)) return 'Morgen';
\`\`\`

## 🎯 Performance

### Code Splitting

Automatisches Code Splitting durch Vite:

\`\`\`tsx
const LazyComponent = lazy(() => import('./Component'));
\`\`\`

### Optimierungen

- Lazy Loading für Routen
- Memoization für teure Berechnungen
- Optimierte Bundle-Größe durch Tree Shaking
- Image Optimization (falls verwendet)

## 🛠 Entwicklung

### Neue Seite hinzufügen

1. **Komponente erstellen** in `src/pages/`
2. **Route hinzufügen** in `src/App.tsx`
3. **Navigation aktualisieren** in `src/components/Layout/Navbar.tsx`

### Neue API Integration

1. **Service hinzufügen** in `src/services/api.ts`
2. **Types definieren** in `src/types/`
3. **Error Handling** implementieren

### Styling Guidelines

- Verwende Tailwind Utility Classes
- Konsistente Spacing mit Tailwind's System
- Responsive Design mit Mobile-First Approach
- Accessibility mit Focus States

## 🎨 Komponenten-Bibliothek

### Button Varianten

\`\`\`tsx
// Primary Button
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">

// Secondary Button  
<button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md">

// Danger Button
<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
\`\`\`

### Card Layout

\`\`\`tsx
<div className="bg-white rounded-lg shadow p-6">
  {/* Card Content */}
</div>
\`\`\`

### Status Badges

\`\`\`tsx
<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
  Bezahlt
</span>
\`\`\`

## 🔍 Debugging

### React DevTools

Nutze React DevTools für:
- Komponenten-Tree inspizieren
- Props und State debugging
- Performance Profiling

### Console Logs

Development-spezifische Logs:

\`\`\`tsx
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
\`\`\`

## 🚀 Deployment

### Build Optimierung

\`\`\`bash
npm run build
\`\`\`

Erstellt optimierten Build in `dist/`:
- Minified JavaScript/CSS
- Asset Optimization
- Gzip-ready Files

### Vercel Deployment

\`\`\`json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-api.com/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
\`\`\`

### Environment Variables

\`\`\`env
VITE_API_URL=https://your-api.com
\`\`\`

Zugriff via `import.meta.env.VITE_API_URL`

## 🧪 Testing

### Component Testing

\`\`\`tsx
import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument();
});
\`\`\`

### E2E Testing

Cypress oder Playwright für End-to-End Tests:

\`\`\`typescript
cy.visit('/login');
cy.get('[data-testid="email"]').type('user@example.com');
cy.get('[data-testid="password"]').type('password');
cy.get('[data-testid="login-button"]').click();
\`\`\`