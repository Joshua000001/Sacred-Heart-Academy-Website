import React from 'react';
import {
  Student,
  Teacher,
  Subject,
  Section,
  GradeLevel,
  GradeRecord,
  Announcement,
  AuditLog,
  TrackProgram,
} from '../../types';
import {
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  FileCheck2,
  Megaphone,
  Activity,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  sections: Section[];
  gradeLevels: GradeLevel[];
  tracks: TrackProgram[];
  grades: GradeRecord[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  teachers,
  subjects,
  sections,
  gradeLevels,
  tracks,
  grades,
  announcements,
  auditLogs,
  onNavigateTab,
}) => {
  // Compute metrics
  const activeStudents = students.filter((s) => s.enrollmentStatus === 'Active');
  const pendingGrades = grades.filter((g) => g.status === 'Submitted' || g.status === 'Draft');

  const gradeCounts = gradeLevels.map((gl) => ({
    level: gl.name,
    count: students.filter((s) => s.gradeLevelId === gl.id).length,
    category: gl.category,
  }));

  const acadStrandCount = students.filter((s) => s.trackProgramId === 'track-acad').length;
  const techProCount = students.filter((s) => s.trackProgramId === 'track-techpro').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Sacred Heart Academy Administration Console</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            Institutional Master Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            Centralized academic, faculty, timetable scheduling, and registrar control for School Year 2026–2027.
          </p>
        </div>
      </div>

      {/* Primary Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{activeStudents.length}</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">JHS & SHS Learners</p>
        </div>

        <div
          onClick={() => onNavigateTab('teachers')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty Teachers</span>
            <div className="p-2 bg-purple-100 text-purple-800 rounded-lg group-hover:bg-purple-800 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{teachers.length}</span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">17 Faculty</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Assigned Timetable Staff</p>
        </div>

        <div
          onClick={() => onNavigateTab('subjects')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Subjects</span>
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg group-hover:bg-blue-800 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{subjects.length}</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Curricular</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Core, JHS, TechPro & SHS</p>
        </div>

        <div
          onClick={() => onNavigateTab('sections')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Sections</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg group-hover:bg-amber-800 group-hover:text-white transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{sections.length}</span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Allocated</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">With Designated Advisers</p>
        </div>
      </div>

      {/* Grade Levels & Senior High Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Student Enrollment by Grade Level</h3>
              <p className="text-xs text-slate-500">Junior High School (7-10) and Senior High School (11-12)</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>View Full Report</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {gradeCounts.map((gc) => (
              <div
                key={gc.level}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center hover:bg-emerald-50/60 transition-colors"
              >
                <span className="block text-[10px] font-bold text-slate-500 uppercase">{gc.category}</span>
                <span className="block text-xs font-bold text-slate-800 mt-0.5">{gc.level}</span>
                <span className="block text-xl font-extrabold text-emerald-900 mt-1">{gc.count}</span>
                <span className="block text-[10px] text-slate-400">Students</span>
              </div>
            ))}
          </div>

          {/* Senior High Breakdown Banner */}
          <div className="mt-4 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-800 text-white rounded-lg">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">Senior High School Program Distribution</span>
                <span className="text-[11px] text-emerald-700 block">
                  Configured pathways: Academic Strand & TechPro
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="px-3 py-1.5 bg-white rounded-lg border border-emerald-200 shadow-2xs text-center">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Academic Strand</span>
                <span className="text-sm font-extrabold text-emerald-900">{acadStrandCount} Enrolled</span>
              </div>
              <div className="px-3 py-1.5 bg-white rounded-lg border border-emerald-200 shadow-2xs text-center">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">TechPro Program</span>
                <span className="text-sm font-extrabold text-emerald-900">{techProCount} Enrolled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks / Workflow Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Academic Approvals</h3>
              <span className="text-[11px] px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full">
                {pendingGrades.length} Pending
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Teacher grade submissions awaiting verification, approval by Principal Ellen Baider, or publishing.
            </p>

            <div className="space-y-2.5">
              <div
                onClick={() => onNavigateTab('grades')}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold text-slate-800">Grade Submissions Queue</span>
                </div>
                <span className="font-bold text-emerald-900">{pendingGrades.length} Records</span>
              </div>

              <div
                onClick={() => onNavigateTab('schedules')}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" />
                  <span className="font-semibold text-slate-800">Timetable Conflict Validator</span>
                </div>
                <span className="font-bold text-emerald-800">Active</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('grades')}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              Review Grade Submissions
            </button>
          </div>
        </div>
      </div>

      {/* Announcements & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">Institutional Announcements</h3>
            </div>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Manage Board
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">{ann.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">
                    {ann.targetAudience}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Author: {ann.authorName} ({ann.authorRole})</span>
                  <span>{ann.publishDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit Activities */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">System Audit Trail</h3>
            </div>
            <button
              onClick={() => onNavigateTab('audit_logs')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Full Log ({auditLogs.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start gap-2.5 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
