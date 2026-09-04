import React, { useState } from 'react';
import { User, SchoolProfile } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Shield,
  Award,
  UserCheck,
  BookOpen,
  GraduationCap,
  Users,
  Eye,
  Check,
  FileSpreadsheet,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';

import { ArrowLeft } from 'lucide-react';

interface LoginViewProps {
  schoolProfile: SchoolProfile;
  allUsers: User[];
  onLoginSuccess: (user: User) => void;
  onBackToHome?: () => void;
  onCreateAccount?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  schoolProfile,
  allUsers,
  onLoginSuccess,
  onBackToHome,
  onCreateAccount,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'comparison'>('signin');
  const [selectedRole, setSelectedRole] = useState('ADMIN');

  // Specific role lookup
  const adminUser = allUsers.find((u) => u.role === 'ADMIN');
  const headUser = allUsers.find((u) => u.role === 'HEAD');
  const principalUser = allUsers.find((u) => u.role === 'PRINCIPAL');
  const registrarUser = allUsers.find((u) => u.role === 'REGISTRAR');
  const teacherAustin = allUsers.find((u) => u.username === 'austin') || allUsers.find((u) => u.role === 'TEACHER');
  const studentJoshua = allUsers.find((u) => u.role === 'STUDENT');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const input = username.trim().toLowerCase();

    // Map common aliases
    let target: User | undefined;
    if (input === 'admin') {
      target = adminUser;
    } else if (input === 'principal') {
      target = principalUser;
    } else if (input === 'registrar' || input === 'registra') {
      target = registrarUser;
    } else if (input === 'head') {
      target = headUser;
    } else if (input === 'teacher') {
      target = teacherAustin;
    } else if (input === 'student') {
      target = studentJoshua;
    } else {
      // Find by username, email, or teacher first name
      target = allUsers.find(
        (u) =>
          u.username.toLowerCase() === input ||
          u.email.toLowerCase() === input ||
          u.fullName.toLowerCase() === input ||
          `teacher ${u.username.toLowerCase()}` === input ||
          u.fullName.toLowerCase().includes(input)
      );
    }

