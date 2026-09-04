import React, { useState } from 'react';
import {
  GradeRecord,
  Student,
  Subject,
  Section,
  Teacher,
  User,
  GradeStatus,
} from '../../types';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  Eye,
  Edit3,
  Filter,
  Save,
  Download,
  Printer,
  Sparkles,
  Search,
  FileSpreadsheet,
} from 'lucide-react';
import { DepEdClassRecordModal } from './DepEdClassRecordModal';

interface GradeManagementProps {
  grades: GradeRecord[];
  students: Student[];
  subjects: Subject[];
  sections: Section[];
  teachers: Teacher[];
  currentUser: User;
  onSaveBatchGrades: (
    records: GradeRecord[],
    actionType: 'SAVE_DRAFT' | 'SUBMIT' | 'APPROVE' | 'RETURN' | 'PUBLISH',
    feedback?: string
  ) => void;
}

export const GradeManagement: React.FC<GradeManagementProps> = ({
  grades,
  students,
  subjects,
  sections,
  teachers,
  currentUser,
  onSaveBatchGrades,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [returnFeedbackModal, setReturnFeedbackModal] = useState(false);
  const [returnNote, setReturnNote] = useState('');
  
  const [classRecordTerm, setClassRecordTerm] = useState<'q1'|'q2'|'q3'|'q4'|null>(null);

  // Find students in the selected section
  const sectionStudents = students.filter((s) => s.sectionId === selectedSectionId);

  // Local editable draft state for the selected grid
  const [gridGrades, setGridGrades] = useState<{
    [studentId: string]: {
      q1: string;
      q2: string;
      q3: string;
      q4: string;
    };
  }>({});
  
  const [rawScoresLocal, setRawScoresLocal] = useState<{
    [studentId: string]: any;
  }>({});

  // Populate local grid state when section/subject changes
  React.useEffect(() => {
    const map: { [studentId: string]: { q1: string; q2: string; q3: string; q4: string } } = {};
    const rsMap: { [studentId: string]: any } = {};
    for (const student of sectionStudents) {
      const existing = grades.find(
        (g) => g.studentId === student.id && g.subjectId === selectedSubjectId && g.sectionId === selectedSectionId
      );
      map[student.id] = {
        q1: existing?.q1 !== undefined && existing?.q1 !== null ? existing.q1.toString() : '',
        q2: existing?.q2 !== undefined && existing?.q2 !== null ? existing.q2.toString() : '',
        q3: existing?.q3 !== undefined && existing?.q3 !== null ? existing.q3.toString() : '',
        q4: existing?.q4 !== undefined && existing?.q4 !== null ? existing.q4.toString() : '',
      };
      if (existing?.rawScores) {
        rsMap[student.id] = existing.rawScores;
      }
    }
    setGridGrades(map);
    setRawScoresLocal(rsMap);
  }, [selectedSectionId, selectedSubjectId, grades]);

  const handleCellChange = (studentId: string, quarter: 'q1' | 'q2' | 'q3' | 'q4', value: string) => {
    // Only numeric or empty
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) <= 100)) {
      setGridGrades((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [quarter]: value,
        },
      }));
    }
  };

  const calculateFinalAndRemarks = (q1?: number | null, q2?: number | null, q3?: number | null, q4?: number | null) => {
    const quarters = [q1, q2, q3, q4].filter((q): q is number => q !== null && q !== undefined);
    if (quarters.length === 0) return { finalGrade: null, remarks: 'No Grades' };

    const avg = Math.round(quarters.reduce((sum, val) => sum + val, 0) / quarters.length);
    let remarks = 'Passed';
    if (avg >= 95) remarks = 'Passed with High Honors';
    else if (avg >= 90) remarks = 'Passed with Honors';
    else if (avg < 75) remarks = 'Failed';

    return { finalGrade: avg, remarks };
  };

  const handleSaveClassRecord = (studentId: string, rawScores: any, computedGrade: number) => {
    if (!classRecordTerm) return;
    
    // Update local grid state
    setGridGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [classRecordTerm]: computedGrade > 0 ? computedGrade.toString() : ''
      }
    }));
    
    setRawScoresLocal(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [classRecordTerm]: rawScores
      }
    }));
  };

  const buildRecordsToSave = (): GradeRecord[] => {
    return sectionStudents.map((s) => {
      const gState = gridGrades[s.id] || { q1: '', q2: '', q3: '', q4: '' };
      const q1Val = gState.q1 !== '' ? parseInt(gState.q1, 10) : null;
      const q2Val = gState.q2 !== '' ? parseInt(gState.q2, 10) : null;
      const q3Val = gState.q3 !== '' ? parseInt(gState.q3, 10) : null;
      const q4Val = gState.q4 !== '' ? parseInt(gState.q4, 10) : null;

      const { finalGrade, remarks } = calculateFinalAndRemarks(q1Val, q2Val, q3Val, q4Val);
      const existing = grades.find(
        (g) => g.studentId === s.id && g.subjectId === selectedSubjectId && g.sectionId === selectedSectionId
      );

      return {
        id: existing ? existing.id : `grd-${s.id}-${selectedSubjectId}`,
        studentId: s.id,
        subjectId: selectedSubjectId,
        sectionId: selectedSectionId,
        schoolYearId: 'sy-2026-2027',
        teacherId: currentUser.relatedEntityId || 'tch-austin',
        q1: q1Val,
        q2: q2Val,
        q3: q3Val,
        q4: q4Val,
        finalGrade,
        rawScores: rawScoresLocal[s.id] || existing?.rawScores,
        remarks,
        status: existing?.status || 'Draft',
      };
    });
  };

  const currentSection = sections.find((s) => s.id === selectedSectionId);
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Overall status of the currently selected section/subject sheet
  const activeRecords = grades.filter(
    (g) => g.sectionId === selectedSectionId && g.subjectId === selectedSubjectId
  );
  const currentSheetStatus = activeRecords.length > 0 ? activeRecords[0].status : 'Draft';

  const canEditGrades =
    ['ADMIN', 'HEAD', 'PRINCIPAL', 'REGISTRAR', 'TEACHER'].includes(currentUser.role);


  const canApprove =
    currentUser.role === 'ADMIN' || currentUser.role === 'PRINCIPAL' || currentUser.role === 'HEAD';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Official Grade Management & Encoding</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            DepEd-aligned quarterly assessment encoding, submission workflow, and institutional approval
          </p>
        </div>

        {/* Current Sheet Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-slate-500">Sheet Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
              currentSheetStatus === 'Published'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : currentSheetStatus === 'Approved'
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : currentSheetStatus === 'Submitted'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : currentSheetStatus === 'Returned'
                ? 'bg-rose-100 text-rose-900 border-rose-300'
                : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {currentSheetStatus}
          </span>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Target Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700"
          >
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Subject
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700"
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subjectCode} — {sub.subjectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Return Feedback Banner if Returned */}
      {currentSheetStatus === 'Returned' && activeRecords[0]?.returnFeedback && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-900 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Returned for Correction by Academic Administration:</span>
            <p className="mt-0.5 leading-relaxed text-rose-800">{activeRecords[0].returnFeedback}</p>
          </div>
        </div>
      )}

      {/* Grade Spreadsheet Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {currentSection?.name} • {currentSubject?.subjectName} ({currentSubject?.subjectCode})
            </h3>
            <span className="text-[11px] text-slate-500">
              Passing threshold: 75 • Quarterly weights: 25% each
            </span>
          </div>

          {/* Workflow Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {canEditGrades && (
              <div className="relative group mr-2">
                <button className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-200">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>DepEd Class Record</span>
                </button>
                <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                  {['q1', 'q2', 'q3', 'q4'].map(q => {
                    const termNames: Record<string, string> = { q1: '1st Term', q2: '2nd Term', q3: '3rd Term', q4: 'Final' };
                    return (
                    <button 
                      key={q} 
                      onClick={() => setClassRecordTerm(q as 'q1'|'q2'|'q3'|'q4')}
                      className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 text-slate-700 rounded"
                    >
                      {termNames[q]} Class Record
                    </button>
                    );
                  })}
                </div>
              </div>
            )}
            {canEditGrades && (
              <>
                <button
                  onClick={() => onSaveBatchGrades(buildRecordsToSave(), 'SAVE_DRAFT')}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={() => onSaveBatchGrades(buildRecordsToSave(), 'SUBMIT')}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Review</span>
                </button>
              </>
            )}

            {canApprove && currentSheetStatus === 'Submitted' && (
              <>
                <button
                  onClick={() => setReturnFeedbackModal(true)}
                  className="px-3 py-1.5 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return for Correction</span>
                </button>
                <button
                  onClick={() => onSaveBatchGrades(buildRecordsToSave(), 'APPROVE')}
                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Grades</span>
                </button>
              </>
            )}

            {canApprove && currentSheetStatus === 'Approved' && (
              <button
                onClick={() => onSaveBatchGrades(buildRecordsToSave(), 'PUBLISH')}
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Publish to Student Portals</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Learner Full Name</th>
                <th className="py-3 px-4">LRN</th>
                <th className="py-3 px-3 text-center w-24">1st Term</th>
                <th className="py-3 px-3 text-center w-24">2nd Term</th>
                <th className="py-3 px-3 text-center w-24">3rd Term</th>
                <th className="py-3 px-3 text-center w-24">Final</th>
                <th className="py-3 px-4 text-center w-28">Final Grade</th>
                <th className="py-3 px-4 text-center">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sectionStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No enrolled students in this section.
                  </td>
                </tr>
              ) : (
                sectionStudents.map((s, idx) => {
                  const gState = gridGrades[s.id] || { q1: '', q2: '', q3: '', q4: '' };
                  const q1N = gState.q1 ? parseInt(gState.q1, 10) : null;
                  const q2N = gState.q2 ? parseInt(gState.q2, 10) : null;
                  const q3N = gState.q3 ? parseInt(gState.q3, 10) : null;
                  const q4N = gState.q4 ? parseInt(gState.q4, 10) : null;
                  const { finalGrade, remarks } = calculateFinalAndRemarks(q1N, q2N, q3N, q4N);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                      <td className="py-3 px-4 font-mono-code text-slate-500">{s.lrn}</td>

                      {/* Q1 */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="text"
                          disabled={!canEditGrades}
                          value={gState.q1}
                          onChange={(e) => handleCellChange(s.id, 'q1', e.target.value)}
                          placeholder="—"
                          className="w-16 py-1 px-2 text-center text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </td>

                      {/* Q2 */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="text"
                          disabled={!canEditGrades}
                          value={gState.q2}
                          onChange={(e) => handleCellChange(s.id, 'q2', e.target.value)}
                          placeholder="—"
                          className="w-16 py-1 px-2 text-center text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </td>

                      {/* Q3 */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="text"
                          disabled={!canEditGrades}
                          value={gState.q3}
                          onChange={(e) => handleCellChange(s.id, 'q3', e.target.value)}
                          placeholder="—"
                          className="w-16 py-1 px-2 text-center text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </td>

                      {/* Q4 */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="text"
                          disabled={!canEditGrades}
                          value={gState.q4}
                          onChange={(e) => handleCellChange(s.id, 'q4', e.target.value)}
                          placeholder="—"
                          className="w-16 py-1 px-2 text-center text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 disabled:bg-slate-100 disabled:text-slate-700"
                        />
                      </td>

                      {/* Final Grade Computed */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-extrabold text-sm ${
                            finalGrade === null
                              ? 'text-slate-400'
                              : finalGrade >= 75
                              ? 'text-emerald-900'
                              : 'text-rose-700'
                          }`}
                        >
                          {finalGrade !== null ? finalGrade : '—'}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            remarks.includes('Passed')
                              ? 'bg-emerald-100 text-emerald-800'
                              : remarks === 'Failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {remarks}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return for Correction Modal */}
      {returnFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-700 mb-3">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Return Grades for Correction</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Specify the discrepancy or remarks for the teacher to rectify before resubmitting.
            </p>
            <textarea
              required
              rows={4}
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              placeholder="e.g. Please verify Quarter 2 computation for student 3 and check incomplete records..."
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-600 focus:outline-none mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReturnFeedbackModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSaveBatchGrades(buildRecordsToSave(), 'RETURN', returnNote);
                  setReturnFeedbackModal(false);
                  setReturnNote('');
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg shadow-sm"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {classRecordTerm && currentSection && currentSubject && (
        <DepEdClassRecordModal
          section={currentSection}
          subject={currentSubject}
          students={sectionStudents}
          grades={grades.filter(g => g.sectionId === selectedSectionId && g.subjectId === selectedSubjectId)}
          term={classRecordTerm}
          onClose={() => setClassRecordTerm(null)}
          onSaveScores={handleSaveClassRecord}
        />
      )}
    </div>
  );
};
