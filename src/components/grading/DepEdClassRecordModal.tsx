import React, { useState, useEffect } from 'react';
import { GradeRecord, Student, Section, Subject } from '../../types';
import { X, Save, FileSpreadsheet } from 'lucide-react';

interface DepEdClassRecordModalProps {
  section: Section;
  subject: Subject;
  students: Student[];
  grades: GradeRecord[];
  term: 'q1' | 'q2' | 'q3' | 'q4';
  onClose: () => void;
  onSaveScores: (studentId: string, rawScores: any, computedGrade: number) => void;
}

export const DepEdClassRecordModal: React.FC<DepEdClassRecordModalProps> = ({
  section,
  subject,
  students,
  grades,
  term,
  onClose,
  onSaveScores,
}) => {
  const [scores, setScores] = useState<Record<string, any>>({});
  
  // Highest Possible Scores (HPS)
  const [hps, setHps] = useState({
    ww1: 20, ww2: 20, ww3: 20, ww4: 20, ww5: 20,
    pt1: 20, pt2: 20, pt3: 20,
    sa1: 30, sa2: 30, te: 40
  });

  useEffect(() => {
    const initialScores: Record<string, any> = {};
    students.forEach(student => {
      const existing = grades.find(g => g.studentId === student.id);
      if (existing?.rawScores?.[term]) {
        initialScores[student.id] = existing.rawScores[term];
      } else {
        initialScores[student.id] = {
          ww1: '', ww2: '', ww3: '', ww4: '', ww5: '',
          pt1: '', pt2: '', pt3: '',
          sa1: '', sa2: '', te: ''
        };
      }
    });
    setScores(initialScores);
  }, [students, grades, term]);

  const handleScoreChange = (studentId: string, field: string, value: string) => {
    if (value === '' || (/^\d+$/.test(value))) {
      setScores(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value
        }
      }));
    }
  };

  const calculateGrade = (studentScores: any) => {
    // Written Works (20%)
    const wwTotal = ['ww1', 'ww2', 'ww3', 'ww4', 'ww5'].reduce((sum, key) => sum + (parseInt(studentScores[key]) || 0), 0);
    const hpsWwTotal = ['ww1', 'ww2', 'ww3', 'ww4', 'ww5'].reduce((sum, key) => sum + hps[key as keyof typeof hps], 0);
    const wwPS = hpsWwTotal ? (wwTotal / hpsWwTotal) * 100 : 0;
    const wwWS = wwPS * 0.20;

    // Performance Tasks (50%)
    const ptTotal = ['pt1', 'pt2', 'pt3'].reduce((sum, key) => sum + (parseInt(studentScores[key]) || 0), 0);
    const hpsPtTotal = ['pt1', 'pt2', 'pt3'].reduce((sum, key) => sum + hps[key as keyof typeof hps], 0);
    const ptPS = hpsPtTotal ? (ptTotal / hpsPtTotal) * 100 : 0;
    const ptWS = ptPS * 0.50;

    // Summative (30%)
    const saTotal = ['sa1', 'sa2', 'te'].reduce((sum, key) => sum + (parseInt(studentScores[key]) || 0), 0);
    const hpsSaTotal = ['sa1', 'sa2', 'te'].reduce((sum, key) => sum + hps[key as keyof typeof hps], 0);
    const saPS = hpsSaTotal ? (saTotal / hpsSaTotal) * 100 : 0;
    const saWS = saPS * 0.30;

    const initialGrade = wwWS + ptWS + saWS;
    
    // Transmutation logic (simplified for DepEd standard approximation)
    let transmutedGrade = 0;
    if (initialGrade >= 100) transmutedGrade = 100;
    else if (initialGrade >= 98.4) transmutedGrade = 99;
    else if (initialGrade >= 96.8) transmutedGrade = 98;
    else if (initialGrade >= 95.2) transmutedGrade = 97;
    else if (initialGrade >= 93.6) transmutedGrade = 96;
    else if (initialGrade >= 92) transmutedGrade = 95;
    else if (initialGrade >= 90.4) transmutedGrade = 94;
    else if (initialGrade >= 88.8) transmutedGrade = 93;
    else if (initialGrade >= 87.2) transmutedGrade = 92;
    else if (initialGrade >= 85.6) transmutedGrade = 91;
    else if (initialGrade >= 84) transmutedGrade = 90;
    else if (initialGrade >= 82.4) transmutedGrade = 89;
    else if (initialGrade >= 80.8) transmutedGrade = 88;
    else if (initialGrade >= 79.2) transmutedGrade = 87;
    else if (initialGrade >= 77.6) transmutedGrade = 86;
    else if (initialGrade >= 76) transmutedGrade = 85;
    else if (initialGrade >= 74.4) transmutedGrade = 84;
    else if (initialGrade >= 72.8) transmutedGrade = 83;
    else if (initialGrade >= 71.2) transmutedGrade = 82;
    else if (initialGrade >= 69.6) transmutedGrade = 81;
    else if (initialGrade >= 68) transmutedGrade = 80;
    else if (initialGrade >= 64) transmutedGrade = 79;
    else if (initialGrade >= 60) transmutedGrade = 75;
    else transmutedGrade = 74; // simplified failing

    return { wwTotal, ptTotal, saTotal, initialGrade: initialGrade.toFixed(2), transmutedGrade };
  };

  const handleSave = () => {
    students.forEach(student => {
      const studentScores = scores[student.id] || {};
      const { transmutedGrade } = calculateGrade(studentScores);
      onSaveScores(student.id, studentScores, transmutedGrade);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col p-4">
      <div className="bg-white rounded-xl shadow-2xl flex-1 flex flex-col overflow-hidden max-w-[1600px] mx-auto w-full border border-slate-200">
        
        {/* Header */}
        <div className="bg-emerald-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold">Strengthened Senior High School Class Record</h2>
              <p className="text-sm text-emerald-200">
                {section.gradeLevel} - {section.name} | {subject.name} | { { q1: '1st Term', q2: '2nd Term', q3: '3rd Term', q4: 'Final' }[term] }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Class Record
            </button>
            <button onClick={onClose} className="p-2 hover:bg-emerald-900 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4">
          <table className="w-full border-collapse bg-white text-[11px] shadow-sm">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10">
              <tr>
                <th className="border border-slate-300 p-2 text-left w-48" rowSpan={2}>LEARNERS' NAMES</th>
                <th className="border border-slate-300 p-1 text-center bg-blue-50" colSpan={8}>WRITTEN / ORAL WORKS (20%)</th>
                <th className="border border-slate-300 p-1 text-center bg-green-50" colSpan={6}>PRODUCT / PERFORMANCE (50%)</th>
                <th className="border border-slate-300 p-1 text-center bg-purple-50" colSpan={6}>SUMMATIVE TESTS & EXAM (30%)</th>
                <th className="border border-slate-300 p-2 text-center" rowSpan={2}>Initial<br/>Grade</th>
                <th className="border border-slate-300 p-2 text-center font-bold bg-amber-50" rowSpan={2}>Transmuted<br/>Grade</th>
              </tr>
              <tr>
                {/* WW */}
                <th className="border border-slate-300 p-1 text-center w-8">1</th>
                <th className="border border-slate-300 p-1 text-center w-8">2</th>
                <th className="border border-slate-300 p-1 text-center w-8">3</th>
                <th className="border border-slate-300 p-1 text-center w-8">4</th>
                <th className="border border-slate-300 p-1 text-center w-8">5</th>
                <th className="border border-slate-300 p-1 text-center w-10 font-bold bg-slate-200">Total</th>
                <th className="border border-slate-300 p-1 text-center w-10">PS</th>
                <th className="border border-slate-300 p-1 text-center w-10 font-bold">WS</th>
                {/* PT */}
                <th className="border border-slate-300 p-1 text-center w-8">1</th>
                <th className="border border-slate-300 p-1 text-center w-8">2</th>
                <th className="border border-slate-300 p-1 text-center w-8">3</th>
                <th className="border border-slate-300 p-1 text-center w-10 font-bold bg-slate-200">Total</th>
                <th className="border border-slate-300 p-1 text-center w-10">PS</th>
                <th className="border border-slate-300 p-1 text-center w-10 font-bold">WS</th>
                {/* Summative */}
                <th className="border border-slate-300 p-1 text-center w-8">SA1</th>
                <th className="border border-slate-300 p-1 text-center w-8">SA2</th>
                <th className="border border-slate-300 p-1 text-center w-8">TE</th>
                <th className="border border-slate-300 p-1 text-center w-10 font-bold bg-slate-200">Total</th>
                <th className="border border-slate-300 p-1 text-center w-10">PS</th>
                <th className="border border-slate-300 p-1 text-center w-10 font-bold">WS</th>
              </tr>
              <tr className="bg-slate-200 font-bold text-slate-800">
                <td className="border border-slate-300 p-1 text-right">HPS</td>
                {/* WW HPS */}
                <td className="border border-slate-300 p-1 text-center">{hps.ww1}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.ww2}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.ww3}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.ww4}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.ww5}</td>
                <td className="border border-slate-300 p-1 text-center">100</td>
                <td className="border border-slate-300 p-1 text-center">100</td>
                <td className="border border-slate-300 p-1 text-center">20%</td>
                {/* PT HPS */}
                <td className="border border-slate-300 p-1 text-center">{hps.pt1}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.pt2}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.pt3}</td>
                <td className="border border-slate-300 p-1 text-center">60</td>
                <td className="border border-slate-300 p-1 text-center">100</td>
                <td className="border border-slate-300 p-1 text-center">50%</td>
                {/* SA HPS */}
                <td className="border border-slate-300 p-1 text-center">{hps.sa1}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.sa2}</td>
                <td className="border border-slate-300 p-1 text-center">{hps.te}</td>
                <td className="border border-slate-300 p-1 text-center">100</td>
                <td className="border border-slate-300 p-1 text-center">100</td>
                <td className="border border-slate-300 p-1 text-center">30%</td>
                <td className="border border-slate-300 p-1"></td>
                <td className="border border-slate-300 p-1"></td>
              </tr>
            </thead>
            <tbody>
              {/* Male Students */}
              <tr><td colSpan={24} className="border border-slate-300 p-1 font-bold bg-slate-100">MALE</td></tr>
              {students.filter(s => s.sex === 'Male').map((s, idx) => (
                <StudentRow key={s.id} student={s} idx={idx} scores={scores[s.id] || {}} onChange={(f, v) => handleScoreChange(s.id, f, v)} calculateGrade={calculateGrade} />
              ))}
              
              {/* Female Students */}
              <tr><td colSpan={24} className="border border-slate-300 p-1 font-bold bg-slate-100">FEMALE</td></tr>
              {students.filter(s => s.sex === 'Female').map((s, idx) => (
                <StudentRow key={s.id} student={s} idx={idx} scores={scores[s.id] || {}} onChange={(f, v) => handleScoreChange(s.id, f, v)} calculateGrade={calculateGrade} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StudentRow = ({ student, idx, scores, onChange, calculateGrade }: any) => {
  const { wwTotal, ptTotal, saTotal, initialGrade, transmutedGrade } = calculateGrade(scores);
  
  const InputCell = ({ field }: { field: string }) => (
    <td className="border border-slate-300 p-0 text-center relative hover:bg-slate-50 transition-colors">
      <input
        type="text"
        className="w-full h-full text-center py-1.5 focus:outline-none focus:bg-amber-50 font-medium text-slate-800"
        value={scores[field] || ''}
        onChange={(e) => onChange(field, e.target.value)}
      />
    </td>
  );

  return (
    <tr className="hover:bg-slate-50">
      <td className="border border-slate-300 p-1 pl-2">
        <span className="mr-2 text-slate-400 font-mono text-[10px]">{idx + 1}</span>
        <span className="font-semibold text-slate-800">{student.lastName}, {student.firstName}</span>
      </td>
      {/* WW */}
      <InputCell field="ww1" />
      <InputCell field="ww2" />
      <InputCell field="ww3" />
      <InputCell field="ww4" />
      <InputCell field="ww5" />
      <td className="border border-slate-300 p-1 text-center font-bold bg-slate-100/50">{wwTotal || ''}</td>
      <td className="border border-slate-300 p-1 text-center"></td>
      <td className="border border-slate-300 p-1 text-center font-bold"></td>
      {/* PT */}
      <InputCell field="pt1" />
      <InputCell field="pt2" />
      <InputCell field="pt3" />
      <td className="border border-slate-300 p-1 text-center font-bold bg-slate-100/50">{ptTotal || ''}</td>
      <td className="border border-slate-300 p-1 text-center"></td>
      <td className="border border-slate-300 p-1 text-center font-bold"></td>
      {/* SA */}
      <InputCell field="sa1" />
      <InputCell field="sa2" />
      <InputCell field="te" />
      <td className="border border-slate-300 p-1 text-center font-bold bg-slate-100/50">{saTotal || ''}</td>
      <td className="border border-slate-300 p-1 text-center"></td>
      <td className="border border-slate-300 p-1 text-center font-bold"></td>
      
      {/* Final */}
      <td className="border border-slate-300 p-1 text-center font-bold text-slate-600 bg-slate-50">{initialGrade}</td>
      <td className="border border-slate-300 p-1 text-center font-bold text-emerald-800 bg-amber-50/50">{transmutedGrade || ''}</td>
    </tr>
  );
};
