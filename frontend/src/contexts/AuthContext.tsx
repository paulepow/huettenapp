import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, getApiErrorMessage } from '../services/api';
import type { User, LoginData, RegisterData, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token und Benutzer beim App-Start laden
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { user } = await authAPI.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response = await authAPI.login(data);
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await authAPI.register(data);
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};