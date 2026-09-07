export type UserRole = 'ADMIN' | 'HEAD' | 'PRINCIPAL' | 'REGISTRAR' | 'TEACHER' | 'STUDENT' | 'PARENT';

export type EnrollmentStatus = 'Active' | 'Transferred' | 'Graduated' | 'Dropped' | 'Archived';

export type GradeStatus = 'Draft' | 'Submitted' | 'Reviewed' | 'Approved' | 'Returned' | 'Published';

export type GradeLevelCategory = 'JHS' | 'SHS';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  relatedEntityId?: string; // links to teacherId, studentId, or official
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface RolePermissionConfig {
  role: UserRole;
  displayName: string;
  description: string;
  assignedOfficial?: string;
  canManageStudents: boolean;
  canManageTeachers: boolean;
  canManageSubjects: boolean;
  canManageSections: boolean;
  canManageSchedules: boolean;
  canEncodeGrades: boolean;
  canApproveGrades: boolean;
  canPublishGrades: boolean;
  canPostAnnouncements: boolean;
  canGenerateReports: boolean;
  canManageSettings: boolean;
  canViewAuditLogs: boolean;
}

export interface SchoolProfile {
  id: string;
  name: string;
  schoolId: string;
  tagline: string;
  location: string;
  address: string;
  division: string;
  region: string;
  contactNumber: string;
  email: string;
  headOfficial: string;
  headTitle: string;
  schoolHead: string;
  principalOfficial: string;
  principalTitle: string;
  principal: string;
  registrarOfficial: string;
  registrarTitle: string;
  registrar: string;
  currentSchoolYearId: string;
  currentGradingPeriod: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  gradingScalePassing: number;
}

export interface SchoolYear {
  id: string;
  name: string; // e.g. "2026–2027"
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
  isArchived: boolean;
}

export interface GradeLevel {
  id: string;
  name: string; // "Grade 7", "Grade 8", etc.
  levelNumber: number; // 7, 8, 9, 10, 11, 12
  category: GradeLevelCategory;
}

export interface TrackProgram {
  id: string;
  name: string; // "Academic Track", "TVL Track"
  code: string;
  description: string;
}

export interface StrandSpecialization {
  id: string;
  trackProgramId: string;
  name: string; // e.g., "STEM", "ABM", "HUMSS", "ICT - Computer Systems", etc.
  code: string;
  description: string;
}

export interface Room {
  id: string;
  name: string; // e.g., "Room 1", "Science Lab", "Computer Lab"
  building: string;
  capacity: number;
  type?: string;
  status: 'Available' | 'Maintenance';
}

export interface Section {
  id: string;
  name: string; // e.g., "Section St. Joseph", "Section Diamond"
  gradeLevelId: string;
  schoolYearId: string;
  trackProgramId?: string;
  strandSpecializationId?: string;
  adviserTeacherId?: string;
  roomId?: string;
  status: 'Active' | 'Archived';
}

export interface Subject {
  id: string;
  subjectCode: string; // e.g., "MATH-7", "SCI-8", "ENG-7"
  subjectName: string; // e.g., "Mathematics", "Science", "English"
  description: string;
  gradeLevelId: string;
  trackProgramId?: string;
  strandSpecializationId?: string;
  units: number;
  status: 'Active' | 'Inactive';
}

export interface Teacher {
  id: string;
  teacherId: string; // e.g. "TCH-2026-001"
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  contactNumber: string;
  email: string;
  username: string;
  accountStatus: 'Active' | 'On Leave' | 'Inactive';
  specialization?: string;
  photoUrl?: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  sectionId: string;
  schoolYearId: string;
}

export interface Schedule {
  id: string;
  schoolYearId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // "07:45" (24h) or "7:45 AM"
  endTime: string;   // "08:35" (24h) or "8:35 AM"
  teacherId: string;
  subjectId: string;
  gradeLevelId: string;
  sectionId: string;
  roomId: string;
  trackProgramId?: string;
  strandSpecializationId?: string;
}

export interface ScheduleConflict {
  type: 'TEACHER' | 'SECTION' | 'ROOM';
  message: string;
  conflictingSchedule: Schedule;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "SHA-2026-0012"
  lrn: string;       // Learner Reference Number (12 digits)
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  fullName: string;
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
  trackProgramId?: string;
  strandSpecializationId?: string;
  enrollmentStatus: EnrollmentStatus;
  photoUrl?: string;
  createdAt: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  schoolYearId: string;
  gradeLevelId: string;
  sectionId: string;
  trackProgramId?: string;
  strandSpecializationId?: string;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string;
  remarks?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  sectionId: string;
  schoolYearId: string;
  teacherId: string;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  finalGrade?: number | null;
  rawScores?: any; // To store detailed DepEd class record JSON data
  remarks?: string; // "Passed", "Failed", "Incomplete"
  status: GradeStatus;
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  returnFeedback?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  targetAudience: 'School-Wide' | 'Grade-Level' | 'Section-Level' | 'Teachers-Only' | 'SHS-Only' | 'JHS-Only' | 'All' | 'Teachers' | 'Students' | 'Parents';
  gradeLevelId?: string;
  sectionId?: string;
  publishDate: string;
  expirationDate?: string;
  isPinned: boolean;
  priority: 'Normal' | 'High' | 'Urgent';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  targetEntity?: string;
  recordId?: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
}

export type DocumentType = 'Transcript of Records' | 'Diploma' | 'Certificate of Graduation' | 'Certificate of Enrollment' | 'Certificate of Good Moral Character' | 'Certificate of Grades' | 'Form 137' | 'Other';
export type DocumentRequestStatus = 'Pending' | 'Processing' | 'For Release' | 'Claimed' | 'Rejected';

export interface DocumentRequest {
  id: string;
  studentId: string;
  documentType: DocumentType;
  copies: number;
  purpose: string;
  status: DocumentRequestStatus;
  requestDate: string;
  releaseDate?: string;
  feeAmount: number;
  paymentStatus: 'Pending' | 'Paid';
  remarks?: string;
}
