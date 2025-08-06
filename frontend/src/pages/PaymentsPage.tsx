import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, XCircle, Users, DollarSign } from 'lucide-react';
import { userAPI, getApiErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

const PaymentsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [myPaymentStatus, setMyPaymentStatus] = useState<{ id: string; name: string; hasPaid: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      fetchAllUsers();
    } else {
      fetchMyPaymentStatus();
    }
  }, [currentUser]);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const { users } = await userAPI.getAllUsers();
      setUsers(users);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyPaymentStatus = async () => {
    setIsLoading(true);
    try {
      const status = await userAPI.getMyPaymentStatus();
      setMyPaymentStatus(status);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaymentStatus = async (userId: string, hasPaid: boolean) => {
    setUpdatingUser(userId);
    try {
      await userAPI.updatePaymentStatus(userId, hasPaid);
      // Lokalen State aktualisieren
      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, hasPaid } : user
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setUpdatingUser(null);
    }
  };

  const getPaymentStats = () => {
    const total = users.length;
    const paid = users.filter(user => user.hasPaid).length;
    const pending = total - paid;
    const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;
    
    return { total, paid, pending, percentage };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Admin-Ansicht
  if (currentUser?.role === 'ADMIN') {
    const stats = getPaymentStats();
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zahlungsübersicht</h1>
          <p className="mt-1 text-gray-600">
            Verwalte die Zahlungsstatus aller Teilnehmer
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gesamt Teilnehmer</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bezahlt</p>
                <p className="text-2xl font-semibold text-green-600">{stats.paid}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ausstehend</p>
                <p className="text-2xl font-semibold text-red-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Zahlungsquote</p>
                <p className="text-2xl font-semibold text-purple-600">{stats.percentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fortschrittsbalken */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Zahlungsfortschritt</h3>
            <span className="text-sm text-gray-500">{stats.paid} von {stats.total} bezahlt</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Teilnehmerliste */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">Alle Teilnehmer</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teilnehmer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-Mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zahlungsstatus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'ADMIN' ? 'Admin' : 'Teilnehmer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.hasPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.hasPaid ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Bezahlt
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Offen
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updatePaymentStatus(user.id, true)}
                          disabled={user.hasPaid || updatingUser === user.id}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Als bezahlt markieren
                        </button>
                        {user.hasPaid && (
                          <button
                            onClick={() => updatePaymentStatus(user.id, false)}
                            disabled={updatingUser === user.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Als offen markieren
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Teilnehmer-Ansicht
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mein Zahlungsstatus</h1>
        <p className="mt-1 text-gray-600">
          Hier siehst du deinen aktuellen Zahlungsstatus für den Hüttenurlaub
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {myPaymentStatus && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-4 rounded-full ${
                myPaymentStatus.hasPaid ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <CreditCard className={`w-8 h-8 ${
                  myPaymentStatus.hasPaid ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Hallo {myPaymentStatus.name}!
                </h3>
                <p className={`text-sm mt-1 ${
                  myPaymentStatus.hasPaid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {myPaymentStatus.hasPaid 
                    ? 'Deine Zahlung ist eingegangen. Vielen Dank!' 
                    : 'Deine Zahlung steht noch aus.'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                myPaymentStatus.hasPaid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {myPaymentStatus.hasPaid ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Bezahlt
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Offen
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Informationen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">
          Zahlungsinformationen
        </h3>
        <div className="space-y-3 text-blue-800">
          <p>
            <strong>Betrag:</strong> Der fällige Betrag wird dir vom Organisator mitgeteilt.
          </p>
          <p>
            <strong>Zahlungsweise:</strong> Bitte überweise den Betrag direkt an den Organisator.
          </p>
          <p>
            <strong>Status-Update:</strong> Der Organisator wird deinen Zahlungsstatus nach Eingang der Überweisung aktualisieren.
          </p>
        </div>
      </div>

      {!myPaymentStatus?.hasPaid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 text-yellow-400">⚠️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Erinnerung
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Bitte überweise den fälligen Betrag rechtzeitig, damit deine Teilnahme am Hüttenurlaub 
                  gesichert ist. Bei Fragen wende dich an den Organisator.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;