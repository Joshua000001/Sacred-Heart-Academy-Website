import React from 'react';
import { User, UserRole } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  Shield,
  GraduationCap,
  BookOpen,
  UserCheck,
  Award,
  Users,
  Check,
  ChevronDown,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface RoleSwitcherProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  onResetData: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentUser,
  users,
  onSelectUser,
  onResetData,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Administrator', bg: 'bg-rose-100 text-rose-800 border-rose-200', icon: Shield };
      case 'HEAD':
        return { label: 'School Head', bg: 'bg-purple-100 text-purple-800 border-purple-200', icon: Award };
      case 'PRINCIPAL':
        return { label: 'Principal', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: UserCheck };
      case 'REGISTRAR':
        return { label: 'Registrar', bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: BookOpen };
      case 'TEACHER':
        return { label: 'Teacher', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: GraduationCap };
      case 'STUDENT':
        return { label: 'Student', bg: 'bg-teal-100 text-teal-800 border-teal-200', icon: Users };
      default:
        return { label: role, bg: 'bg-slate-100 text-slate-800 border-slate-200', icon: Users };
    }
  };

  const badge = getRoleBadge(currentUser.role);
  const BadgeIcon = badge.icon;

  // Key quick accounts
  const adminUser = users.find((u) => u.role === 'ADMIN');
  const headUser = users.find((u) => u.role === 'HEAD');
  const principalUser = users.find((u) => u.role === 'PRINCIPAL');
  const registrarUser = users.find((u) => u.role === 'REGISTRAR');
  const sampleTeacher = users.find((u) => u.username === 'austin') || users.find((u) => u.role === 'TEACHER');
  const sampleStudent = users.find((u) => u.role === 'STUDENT');

  const keyAccounts = [
    { title: 'Administrator', user: adminUser, desc: 'Full System Configuration' },
    { title: 'School Head', user: headUser, desc: 'Atty. Rammonete Shirlyn G. Piano' },
    { title: 'Principal', user: principalUser, desc: 'Ellen Baider' },
    { title: 'Registrar', user: registrarUser, desc: 'Ruben Martirez' },
    { title: 'Teacher (Austin)', user: sampleTeacher, desc: 'Math 7 & ESP 7 Faculty' },
    { title: 'Student (Joshua)', user: sampleStudent, desc: 'Grade 7 St. Joseph' },
  ].filter((item) => item.user !== undefined);

  return (
    <div className="relative">
      <button
        id="btn-active-role-selector"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-700/60 bg-emerald-900/60 hover:bg-emerald-800 text-white transition-all text-xs font-medium shadow-inner"
        title="Switch active user role for testing"
      >
        {currentUser.avatarUrl ? (
          <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-5 h-5 rounded-full object-cover border border-emerald-700/60" />
        ) : (
          <BadgeIcon className="w-3.5 h-3.5 text-emerald-300" />
        )}
        <span className="hidden sm:inline font-semibold">{currentUser.fullName}</span>
        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-emerald-700/80 text-emerald-100 uppercase tracking-wider font-bold">
          {badge.label}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-800 animate-fade-in">
            <div className="p-3 bg-emerald-950 text-white border-b border-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SchoolLogo size="xs" />
                <div>
                  <h4 className="text-xs font-bold font-seal uppercase tracking-wider">Role & Account Switcher</h4>
                  <p className="text-[10px] text-emerald-300">Test all portal access levels instantly</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowConfirmReset(true);
                }}
                className="p-1.5 rounded text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors text-[11px] flex items-center gap-1"
                title="Reset database to default"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset Data</span>
              </button>
            </div>

            <div className="p-2 max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Official Leadership & Roles
              </div>
              {keyAccounts.map((item) => {
                const u = item.user!;
                const isSelected = currentUser.id === u.id;
                const rBadge = getRoleBadge(u.role);
                const Icon = rBadge.icon;

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-md ${rBadge.bg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{u.fullName}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />}
                        </div>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${rBadge.bg}`}>
                      {rBadge.label}
                    </span>
                  </button>
                );
              })}

              <div className="pt-2">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  All 17 Timetable Faculty Teachers
                </div>
                <div className="grid grid-cols-2 gap-1 p-1">
                  {users
                    .filter((u) => u.role === 'TEACHER')
                    .map((tUser) => {
                      const isSelected = currentUser.id === tUser.id;
                      return (
                        <button
                          key={tUser.id}
                          onClick={() => {
                            onSelectUser(tUser);
                            setIsOpen(false);
                          }}
                          className={`text-left px-2 py-1.5 rounded text-xs truncate transition-colors ${
                            isSelected
                              ? 'bg-emerald-100 font-bold text-emerald-900'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {tUser.fullName}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="p-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Current SY: 2026–2027</span>
              <span className="text-emerald-700 font-medium">Sacred Heart Academy</span>
            </div>
          </div>
        </>
      )}

      {/* Reset Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <div className="p-2 bg-amber-100 rounded-xl">
                <RefreshCw className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reset School Database</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              This will restore all authentic Sacred Heart Academy data, including the 17 faculty teachers, official officials (Head Atty. Piano, Principal Ellen Baider, Registrar Ruben Martirez), timetable assignments, and curriculum.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
