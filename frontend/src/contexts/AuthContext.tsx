// frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { apiClient, ApiError } from '@/lib/api-client'; // Keep this one
import { User, AuthSigninRequest, AuthSignupRequest, AuthResponse } from '@/lib/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (credentials: AuthSigninRequest) => Promise<void>;
  signUp: (credentials: AuthSignupRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      apiClient.setAuthToken(authToken);
      const userData: User = await apiClient.fetch('/auth/me');
      setUser(userData);
      setIsAuthenticated(true);
      setToken(authToken);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      auth.removeToken();
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = auth.getToken();
    if (storedToken) {
      fetchUser(storedToken);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, [fetchUser]);

  const signIn = useCallback(async (credentials: AuthSigninRequest) => {
    try {
      const response: AuthResponse = await apiClient.fetch('/auth/sign-in/email', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      auth.setToken(response.token);
      await fetchUser(response.token);
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.data.detail || err.message);
      }
      throw new Error('Failed to sign in.');
    }
  }, [fetchUser]);

  const signUp = useCallback(async (credentials: AuthSignupRequest) => {
    try {
      const response: AuthResponse = await apiClient.fetch('/auth/sign-up/email', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      auth.setToken(response.token);
      await fetchUser(response.token);
    } catch (err) {
      if (err instanceof ApiError) {
        throw new Error(err.data.detail || err.message);
      }
      throw new Error('Failed to sign up.');
    }
  }, [fetchUser]);

  const signOut = useCallback(async () => {
    auth.removeToken();
    apiClient.setAuthToken(undefined);
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    router.push('/');
  }, [router]);

  const value = { isAuthenticated, user, token, isLoading, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
