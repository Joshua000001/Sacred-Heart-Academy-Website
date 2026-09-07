import React, { useState } from 'react';
import {
  Teacher,
  TeacherAssignment,
  Subject,
  Section,
  GradeLevel,
  User,
  Schedule,
} from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  BookOpen,
  Calendar,
  Layers,
  Building2,
  X,
  CheckCircle2,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

interface TeacherManagementProps {
  teachers: Teacher[];
  assignments: TeacherAssignment[];
  subjects: Subject[];
  sections: Section[];
  gradeLevels: GradeLevel[];
  schedules: Schedule[];
  currentUser: User;
  onSaveTeacher: (teacher: Teacher) => void;
  onSaveAssignment: (assignment: TeacherAssignment) => void;
}

export const TeacherManagement: React.FC<TeacherManagementProps> = ({
  teachers,
  assignments,
  subjects,
  sections,
  gradeLevels,
  schedules,
  currentUser,
  onSaveTeacher,
  onSaveAssignment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Form State for Teacher
  const [teacherForm, setTeacherForm] = useState<{
    id?: string;
    teacherId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    username: string;
    accountStatus: 'Active' | 'On Leave' | 'Inactive';
    specialization: string;
  }>({
    teacherId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    username: '',
    accountStatus: 'Active',
    specialization: '',
  });

  // Assignment Form State
  const [assignmentForm, setAssignmentForm] = useState({
    subjectId: subjects[0]?.id || '',
    sectionId: sections[0]?.id || '',
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.specialization && t.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setSelectedTeacher(null);
    const nextNum = (teachers.length + 1).toString().padStart(3, '0');
    setTeacherForm({
      teacherId: `TCH-${nextNum}`,
      firstName: '',
      middleName: '',
      lastName: '',
      contactNumber: '0918-000-0000',
      email: '',
      username: '',
      accountStatus: 'Active',
      specialization: 'Junior High School Faculty',
    });
    setShowEditModal(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setSelectedTeacher(t);
    setTeacherForm({
      id: t.id,
      teacherId: t.teacherId,
      firstName: t.firstName,
      middleName: t.middleName || '',
      lastName: t.lastName,
      contactNumber: t.contactNumber,
      email: t.email,
      username: t.username,
      accountStatus: t.accountStatus,
      specialization: t.specialization || '',
    });
    setShowEditModal(true);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${teacherForm.firstName} ${teacherForm.middleName ? teacherForm.middleName[0] + '. ' : ''}${teacherForm.lastName}`.trim();
    const username = teacherForm.username || teacherForm.firstName.toLowerCase().replace(/\s+/g, '');
    const email = teacherForm.email || `${username}@sacredheartacademy.edu.ph`;

    const updated: Teacher = {
      id: selectedTeacher ? selectedTeacher.id : `tch-${Date.now()}`,
      teacherId: teacherForm.teacherId,
      firstName: teacherForm.firstName,
      middleName: teacherForm.middleName,
      lastName: teacherForm.lastName,
      fullName,
      contactNumber: teacherForm.contactNumber,
      email,
      username,
      accountStatus: teacherForm.accountStatus,
      specialization: teacherForm.specialization,
    };

    onSaveTeacher(updated);
    setShowEditModal(false);
  };

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    const newAssignment: TeacherAssignment = {
      id: `ta-${Date.now()}`,
      teacherId: selectedTeacher.id,
      subjectId: assignmentForm.subjectId,
      sectionId: assignmentForm.sectionId,
      schoolYearId: 'sy-2026-2027',
    };

    onSaveAssignment(newAssignment);
    setShowAssignModal(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Faculty & Teacher Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            17 official faculty instructors, curricular specializations, and relational subject loads
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Teacher</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search faculty name, specialization, ID..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => {
          const teacherAssignments = assignments.filter((a) => a.teacherId === t.id);
          const teacherSchedules = schedules.filter((s) => s.teacherId === t.id);

          return (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {t.firstName[0]}
                      {t.lastName ? t.lastName[0] : ''}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{t.fullName}</h3>
                      <span className="font-mono-code text-[10px] text-emerald-800 font-semibold">{t.teacherId}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.accountStatus === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.accountStatus}
                  </span>
                </div>

                {/* Specialization */}
                <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-700 block text-[10px] uppercase">Specialization / Department</span>
                  <span className="text-slate-900 font-medium text-xs mt-0.5 block">{t.specialization || 'General Faculty'}</span>
                </div>

                {/* Contact Info */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.contactNumber}</span>
                  </div>
                </div>

                {/* Assignments summary */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-bold text-slate-800">{teacherAssignments.length}</span>
                    <span>Assigned Subjects</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                    <span className="font-bold text-slate-800">{teacherSchedules.length}</span>
                    <span>Class Periods</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setSelectedTeacher(t);
                    setShowAssignModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  Assign Subject
                </button>
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Edit Teacher"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">
                  {selectedTeacher ? 'Edit Teacher Profile' : 'Register Faculty Teacher'}
                </h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTeacherSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Teacher ID</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.teacherId}
                    onChange={(e) => setTeacherForm({ ...teacherForm, teacherId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Account Status</label>
                  <select
                    value={teacherForm.accountStatus}
                    onChange={(e) => setTeacherForm({ ...teacherForm, accountStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.firstName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.lastName}
                    onChange={(e) => setTeacherForm({ ...teacherForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Specialization
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.specialization}
                  onChange={(e) => setTeacherForm({ ...teacherForm, specialization: e.target.value })}
                  placeholder="e.g. Science 7 & 8, Mathematics, MAPEH..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Number</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.contactNumber}
                    onChange={(e) => setTeacherForm({ ...teacherForm, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Portal Username</label>
                  <input
                    type="text"
                    value={teacherForm.username}
                    onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value })}
                    placeholder="e.g. austin"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900 shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Subject Modal */}
      {showAssignModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Assign Subject & Section</h3>
                  <p className="text-[11px] text-slate-500">{selectedTeacher.fullName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                <select
                  value={assignmentForm.subjectId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subjectCode} — {sub.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target Section</label>
                <select
                  value={assignmentForm.sectionId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, sectionId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900 shadow-sm"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
