import React, { useState, useMemo } from 'react';
import {
  Student,
  GradeLevel,
  Section,
  SchoolYear,
  TrackProgram,
  StrandSpecialization,
  EnrollmentStatus,
  User,
} from '../../types';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Archive,
  Download,
  Printer,
  GraduationCap,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface StudentManagementProps {
  students: Student[];
  gradeLevels: GradeLevel[];
  sections: Section[];
  schoolYears: SchoolYear[];
  tracks: TrackProgram[];
  strands: StrandSpecialization[];
  currentUser: User;
  onSaveStudent: (student: Student) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  students,
  gradeLevels,
  sections,
  schoolYears,
  tracks,
  strands,
  currentUser,
  onSaveStudent,
}) => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('ALL');
  const [filterSection, setFilterSection] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterTrack, setFilterTrack] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    studentId: string;
    lrn: string;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    birthdate: string;
    sex: 'Male' | 'Female';
    address: string;
    contactNumber: string;
    email: string;
    parentGuardian: string;
    guardianContact: string;
    gradeLevelId: string;
    sectionId: string;
    schoolYearId: string;
    trackProgramId: string;
    strandSpecializationId: string;
    enrollmentStatus: EnrollmentStatus;
  }>({
    studentId: '',
    lrn: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthdate: '2012-01-01',
    sex: 'Male',
    address: '',
    contactNumber: '',
    email: '',
    parentGuardian: '',
    guardianContact: '',
    gradeLevelId: gradeLevels[0]?.id || 'gl-7',
    sectionId: sections[0]?.id || 'sec-7a',
    schoolYearId: schoolYears.find((sy) => sy.isActive)?.id || 'sy-2026-2027',
    trackProgramId: '',
    strandSpecializationId: '',
    enrollmentStatus: 'Active',
  });

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        searchTerm === '' ||
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.lrn.includes(searchTerm) ||
        s.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade = filterGrade === 'ALL' || s.gradeLevelId === filterGrade;
      const matchesSection = filterSection === 'ALL' || s.sectionId === filterSection;
      const matchesStatus = filterStatus === 'ALL' || s.enrollmentStatus === filterStatus;
      const matchesTrack = filterTrack === 'ALL' || s.trackProgramId === filterTrack;

      return matchesSearch && matchesGrade && matchesSection && matchesStatus && matchesTrack;
    });
  }, [students, searchTerm, filterGrade, filterSection, filterStatus, filterTrack]);

  // Paginated Students
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const newIdNum = (students.length + 1).toString().padStart(4, '0');
    setFormData({
      studentId: `SHA-2026-${newIdNum}`,
      lrn: `112233${Math.floor(100000 + Math.random() * 900000)}`,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      birthdate: '2012-01-01',
      sex: 'Male',
      address: 'Garchitorena, Camarines Sur',
      contactNumber: '0912-000-0000',
      email: '',
      parentGuardian: '',
      guardianContact: '0917-000-0000',
      gradeLevelId: gradeLevels[0]?.id || 'gl-7',
      sectionId: sections[0]?.id || 'sec-7a',
      schoolYearId: schoolYears.find((sy) => sy.isActive)?.id || 'sy-2026-2027',
      trackProgramId: '',
      strandSpecializationId: '',
      enrollmentStatus: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      lrn: student.lrn,
      firstName: student.firstName,
      middleName: student.middleName || '',
      lastName: student.lastName,
      suffix: student.suffix || '',
      birthdate: student.birthdate,
      sex: student.sex,
      address: student.address,
      contactNumber: student.contactNumber,
      email: student.email,
      parentGuardian: student.parentGuardian,
      guardianContact: student.guardianContact,
      gradeLevelId: student.gradeLevelId,
      sectionId: student.sectionId,
      schoolYearId: student.schoolYearId,
      trackProgramId: student.trackProgramId || '',
      strandSpecializationId: student.strandSpecializationId || '',
      enrollmentStatus: student.enrollmentStatus,
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName[0] + '. ' : ''}${formData.lastName}${formData.suffix ? ' ' + formData.suffix : ''}`.trim();

    const studentRecord: Student = {
      id: editingStudent ? editingStudent.id : `stud-${Date.now()}`,
      studentId: formData.studentId,
      lrn: formData.lrn,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      suffix: formData.suffix,
      fullName,
      birthdate: formData.birthdate,
      sex: formData.sex,
      address: formData.address,
      contactNumber: formData.contactNumber,
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@student.sacredheartacademy.edu.ph`,
      parentGuardian: formData.parentGuardian,
      guardianContact: formData.guardianContact,
      gradeLevelId: formData.gradeLevelId,
      sectionId: formData.sectionId,
      schoolYearId: formData.schoolYearId,
      trackProgramId: formData.trackProgramId || undefined,
      strandSpecializationId: formData.strandSpecializationId || undefined,
      enrollmentStatus: formData.enrollmentStatus,
      createdAt: editingStudent ? editingStudent.createdAt : new Date().toISOString(),
    };

    onSaveStudent(studentRecord);
    setShowModal(false);
  };

  const handleArchive = (student: Student) => {
    const updated: Student = {
      ...student,
      enrollmentStatus: 'Archived',
    };
    onSaveStudent(updated);
  };

  const exportCSV = () => {
    const headers = ['Student ID', 'LRN', 'Full Name', 'Grade Level', 'Section', 'Status', 'Guardian', 'Contact'];
    const rows = filteredStudents.map((s) => {
      const g = gradeLevels.find((gl) => gl.id === s.gradeLevelId)?.name || '';
      const sec = sections.find((sec) => sec.id === s.sectionId)?.name || '';
      return [s.studentId, s.lrn, `"${s.fullName}"`, `"${g}"`, `"${sec}"`, s.enrollmentStatus, `"${s.parentGuardian}"`, s.guardianContact];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SacredHeartAcademy_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Student Directory & Masterlist</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official learner information, LRN registries, section assignments, and status records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            id="btn-add-student"
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Name, LRN, Student ID..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Grade Level Filter */}
          <div>
            <select
              value={filterGrade}
              onChange={(e) => {
                setFilterGrade(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-700"
            >
              <option value="ALL">All Grade Levels</option>
              {gradeLevels.map((gl) => (
                <option key={gl.id} value={gl.id}>
                  {gl.name} ({gl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={filterSection}
              onChange={(e) => {
                setFilterSection(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-700"
            >
              <option value="ALL">All Sections</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Transferred">Transferred</option>
              <option value="Graduated">Graduated</option>
              <option value="Dropped">Dropped</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID / LRN</th>
                <th className="py-3 px-4">Grade & Section</th>
                <th className="py-3 px-4">Track / Strand</th>
                <th className="py-3 px-4">Guardian Contact</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => {
                  const grade = gradeLevels.find((g) => g.id === s.gradeLevelId);
                  const section = sections.find((sec) => sec.id === s.sectionId);
                  const strand = strands.find((st) => st.id === s.strandSpecializationId);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                            {s.firstName[0]}
                            {s.lastName[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{s.fullName}</span>
                            <span className="text-[10px] text-slate-400">{s.sex} • {s.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono-code font-bold text-emerald-950 block">{s.studentId}</span>
                        <span className="font-mono-code text-[10px] text-slate-500">LRN: {s.lrn}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{grade?.name || 'Unassigned'}</span>
                        <span className="text-[11px] text-slate-500">{section?.name || 'No Section'}</span>
                      </td>
                      <td className="py-3 px-4">
                        {strand ? (
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-semibold border border-purple-200">
                            {strand.code}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">JHS General</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 block font-medium">{s.parentGuardian}</span>
                        <span className="text-[10px] text-slate-500">{s.guardianContact}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.enrollmentStatus === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.enrollmentStatus === 'Transferred'
                              ? 'bg-blue-100 text-blue-800'
                              : s.enrollmentStatus === 'Graduated'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {s.enrollmentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Edit Student Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleArchive(s)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                            title="Archive Record"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-800">
              {filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredStudents.length)}
            </span>{' '}
            of <span className="font-bold text-slate-800">{filteredStudents.length}</span> students
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingStudent ? 'Edit Student Academic Record' : 'Register New Learner'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* IDs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Learner Reference No. (LRN - 12 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{12}"
                    maxLength={12}
                    placeholder="12-digit DepEd LRN"
                    value={formData.lrn}
                    onChange={(e) => setFormData({ ...formData, lrn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Names Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Suffix</label>
                  <input
                    type="text"
                    placeholder="Jr., III..."
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sex & Birthdate & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Sex</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({ ...formData, sex: e.target.value as 'Male' | 'Female' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Birthdate</label>
                  <input
                    type="date"
                    required
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Student Contact</label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Permanent Residential Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Barangay, Municipality, Province"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              {/* Guardian & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={formData.parentGuardian}
                    onChange={(e) => setFormData({ ...formData, parentGuardian: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Guardian Contact Number</label>
                  <input
                    type="text"
                    required
                    value={formData.guardianContact}
                    onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Academic Placement */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Grade Level</label>
                  <select
                    value={formData.gradeLevelId}
                    onChange={(e) => setFormData({ ...formData, gradeLevelId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    {gradeLevels.map((gl) => (
                      <option key={gl.id} value={gl.id}>
                        {gl.name} ({gl.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Section</label>
                  <select
                    value={formData.sectionId}
                    onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Enrollment Status</label>
                  <select
                    value={formData.enrollmentStatus}
                    onChange={(e) => setFormData({ ...formData, enrollmentStatus: e.target.value as EnrollmentStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* SHS Track / Strand (Optional if Grade 11 or 12) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Senior High Track (If Gr. 11/12)
                  </label>
                  <select
                    value={formData.trackProgramId}
                    onChange={(e) => setFormData({ ...formData, trackProgramId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="">None (Junior High)</option>
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Strand / TechPro Specialization
                  </label>
                  <select
                    value={formData.strandSpecializationId}
                    onChange={(e) => setFormData({ ...formData, strandSpecializationId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="">None / Not Applicable</option>
                    {strands.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg hover:bg-emerald-900 shadow-sm"
                >
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
