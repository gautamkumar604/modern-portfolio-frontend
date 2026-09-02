'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AdminUser } from '@/types';
import { adminAuthService } from '@/lib/services/admin-auth.service';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await adminAuthService.getMe();
      if (userData && userData.role === 'admin') {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await adminAuthService.login(email, password);
      if (res && res.token && typeof window !== 'undefined') {
        localStorage.setItem('admin_token', res.token);
      }
      if (res && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else {
        await checkAuth();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await adminAuthService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