    if (target) {
      onLoginSuccess(target);
    } else {
      setErrorMsg('Invalid username. Try "admin", "principal", "registrar", "teacher", or "student".');
    }
  };

  const handleQuickSelect = (u: User, defaultPass: string) => {
    setUsername(u.username);
    setPassword(defaultPass);
    onLoginSuccess(u);
  };

  const credentialsComparison = [
    {
      role: 'ADMIN',
      title: 'Administrator',
      username: 'admin',
      password: 'admin (or any password)',
      official: 'System Administrator',
      icon: Shield,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      userObj: adminUser,
      accessSummary: 'Full administrative access: institutional setup, teacher & student databases, conflict-free timetable scheduler, security audit logs, and JSON database backup / restore.',
      keyCapabilities: [
        'Institutional settings & school seal',
        'Teacher management & workload matrix',
        'Curriculum, rooms & academic tracks',
        'Audit logs & database backup/restore',
      ],
    },
    {
      role: 'PRINCIPAL',
      title: 'School Principal',
      username: 'principal',
      password: 'principal (or any password)',
      official: 'Ellen Baider',
      icon: UserCheck,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      userObj: principalUser,
      accessSummary: 'Academic oversight & curriculum supervision: reviews teacher schedules, verifies quarter grade submissions, approves or returns gradebooks, and endorses official transcripts.',
      keyCapabilities: [
        'Quarterly gradebook approval & return with feedback',
        'Teacher timetable & room allocation supervision',
        'DepEd SF10 & Form 138 endorsement',
        'Academic metrics & class performance summary',
      ],
    },
    {
      role: 'REGISTRAR',
      title: 'School Registrar',
      username: 'registrar',
      password: 'registrar (or any password)',
      official: 'Ruben Martirez',
      icon: BookOpen,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      userObj: registrarUser,
      accessSummary: 'Student lifecycle & official records: manages learner admissions, 12-digit DepEd LRN registry, section enrollments, grade level promotions, and permanent SF10 records.',
      keyCapabilities: [
        'Student enrollment & LRN assignment',
        'Section assignment & class list generation',
        'DepEd SF10 Permanent Record issuance',
        'Enrollment statistics by strand & grade',
      ],
    },
    {
      role: 'TEACHER',
      title: 'Faculty / Teacher',
      username: 'teacher (or austin, eunilyn, angela...)',
      password: 'teacher (or any password)',
      official: 'Teacher Austin & 17 Faculty Instructors',
      icon: GraduationCap,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      userObj: teacherAustin,
      accessSummary: 'Instructional portal: view weekly class schedule, access section rosters, encode quarterly grades (Q1-Q4), and submit grades for Principal approval.',
      keyCapabilities: [
        'Dedicated teaching schedule & room timetable',
        'Direct quarterly grade encoding with passing checks',
        'Draft, Submit & Revision workflows',
        'Section student roster & contact overview',
      ],
    },
    {
      role: 'STUDENT',
      title: 'Student / Learner',
      username: 'student (or joshua)',
      password: 'student (or any password)',
      official: 'Joshua A. Melante (Grade 7 - St. Joseph)',
      icon: Users,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      userObj: studentJoshua,
      accessSummary: 'Learner portal: view enrolled subjects, personalized weekly class timetable, academic quarterly grades, and printable DepEd Form 138 Report Card.',
      keyCapabilities: [
        'Personalized class schedule with teacher & room info',
        'Live quarter grades (Q1-Q4) and General Average',
        'Official DepEd Form 138 Report Card with honors',
        'Institutional announcements & notices',
      ],
    },
    {
      role: 'HEAD',
      title: 'School Head',
      username: 'head',
      password: 'head (or any password)',
      official: 'Atty. Rammonete Shirlyn G. Piano',
      icon: Award,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      userObj: headUser,
      accessSummary: 'Executive leadership oversight: high-level institutional review, school announcements, policy governance, and final grade publishing authorization.',
      keyCapabilities: [
        'Executive governance dashboard & metrics',
        'School-wide grade publishing & honors oversight',
        'Official institutional announcements broadcasting',
        'Administrative audit log monitoring',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* UNC-inspired institutional header */}
      <header className="relative overflow-hidden bg-white border-b-8 border-emerald-800">
        <div className="absolute inset-0">
          <img
            src="/sha-73rd-anniversary-campus.png"
            alt="Sacred Heart Academy campus"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-white/80" />
        </div>

        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-900 bg-white/90 hover:bg-white border border-slate-200 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-8 sm:pt-16 sm:pb-10 text-center">
          <div className="flex justify-center mb-4">
            <SchoolLogo size="xl" className="drop-shadow-md" />
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
            Garchitorena, Camarines Sur
          </p>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            DepEd ID: {schoolProfile.schoolId || '403152'} &nbsp;•&nbsp; Excellence in Faith & Wisdom
          </p>
        </div>
      </header>

      {/* Main login section */}
      <main className="flex-1 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-7">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Please sign in to your account to proceed.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Select your account type, then enter your institutional credentials.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 bg-rose-950/70 border border-rose-700 text-rose-100 text-sm rounded-md">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Login As */}
              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-5 items-center">
                <label htmlFor="login-role" className="text-sm sm:text-base font-bold text-white">
                  Login As:
                </label>
                <div className="relative">
                  <select
                    id="login-role"
                    value={selectedRole}
                    onChange={(e) => {
                      const role = e.target.value;
                      setSelectedRole(role);
                      const item = credentialsComparison.find((x) => x.role === role);
                      if (item) {
                        setUsername(item.username.split(' ')[0]);
                        setPassword(item.username.split(' ')[0]);
                      }
                      setErrorMsg('');
                    }}
                    className="w-full appearance-none bg-white text-slate-800 border border-slate-300 rounded-md px-4 py-3 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {credentialsComparison.map((item) => (
                      <option key={item.role} value={item.role}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-5 items-center">
                <label htmlFor="login-username" className="text-sm sm:text-base font-bold text-white">
                  Username:
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white text-slate-800 border border-slate-300 rounded-md pl-10 pr-4 py-3 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 sm:gap-5 items-center">
                <label htmlFor="login-password" className="text-sm sm:text-base font-bold text-white">
                  Password:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white text-slate-800 border border-slate-300 rounded-md pl-10 pr-4 py-3 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  id="btn-submit-login"
                  type="submit"
                  className="min-w-36 inline-flex items-center justify-center gap-2 px-7 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md font-bold text-sm sm:text-base shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-slate-300 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </form>

            <div className="mt-8 pt-5 border-t border-slate-700 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('comparison')}
                className="text-xs sm:text-sm text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
              >
                Role Differences & Passwords Guide
              </button>
              {onCreateAccount && (
                <span className="text-slate-600 mx-3">•</span>
              )}
              {onCreateAccount && (
                <button
                  type="button"
                  onClick={onCreateAccount}
                  className="text-xs sm:text-sm text-amber-300 hover:text-amber-200 underline underline-offset-4"
                >
                  Apply for Admission
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Role guide - retained from the existing portal */}
      {activeTab === 'comparison' && (
        <section className="bg-slate-100 border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-emerald-950">Portal Role Differences & Login Credentials</h3>
                <p className="text-xs text-slate-500 mt-1">Existing role guide retained from your portal.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                ← Back to Sign In
              </button>
            </div>
            <div className="bg-white border border-slate-200 divide-y divide-slate-200 shadow-sm">
              {credentialsComparison.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.role} className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-md border ${item.badgeColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          <p className="text-xs text-slate-500">{item.official}</p>
                          <p className="text-xs text-slate-600 mt-1 max-w-3xl">{item.accessSummary}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-xs bg-slate-50 border border-slate-200 p-3 rounded-md">
                        <div><span className="text-slate-500">Username:</span> <strong className="text-emerald-800">{item.username.split(' ')[0]}</strong></div>
                        <div className="mt-1"><span className="text-slate-500">Password:</span> <strong>{item.username.split(' ')[0]}</strong></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Institutional values footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold text-emerald-900">
          <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Faith</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Discipline</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-2"><Award className="w-4 h-4" /> Excellence</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Service</span>
        </div>
        <div className="bg-emerald-950 text-white text-xs text-center py-4 px-4">
          © 2026 Sacred Heart Academy. All Rights Reserved. &nbsp;•&nbsp; Garchitorena, Camarines Sur
        </div>
      </footer>

      {/* Security note */}
      <div className="fixed bottom-1 right-2 z-20 hidden lg:flex items-center gap-1 text-[10px] text-slate-500 bg-white/80 px-2 py-1 rounded">
        <ShieldCheck className="w-3 h-3 text-emerald-700" />
        Institutional Role-Based Access Control
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl border border-slate-200 rounded-md">
            <div className="flex items-center gap-3 text-emerald-800 mb-4">
              <div className="p-2.5 bg-emerald-100 rounded-md">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Password Recovery</h3>
                <p className="text-xs text-slate-500">Sacred Heart Academy Account Security</p>
              </div>
            </div>

            {resetSubmitted ? (
              <div className="py-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 mb-4 text-emerald-900 text-xs leading-relaxed rounded-md">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instructions Sent</span>
                  </div>
                  If an active institutional account exists matching the provided identifier, password reset instructions have been dispatched to the registered contact.
                </div>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSubmitted(false);
                    setResetEmail('');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 text-white rounded-md text-xs font-bold hover:bg-slate-900"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetSubmitted(true);
                }}
                className="space-y-4"
              >
                <p className="text-xs text-slate-600 leading-relaxed">Enter your username or registered email address.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Username or Email</label>
                  <input
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. admin, principal, or austin"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowForgotPassword(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 rounded-md shadow-sm">
                    Send Recovery Link
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
