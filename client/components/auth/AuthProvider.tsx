'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { setAccessToken } from '@/lib/api/client';
import { authService } from '@/lib/api/services';
import type { User } from '@/types/domain';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (body: { name: string; email: string; password: string; confirmPassword: string; fitnessGoal: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.me()
      .then((response) => setUser(response.data))
      .catch(() => authService.refresh().then((response) => { setAccessToken(response.token); return authService.me(); }).then((response) => setUser(response.data)).catch(() => setUser(null)))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const response = await authService.login({ email, password });
    setAccessToken(response.data.token);
    const nextUser = { ...response.data };
    delete (nextUser as Partial<User & { token: string }>).token;
    setUser(nextUser);
    return nextUser;
  }

  async function register(body: { name: string; email: string; password: string; confirmPassword: string; fitnessGoal: string }) {
    const response = await authService.register(body);
    setAccessToken(response.data.token);
    const nextUser = { ...response.data };
    delete (nextUser as Partial<User & { token: string }>).token;
    setUser(nextUser);
    return nextUser;
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  function updateUser(nextUser: User) {
    setUser(nextUser);
  }

  async function deleteAccount() {
    await authService.deleteAccount();
    setAccessToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, deleteAccount }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
