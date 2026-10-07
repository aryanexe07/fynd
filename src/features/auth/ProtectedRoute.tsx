import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { LoginScreen } from './LoginScreen';
import { SignUpScreen } from './SignUpScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';

type AuthView = 'login' | 'signup' | 'forgot_password';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f5f3] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#09261a] text-lime-400 flex items-center justify-center shadow-md animate-pulse border-2 border-white">
            <svg
              className="w-7 h-7 text-lime-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="m11 8 3 3-3 3" />
            </svg>
          </div>
          <div className="text-xs font-bold text-slate-500 tracking-wider uppercase">Loading FYND...</div>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the main website
  if (user) {
    return <>{children}</>;
  }

  // Otherwise, show Login Screen (or SignUp / ForgotPassword)
  return (
    <div className="min-h-screen bg-[#f1f5f3]">
      {currentView === 'login' && (
        <LoginScreen
          onNavigateToSignUp={() => setCurrentView('signup')}
          onNavigateToForgotPassword={() => setCurrentView('forgot_password')}
        />
      )}

      {currentView === 'signup' && (
        <SignUpScreen
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'forgot_password' && (
        <ForgotPasswordScreen
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}
    </div>
  );
};
