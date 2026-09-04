import React, { useState } from 'react';
import {
  Schedule,
  Teacher,
  Subject,
  Section,
  Room,
  GradeLevel,
  User,
  ScheduleConflict,
} from '../../types';
import { SchoolDatabase, formatTime12h } from '../../services/storage';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  DoorOpen,
  Filter,
  X,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface ScheduleManagerProps {
  schedules: Schedule[];
  teachers: Teacher[];
  subjects: Subject[];
  sections: Section[];
  rooms: Room[];
  gradeLevels: GradeLevel[];
  currentUser: User;
  onSaveSchedule: (schedule: Schedule, allowOverride?: boolean) => { success: boolean; conflicts?: ScheduleConflict[] };
  onDeleteSchedule: (id: string) => void;
}

const DAYS_OF_WEEK: Schedule['dayOfWeek'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedules,
  teachers,
  subjects,
  sections,
  rooms,
  gradeLevels,
  currentUser,
  onSaveSchedule,
  onDeleteSchedule,
}) => {
  const [viewMode, setViewMode] = useState<'SECTION' | 'TEACHER' | 'ROOM'>('SECTION');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [allowOverride, setAllowOverride] = useState(false);

  // Form State
  const [form, setForm] = useState<{
    dayOfWeek: Schedule['dayOfWeek'];
    startTime: string;
    endTime: string;
    teacherId: string;
    subjectId: string;
    sectionId: string;
    roomId: string;
  }>({
    dayOfWeek: 'Monday',
    startTime: '07:45',
    endTime: '08:35',
    teacherId: teachers[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    sectionId: sections[0]?.id || '',
    roomId: rooms[0]?.id || '',
  });

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setConflicts([]);
    setAllowOverride(false);
    setForm({
      dayOfWeek: 'Monday',
      startTime: '07:45',
      endTime: '08:35',
      teacherId: selectedTeacherId || teachers[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      sectionId: selectedSectionId || sections[0]?.id || '',
      roomId: selectedRoomId || rooms[0]?.id || '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sch: Schedule) => {
    setEditingSchedule(sch);
    setConflicts([]);
    setAllowOverride(false);
    setForm({
      dayOfWeek: sch.dayOfWeek,
      startTime: sch.startTime,
      endTime: sch.endTime,
      teacherId: sch.teacherId,
      subjectId: sch.subjectId,
      sectionId: sch.sectionId,
      roomId: sch.roomId,
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSection = sections.find((s) => s.id === form.sectionId);

    const scheduleData: Schedule = {
      id: editingSchedule ? editingSchedule.id : `sch-${Date.now()}`,
      schoolYearId: 'sy-2026-2027',
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      teacherId: form.teacherId,
      subjectId: form.subjectId,
      gradeLevelId: targetSection?.gradeLevelId || 'gl-7',
      sectionId: form.sectionId,
      roomId: form.roomId,
    };

    const result = onSaveSchedule(scheduleData, allowOverride);
    if (!result.success && result.conflicts && result.conflicts.length > 0) {
      setConflicts(result.conflicts);
    } else {
      setShowModal(false);
      setConflicts([]);
    }
  };

  // Filtered schedules for current matrix view
  const currentSchedules = schedules.filter((s) => {
    if (viewMode === 'SECTION') return s.sectionId === selectedSectionId;
    if (viewMode === 'TEACHER') return s.teacherId === selectedTeacherId;
    if (viewMode === 'ROOM') return s.roomId === selectedRoomId;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Schedule & Timetable Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Class period assignments with automated teacher, room, and section conflict prevention
          </p>
        </div>

        <button
          id="btn-add-schedule"
          onClick={handleOpenAdd}
          className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timetable Entry</span>
        </button>
      </div>

      {/* View Matrix Selector & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Toggle View Mode */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setViewMode('SECTION')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'SECTION' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>By Section</span>
          </button>
          <button
            onClick={() => setViewMode('TEACHER')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'TEACHER' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>By Teacher</span>
          </button>
          <button
            onClick={() => setViewMode('ROOM')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'ROOM' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>By Room</span>
          </button>
        </div>

        {/* Dynamic Selector based on ViewMode */}
        <div className="w-full md:w-72">
          {viewMode === 'SECTION' && (
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
          )}

          {viewMode === 'TEACHER' && (
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.teacherId})
                </option>
              ))}
            </select>
          )}

          {viewMode === 'ROOM' && (
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-700"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.building})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Weekly Schedule Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {DAYS_OF_WEEK.map((day) => {
          const daySchedules = currentSchedules
            .filter((s) => s.dayOfWeek === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={day} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <div className="p-3 bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
                <span>{day}</span>
                <span className="text-[10px] text-emerald-300">{daySchedules.length} periods</span>
              </div>

              <div className="p-2.5 space-y-2 flex-1 min-h-[300px] bg-slate-50/40">
                {daySchedules.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-4 text-center text-[11px] text-slate-400">
                    No scheduled periods
                  </div>
                ) : (
                  daySchedules.map((sch) => {
                    const sub = subjects.find((s) => s.id === sch.subjectId);
                    const tch = teachers.find((t) => t.id === sch.teacherId);
                    const sec = sections.find((s) => s.id === sch.sectionId);
                    const rm = rooms.find((r) => r.id === sch.roomId);

                    return (
                      <div
                        key={sch.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-xs transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 mb-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatTime12h(sch.startTime)} – {formatTime12h(sch.endTime)}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {sub?.subjectName || 'Subject'}
                          </h4>
                          <span className="text-[10px] font-mono-code text-slate-400 block mb-1.5">
                            {sub?.subjectCode}
                          </span>

                          <div className="space-y-0.5 text-[11px] text-slate-600">
                            {viewMode !== 'TEACHER' && (
                              <div className="flex items-center gap-1 text-slate-700">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span className="truncate font-medium">{tch?.fullName || 'Teacher'}</span>
                              </div>
                            )}
                            {viewMode !== 'SECTION' && (
                              <div className="flex items-center gap-1 text-slate-700">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                <span className="truncate font-medium">{sec?.name || 'Section'}</span>
                              </div>
                            )}
                            {viewMode !== 'ROOM' && (
                              <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                                <DoorOpen className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{rm?.name || 'Room'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(sch)}
                            className="p-1 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Edit Period"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteSchedule(sch.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Remove Period"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Timetable Period Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingSchedule ? 'Edit Schedule Period' : 'Add Timetable Period'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conflict Warnings Box */}
            {conflicts.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-4 text-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Schedule Conflict Detected</span>
                </div>
                <div className="space-y-1 text-rose-700">
                  {conflicts.map((c, idx) => (
                    <p key={idx} className="leading-relaxed">
                      • {c.message}
                    </p>
                  ))}
                </div>
                {currentUser.role === 'ADMIN' && (
                  <div className="pt-2 border-t border-rose-200 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="chk-allow-override"
                      checked={allowOverride}
                      onChange={(e) => setAllowOverride(e.target.checked)}
                      className="rounded text-rose-700 focus:ring-rose-600"
                    />
                    <label htmlFor="chk-allow-override" className="text-rose-900 font-bold cursor-pointer">
                      Administrative Override: Save anyway despite detected conflict
                    </label>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Day of Week</label>
                  <select
                    value={form.dayOfWeek}
                    onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Subject</label>
                <select
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
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
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Assigned Teacher</label>
                <select
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.specialization || 'Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Section</label>
                  <select
                    value={form.sectionId}
                    onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
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
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Classroom / Room</label>
                  <select
                    value={form.roomId}
                    onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    {rooms.map((rm) => (
                      <option key={rm.id} value={rm.id}>
                        {rm.name}
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
                  {allowOverride ? 'Save with Override' : 'Validate & Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
