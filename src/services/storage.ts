import {
  SchoolProfile,
  SchoolYear,
  GradeLevel,
  TrackProgram,
  StrandSpecialization,
  Room,
  Section,
  Subject,
  Teacher,
  TeacherAssignment,
  Schedule,
  ScheduleConflict,
  Student,
  StudentEnrollment,
  GradeRecord,
  Announcement,
  AuditLog,
  User,
  RolePermissionConfig,
  DocumentRequest,
  UserRole,
} from '../types';
import {
  initialSchoolProfile,
  initialSchoolYears,
  initialGradeLevels,
  initialTracks,
  initialStrands,
  initialRooms,
  initialTeachers,
  initialSections,
  initialSubjects,
  initialTeacherAssignments,
  initialSchedules,
  initialStudents,
  initialEnrollments,
  initialGrades,
  initialAnnouncements,
  initialAuditLogs,
  initialUsers,
  initialRolePermissions,
} from './initialData';

const STORAGE_KEYS = {
  PROFILE: 'sha_school_profile',
  SCHOOL_YEARS: 'sha_school_years',
  GRADE_LEVELS: 'sha_grade_levels',
  TRACKS: 'sha_tracks',
  STRANDS: 'sha_strands',
  ROOMS: 'sha_rooms',
  TEACHERS: 'sha_teachers',
  SECTIONS: 'sha_sections',
  SUBJECTS: 'sha_subjects',
  ASSIGNMENTS: 'sha_assignments',
  SCHEDULES: 'sha_schedules',
  STUDENTS: 'sha_students',
  ENROLLMENTS: 'sha_enrollments',
  GRADES: 'sha_grades',
  ANNOUNCEMENTS: 'sha_announcements',
  AUDIT_LOGS: 'sha_audit_logs',
  USERS: 'sha_users',
  PERMISSIONS: 'sha_permissions',
  CURRENT_USER: 'sha_current_user',
  DOCUMENT_REQUESTS: 'sha_document_requests',
};

