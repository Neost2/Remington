import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from './storage';
import { setAuthToken } from '@/api/client';
import { loginApi, meApi, registerApi } from '@/api/auth';
import type { AuthUser, Role } from '@/types/api';

type AuthState = {
  bootstrapping: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (args: { email: string; password: string }) => Promise<void>;
  register: (args: {
    email: string;
    phone: string;
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const saved = await tokenStorage.get();
        if (saved) {
          setAuthToken(saved);
          setToken(saved);
          // Validate token by hitting /me
          const me = await meApi();
          setUser({
            id: me.id,
            email: me.email,
            role: me.role,
            firstName: me.firstName,
            lastName: me.lastName,
            phone: me.phone,
          });
        }
      } catch {
        // token invalid/expired; clear
        await tokenStorage.clear();
        setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setBootstrapping(false);
      }
    };

    init();
  }, []);

  const login = async (args: { email: string; password: string }) => {
    const { token: newToken, user: u } = await loginApi(args);
    await tokenStorage.set(newToken);
    setAuthToken(newToken);
    setToken(newToken);
    setUser({
      id: u.id,
      email: u.email,
      role: u.role,
      firstName: u.firstName,
      lastName: u.lastName,
    });
  };

  const register = async (args: {
    email: string;
    phone: string;
    password: string;
    role: Role;
    firstName: string;
    lastName: string;
  }) => {
    const { token: newToken, user: u } = await registerApi(args);
    await tokenStorage.set(newToken);
    setAuthToken(newToken);
    setToken(newToken);
    setUser({
      id: u.id,
      email: u.email,
      role: u.role,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
    });
  };

  const logout = async () => {
    await tokenStorage.clear();
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ bootstrapping, token, user, login, register, logout }),
    [bootstrapping, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
