import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigateToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigateToLogin }) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmailError(null);

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email format (e.g. alex@campus.edu)');
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('user not found')) {
          setErrorMessage('No account found with this email address.');
        } else if (msg.includes('fetch') || msg.includes('network')) {
          setErrorMessage('Network connection error. Unable to reach Supabase authentication service.');
        } else {
          setErrorMessage(error.message || 'Failed to send password reset email.');
        }
      } else {
        setSuccessMessage(
          'Password reset email sent! Check your inbox for instructions to reset your password.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
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
            <KeyRound className="w-7 h-7 text-lime-400" />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Reset Password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl relative">
          {successMessage ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-800">Check Your Inbox</p>
                  <p className="leading-relaxed">{successMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-display font-bold text-lg text-slate-900">Forgot Password?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  We'll email you a secure link to reset your account password.
                </p>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* Reset Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="reset-email">
                    Campus Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                        if (errorMessage) setErrorMessage(null);
                      }}
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold bg-forest-900 text-lime-400 hover:bg-forest-800 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Back to Login Link */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Security Feature Badges */}
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
