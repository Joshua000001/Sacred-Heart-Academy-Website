import React, { useRef } from 'react';
import {
  Student,
  GradeRecord,
  Subject,
  Section,
  GradeLevel,
  Schedule,
  Teacher,
  SchoolProfile,
  Announcement,
} from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { formatTime12h } from '../../services/storage';
import {
  GraduationCap,
  Award,
  BookOpen,
  CalendarDays,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface StudentPortalProps {
  currentStudent: Student;
  grades: GradeRecord[];
  subjects: Subject[];
  sections: Section[];
  gradeLevels: GradeLevel[];
  schedules: Schedule[];
  teachers: Teacher[];
  schoolProfile: SchoolProfile;
  announcements: Announcement[];
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  grades,
  subjects,
  sections,
  gradeLevels,
  schedules,
  teachers,
  schoolProfile,
  announcements,
}) => {
  const currentGradeLevel = gradeLevels.find((gl) => gl.id === currentStudent.gradeLevelId);
  const currentSection = sections.find((s) => s.id === currentStudent.sectionId);
  const classAdviser = teachers.find((t) => t.id === currentSection?.adviserTeacherId);

  // Student schedules (based on their section)
  const studentSchedules = schedules.filter((s) => s.sectionId === currentStudent.sectionId);

  // Filter subjects for the student's grade level
  const gradeSubjects = subjects.filter((s) => s.gradeLevelId === currentStudent.gradeLevelId);

  // Student grades
  const studentGrades = grades.filter((g) => g.studentId === currentStudent.id);

  // Calculate General Average
  const finalGradesWithValues = studentGrades
    .map((g) => g.finalGrade)
    .filter((g): g is number => g !== null && g !== undefined);

  const generalAverage =
    finalGradesWithValues.length > 0
      ? (finalGradesWithValues.reduce((a, b) => a + b, 0) / finalGradesWithValues.length).toFixed(2)
      : null;

  let generalRemarks = 'Promoted';
  if (generalAverage) {
    const numAvg = parseFloat(generalAverage);
    if (numAvg >= 95) generalRemarks = 'Promoted with High Honors';
    else if (numAvg >= 90) generalRemarks = 'Promoted with Honors';
    else if (numAvg < 75) generalRemarks = 'Retained / Remedial Required';
  }

  const handlePrintForm138 = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Student Top Profile Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden no-print">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-900 font-extrabold flex items-center justify-center text-xl shadow-md">
              {currentStudent.firstName[0]}
              {currentStudent.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 uppercase tracking-wider">
                  Enrolled Learner
                </span>
                <span className="text-xs text-emerald-300 font-mono-code">LRN: {currentStudent.lrn}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white mt-1">
                {currentStudent.fullName}
              </h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {currentGradeLevel?.name} • {currentSection?.name} • Class Adviser:{' '}
                <span className="font-semibold text-white">{classAdviser?.fullName || 'Teacher Austin'}</span>
              </p>
            </div>
          </div>

          <button
            id="btn-print-form138"
            onClick={handlePrintForm138}
            className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-md self-start md:self-auto"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>Print Official Form 138</span>
          </button>
        </div>
      </div>

      {/* Official DepEd Form 138 Printable Report Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 print:p-0 print:border-none print:shadow-none">
        {/* Card Official School Header */}
        <div className="text-center border-b-2 border-emerald-950 pb-5 mb-6">
          <div className="flex justify-center mb-2">
            <SchoolLogo size="lg" />
          </div>
          <h2 className="font-seal text-xl sm:text-2xl font-extrabold text-emerald-950 tracking-wider uppercase">
            {schoolProfile.name}
          </h2>
          <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
            {schoolProfile.location} • Region V • Division of Camarines Sur
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-emerald-900 text-white rounded-md text-xs font-bold tracking-widest uppercase">
            Official Learner Progress Report Card (Form 138)
          </div>
          <p className="text-[11px] font-bold text-slate-500 mt-1">School Year 2026–2027</p>
        </div>

        {/* Student Biographical Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Learner Full Name</span>
            <span className="font-bold text-slate-900">{currentStudent.fullName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Learner Reference No.</span>
            <span className="font-mono-code font-bold text-slate-900">{currentStudent.lrn}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Grade & Section</span>
            <span className="font-bold text-slate-900">
              {currentGradeLevel?.name} – {currentSection?.name}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Sex / Age</span>
            <span className="font-bold text-slate-900">{currentStudent.sex} • 14 yrs</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Parent / Guardian</span>
            <span className="font-medium text-slate-800">
              {currentStudent.parentGuardian} ({currentStudent.guardianContact})
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Class Adviser</span>
            <span className="font-medium text-slate-800">{classAdviser?.fullName || 'Austin'}</span>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200">Learning Areas / Subjects</th>
                <th className="py-2.5 px-2 text-center w-16 border-r border-slate-200">Q1</th>
                <th className="py-2.5 px-2 text-center w-16 border-r border-slate-200">Q2</th>
                <th className="py-2.5 px-2 text-center w-16 border-r border-slate-200">Q3</th>
                <th className="py-2.5 px-2 text-center w-16 border-r border-slate-200">Q4</th>
                <th className="py-2.5 px-3 text-center w-24 border-r border-slate-200">Final Grade</th>
                <th className="py-2.5 px-3 text-center w-36">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {gradeSubjects.map((sub) => {
                const gr = studentGrades.find((g) => g.subjectId === sub.id);

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      <span className="font-bold text-slate-900">{sub.subjectName}</span>
                      <span className="text-[10px] text-slate-400 font-mono-code block">{sub.subjectCode}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 font-semibold">
                      {gr?.q1 !== null && gr?.q1 !== undefined ? gr.q1 : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 font-semibold">
                      {gr?.q2 !== null && gr?.q2 !== undefined ? gr.q2 : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 font-semibold">
                      {gr?.q3 !== null && gr?.q3 !== undefined ? gr.q3 : '—'}
                    </td>
                    <td className="py-2.5 px-2 text-center border-r border-slate-200 font-semibold">
                      {gr?.q4 !== null && gr?.q4 !== undefined ? gr.q4 : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center border-r border-slate-200 font-extrabold text-sm text-emerald-950">
                      {gr?.finalGrade !== null && gr?.finalGrade !== undefined ? gr.finalGrade : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          gr?.remarks?.includes('Passed')
                            ? 'bg-emerald-100 text-emerald-900'
                            : gr?.remarks === 'Failed'
                            ? 'bg-rose-100 text-rose-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {gr?.remarks || 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* General Average Summary Row */}
              <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                <td className="py-3 px-3 text-right uppercase tracking-wider text-slate-700 border-r border-slate-200">
                  General Average:
                </td>
                <td colSpan={4} className="border-r border-slate-200"></td>
                <td className="py-3 px-3 text-center text-base font-extrabold text-emerald-950 border-r border-slate-200">
                  {generalAverage || '—'}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2.5 py-1 rounded bg-emerald-800 text-white text-xs font-extrabold">
                    {generalRemarks}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grading Scale Guide */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-500 space-y-1 mb-8">
          <span className="font-bold text-slate-700 block uppercase">Grading Scale & Performance Descriptors:</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <span>90–100: Outstanding (Passed with Honors)</span>
            <span>85–89: Very Satisfactory</span>
            <span>80–84: Satisfactory</span>
            <span>75–79: Fairly Satisfactory (Passed)</span>
          </div>
        </div>

        {/* Official Signatures Grid */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
          <div>
            <div className="h-10"></div>
            <div className="font-bold text-slate-900 uppercase border-t border-slate-400 pt-1">
              {classAdviser?.fullName || 'Austin Mercado'}
            </div>
            <div className="text-[10px] text-slate-500">Class Adviser</div>
          </div>

          <div>
            <div className="h-10"></div>
            <div className="font-bold text-slate-900 uppercase border-t border-slate-400 pt-1">
              {schoolProfile.principal}
            </div>
            <div className="text-[10px] text-slate-500">Principal</div>
          </div>

          <div>
            <div className="h-10"></div>
            <div className="font-bold text-slate-900 uppercase border-t border-slate-400 pt-1">
              {schoolProfile.schoolHead}
            </div>
            <div className="text-[10px] text-slate-500">School Head</div>
          </div>
        </div>
      </div>

      {/* Class Schedule Grid (Non-Printable in Screen Mode) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 no-print">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-emerald-800" />
          <h3 className="text-sm font-bold text-slate-900">My Class Timetable & Schedule</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {studentSchedules.map((sch) => {
            const sub = subjects.find((s) => s.id === sch.subjectId);
            const tch = teachers.find((t) => t.id === sch.teacherId);

            return (
              <div key={sch.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                  <span className="uppercase">{sch.dayOfWeek}</span>
                  <span>{formatTime12h(sch.startTime)} – {formatTime12h(sch.endTime)}</span>
                </div>
                <div className="font-bold text-slate-900">{sub?.subjectName}</div>
                <div className="text-slate-500 text-[11px]">Instructor: {tch?.fullName}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
