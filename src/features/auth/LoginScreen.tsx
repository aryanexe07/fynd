import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface LoginScreenProps {
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignUp,
  onNavigateToForgotPassword,
}) => {
  const { signIn, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Email format regex validation
  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(null);
    if (errorMessage) setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(null);
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email format (e.g. alex@campus.edu)');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate inputs before calling Supabase
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        // Map Supabase errors to user-friendly messages
        const msg = error.message.toLowerCase();
        if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
          setErrorMessage('Invalid email or password. Please check your credentials and try again.');
        } else if (msg.includes('user not found') || msg.includes('no user')) {
          setErrorMessage('No registered user found with this email. Please create an account.');
        } else if (msg.includes('email not confirmed')) {
          setErrorMessage('Your email address has not been confirmed yet. Please verify your email.');
        } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
          setErrorMessage('Network connection error. Unable to reach Supabase authentication service.');
        } else {
          setErrorMessage(error.message || 'Authentication failed. Please try again.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 bg-[#f8faf9] text-slate-900 selection:bg-lime-400 selection:text-forest-950 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Brand / Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest-900 text-lime-400 font-display font-extrabold text-2xl shadow-lg border-2 border-white mb-4 transform hover:scale-105 transition-transform">
            F
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Welcome to Fynd
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
            Campus Lost & Found • Secure Zero-Knowledge Recovery
          </p>
        </div>

        {/* Configuration Notice if .env has placeholder keys */}
        {!isConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-sm">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Supabase Configuration Required</p>
              <p className="text-amber-800 leading-relaxed">
                Add your Supabase project credentials in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">.env</code>:
              </p>
              <pre className="mt-1 bg-amber-100/70 p-2 rounded-xl text-[10px] font-mono text-amber-900 overflow-x-auto">
                VITE_SUPABASE_URL=https://your-project.supabase.co{'\n'}
                VITE_SUPABASE_ANON_KEY=your-anon-key
              </pre>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl relative">
          <div className="mb-6">
            <h2 className="font-display font-bold text-lg text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your campus credentials to access your reports and matches
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="login-email">
                Campus Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="alex.rivera@campus.edu"
                  disabled={loading}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none transition-colors ${
                    emailError
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600'
                      : 'border-slate-200 focus:border-forest-600'
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-[11px] font-bold text-forest-700 hover:text-forest-900 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none transition-colors ${
                    passwordError
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600'
                      : 'border-slate-200 focus:border-forest-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="font-bold text-forest-800 hover:text-forest-950 underline decoration-lime-400 underline-offset-2 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Security Feature Badges matching Fynd design */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>Encrypted Auth</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-lime-600" />
            <span>Zero-Knowledge Proofs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
