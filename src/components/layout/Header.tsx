import React from 'react';
import { User, SchoolProfile, SchoolYear } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  Menu,
  X,
  Bell,
  Calendar,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  schoolProfile: SchoolProfile;
  activeSchoolYear: SchoolYear;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onOpenAnnouncements: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  schoolProfile,
  activeSchoolYear,
  onToggleSidebar,
  isSidebarOpen,
  onOpenAnnouncements,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-emerald-950 text-white border-b border-emerald-900/80 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <div className="flex items-center gap-3">
            <button
              id="btn-sidebar-toggle"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/80 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <SchoolLogo size="sm" theme="white" />
              <div className="flex flex-col">
                <h1 className="font-seal text-sm sm:text-base font-extrabold tracking-wide uppercase text-white leading-tight">
                  {schoolProfile.name}
                </h1>
                <span className="text-[11px] text-emerald-300/90 font-medium hidden sm:inline leading-none">
                  {schoolProfile.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>SY {activeSchoolYear.name}</span>
            </div>

            <button
              id="btn-header-announcements"
              onClick={onOpenAnnouncements}
              className="relative p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 transition-colors"
              title="Announcements & Notices"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>

            {/* Display current account only. There is NO role/account switching after login. */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-700/60 bg-emerald-900/60 text-white"
              title="Signed-in account"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-600/60">
                <UserIcon className="w-3.5 h-3.5 text-emerald-200" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold">{currentUser.fullName}</span>
                <span className="text-[9px] text-emerald-300 uppercase tracking-wider">{currentUser.role}</span>
              </div>
            </div>

            <button
              id="btn-header-logout"
              onClick={onLogout}
              className="p-2 rounded-lg text-emerald-200 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
