import React, { useEffect, useState } from 'react';
import { MapPin, ExternalLink, Clock, Users, Shield, Euro, Calendar, Mountain, Car } from 'lucide-react';
import { cabinAPI, getApiErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { CabinInfo } from '../types';

const HomePage: React.FC = () => {
  const [cabinInfo, setCabinInfo] = useState<CabinInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCabinInfo = async () => {
      try {
        const info = await cabinAPI.getCabinInfo();
        setCabinInfo(info);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCabinInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Fehler beim Laden der Hütteninformationen: {error}</p>
      </div>
    );
  }

  if (!cabinInfo) {
    return (
      <div className="text-center text-gray-500">
        <p>Keine Hütteninformationen verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Willkommens-Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-800 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-2">
          Hütten 2025 - {cabinInfo.name} 🏔️
        </h1>
        <p className="text-xl font-semibold mb-2">{cabinInfo.date}</p>
        <p className="text-lg opacity-90">
          Willkommen {user?.name}! Es geht wieder auf die {cabinInfo.name} in Tirol!
        </p>
      </div>

      {/* Status-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${user?.hasPaid ? 'bg-green-100' : 'bg-red-100'}`}>
              <Shield className={`w-6 h-6 ${user?.hasPaid ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Zahlungsstatus</p>
              <p className={`text-lg font-semibold ${user?.hasPaid ? 'text-green-600' : 'text-red-600'}`}>
                {user?.hasPaid ? 'Bezahlt ✓' : 'Noch offen'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Deine Rolle</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.role === 'ADMIN' ? 'Organisator' : 'Teilnehmer'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Car className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Treffpunkt</p>
              <p className="text-lg font-semibold text-gray-900">Volksfestplatz Grafing</p>
              <p className="text-sm text-gray-500">04.06 um 13:00 Uhr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wichtigste Informationen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Hütteninfos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Mountain className="w-5 h-5 mr-2" />
              Die Hütte
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <p className="text-gray-600 leading-relaxed">{cabinInfo.description}</p>
            
            <div className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-600">{cabinInfo.address}</p>
                <a
                  href={cabinInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-800 mt-1"
                >
                  <span>In Google Maps öffnen</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Ausstattung</h4>
              <ul className="space-y-1">
                {cabinInfo.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Preise */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Euro className="w-5 h-5 mr-2" />
              Preise & Zahlungsfristen
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">bis {cabinInfo.pricing.earlyBird.deadline}</p>
                  <p className="text-sm text-green-600">Early Bird</p>
                </div>
                <p className="text-xl font-bold text-green-800">{cabinInfo.pricing.earlyBird.price}€</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800">bis {cabinInfo.pricing.regular.deadline}</p>
                  <p className="text-sm text-yellow-600">Regular</p>
                </div>
                <p className="text-xl font-bold text-yellow-800">{cabinInfo.pricing.regular.price}€</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">bis {cabinInfo.pricing.late.deadline}</p>
                  <p className="text-sm text-red-600">Late Bird</p>
                </div>
                <p className="text-xl font-bold text-red-800">{cabinInfo.pricing.late.price}€</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Einzelne Nächte:</strong> {cabinInfo.pricing.singleNight.price}€/Nacht 
                <span className="text-gray-500"> ({cabinInfo.pricing.singleNight.note})</span>
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Im Preis enthalten:</h4>
              <ul className="space-y-1">
                {cabinInfo.included.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Programm */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Programm
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cabinInfo.program.map((activity, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-500 mt-1">🎯</span>
                <span className="text-gray-700 text-sm">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aftermovie */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">🎬 Aftermovie 2024</h3>
        <p className="mb-4">Schau dir an, wie großartig es letztes Jahr war!</p>
        <a
          href={cabinInfo.aftermovie}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          <span>YouTube Video ansehen</span>
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>

      {/* Hinweis für neue Benutzer */}
      {!user?.hasPaid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 text-yellow-400">⚠️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Zahlungserinnerung
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Dein Zahlungsstatus ist noch auf "offen". Bitte überweise den fälligen Betrag zeitnah.
                  Der Organisator wird deinen Status nach Zahlungseingang aktualisieren.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/activities"
          className="bg-primary-50 border border-primary-200 rounded-lg p-4 hover:bg-primary-100 transition-colors"
        >
          <h4 className="font-medium text-primary-900">Aktivitäten ansehen</h4>
          <p className="text-sm text-primary-700 mt-1">Schau dir geplante Aktivitäten an</p>
        </a>
        
        <a
          href="/notifications"
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors"
        >
          <h4 className="font-medium text-blue-900">Benachrichtigungen</h4>
          <p className="text-sm text-blue-700 mt-1">Wichtige Updates und Nachrichten</p>
        </a>
        
        <a
          href="/payments"
          className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors"
        >
          <h4 className="font-medium text-green-900">Zahlungsstatus</h4>
          <p className="text-sm text-green-700 mt-1">Deinen Zahlungsstatus einsehen</p>
        </a>
      </div>
    </div>
  );
};

export default HomePage;