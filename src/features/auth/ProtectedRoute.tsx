import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { LoginScreen } from './LoginScreen';
import { SignUpScreen } from './SignUpScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';

type AuthView = 'login' | 'signup' | 'forgot-password';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Helper to determine auth view from current URL pathname
  const getInitialView = (): AuthView => {
    if (typeof window === 'undefined') return 'login';
    const path = window.location.pathname.toLowerCase();
    if (path.includes('signup') || path.includes('sign-up') || path.includes('register')) {
      return 'signup';
    }
    if (path.includes('forgot') || path.includes('reset')) {
      return 'forgot-password';
    }
    return 'login';
  };

  const [authView, setAuthView] = useState<AuthView>(getInitialView);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setAuthView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // When user is logged in and visits auth paths, redirect to home ('/')
  useEffect(() => {
    if (!loading && user) {
      const path = window.location.pathname.toLowerCase();
      if (
        path.includes('login') ||
        path.includes('signup') ||
        path.includes('register') ||
        path.includes('forgot')
      ) {
        window.history.replaceState(null, '', '/');
      }
    } else if (!loading && !user) {
      // If logged out on root or other path, update URL to reflect auth page
      const path = window.location.pathname.toLowerCase();
      if (!path.includes('login') && !path.includes('signup') && !path.includes('forgot')) {
        window.history.replaceState(null, '', '/login');
      }
    }
  }, [user, loading]);

  const navigateTo = (view: AuthView) => {
    setAuthView(view);
    const path = view === 'login' ? '/login' : view === 'signup' ? '/signup' : '/forgot-password';
    window.history.pushState(null, '', path);
  };

  // 1. Initial auth loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf9] text-slate-900 selection:bg-lime-400 selection:text-forest-950">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-forest-900 text-lime-400 flex items-center justify-center font-display font-extrabold text-2xl shadow-xl border-2 border-white animate-pulse">
            F
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-400 border-2 border-white animate-ping" />
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-2">
          <span>Verifying authentication session...</span>
        </p>
      </div>
    );
  }

  // 2. Unauthenticated: route protection redirect to login / signup / forgot-password
  if (!user) {
    if (authView === 'signup') {
      return <SignUpScreen onNavigateToLogin={() => navigateTo('login')} />;
    }
    if (authView === 'forgot-password') {
      return <ForgotPasswordScreen onNavigateToLogin={() => navigateTo('login')} />;
    }
    return (
      <LoginScreen
        onNavigateToSignUp={() => navigateTo('signup')}
        onNavigateToForgotPassword={() => navigateTo('forgot-password')}
      />
    );
  }

  // 3. Authenticated: render protected application
  return <>{children}</>;
};
