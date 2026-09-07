import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  User as UserIcon,
  X,
} from 'lucide-react';

import { SchoolProfile, User } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { supabase } from '../../lib/supabase';

interface LoginViewProps {
  schoolProfile: SchoolProfile;
  onLoginSuccess: (user: User) => void;
  onBackToHome?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  schoolProfile,
  onLoginSuccess,
  onBackToHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleLoginSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErrorMsg(
        'Please enter your institutional email and password.'
      );
      setLoading(false);
      return;
    }

    try {
      /*
       * Authenticate through Supabase Auth.
       * No hardcoded accounts.
       * No automatic/demo login.
       */
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (error) {
        console.error('Supabase login error:', error);
        throw new Error(
          'Invalid email or password.'
        );
      }

      if (!data.user) {
        throw new Error(
          'Unable to identify the authenticated account.'
        );
      }

      /*
       * Get the authenticated user's profile.
       * The profile stores the institutional role,
       * full name, and application-specific account data.
       */
      const { data: profile, error: profileError } =
        await supabase
          .from('profiles')
          .select(
            'id, full_name, role, created_at'
          )
          .eq('id', data.user.id)
          .single();

      if (profileError || !profile) {
        console.error(
          'Profile lookup error:',
          profileError
        );

        await supabase.auth.signOut();

        throw new Error(
          'Your account is authenticated, but no school profile is assigned. Please contact the school administrator.'
        );
      }

      const role = String(profile.role).toUpperCase();

      const allowedRoles = [
        'ADMIN',
        'HEAD',
        'PRINCIPAL',
        'REGISTRAR',
        'TEACHER',
        'STUDENT',
        'PARENT',
      ];

      if (!allowedRoles.includes(role)) {
        await supabase.auth.signOut();

        throw new Error(
          'Your account has an invalid school role. Please contact the school administrator.'
        );
      }

      const username =
        data.user.user_metadata?.username ||
        data.user.email?.split('@')[0] ||
        data.user.id;

      const loggedInUser: User = {
        id: data.user.id,
        username,
        email: data.user.email || cleanEmail,
        fullName:
          profile.full_name ||
          data.user.user_metadata?.full_name ||
          username,
        role: role as User['role'],
        status: 'Active',
        createdAt:
          profile.created_at ||
          data.user.created_at,
        lastLogin: new Date().toISOString(),
      };

      onLoginSuccess(loggedInUser);

    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.';

      setErrorMsg(message);

    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setResetLoading(true);
    setResetMessage('');

    try {
      const cleanEmail = resetEmail.trim().toLowerCase();

      if (!cleanEmail) {
        throw new Error(
          'Please enter your registered email address.'
        );
      }

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (error) {
        throw error;
      }

      setResetMessage(
        'If an account exists with that email address, password recovery instructions have been sent.'
      );

    } catch (error) {
      console.error(error);

      setResetMessage(
        'Unable to process the password recovery request. Please contact the school administrator.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">

      {/* =====================================================
          INSTITUTIONAL HEADER
      ====================================================== */}
      <header className="relative overflow-hidden bg-white border-b-8 border-emerald-800">

        <div className="absolute inset-0">
          <img
            src="/sha-73rd-anniversary-campus.png"
            alt="Sacred Heart Academy campus"
            className="w-full h-full object-cover opacity-20"
          />

          <div className="absolute inset-0 bg-white/85" />
        </div>

        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-900 bg-white/95 hover:bg-white border border-slate-200 shadow-sm transition-colors"
          >
            ← Back to Home
          </button>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-8 sm:pt-16 sm:pb-10 text-center">

          <div className="flex justify-center mb-4">
            <SchoolLogo
              size="xl"
              className="drop-shadow-md"
            />
          </div>

          <h1 className="font-seal text-3xl sm:text-5xl font-extrabold tracking-tight text-emerald-950 uppercase">
            Sacred Heart Academy
          </h1>

          <div className="mt-2 flex items-center justify-center gap-3 text-emerald-800">

            <span className="hidden sm:block h-px w-12 bg-emerald-700/50" />

            <p className="text-sm sm:text-base font-bold tracking-[0.22em] uppercase">
              School Management Portal
            </p>

            <span className="hidden sm:block h-px w-12 bg-emerald-700/50" />

          </div>

          <p className="mt-2 text-sm sm:text-base text-slate-700 font-semibold">
            {schoolProfile.location}
          </p>

          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            DepEd ID: {schoolProfile.schoolId || '403152'}
            &nbsp;•&nbsp;
            Excellence in Faith & Wisdom
          </p>

        </div>
      </header>

      {/* =====================================================
          LOGIN AREA
      ====================================================== */}
      <main className="flex-1 bg-slate-900 relative overflow-hidden">

        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />

        <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          <div className="text-center mb-8">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800/40 border border-emerald-700/50 mb-4">
              <ShieldCheck className="w-7 h-7 text-emerald-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Sign in to your account
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Use your registered Sacred Heart Academy
              institutional credentials.
            </p>

          </div>

          {/* Error */}
          {errorMsg && (
            <div className="mb-5 rounded-xl border border-rose-700 bg-rose-950/70 p-4 text-sm text-rose-100">
              {errorMsg}
            </div>
          )}

          {/* =================================================
              LOGIN FORM
          ================================================== */}
          <form
            onSubmit={handleLoginSubmit}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
          >

            {/* Email */}
            <div>

              <label
                htmlFor="login-email"
                className="block text-sm font-bold text-slate-800 mb-2"
              >
                Institutional Email
              </label>

              <div className="relative">

                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@sha.edu.ph"
                  className="w-full bg-white text-slate-800 border border-slate-300 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="login-password"
                  className="block text-sm font-bold text-slate-800"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetMessage('');
                    setShowForgotPassword(true);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full bg-white text-slate-800 border border-slate-300 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />

              </div>

            </div>

            {/* Sign In */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg transition-colors"
            >
              <span>
                {loading ? 'Signing In...' : 'Sign In'}
              </span>

              {!loading && (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>

            {/* Security information */}
            <div className="pt-5 border-t border-slate-200">

              <div className="flex items-start gap-3">

                <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />

                <p className="text-xs text-slate-500 leading-relaxed">
                  Access is controlled by Sacred Heart Academy
                  institutional accounts. Your permissions are
                  determined by the role assigned to your account.
                </p>

              </div>

            </div>

          </form>

          {/* =================================================
              PORTAL INFORMATION
          ================================================== */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <BookOpen className="w-5 h-5 mx-auto text-emerald-300 mb-2" />
              <p className="text-xs font-bold text-white">
                Secure Access
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Institutional credentials
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <GraduationCap className="w-5 h-5 mx-auto text-emerald-300 mb-2" />
              <p className="text-xs font-bold text-white">
                School Records
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Role-based access
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-300 mb-2" />
              <p className="text-xs font-bold text-white">
                Protected Portal
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Authorized users only
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="bg-emerald-950 text-emerald-200 text-center py-4 px-4">
        <p className="text-xs">
          © {new Date().getFullYear()} Sacred Heart Academy.
          All Rights Reserved.
        </p>

        <p className="text-[10px] text-emerald-400 mt-1">
          {schoolProfile.location}
        </p>
      </footer>

      {/* =====================================================
          FORGOT PASSWORD MODAL
      ====================================================== */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

            <div className="bg-emerald-950 text-white px-6 py-5 flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-emerald-200" />
                </div>

                <div>
                  <h3 className="font-black">
                    Password Recovery
                  </h3>

                  <p className="text-xs text-emerald-200/70">
                    Sacred Heart Academy
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetMessage('');
                }}
                className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {resetMessage ? (
              <div className="p-6">

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">

                  <CheckCircle2 className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />

                  <p className="text-sm text-emerald-900">
                    {resetMessage}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage('');
                    setResetEmail('');
                  }}
                  className="w-full mt-5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl py-3 font-bold"
                >
                  Return to Sign In
                </button>

              </div>
            ) : (
              <form
                onSubmit={handleForgotPassword}
                className="p-6 space-y-5"
              >

                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter the email address registered to your
                  Sacred Heart Academy account.
                </p>

                <div>

                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2"
                  >
                    Registered Email
                  </label>

                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(event) =>
                      setResetEmail(event.target.value)
                    }
                    placeholder="name@sha.edu.ph"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />

                </div>

                <div className="flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setShowForgotPassword(false)
                    }
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold"
                  >
                    {resetLoading
                      ? 'Sending...'
                      : 'Send Recovery Link'}
                  </button>

                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginView;