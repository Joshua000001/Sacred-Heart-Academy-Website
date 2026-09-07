import React, { useState } from 'react';
import {
  Student,
  Teacher,
  Subject,
  Section,
  GradeLevel,
  GradeRecord,
  Schedule,
  TeacherAssignment,
  SchoolProfile,
} from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { formatTime12h } from '../../services/storage';
import {
  FileText,
  Printer,
  Download,
  Users,
  Award,
  Calendar,
  Layers,
  Building2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ReportsViewerProps {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  sections: Section[];
  gradeLevels: GradeLevel[];
  grades: GradeRecord[];
  schedules: Schedule[];
  assignments: TeacherAssignment[];
  schoolProfile: SchoolProfile;
}

export const ReportsViewer: React.FC<ReportsViewerProps> = ({
  students,
  teachers,
  subjects,
  sections,
  gradeLevels,
  grades,
  schedules,
  assignments,
  schoolProfile,
}) => {
  const [reportType, setReportType] = useState<
    'MASTERLIST' | 'TEACHING_LOAD' | 'HONOR_ROLL' | 'SCHEDULE_MATRIX'
  >('MASTERLIST');

  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedGradeId, setSelectedGradeId] = useState<string>('ALL');

  const currentSection = sections.find((s) => s.id === selectedSectionId);
  const sectionStudents = students.filter((s) => s.sectionId === selectedSectionId);

  // Compute Honor Roll
  const studentHonorRoll = students
    .map((s) => {
      const sGrades = grades.filter((g) => g.studentId === s.id && g.finalGrade !== null && g.finalGrade !== undefined);
      if (sGrades.length === 0) return null;
      const avg = sGrades.reduce((sum, g) => sum + (g.finalGrade || 0), 0) / sGrades.length;
      let honor = '';
      if (avg >= 95) honor = 'With High Honors';
      else if (avg >= 90) honor = 'With Honors';

      const sec = sections.find((sec) => sec.id === s.sectionId);
      const gr = gradeLevels.find((gl) => gl.id === s.gradeLevelId);

      return {
        student: s,
        average: avg.toFixed(2),
        honor,
        sectionName: sec?.name || '',
        gradeName: gr?.name || '',
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null && entry.honor !== '')
    .sort((a, b) => parseFloat(b.average) - parseFloat(a.average));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Official Reports & Masterlists</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            DepEd compliant enrollment registries, faculty teaching workloads, and academic honor rankings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 no-print">
        <button
          onClick={() => setReportType('MASTERLIST')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'MASTERLIST' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Section Masterlist
        </button>
        <button
          onClick={() => setReportType('TEACHING_LOAD')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'TEACHING_LOAD' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Faculty Teaching Load (17 Teachers)
        </button>
        <button
          onClick={() => setReportType('HONOR_ROLL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            reportType === 'HONOR_ROLL' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Academic Honor Roll
        </button>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 print:p-0 print:border-none">
        {/* Official Header */}
        <div className="text-center border-b-2 border-emerald-950 pb-5 mb-6">
          <div className="flex justify-center mb-2">
            <SchoolLogo size="md" />
          </div>
          <h2 className="font-seal text-xl font-extrabold text-emerald-950 tracking-wider uppercase">
            {schoolProfile.name}
          </h2>
          <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
            {schoolProfile.location} • SY 2026–2027
          </p>
          <div className="mt-2 inline-block px-3 py-0.5 bg-emerald-900 text-white rounded text-xs font-bold uppercase tracking-wider">
            {reportType === 'MASTERLIST' && `Official Section Master List: ${currentSection?.name}`}
            {reportType === 'TEACHING_LOAD' && 'Faculty Teaching Load & Timetable Allocation Summary'}
            {reportType === 'HONOR_ROLL' && 'Academic Honor Roll & Academic Excellence Roster'}
          </div>
        </div>

        {/* 1. MASTERLIST REPORT */}
        {reportType === 'MASTERLIST' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between no-print mb-3">
              <label className="text-xs font-bold text-slate-700">Select Section:</label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">LRN</th>
                  <th className="py-2.5 px-3 text-center">Sex</th>
                  <th className="py-2.5 px-3">Parent / Guardian</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionStudents.map((s, idx) => (
                  <tr key={s.id}>
                    <td className="py-2 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{s.fullName}</td>
                    <td className="py-2 px-3 font-mono-code text-slate-600">{s.lrn}</td>
                    <td className="py-2 px-3 text-center">{s.sex}</td>
                    <td className="py-2 px-3">{s.parentGuardian}</td>
                    <td className="py-2 px-3">{s.guardianContact}</td>
                    <td className="py-2 px-3 text-center font-semibold text-emerald-800">{s.enrollmentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. TEACHING LOAD REPORT */}
        {reportType === 'TEACHING_LOAD' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Faculty Instructor</th>
                  <th className="py-2.5 px-3">Faculty ID</th>
                  <th className="py-2.5 px-3">Specialization</th>
                  <th className="py-2.5 px-3">Assigned Courses & Sections</th>
                  <th className="py-2.5 px-3 text-center">Weekly Periods</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((t) => {
                  const tAssignments = assignments.filter((a) => a.teacherId === t.id);
                  const tSchedules = schedules.filter((s) => s.teacherId === t.id);

                  return (
                    <tr key={t.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{t.fullName}</td>
                      <td className="py-2.5 px-3 font-mono-code text-emerald-800">{t.teacherId}</td>
                      <td className="py-2.5 px-3 text-slate-600">{t.specialization || 'Junior High Faculty'}</td>
                      <td className="py-2.5 px-3">
                        <div className="space-y-0.5">
                          {tAssignments.map((a) => {
                            const sub = subjects.find((s) => s.id === a.subjectId);
                            const sec = sections.find((sec) => sec.id === a.sectionId);
                            return (
                              <span key={a.id} className="block text-[11px] text-slate-700">
                                • {sub?.subjectName} ({sec?.name})
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">{tSchedules.length}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-emerald-800">{t.accountStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. HONOR ROLL REPORT */}
        {reportType === 'HONOR_ROLL' && (
          <div className="space-y-4">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                  <th className="py-2.5 px-3">Learner Name</th>
                  <th className="py-2.5 px-3">LRN</th>
                  <th className="py-2.5 px-3">Grade & Section</th>
                  <th className="py-2.5 px-3 text-center">General Average</th>
                  <th className="py-2.5 px-3 text-center">Academic Distinction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentHonorRoll.map((hr, idx) => (
                  <tr key={hr.student.id}>
                    <td className="py-2 px-3 text-center font-bold text-emerald-900">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{hr.student.fullName}</td>
                    <td className="py-2 px-3 font-mono-code text-slate-500">{hr.student.lrn}</td>
                    <td className="py-2 px-3">
                      {hr.gradeName} – {hr.sectionName}
                    </td>
                    <td className="py-2 px-3 text-center font-extrabold text-slate-900 text-sm">{hr.average}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        {hr.honor}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-8 text-center text-xs">
          <div>
            <div className="h-10"></div>
            <div className="font-bold text-slate-900 uppercase border-t border-slate-400 pt-1">
              {schoolProfile.principal}
            </div>
            <div className="text-[10px] text-slate-500">School Principal</div>
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
    </div>
  );
};
