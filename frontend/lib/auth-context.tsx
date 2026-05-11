'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  user_id: number;
  role: 'admin' | 'student';
  name: string;
}

interface AuthCtx {
  user: User | null;
  loading: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, refresh: () => {}, logout: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await api.me();
      if (res.success) setUser(res.data);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  useEffect(() => { refresh(); }, []);

  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
