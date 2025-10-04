'use client';

import { useState, useEffect } from 'react';

export interface User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export interface AuthSession {
  user: User | null;
  isLoading: boolean;
  error?: Error;
}

export function useAuthSession(): AuthSession {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          // Not authenticated, which is fine
          setUser(null);
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, isLoading, error };
}
