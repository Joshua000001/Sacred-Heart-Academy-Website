import React, { useState } from 'react';
import {
  Subject,
  Section,
  GradeLevel,
  TrackProgram,
  StrandSpecialization,
  Room,
  Teacher,
  SchoolYear,
} from '../../types';
import {
  BookOpen,
  Building2,
  Layers,
  Compass,
  DoorOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react';

interface AcademicStructureProps {
  subjects: Subject[];
  sections: Section[];
  gradeLevels: GradeLevel[];
  tracks: TrackProgram[];
  strands: StrandSpecialization[];
  rooms: Room[];
  teachers: Teacher[];
  schoolYears: SchoolYear[];
  initialTab?: 'subjects' | 'sections' | 'grade_levels' | 'tracks_strands' | 'rooms';
  onSaveSubject: (sub: Subject) => void;
  onSaveSection: (sec: Section) => void;
  onSaveRoom: (room: Room) => void;
  onSaveTrack: (t: TrackProgram) => void;
  onSaveStrand: (s: StrandSpecialization) => void;
}

export const AcademicStructure: React.FC<AcademicStructureProps> = ({
  subjects,
  sections,
  gradeLevels,
  tracks,
  strands,
  rooms,
  teachers,
  schoolYears,
  initialTab = 'subjects',
  onSaveSubject,
  onSaveSection,
  onSaveRoom,
  onSaveTrack,
  onSaveStrand,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'subjects' | 'sections' | 'grade_levels' | 'tracks_strands' | 'rooms'
  >(initialTab);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    subjectCode: '',
    subjectName: '',
    description: '',
    gradeLevelId: gradeLevels[0]?.id || 'gl-7',
    units: 1,
    status: 'Active' as const,
  });

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    gradeLevelId: gradeLevels[0]?.id || 'gl-7',
    adviserTeacherId: teachers[0]?.id || '',
    roomId: rooms[0]?.id || '',
    schoolYearId: 'sy-2026-2027',
  });

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    building: 'Main Academic Wing',
    capacity: 45,
    type: 'Classroom' as Room['type'],
  });

  // Subject Modal handlers
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      subjectCode: '',
      subjectName: '',
      description: '',
      gradeLevelId: gradeLevels[0]?.id || 'gl-7',
      units: 1,
      status: 'Active',
    });
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (s: Subject) => {
    setEditingSubject(s);
    setSubjectForm({
      subjectCode: s.subjectCode,
      subjectName: s.subjectName,
      description: s.description || '',
      gradeLevelId: s.gradeLevelId,
      units: s.units,
      status: s.status,
    });
    setShowSubjectModal(true);
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSubject({
      id: editingSubject ? editingSubject.id : `sub-${Date.now()}`,
      subjectCode: subjectForm.subjectCode,
      subjectName: subjectForm.subjectName,
      description: subjectForm.description,
      gradeLevelId: subjectForm.gradeLevelId,
      units: Number(subjectForm.units),
      status: subjectForm.status,
    });
    setShowSubjectModal(false);
  };

  // Section Modal handlers
  const handleOpenAddSection = () => {
    setEditingSection(null);
    setSectionForm({
      name: '',
      gradeLevelId: gradeLevels[0]?.id || 'gl-7',
      adviserTeacherId: teachers[0]?.id || '',
      roomId: rooms[0]?.id || '',
      schoolYearId: 'sy-2026-2027',
    });
    setShowSectionModal(true);
  };

  const handleOpenEditSection = (sec: Section) => {
    setEditingSection(sec);
    setSectionForm({
      name: sec.name,
      gradeLevelId: sec.gradeLevelId,
      adviserTeacherId: sec.adviserTeacherId || teachers[0]?.id || '',
      roomId: sec.roomId || rooms[0]?.id || '',
      schoolYearId: sec.schoolYearId,
    });
    setShowSectionModal(true);
  };

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSection({
      id: editingSection ? editingSection.id : `sec-${Date.now()}`,
      name: sectionForm.name,
      gradeLevelId: sectionForm.gradeLevelId,
      adviserTeacherId: sectionForm.adviserTeacherId,
      roomId: sectionForm.roomId,
      schoolYearId: sectionForm.schoolYearId,
      status: 'Active',
    });
    setShowSectionModal(false);
  };

  // Room Modal handlers
  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      name: '',
      building: 'Main Academic Wing',
      capacity: 45,
      type: 'Classroom',
    });
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (rm: Room) => {
    setEditingRoom(rm);
    setRoomForm({
      name: rm.name,
      building: rm.building,
      capacity: rm.capacity,
      type: rm.type,
    });
    setShowRoomModal(true);
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRoom({
      id: editingRoom ? editingRoom.id : `rm-${Date.now()}`,
      name: roomForm.name,
      building: roomForm.building,
      capacity: Number(roomForm.capacity),
      type: roomForm.type,
      status: 'Available',
    });
    setShowRoomModal(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Header & SubTabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Academic Structure & Curricular Setup</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Subjects, Sections, Grade Levels (JHS & SHS), Programs/Strands, and Facilities
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('subjects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'subjects' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subjects</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'sections' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Sections</span>
          </button>
          <button
            onClick={() => setActiveSubTab('grade_levels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'grade_levels' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Grade Levels</span>
          </button>
          <button
            onClick={() => setActiveSubTab('tracks_strands')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'tracks_strands' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tracks & Strands</span>
          </button>
          <button
            onClick={() => setActiveSubTab('rooms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'rooms' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Rooms</span>
          </button>
        </div>
      </div>

      {/* 1. SUBJECTS TAB */}
      {activeSubTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject code, title..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
            <button
              onClick={handleOpenAddSubject}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects
              .filter(
                (s) =>
                  s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((s) => {
                const grade = gradeLevels.find((g) => g.id === s.gradeLevelId);

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono-code font-bold text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {s.subjectCode}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {grade?.name || 'All Grades'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">{s.subjectName}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{s.description || 'Core DepEd Subject'}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">{s.units} Unit(s)</span>
                      <button
                        onClick={() => handleOpenEditSubject(s)}
                        className="p-1 rounded text-slate-400 hover:text-emerald-800 hover:bg-emerald-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 2. SECTIONS TAB */}
      {activeSubTab === 'sections' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenAddSection}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Section</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((sec) => {
              const grade = gradeLevels.find((g) => g.id === sec.gradeLevelId);
              const adviser = teachers.find((t) => t.id === sec.adviserTeacherId);
              const room = rooms.find((r) => r.id === sec.roomId);

              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        {grade?.name} ({grade?.category})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded font-bold">
                        {sec.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">{sec.name}</h3>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-700 block text-[10px] uppercase">Class Adviser:</span>
                        <span className="text-slate-900 font-medium">{adviser?.fullName || 'Not assigned'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 block text-[10px] uppercase">Home Classroom:</span>
                        <span className="text-slate-900 font-medium">{room?.name || 'Main Wing'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleOpenEditSection(sec)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Section</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. GRADE LEVELS TAB */}
      {activeSubTab === 'grade_levels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradeLevels.map((gl) => (
            <div key={gl.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900">
                  {gl.category}
                </span>
                <span className="text-xs font-mono-code text-slate-400">Order: {gl.levelOrder}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{gl.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {gl.category === 'Junior High School'
                  ? 'Standard Core Curriculum with TLE and Values Education'
                  : 'Senior High Specialized Track & Program Pathways'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4. TRACKS & STRANDS TAB */}
      {activeSubTab === 'tracks_strands' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Senior High School Tracks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tracks.map((t) => (
                <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-mono-code font-bold text-emerald-800 block">{t.code}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{t.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Strands & TechPro Specializations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {strands.map((st) => (
                <div key={st.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-code font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[10px]">
                      {st.code}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      {st.trackProgramId === 'track-acad' ? 'Academic' : 'TechPro'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1">{st.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{st.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. ROOMS TAB */}
      {activeSubTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenAddRoom}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility / Room</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rooms.map((rm) => (
              <div key={rm.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {rm.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {rm.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{rm.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{rm.building} • Max {rm.capacity} Learners</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleOpenEditRoom(rm)}
                    className="p-1 text-slate-400 hover:text-emerald-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingSubject ? 'Edit Curricular Subject' : 'Add New Subject'}
                </h3>
              </div>
              <button onClick={() => setShowSubjectModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MATH-7, ENG-11"
                  value={subjectForm.subjectCode}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics 7"
                  value={subjectForm.subjectName}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subjectName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Grade Level</label>
                <select
                  value={subjectForm.gradeLevelId}
                  onChange={(e) => setSubjectForm({ ...subjectForm, gradeLevelId: e.target.value })}
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
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg shadow-sm">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingSection ? 'Edit Section Configuration' : 'Create New Section'}
                </h3>
              </div>
              <button onClick={() => setShowSectionModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Section Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 7 St. Joseph"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Grade Level</label>
                <select
                  value={sectionForm.gradeLevelId}
                  onChange={(e) => setSectionForm({ ...sectionForm, gradeLevelId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {gradeLevels.map((gl) => (
                    <option key={gl.id} value={gl.id}>
                      {gl.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Class Adviser</label>
                <select
                  value={sectionForm.adviserTeacherId}
                  onChange={(e) => setSectionForm({ ...sectionForm, adviserTeacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Room Assignment</label>
                <select
                  value={sectionForm.roomId}
                  onChange={(e) => setSectionForm({ ...sectionForm, roomId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {rooms.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name} ({rm.building})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg shadow-sm">
                  Save Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingRoom ? 'Edit Facility Room' : 'Add New Room'}
                </h3>
              </div>
              <button onClick={() => setShowRoomModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Room Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 7, Science Lab 2"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Building Location</label>
                <input
                  type="text"
                  required
                  value={roomForm.building}
                  onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Capacity</label>
                  <input
                    type="number"
                    required
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Room Type</label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="AVR">AVR</option>
                    <option value="Covered Court">Covered Court</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg shadow-sm">
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
