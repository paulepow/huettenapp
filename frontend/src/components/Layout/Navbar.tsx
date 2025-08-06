import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  CreditCard, 
  User, 
  Settings, 
  Bell, 
  Menu, 
  X,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Startseite',
      requiresAuth: true
    },
    {
      to: '/activities',
      icon: Calendar,
      label: 'Aktivitäten',
      requiresAuth: true
    },
    {
      to: '/payments',
      icon: CreditCard,
      label: 'Zahlungen',
      requiresAuth: true
    },
    {
      to: '/notifications',
      icon: Bell,
      label: 'Benachrichtigungen',
      requiresAuth: true,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      to: '/admin',
      icon: Settings,
      label: 'Admin',
      requiresAuth: true,
      requiresAdmin: true
    }
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.requiresAuth) return true;
    if (!user) return false;
    if (item.requiresAdmin && user.role !== 'ADMIN') return false;
    return true;
  });

  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo und Hauptnavigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                🏔️ Hütten 2026
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {filteredNavItems.map(({ to, icon: Icon, label, badge }) => (
                <Link
                  key={to}
                  to={to}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 relative ${
                    isActive(to)
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {label}
                  {badge && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Benutzer-Menü */}
          <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                  {user.role === 'ADMIN' && (
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Abmelden</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menü Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            {filteredNavItems.map(({ to, icon: Icon, label, badge }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(to)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
                {badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
            
            {user && (
              <>
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-3 mb-3">
                    <User className="w-6 h-6 text-gray-400 mr-3" />
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Abmelden
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;