import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'subscriber' | 'admin';
}

export interface Subscription {
  status: 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused';
  planId: string;
}

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSubscription: (sub: Subscription | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to refresh token on initial load
    const initAuth = async () => {
      try {
        const res = await api.post('/auth/refresh');
        if (res.data.accessToken) {
          // If we had a /me route we could fetch user info.
          // Since we don't, we might need to rely on the token payload or add a /me route.
          // Let's add a /me route in the backend to fetch current user, or decode JWT.
          // For now, let's decode JWT if we have it, but we only have accessToken in memory.
          // Ideally backend refresh returns user object. Assuming we update backend to do so.
          if (res.data.user) {
            setUser(res.data.user);
          }
        }
      } catch (error) {
        // Not authenticated
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null);
        return;
      }
      try {
        const res = await api.get('/subscriptions/me');
        if (res.data) {
          setSubscription(res.data);
        }
      } catch (err) {
        setSubscription(null);
      }
    };
    fetchSubscription();
  }, [user]);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, subscription, loading, setUser, setSubscription, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
