'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { setAccessToken } from '@/lib/api/client';
import { authService } from '@/lib/api/services';
import type { User } from '@/types/domain';

type AuthState = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (body: { name: string; email: string; password: string; confirmPassword: string; fitnessGoal: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  deleteAccount: () => Promise<void>;
  initialize: () => Promise<void>;
  initialized: boolean;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  initialized: false,
  initialize: async () => {
    if (get().initialized) return;
    set({ initialized: true });

    try {
      const response = await authService.me();
      set({ user: response.data });
    } catch {
      try {
        const response = await authService.refresh();
        setAccessToken(response.token);
        const userResponse = await authService.me();
        set({ user: userResponse.data });
      } catch {
        set({ user: null });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (email, password) => {
    const response = await authService.login({ email, password });
    setAccessToken(response.data.token);
    const nextUser = { ...response.data };
    delete (nextUser as Partial<User & { token: string }>).token;
    set({ user: nextUser });
    return nextUser;
  },
  register: async (body) => {
    const response = await authService.register(body);
    setAccessToken(response.data.token);
    const nextUser = { ...response.data };
    delete (nextUser as Partial<User & { token: string }>).token;
    set({ user: nextUser });
    return nextUser;
  },
  logout: async () => {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      set({ user: null });
    }
  },
  updateUser: (nextUser) => set({ user: nextUser }),
  deleteAccount: async () => {
    await authService.deleteAccount();
    setAccessToken(null);
    set({ user: null });
  },
}));

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useAuth.getState().initialize();
  }, []);

  return children;
}
