import React from 'react';
import { User, SchoolProfile, UserRole } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  Settings,
  Bell,
  Megaphone,
  Briefcase,
  Layers,
  MapPin,
  ClipboardList,
  FolderOpen,
  Award,
  ShieldCheck,
  User as UserIcon,
  FileSpreadsheet,
  Compass,
  Building2,
  DoorOpen,
  FileCheck2,
  FileText,
  UserCog,
  ShieldAlert,
  UserCheck,
  Clock,
} from 'lucide-react';
export type NavTab =
  | 'dashboard'
  | 'students'
  | 'enrollment'
  | 'teachers'
  | 'subjects'
  | 'grade_levels'
  | 'tracks_strands'
  | 'sections'
  | 'schedules'
  | 'rooms'
  | 'grades'
  | 'announcements'
  | 'reports'
  | 'users'
  | 'audit_logs'
  | 'school_profile'
  | 'settings'
  | 'my_classes'
  | 'my_students'
  | 'my_subjects'
  | 'my_schedule'
  | 'my_grades'
  | 'academic_overview'
  | 'school_overview'
  | 'profile' | 'requests' | 'my_requests'
  | 'records_archive';

interface SidebarProps {
  currentUser: User;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  schoolProfile: SchoolProfile;
}

interface MenuItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  schoolProfile,
}) => {
  const getMenuItemsForRole = (role: UserRole): MenuItem[] => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'teachers', label: 'Teachers', icon: Users },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'grade_levels', label: 'Grade Levels', icon: Layers },
          { id: 'tracks_strands', label: 'Tracks & Strands', icon: Compass },
          { id: 'sections', label: 'Sections', icon: Building2 },
          { id: 'schedules', label: 'Schedules', icon: CalendarDays },
          { id: 'rooms', label: 'Rooms', icon: DoorOpen },
          { id: 'grades', label: 'Grades', icon: FileCheck2 },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'users', label: 'Users & Roles', icon: UserCog },
          { id: 'audit_logs', label: 'Audit Logs', icon: ShieldAlert },
          { id: 'school_profile', label: 'School Profile', icon: Award },
          { id: 'requests', label: 'Document Requests', icon: FileSpreadsheet },
          { id: 'records_archive', label: 'Records Archive', icon: FolderOpen },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      case 'HEAD':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'school_overview', label: 'School Overview', icon: Building2 },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'teachers', label: 'Teachers', icon: Users },
          { id: 'schedules', label: 'Schedules & Timetable', icon: CalendarDays },
          { id: 'grades', label: 'Academic Records', icon: FileCheck2 },
          { id: 'reports', label: 'Official Reports', icon: FileText },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'records_archive', label: 'Records Archive', icon: FolderOpen },
          { id: 'profile', label: 'Executive Profile', icon: Award },
        ];

      case 'PRINCIPAL':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'academic_overview', label: 'Academic Overview', icon: Layers },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'teachers', label: 'Teachers', icon: Users },
          { id: 'grades', label: 'Grade Approvals', icon: FileCheck2, badge: 'Review' },
          { id: 'schedules', label: 'Schedules', icon: CalendarDays },
          { id: 'reports', label: 'Academic Reports', icon: FileText },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'records_archive', label: 'Records Archive', icon: FolderOpen },
          { id: 'profile', label: 'Profile', icon: UserCheck },
        ];

      case 'REGISTRAR':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Student Records', icon: GraduationCap },
          { id: 'enrollment', label: 'Enrollment Center', icon: ClipboardList, badge: 'SY 26-27' },
          { id: 'sections', label: 'Sections', icon: Building2 },
          { id: 'grades', label: 'Academic Records', icon: FileCheck2 },
          { id: 'reports', label: 'Master Lists & SF10', icon: FileText },
          { id: 'requests', label: 'Document Requests', icon: FileSpreadsheet },
          { id: 'records_archive', label: 'Records Archive', icon: FolderOpen },
          { id: 'profile', label: 'Registrar Profile', icon: Award },
        ];

      case 'TEACHER':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'my_classes', label: 'My Classes', icon: Building2 },
          { id: 'my_students', label: 'My Students', icon: Users },
          { id: 'my_subjects', label: 'My Subjects', icon: BookOpen },
          { id: 'my_schedule', label: 'My Schedule', icon: Clock },
          { id: 'grades', label: 'Grade Encoding', icon: FileCheck2 },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'records_archive', label: 'My Records & Uploads', icon: FolderOpen },
          { id: 'profile', label: 'My Profile', icon: UserCheck },
        ];

      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'My Profile', icon: GraduationCap },
          { id: 'my_subjects', label: 'My Subjects', icon: BookOpen },
          { id: 'my_grades', label: 'My Grades (Form 138)', icon: Award },
          { id: 'my_schedule', label: 'My Schedule', icon: CalendarDays },
          { id: 'requests', label: 'Document Requests', icon: FileSpreadsheet },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];

      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
    }
  };

  const menuItems = getMenuItemsForRole(currentUser.role);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-main-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print shadow-lg lg:shadow-none`}
      >
        {/* User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {currentUser.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</span>
              <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider">
                {currentUser.role === 'HEAD'
                  ? 'School Head'
                  : currentUser.role === 'PRINCIPAL'
                  ? 'Principal'
                  : currentUser.role === 'REGISTRAR'
                  ? 'Registrar'
                  : currentUser.role === 'ADMIN'
                  ? 'Administrator'
                  : currentUser.role === 'TEACHER'
                  ? 'Faculty Teacher'
                  : 'Student'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Navigation
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-200' : 'text-slate-400 group-hover:text-emerald-700'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight ${
                      isActive ? 'bg-emerald-900 text-emerald-100' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* School Footer Branding */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 px-2 py-1">
            <SchoolLogo size="xs" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider font-seal">
                Sacred Heart Academy
              </span>
              <span className="text-[9px] text-slate-400">Garchitorena, Camarines Sur</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
