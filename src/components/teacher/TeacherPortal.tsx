import React from 'react';
import {
  Teacher,
  TeacherAssignment,
  Subject,
  Section,
  Schedule,
  Student,
  GradeRecord,
  Announcement,
  User,
} from '../../types';
import { formatTime12h } from '../../services/storage';
import {
  Users,
  BookOpen,
  CalendarDays,
  FileCheck2,
  Clock,
  Building2,
  Megaphone,
  Sparkles,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface TeacherPortalProps {
  currentTeacher: Teacher;
  assignments: TeacherAssignment[];
  subjects: Subject[];
  sections: Section[];
  schedules: Schedule[];
  students: Student[];
  grades: GradeRecord[];
  announcements: Announcement[];
  onNavigateTab: (tab: any) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentTeacher,
  assignments,
  subjects,
  sections,
  schedules,
  students,
  grades,
  announcements,
  onNavigateTab,
}) => {
  const teacherAssignments = assignments.filter((a) => a.teacherId === currentTeacher.id);
  const teacherSchedules = schedules.filter((s) => s.teacherId === currentTeacher.id);

  // Sections taught by this teacher
  const taughtSectionIds = Array.from(new Set(teacherAssignments.map((a) => a.sectionId)));
  const taughtSections = sections.filter((s) => taughtSectionIds.includes(s.id));

  // Students taught
  const taughtStudents = students.filter((s) => taughtSectionIds.includes(s.sectionId));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Faculty Academic Station • SY 2026–2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            Welcome, Teacher {currentTeacher.fullName}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
            Specialization: <span className="font-semibold text-white">{currentTeacher.specialization || 'Faculty Instructor'}</span> • Faculty ID: <span className="font-mono-code">{currentTeacher.teacherId}</span>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Classes</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{taughtSections.length}</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Sections</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subjects Taught</span>
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{teacherAssignments.length}</span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Courses</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Learners</span>
            <div className="p-2 bg-purple-100 text-purple-800 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{taughtStudents.length}</span>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Students</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Periods</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{teacherSchedules.length}</span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Timetable</span>
          </div>
        </div>
      </div>

      {/* Teaching Load & Grade Encoding Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes & Subjects */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">My Subject & Section Assignments</h3>
              <p className="text-xs text-slate-500">Official teaching assignments for School Year 2026–2027</p>
            </div>
            <button
              onClick={() => onNavigateTab('grades')}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Encode Grades</span>
            </button>
          </div>

          <div className="space-y-3">
            {teacherAssignments.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400">No subject assignments registered yet.</p>
            ) : (
              teacherAssignments.map((a) => {
                const sub = subjects.find((s) => s.id === a.subjectId);
                const sec = sections.find((s) => s.id === a.sectionId);
                const secStudentCount = students.filter((s) => s.sectionId === a.sectionId).length;

                return (
                  <div
                    key={a.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-code font-bold text-emerald-800">{sub?.subjectCode}</span>
                        <span className="text-xs font-bold text-slate-900">{sub?.subjectName}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{sec?.name}</span>
                        <span>•</span>
                        <span>{secStudentCount} Enrolled Students</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTab('grades')}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>Gradebook</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* My Weekly Schedule Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule</h3>
            <button
              onClick={() => onNavigateTab('my_schedule')}
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              Full Schedule
            </button>
          </div>

          <div className="space-y-2.5">
            {teacherSchedules.slice(0, 5).map((sch) => {
              const sub = subjects.find((s) => s.id === sch.subjectId);
              const sec = sections.find((s) => s.id === sch.sectionId);

              return (
                <div
                  key={sch.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{sub?.subjectName}</div>
                    <div className="text-[11px] text-slate-500">{sec?.name} • {sch.dayOfWeek}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {formatTime12h(sch.startTime)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
