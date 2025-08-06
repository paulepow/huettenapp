import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ActivitiesPage from './pages/ActivitiesPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Öffentliche Routen */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Geschützte Routen */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/activities" element={
              <ProtectedRoute>
                <Layout>
                  <ActivitiesPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/payments" element={
              <ProtectedRoute>
                <Layout>
                  <PaymentsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Layout>
                  <NotificationsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin-Bereich</h2>
                    <p className="text-gray-600">Hier können Admin-spezifische Funktionen hinzugefügt werden.</p>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <a
                        href="/payments"
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Zahlungen verwalten</h3>
                        <p className="text-gray-600">Zahlungsstatus aller Teilnehmer einsehen und bearbeiten</p>
                      </a>
                      <a
                        href="/activities"
                        className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                      >
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aktivitäten verwalten</h3>
                        <p className="text-gray-600">Neue Aktivitäten erstellen und bestehende bearbeiten</p>
                      </a>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Benachrichtigungen senden</h3>
                        <p className="text-gray-600">Nachrichten an alle oder einzelne Teilnehmer senden</p>
                      </div>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Fallback für unbekannte Routen */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;