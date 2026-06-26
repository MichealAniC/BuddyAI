'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { setToken, removeToken, getUser, setUser as storeUser, isAuthenticated as checkAuth } from '@/lib/auth';
import { apiRequest } from '@/lib/api';
import { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function clearAuth() {
  removeToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate from localStorage on mount
    const storedUser = getUser();
    if (storedUser && checkAuth()) {
      setUserState(storedUser as unknown as User);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    storeUser(data.user);
    setUserState(data.user as User);
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string, role: Role) => {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, role }),
    });
    setToken(data.token);
    storeUser(data.user);
    setUserState(data.user as User);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user && checkAuth(),
      isLoading,
      role: user?.role || null,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}