function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save to localStorage key "${key}":`, err);
  }
}

// Convert "07:45" or "7:45 AM" to minutes from midnight for accurate overlap check
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toLowerCase();
  const isPM = clean.includes('pm');
  const isAM = clean.includes('am');
  const numbersPart = clean.replace(/(am|pm)/g, '').trim();
  const [hoursStr, minutesStr] = numbersPart.split(':');
  let hours = parseInt(hoursStr, 10) || 0;
  const minutes = parseInt(minutesStr, 10) || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function formatTime12h(timeStr: string): string {
  if (!timeStr) return '';
  const totalMins = parseTimeToMinutes(timeStr);
  const hours24 = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
}

export function checkTimeIntervalOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = parseTimeToMinutes(start1);
  const e1 = parseTimeToMinutes(end1);
  const s2 = parseTimeToMinutes(start2);
  const e2 = parseTimeToMinutes(end2);
  return Math.max(s1, s2) < Math.min(e1, e2);
}

// Core Database Service
export class SchoolDatabase {
  // Profiles
  static getProfile(): SchoolProfile {
    return getStorageItem(STORAGE_KEYS.PROFILE, initialSchoolProfile);
  }

  static saveSchoolProfile(profile: SchoolProfile, actor?: User): void {
    setStorageItem(STORAGE_KEYS.PROFILE, profile);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: 'UPDATE_SCHOOL_PROFILE',
      module: 'School Profile',
      description: `Updated institutional profile details and officials.`,
    });
  }

  static updateProfile(profile: SchoolProfile, actor?: User): void {
    this.saveSchoolProfile(profile, actor);
  }

  // School Years
  static getSchoolYears(): SchoolYear[] {
    return getStorageItem(STORAGE_KEYS.SCHOOL_YEARS, initialSchoolYears);
  }

  static saveSchoolYear(sy: SchoolYear, actor?: User): void {
    const list = this.getSchoolYears();
    const index = list.findIndex((item) => item.id === sy.id);
    let updated: SchoolYear[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = sy;
    } else {
      updated = [sy, ...list];
    }
    setStorageItem(STORAGE_KEYS.SCHOOL_YEARS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: index >= 0 ? 'UPDATE_SCHOOL_YEAR' : 'CREATE_SCHOOL_YEAR',
      module: 'School Year',
      recordId: sy.id,
      description: `${index >= 0 ? 'Updated' : 'Created'} School Year ${sy.name}.`,
    });
  }

  // Grade Levels
  static getGradeLevels(): GradeLevel[] {
    return getStorageItem(STORAGE_KEYS.GRADE_LEVELS, initialGradeLevels);
  }

  // Tracks & Strands
  static getTracks(): TrackProgram[] {
    return getStorageItem(STORAGE_KEYS.TRACKS, initialTracks);
  }

  static saveTrack(track: TrackProgram, actor?: User): void {
    const list = this.getTracks();
    const idx = list.findIndex((t) => t.id === track.id);
    const updated = idx >= 0 ? list.map((t) => (t.id === track.id ? track : t)) : [...list, track];
    setStorageItem(STORAGE_KEYS.TRACKS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_TRACK' : 'CREATE_TRACK',
      module: 'Tracks & Programs',
      recordId: track.id,
      description: `Track "${track.name}" saved.`,
    });
  }

  static getStrands(): StrandSpecialization[] {
    return getStorageItem(STORAGE_KEYS.STRANDS, initialStrands);
  }

  static saveStrand(strand: StrandSpecialization, actor?: User): void {
    const list = this.getStrands();
    const idx = list.findIndex((s) => s.id === strand.id);
    const updated = idx >= 0 ? list.map((s) => (s.id === strand.id ? strand : s)) : [...list, strand];
    setStorageItem(STORAGE_KEYS.STRANDS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_STRAND' : 'CREATE_STRAND',
      module: 'Strands & TechPro',
      recordId: strand.id,
      description: `Saved strand/specialization: ${strand.name}.`,
    });
  }

  // Rooms
  static getRooms(): Room[] {
    return getStorageItem(STORAGE_KEYS.ROOMS, initialRooms);
  }

  static saveRoom(room: Room, actor?: User): void {
    const list = this.getRooms();
    const idx = list.findIndex((r) => r.id === room.id);
    const updated = idx >= 0 ? list.map((r) => (r.id === room.id ? room : r)) : [...list, room];
    setStorageItem(STORAGE_KEYS.ROOMS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_ROOM' : 'CREATE_ROOM',
      module: 'Rooms',
      recordId: room.id,
      description: `Saved room ${room.name} (${room.building}).`,
    });
  }

  // Sections
  static getSections(): Section[] {
    return getStorageItem(STORAGE_KEYS.SECTIONS, initialSections);
  }

  static saveSection(section: Section, actor?: User): void {
    const list = this.getSections();
    const idx = list.findIndex((s) => s.id === section.id);
    const updated = idx >= 0 ? list.map((s) => (s.id === section.id ? section : s)) : [...list, section];
    setStorageItem(STORAGE_KEYS.SECTIONS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_SECTION' : 'CREATE_SECTION',
      module: 'Sections',
      recordId: section.id,
      description: `${idx >= 0 ? 'Updated' : 'Created'} Section "${section.name}".`,
    });
  }

  // Subjects
  static getSubjects(): Subject[] {
    return getStorageItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
  }

  static saveSubject(subject: Subject, actor?: User): void {
    const list = this.getSubjects();
    const idx = list.findIndex((s) => s.id === subject.id);
    const updated = idx >= 0 ? list.map((s) => (s.id === subject.id ? subject : s)) : [...list, subject];
    setStorageItem(STORAGE_KEYS.SUBJECTS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_SUBJECT' : 'CREATE_SUBJECT',
      module: 'Subjects',
      recordId: subject.id,
      description: `Saved Subject ${subject.subjectCode} - ${subject.subjectName}.`,
    });
  }

  // Teachers
  static getTeachers(): Teacher[] {
    const raw = getStorageItem(STORAGE_KEYS.TEACHERS, initialTeachers);
    // Sanitize any existing cached teachers to ensure no last names are displayed
    const sanitized = raw.map((t) => {
      const initMatch = initialTeachers.find((it) => it.id === t.id);
      return {
        ...t,
        firstName: initMatch ? initMatch.firstName : t.firstName,
        lastName: '',
        fullName: initMatch ? initMatch.firstName : t.firstName,
        email: initMatch ? initMatch.email : (t.email ? t.email.replace(/\.[a-z]+@/i, '@') : `${t.firstName.toLowerCase()}@sacredheartacademy.edu.ph`),
      };
    });
    return sanitized;
  }

  static saveTeacher(teacher: Teacher, actor?: User): void {
    const list = this.getTeachers();
    const idx = list.findIndex((t) => t.id === teacher.id);
    const updated = idx >= 0 ? list.map((t) => (t.id === teacher.id ? teacher : t)) : [...list, teacher];
    setStorageItem(STORAGE_KEYS.TEACHERS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_TEACHER' : 'CREATE_TEACHER',
      module: 'Teacher Management',
      recordId: teacher.id,
      description: `Saved teacher profile for ${teacher.fullName}.`,
    });
  }

  // Teacher Assignments
  static getTeacherAssignments(): TeacherAssignment[] {
    return getStorageItem(STORAGE_KEYS.ASSIGNMENTS, initialTeacherAssignments);
  }

  static saveTeacherAssignment(assignment: TeacherAssignment, actor?: User): void {
    const list = this.getTeacherAssignments();
    const idx = list.findIndex((a) => a.id === assignment.id);
    const updated = idx >= 0 ? list.map((a) => (a.id === assignment.id ? assignment : a)) : [...list, assignment];
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, updated);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: 'UPDATE_TEACHER_ASSIGNMENT',
      module: 'Academic Assignments',
      recordId: assignment.id,
      description: `Updated teacher subject & section assignment.`,
    });
  }

  // Schedules & Timetable with Conflict Detection
  static getSchedules(): Schedule[] {
    return getStorageItem(STORAGE_KEYS.SCHEDULES, initialSchedules);
  }

  static detectScheduleConflicts(
    newSchedule: Schedule,
    existingSchedules?: Schedule[]
  ): ScheduleConflict[] {
    const schedules = existingSchedules || this.getSchedules();
    const conflicts: ScheduleConflict[] = [];

    for (const s of schedules) {
      if (s.id === newSchedule.id) continue;
      if (s.dayOfWeek !== newSchedule.dayOfWeek) continue;

      const overlaps = checkTimeIntervalOverlap(
        newSchedule.startTime,
        newSchedule.endTime,
        s.startTime,
        s.endTime
      );

      if (!overlaps) continue;

      // 1. Teacher Conflict
      if (s.teacherId === newSchedule.teacherId) {
        conflicts.push({
          type: 'TEACHER',
          message: `Teacher is already assigned to teach another class on ${s.dayOfWeek} (${formatTime12h(s.startTime)} - ${formatTime12h(s.endTime)}).`,
          conflictingSchedule: s,
        });
      }

      // 2. Section Conflict
      if (s.sectionId === newSchedule.sectionId) {
        conflicts.push({
          type: 'SECTION',
          message: `This section already has an assigned period on ${s.dayOfWeek} (${formatTime12h(s.startTime)} - ${formatTime12h(s.endTime)}).`,
          conflictingSchedule: s,
        });
      }

      // 3. Room Conflict
      if (s.roomId === newSchedule.roomId) {
        conflicts.push({
          type: 'ROOM',
          message: `Room is already occupied on ${s.dayOfWeek} (${formatTime12h(s.startTime)} - ${formatTime12h(s.endTime)}).`,
          conflictingSchedule: s,
        });
      }
    }

    return conflicts;
  }

  static saveSchedule(
    schedule: Schedule,
    actor?: User,
    allowOverride: boolean = false
  ): { success: boolean; conflicts?: ScheduleConflict[] } {
    if (!allowOverride) {
      const conflicts = this.detectScheduleConflicts(schedule);
      if (conflicts.length > 0) {
        return { success: false, conflicts };
      }
    }

    const list = this.getSchedules();
    const idx = list.findIndex((s) => s.id === schedule.id);
    const updated = idx >= 0 ? list.map((s) => (s.id === schedule.id ? schedule : s)) : [...list, schedule];
    setStorageItem(STORAGE_KEYS.SCHEDULES, updated);

    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_SCHEDULE' : 'CREATE_SCHEDULE',
      module: 'Class Timetable',
      recordId: schedule.id,
      description: `Saved timetable slot on ${schedule.dayOfWeek} (${schedule.startTime} - ${schedule.endTime}).`,
    });

    return { success: true };
  }

  static deleteSchedule(id: string, actor?: User): void {
    const list = this.getSchedules();
    const target = list.find((s) => s.id === id);
    setStorageItem(
      STORAGE_KEYS.SCHEDULES,
      list.filter((s) => s.id !== id)
    );
    const user = actor || this.getCurrentUser();
    if (target) {
      this.addAuditLog({
        userId: user.id,
        userName: user.fullName,
        userRole: user.role,
        action: 'DELETE_SCHEDULE',
        module: 'Class Timetable',
        recordId: id,
        description: `Deleted timetable entry for ${target.dayOfWeek} (${target.startTime} - ${target.endTime}).`,
      });
    }
  }

  // Students & Enrollments
  static getStudents(): Student[] {
    return getStorageItem(STORAGE_KEYS.STUDENTS, initialStudents);
  }

  static saveStudent(student: Student, actor?: User): void {
    const list = this.getStudents();
    const idx = list.findIndex((s) => s.id === student.id);
    const updated = idx >= 0 ? list.map((s) => (s.id === student.id ? student : s)) : [student, ...list];
    setStorageItem(STORAGE_KEYS.STUDENTS, updated);

    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_STUDENT' : 'ENROLL_STUDENT',
      module: 'Student Registry',
      recordId: student.id,
      description: `${idx >= 0 ? 'Updated profile of' : 'Enrolled'} learner ${student.fullName} (LRN: ${student.lrn}).`,
    });
  }

  static getEnrollments(): StudentEnrollment[] {
    return getStorageItem(STORAGE_KEYS.ENROLLMENTS, initialEnrollments);
  }

  // Grades & Academic Records
  static getGrades(): GradeRecord[] {
    return getStorageItem(STORAGE_KEYS.GRADES, initialGrades);
  }

  static saveGradeRecord(record: GradeRecord, actor?: User): void {
    const list = this.getGrades();
    const idx = list.findIndex((g) => g.id === record.id);
    const updated = idx >= 0 ? list.map((g) => (g.id === record.id ? record : g)) : [...list, record];
    setStorageItem(STORAGE_KEYS.GRADES, updated);
  }

  static saveBatchGrades(
    records: GradeRecord[],
    actor?: User,
    actionDesc: string = 'Saved batch of grade records'
  ): void {
    const list = this.getGrades();
    const recordMap = new Map(records.map((r) => [r.id, r]));

    const updated = list.map((item) => (recordMap.has(item.id) ? recordMap.get(item.id)! : item));

    // Also add any new records that weren't in list
    for (const r of records) {
      if (!list.some((existing) => existing.id === r.id)) {
        updated.push(r);
      }
    }

    setStorageItem(STORAGE_KEYS.GRADES, updated);

    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: 'UPDATE_GRADES',
      module: 'Gradebook',
      description: `${actionDesc} (${records.length} records processed).`,
    });
  }

  // Announcements
  static getAnnouncements(): Announcement[] {
    return getStorageItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
  }

  static saveAnnouncement(announcement: Announcement, actor?: User): void {
    const list = this.getAnnouncements();
    const idx = list.findIndex((a) => a.id === announcement.id);
    const updated = idx >= 0 ? list.map((a) => (a.id === announcement.id ? announcement : a)) : [announcement, ...list];
    setStorageItem(STORAGE_KEYS.ANNOUNCEMENTS, updated);

    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
      action: idx >= 0 ? 'UPDATE_ANNOUNCEMENT' : 'POST_ANNOUNCEMENT',
      module: 'Announcements',
      recordId: announcement.id,
      description: `Posted announcement: "${announcement.title}".`,
    });
  }

  static deleteAnnouncement(id: string, actor?: User): void {
    const list = this.getAnnouncements();
    const target = list.find((a) => a.id === id);
    setStorageItem(
      STORAGE_KEYS.ANNOUNCEMENTS,
      list.filter((a) => a.id !== id)
    );
    const user = actor || this.getCurrentUser();
    if (target) {
      this.addAuditLog({
        userId: user.id,
        userName: user.fullName,
        userRole: user.role,
        action: 'DELETE_ANNOUNCEMENT',
        module: 'Announcements',
        recordId: id,
        description: `Deleted announcement "${target.title}".`,
      });
    }
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return getStorageItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }

  static addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs].slice(0, 500)); // Keep latest 500
  }

  // Users & Permissions
  static getUsers(): User[] {
    const raw = getStorageItem(STORAGE_KEYS.USERS, initialUsers);
    const sanitized = raw.map((u) => {
      if (u.role === 'TEACHER') {
        const match = initialUsers.find((iu) => iu.id === u.id || iu.username === u.username);
        if (match) {
          return { ...u, fullName: match.fullName, email: match.email };
        }
      }
      return u;
    });
    return sanitized;
  }

  static saveUser(user: User, actor?: User): void {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === user.id);
    const updated = idx >= 0 ? list.map((u) => (u.id === user.id ? user : u)) : [...list, user];
    setStorageItem(STORAGE_KEYS.USERS, updated);
    const current = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: current.id,
      userName: current.fullName,
      userRole: current.role,
      action: idx >= 0 ? 'UPDATE_USER' : 'CREATE_USER',
      module: 'User Management',
      recordId: user.id,
      description: `Saved user account ${user.username} (${user.role}).`,
    });
  }

  static getPermissions(): RolePermissionConfig[] {
    return getStorageItem(STORAGE_KEYS.PERMISSIONS, initialRolePermissions);
  }

  static savePermissions(permissions: RolePermissionConfig[], actor?: User): void {
    setStorageItem(STORAGE_KEYS.PERMISSIONS, permissions);
    const current = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: current.id,
      userName: current.fullName,
      userRole: current.role,
      action: 'UPDATE_PERMISSIONS',
      module: 'Roles & Security',
      description: `Configured system-wide role permissions.`,
    });
  }

  // Current Session User
  static getCurrentUser(): User {
    return getStorageItem(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
  }

  static setCurrentUser(user: User): void {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Complete Database Snapshot
  
  static getDocumentRequests(): DocumentRequest[] {
    return getStorageItem(STORAGE_KEYS.DOCUMENT_REQUESTS, []);
  }
  static saveDocumentRequest(req: DocumentRequest, actor?: User): void {
    const list = this.getDocumentRequests();
    const idx = list.findIndex(r => r.id === req.id);
    if (idx >= 0) list[idx] = req;
    else list.push(req);
    setStorageItem(STORAGE_KEYS.DOCUMENT_REQUESTS, list);
    const user = actor || this.getCurrentUser();
    this.addAuditLog({
      userId: user?.id || 'sys',
      userName: user?.fullName || 'System',
      userRole: user?.role || 'STUDENT',
      action: idx >= 0 ? 'UPDATE_DOC_REQUEST' : 'CREATE_DOC_REQUEST',
      module: 'Document Requests',
      description: `Document request for ${req.documentType} (${req.status})`
    });
  }
  static deleteDocumentRequest(id: string, actor?: User): void {
    const list = this.getDocumentRequests().filter(r => r.id !== id);
    setStorageItem(STORAGE_KEYS.DOCUMENT_REQUESTS, list);
  }

  static getDatabase() {
    return {
      schoolProfile: this.getProfile(),
      schoolYears: this.getSchoolYears(),
      gradeLevels: this.getGradeLevels(),
      tracks: this.getTracks(),
      strands: this.getStrands(),
      rooms: this.getRooms(),
      teachers: this.getTeachers(),
      sections: this.getSections(),
      subjects: this.getSubjects(),
      teacherAssignments: this.getTeacherAssignments(),
      schedules: this.getSchedules(),
      students: this.getStudents(),
      enrollments: this.getEnrollments(),
      grades: this.getGrades(),
      announcements: this.getAnnouncements(),
      auditLogs: this.getAuditLogs(),
      documentRequests: this.getDocumentRequests(),
      users: this.getUsers(),
      permissions: this.getPermissions(),
    };
  }

  // Reset to factory authentic data
  static resetToFactory(): void {
    this.resetToInitialData();
  }

  static resetToInitialData(): void {
    localStorage.clear();
    setStorageItem(STORAGE_KEYS.PROFILE, initialSchoolProfile);
    setStorageItem(STORAGE_KEYS.SCHOOL_YEARS, initialSchoolYears);
    setStorageItem(STORAGE_KEYS.GRADE_LEVELS, initialGradeLevels);
    setStorageItem(STORAGE_KEYS.TRACKS, initialTracks);
    setStorageItem(STORAGE_KEYS.STRANDS, initialStrands);
    setStorageItem(STORAGE_KEYS.ROOMS, initialRooms);
    setStorageItem(STORAGE_KEYS.TEACHERS, initialTeachers);
    setStorageItem(STORAGE_KEYS.SECTIONS, initialSections);
    setStorageItem(STORAGE_KEYS.SUBJECTS, initialSubjects);
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, initialTeacherAssignments);
    setStorageItem(STORAGE_KEYS.SCHEDULES, initialSchedules);
    setStorageItem(STORAGE_KEYS.STUDENTS, initialStudents);
    setStorageItem(STORAGE_KEYS.ENROLLMENTS, initialEnrollments);
    setStorageItem(STORAGE_KEYS.GRADES, initialGrades);
    setStorageItem(STORAGE_KEYS.ANNOUNCEMENTS, initialAnnouncements);
    setStorageItem(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    setStorageItem(STORAGE_KEYS.USERS, initialUsers);
    setStorageItem(STORAGE_KEYS.PERMISSIONS, initialRolePermissions);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, initialUsers[0]);
  }

  // Complete Database Backup Export
  static exportData(): string {
    return this.exportCompleteBackup();
  }

  static exportCompleteBackup(): string {
    const backup = {
      exportTimestamp: new Date().toISOString(),
      school: 'SACRED HEART ACADEMY',
      profile: this.getProfile(),
      schoolYears: this.getSchoolYears(),
      gradeLevels: this.getGradeLevels(),
      tracks: this.getTracks(),
      strands: this.getStrands(),
      rooms: this.getRooms(),
      teachers: this.getTeachers(),
      sections: this.getSections(),
      subjects: this.getSubjects(),
      teacherAssignments: this.getTeacherAssignments(),
      schedules: this.getSchedules(),
      students: this.getStudents(),
      enrollments: this.getEnrollments(),
      grades: this.getGrades(),
      announcements: this.getAnnouncements(),
      auditLogs: this.getAuditLogs(),
      users: this.getUsers(),
      permissions: this.getPermissions(),
    };
    return JSON.stringify(backup, null, 2);
  }

  // Import Backup
  static importData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setStorageItem(STORAGE_KEYS.PROFILE, data.profile);
      if (data.schoolYears) setStorageItem(STORAGE_KEYS.SCHOOL_YEARS, data.schoolYears);
      if (data.gradeLevels) setStorageItem(STORAGE_KEYS.GRADE_LEVELS, data.gradeLevels);
      if (data.tracks) setStorageItem(STORAGE_KEYS.TRACKS, data.tracks);
      if (data.strands) setStorageItem(STORAGE_KEYS.STRANDS, data.strands);
      if (data.rooms) setStorageItem(STORAGE_KEYS.ROOMS, data.rooms);
      if (data.teachers) setStorageItem(STORAGE_KEYS.TEACHERS, data.teachers);
      if (data.sections) setStorageItem(STORAGE_KEYS.SECTIONS, data.sections);
      if (data.subjects) setStorageItem(STORAGE_KEYS.SUBJECTS, data.subjects);
      if (data.teacherAssignments) setStorageItem(STORAGE_KEYS.ASSIGNMENTS, data.teacherAssignments);
      if (data.schedules) setStorageItem(STORAGE_KEYS.SCHEDULES, data.schedules);
      if (data.students) setStorageItem(STORAGE_KEYS.STUDENTS, data.students);
      if (data.enrollments) setStorageItem(STORAGE_KEYS.ENROLLMENTS, data.enrollments);
      if (data.grades) setStorageItem(STORAGE_KEYS.GRADES, data.grades);
      if (data.announcements) setStorageItem(STORAGE_KEYS.ANNOUNCEMENTS, data.announcements);
      if (data.auditLogs) setStorageItem(STORAGE_KEYS.AUDIT_LOGS, data.auditLogs);
      if (data.users) setStorageItem(STORAGE_KEYS.USERS, data.users);
      if (data.permissions) setStorageItem(STORAGE_KEYS.PERMISSIONS, data.permissions);
      return true;
    } catch (e) {
      console.error('Failed to import database:', e);
      return false;
    }
  }
}
