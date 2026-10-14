'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { UserProfile, Role, ROLE_PORTAL_MAP } from '@koraylo/shared';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/api/auth/me');
      const userData = res?.data?.user || res?.data || res?.user || res;
      if (userData && userData.id) {
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const res = await api.post<any>('/api/auth/login', { email, password });
      const userData: UserProfile =
        res?.data?.user || res?.data || res?.user || res;

      if (!userData || !userData.role) {
        throw new Error('Invalid user data received from server');
      }

      setUser(userData);

      // Determine redirect path
      const redirectPath = ROLE_PORTAL_MAP[userData.role] || '/student';
      router.push(redirectPath);

      return userData;
    } catch (err: any) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    refresh: fetchMe,
  };
}
