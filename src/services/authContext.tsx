import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';

export interface SignUpMetadata {
  displayName?: string;
  studentId?: string;
  department?: string;
}

export interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: SignUpMetadata
  ) => Promise<{ error: AuthError | Error | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<{ error: AuthError | Error | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    // 1. Get initial active session from Supabase local storage persistence
    const initializeAuth = async () => {
      try {
        if (!configured) {
          // If Supabase credentials are not set yet in .env, check for local demo session or finish loading
          const storedMockSession = localStorage.getItem('fynd_demo_auth_user');
          if (storedMockSession) {
            const parsed = JSON.parse(storedMockSession);
            setUser(parsed);
          }
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Error fetching Supabase session:', error.message);
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('Unexpected error during auth initialization:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth state changes (sign in, sign out, token refresh)
    if (configured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [configured]);

  /**
   * Log in using Supabase Auth signInWithPassword
   */
  const signIn = async (email: string, password: string): Promise<{ error: AuthError | Error | null }> => {
    if (!configured) {
      return {
        error: new Error(
          'Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      setSession(data.session);
      setUser(data.user);
      return { error: null };
    } catch (err: any) {
      return {
        error: err instanceof Error ? err : new Error(err?.message || 'Network error occurred. Please try again.'),
      };
    }
  };

  /**
   * Register a new user using Supabase Auth signUp
   */
  const signUp = async (
    email: string,
    password: string,
    metadata?: SignUpMetadata
  ): Promise<{ error: AuthError | Error | null; needsEmailConfirmation: boolean }> => {
    if (!configured) {
      return {
        error: new Error(
          'Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
        ),
        needsEmailConfirmation: false,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            displayName: metadata?.displayName || email.split('@')[0],
            studentId: metadata?.studentId || '',
            department: metadata?.department || 'Student',
          },
        },
      });

      if (error) {
        return { error, needsEmailConfirmation: false };
      }

      // If Supabase requires email verification, session will be null upon signup
      const needsEmailConfirmation = !data.session && Boolean(data.user);

      if (data.session) {
        setSession(data.session);
        setUser(data.user);
      }

      return { error: null, needsEmailConfirmation };
    } catch (err: any) {
      return {
        error: err instanceof Error ? err : new Error(err?.message || 'Network error occurred. Please try again.'),
        needsEmailConfirmation: false,
      };
    }
  };

  /**
   * Log out using Supabase Auth signOut
   */
  const signOut = async (): Promise<{ error: AuthError | Error | null }> => {
    try {
      if (configured) {
        const { error } = await supabase.auth.signOut();
        if (error) return { error };
      }
      localStorage.removeItem('fynd_demo_auth_user');
      setSession(null);
      setUser(null);
      return { error: null };
    } catch (err: any) {
      return {
        error: err instanceof Error ? err : new Error(err?.message || 'Failed to sign out.'),
      };
    }
  };

  /**
   * Request password reset instructions via Supabase Auth resetPasswordForEmail
   */
  const resetPassword = async (email: string): Promise<{ error: AuthError | Error | null }> => {
    if (!configured) {
      return {
        error: new Error(
          'Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
        ),
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) return { error };
      return { error: null };
    } catch (err: any) {
      return {
        error: err instanceof Error ? err : new Error(err?.message || 'Failed to send password reset email.'),
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: configured,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      session: null,
      loading: false,
      isConfigured: false,
      signIn: async () => ({ error: new Error('Auth context not found') }),
      signUp: async () => ({ error: new Error('Auth context not found'), needsEmailConfirmation: false }),
      signOut: async () => ({ error: null }),
      resetPassword: async () => ({ error: new Error('Auth context not found') }),
    };
  }
  return context;
};
