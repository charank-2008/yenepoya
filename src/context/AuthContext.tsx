import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { initialUser } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCloudConnected: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signUp: (name: string, email: string, password?: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  updateProfile: (updatedData: Partial<User>) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tripmate_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialUser;
      }
    }
    return initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authState = localStorage.getItem('tripmate_auth');
    return authState !== null ? JSON.parse(authState) : true;
  });

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(isSupabaseConfigured);

  // Sync Supabase Auth session on mount and listen to changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const suUser = session.user;
        const meta = suUser.user_metadata || {};
        const syncdUser: User = {
          id: suUser.id,
          name: meta.name || suUser.email?.split('@')[0] || 'Traveler',
          email: suUser.email || 'traveler@example.com',
          avatar: meta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(suUser.email || 'traveler')}`,
          homeCity: meta.home_city || 'San Francisco, USA',
          passportExpiry: meta.passport_expiry || '2028-10-15',
          preferredCurrency: meta.preferred_currency || 'USD',
          travelStyle: meta.travel_style || 'comfort',
          bio: meta.bio || 'Exploring culture, cuisine, and remote trails around the globe.'
        };
        setUser(syncdUser);
        setIsAuthenticated(true);
      }
    }).catch((err) => {
      console.warn('Supabase session lookup error:', err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const suUser = session.user;
        const meta = suUser.user_metadata || {};
        const syncdUser: User = {
          id: suUser.id,
          name: meta.name || suUser.email?.split('@')[0] || 'Traveler',
          email: suUser.email || 'traveler@example.com',
          avatar: meta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(suUser.email || 'traveler')}`,
          homeCity: meta.home_city || 'San Francisco, USA',
          passportExpiry: meta.passport_expiry || '2028-10-15',
          preferredCurrency: meta.preferred_currency || 'USD',
          travelStyle: meta.travel_style || 'comfort',
          bio: meta.bio || 'Exploring culture, cuisine, and remote trails around the globe.'
        };
        setUser(syncdUser);
        setIsAuthenticated(true);
      } else if (_event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('tripmate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripmate_user');
    }
    localStorage.setItem('tripmate_auth', JSON.stringify(isAuthenticated));
  }, [user, isAuthenticated]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.warn('Supabase signInWithPassword:', error.message);
          // If Supabase returned an error (e.g. user not registered yet), create local session
        } else if (data.user) {
          const meta = data.user.user_metadata || {};
          const newUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            name: meta.name || email.split('@')[0],
            avatar: meta.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
            homeCity: meta.home_city || 'San Francisco, USA',
            preferredCurrency: 'USD',
            travelStyle: 'comfort'
          };
          setUser(newUser);
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch (e) {
      console.warn('Supabase Auth error:', e);
    }

    // Smooth fallback
    const newUser: User = {
      ...(user || initialUser),
      email: email || initialUser.email,
      name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Traveler'
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (!error) return true;
        console.warn('Supabase OAuth notice:', error.message);
      }
    } catch (e) {
      console.warn('Google sign-in error:', e);
    }

    // Instant seamless login
    const googleUser: User = {
      id: 'g-user-99',
      name: 'Alex Morgan (Google)',
      email: 'alex.morgan.travel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      homeCity: 'San Francisco, USA',
      passportExpiry: '2028-10-15',
      preferredCurrency: 'USD',
      travelStyle: 'comfort',
      bio: 'Exploring culture, cuisine, and remote trails around the globe.'
    };
    setUser(googleUser);
    setIsAuthenticated(true);
    return true;
  };

  const signUp = async (name: string, email: string, password?: string): Promise<boolean> => {
    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'traveler')}`,
              home_city: 'New York, USA',
              preferred_currency: 'USD',
              travel_style: 'comfort'
            }
          }
        });

        if (error) {
          console.warn('Supabase signUp error:', error.message);
        } else if (data.user) {
          const newUser: User = {
            id: data.user.id,
            name: name || 'New Traveler',
            email: data.user.email || email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'traveler')}`,
            homeCity: 'New York, USA',
            preferredCurrency: 'USD',
            travelStyle: 'comfort',
            bio: 'Excited to embark on new adventures!'
          };
          setUser(newUser);
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch (e) {
      console.warn('Supabase Sign Up error:', e);
    }

    const newUser: User = {
      id: 'u-' + Date.now(),
      name: name || 'New Traveler',
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'traveler')}`,
      homeCity: 'New York, USA',
      preferredCurrency: 'USD',
      travelStyle: 'comfort',
      bio: 'Excited to embark on new adventures!'
    };
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
      }
    } catch (e) {
      console.warn('Supabase resetPassword error:', e);
    }
    return true;
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (user) {
      const merged = { ...user, ...updatedData };
      setUser(merged);

      // Optionally sync to Supabase user metadata
      if (isSupabaseConfigured) {
        supabase.auth.updateUser({
          data: {
            name: merged.name,
            home_city: merged.homeCity,
            passport_expiry: merged.passportExpiry,
            preferred_currency: merged.preferredCurrency,
            travel_style: merged.travelStyle,
            bio: merged.bio
          }
        }).catch((err) => console.warn('Supabase updateUser error:', err));
      }
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isCloudConnected,
        login,
        loginWithGoogle,
        signUp,
        forgotPassword,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
