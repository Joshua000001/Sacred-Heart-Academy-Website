/**
 * Sacred Heart Academy - School Management Portal
 * Garchitorena, Camarines Sur
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  SchoolProfile,
  SchoolYear,
  Student,
  Teacher,
  TeacherAssignment,
  Subject,
  Section,
  GradeLevel,
  TrackProgram,
  StrandSpecialization,
  Room,
  Schedule,
  GradeRecord,
  Announcement,
  AuditLog,
  ScheduleConflict,
} from './types';
import { SchoolDatabase } from './services/storage';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { TeacherManagement } from './components/admin/TeacherManagement';
import { AcademicStructure } from './components/admin/AcademicStructure';
import { ScheduleManager } from './components/schedule/ScheduleManager';
import { GradeManagement } from './components/grading/GradeManagement';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { StudentPortal } from './components/student/StudentPortal';
import { ReportsViewer } from './components/admin/ReportsViewer';
import { AnnouncementsManager } from './components/admin/AnnouncementsManager';
import { SchoolProfileSettings } from './components/admin/SchoolProfileSettings';
import { UserManagement } from './components/admin/UserManagement';
import { AuditLogsViewer } from './components/admin/AuditLogsViewer';
import { DocumentRequests } from './components/registrar/DocumentRequests';
import { LandingPage } from './components/public/LandingPage';
import { RegistrationView } from './components/auth/RegistrationView';
import { UserProfile } from './components/common/UserProfile';
import { RecordsArchive } from './components/admin/RecordsArchive';
import { Megaphone, X, Calendar, Sparkles } from 'lucide-react';

export default function App() {
  // Database state in memory synced with localStorage
  const [db, setDb] = useState(() => SchoolDatabase.getDatabase());
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [showLanding, setShowLanding] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);

  // Sync state whenever DB operations occur
  const refreshDb = () => {
    setDb(SchoolDatabase.getDatabase());
  };

  // Switch role / user
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    // Reset to default tab for that role
    if (user.role === 'STUDENT') {
      setActiveTab('dashboard');
    } else if (user.role === 'TEACHER') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  
  const handleSaveRequest = (req) => {
    SchoolDatabase.saveDocumentRequest(req, currentUser);
    refreshDb();
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Active School Year
  const activeSchoolYear = db.schoolYears.find((sy) => sy.isActive) || db.schoolYears[0];

  // Save Student
  const handleSaveStudent = (student: Student) => {
    SchoolDatabase.saveStudent(student);
    refreshDb();
  };

  // Save Teacher
  const handleSaveTeacher = (teacher: Teacher) => {
    SchoolDatabase.saveTeacher(teacher);
    refreshDb();
  };

  // Save Assignment
  const handleSaveAssignment = (assignment: TeacherAssignment) => {
    SchoolDatabase.saveTeacherAssignment(assignment);
    refreshDb();
  };

  // Save Schedule with Conflict Detection
  const handleSaveSchedule = (schedule: Schedule, allowOverride: boolean = false) => {
    if (!allowOverride) {
      const conflicts = SchoolDatabase.detectScheduleConflicts(schedule, db.schedules);
      if (conflicts.length > 0) {
        return { success: false, conflicts };
      }
    }
    SchoolDatabase.saveSchedule(schedule);
    refreshDb();
    return { success: true };
  };

  // Delete Schedule
  const handleDeleteSchedule = (id: string) => {
    SchoolDatabase.deleteSchedule(id);
    refreshDb();
  };

  // Save Batch Grades with Workflow Actions
  const handleSaveBatchGrades = (
    records: GradeRecord[],
    actionType: 'SAVE_DRAFT' | 'SUBMIT' | 'APPROVE' | 'RETURN' | 'PUBLISH',
    feedback?: string
  ) => {
    const updatedRecords = records.map((rec) => {
      let nextStatus = rec.status;
      let returnFeedback = rec.returnFeedback;

      if (actionType === 'SAVE_DRAFT') nextStatus = 'Draft';
      else if (actionType === 'SUBMIT') nextStatus = 'Submitted';
      else if (actionType === 'APPROVE') nextStatus = 'Approved';
      else if (actionType === 'RETURN') {
        nextStatus = 'Returned';
        returnFeedback = feedback;
      } else if (actionType === 'PUBLISH') nextStatus = 'Published';

      return {
        ...rec,
        status: nextStatus,
        returnFeedback,
      };
    });

    SchoolDatabase.saveBatchGrades(updatedRecords);

    // Add Audit Log
    SchoolDatabase.addAuditLog({
      userId: currentUser?.id || 'sys',
      userName: currentUser?.fullName || 'System',
      userRole: currentUser?.role || 'ADMIN',
      action:
        actionType === 'SUBMIT'
          ? 'GRADE_SUBMIT'
          : actionType === 'APPROVE'
          ? 'GRADE_APPROVE'
          : actionType === 'PUBLISH'
          ? 'GRADE_PUBLISH'
          : 'UPDATE',
      module: 'Gradebook',
      targetEntity: 'Grades',
      description: `${actionType} action executed on ${records.length} grade records.`,
    });

    refreshDb();
  };

  // Save Subject
  const handleSaveSubject = (sub: Subject) => {
    SchoolDatabase.saveSubject(sub);
    refreshDb();
  };

  // Save Section
  const handleSaveSection = (sec: Section) => {
    SchoolDatabase.saveSection(sec);
    refreshDb();
  };

  // Save Room
  const handleSaveRoom = (rm: Room) => {
    SchoolDatabase.saveRoom(rm);
    refreshDb();
  };

  // Save Track
  const handleSaveTrack = (t: TrackProgram) => {
    SchoolDatabase.saveTrack(t);
    refreshDb();
  };

  // Save Strand
  const handleSaveStrand = (s: StrandSpecialization) => {
    SchoolDatabase.saveStrand(s);
    refreshDb();
  };

  // Save Announcement
  const handleSaveAnnouncement = (ann: Announcement) => {
    SchoolDatabase.saveAnnouncement(ann);
    refreshDb();
  };

  // Delete Announcement
  const handleDeleteAnnouncement = (id: string) => {
    SchoolDatabase.deleteAnnouncement(id);
    refreshDb();
  };

  // Save School Profile
  const handleSaveProfile = (profile: SchoolProfile) => {
    SchoolDatabase.saveSchoolProfile(profile);
    refreshDb();
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = SchoolDatabase.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SacredHeartAcademy_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (jsonStr: string) => {
    const success = SchoolDatabase.importData(jsonStr);
    if (success) {
      refreshDb();
    }
  };

  // Factory Reset
  const handleResetFactory = () => {
    SchoolDatabase.resetToFactory();
    const fresh = SchoolDatabase.getDatabase();
    setDb(fresh);
    setCurrentUser(fresh.users[0]);
  };

  // Save User
  const handleSaveUser = (user: User) => {
    SchoolDatabase.saveUser(user);
    refreshDb();
    if (currentUser?.id === user.id) {
      setCurrentUser(user);
    }
  };

  // If unauthenticated, show official Login View
  if (!currentUser) {
    if (showLanding) {
      return (
        <LandingPage
          schoolProfile={db.schoolProfile}
          onEnterPortal={() => setShowLanding(false)}
          onEnrollNow={() => {
            setShowLanding(false);
            setShowRegistration(true);
          }}
        />
      );
    }

    if (showRegistration) {
      return (
        <RegistrationView
          schoolProfile={db.schoolProfile}
          gradeLevels={db.gradeLevels}
          onBack={() => {
            setShowRegistration(false);
            setShowLanding(true);
          }}
          onRegisterSuccess={(newUser, newStudent) => {
            handleSaveStudent(newStudent);
            handleSaveUser(newUser);
            setShowRegistration(false);
            handleSelectUser(newUser); // Automatically log them in after registration
          }}
        />
      );
    }

    return (
      <LoginView
        schoolProfile={db.schoolProfile}
        onLoginSuccess={(u) => handleSelectUser(u)}
        onBackToHome={() => setShowLanding(true)}
      />
    );
  }

  // Find linked entities for specific roles
  const loggedTeacher =
    db.teachers.find((t) => t.id === currentUser.relatedEntityId) ||
    db.teachers.find((t) => t.username.toLowerCase() === currentUser.username.toLowerCase()) ||
    db.teachers[0];

  const loggedStudent =
    db.students.find((s) => s.id === currentUser.relatedEntityId) ||
    db.students.find((s) => s.studentId.toLowerCase() === currentUser.username.toLowerCase()) ||
    db.students[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-900 selection:text-white">
      {/* Header */}
      <Header
        currentUser={currentUser}
        schoolProfile={db.schoolProfile}
        activeSchoolYear={activeSchoolYear}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        onOpenAnnouncements={() => setShowAnnouncementsModal(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          currentUser={currentUser}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          schoolProfile={db.schoolProfile}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* 1. ADMIN & EXECUTIVE VIEWS */}
          {activeTab === 'dashboard' && currentUser.role === 'ADMIN' && (
            <AdminDashboard
              students={db.students}
              teachers={db.teachers}
              subjects={db.subjects}
              sections={db.sections}
              gradeLevels={db.gradeLevels}
              tracks={db.tracks}
              grades={db.grades}
              announcements={db.announcements}
              auditLogs={db.auditLogs}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'dashboard' && (currentUser.role === 'HEAD' || currentUser.role === 'PRINCIPAL' || currentUser.role === 'REGISTRAR') && (
            <AdminDashboard
              students={db.students}
              teachers={db.teachers}
              subjects={db.subjects}
              sections={db.sections}
              gradeLevels={db.gradeLevels}
              tracks={db.tracks}
              grades={db.grades}
              announcements={db.announcements}
              auditLogs={db.auditLogs}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* 2. TEACHER PORTAL */}
          {currentUser.role === 'TEACHER' && activeTab === 'dashboard' && (
            <TeacherPortal
              currentTeacher={loggedTeacher}
              assignments={db.teacherAssignments}
              subjects={db.subjects}
              sections={db.sections}
              schedules={db.schedules}
              students={db.students}
              grades={db.grades}
              announcements={db.announcements}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {currentUser.role === 'TEACHER' && (activeTab === 'my_classes' || activeTab === 'my_subjects') && (
            <TeacherPortal
              currentTeacher={loggedTeacher}
              assignments={db.teacherAssignments}
              subjects={db.subjects}
              sections={db.sections}
              schedules={db.schedules}
              students={db.students}
              grades={db.grades}
              announcements={db.announcements}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* 3. STUDENT PORTAL */}
          {currentUser.role === 'STUDENT' && (activeTab === 'dashboard' || activeTab === 'profile' || activeTab === 'my_grades') && (
            <StudentPortal
              currentStudent={loggedStudent}
              grades={db.grades}
              subjects={db.subjects}
              sections={db.sections}
              gradeLevels={db.gradeLevels}
              schedules={db.schedules}
              teachers={db.teachers}
              schoolProfile={db.schoolProfile}
              announcements={db.announcements}
            />
          )}

          {/* 4. STUDENTS MANAGEMENT & ENROLLMENT */}
          {(activeTab === 'students' || activeTab === 'enrollment' || activeTab === 'my_students') && (
            <StudentManagement
              students={db.students}
              gradeLevels={db.gradeLevels}
              sections={db.sections}
              schoolYears={db.schoolYears}
              tracks={db.tracks}
              strands={db.strands}
              currentUser={currentUser}
              onSaveStudent={handleSaveStudent}
            />
          )}

          {/* 5. TEACHER MANAGEMENT */}
          {activeTab === 'teachers' && (
            <TeacherManagement
              teachers={db.teachers}
              assignments={db.teacherAssignments}
              subjects={db.subjects}
              sections={db.sections}
              gradeLevels={db.gradeLevels}
              schedules={db.schedules}
              currentUser={currentUser}
              onSaveTeacher={handleSaveTeacher}
              onSaveAssignment={handleSaveAssignment}
            />
          )}

          {/* 6. ACADEMIC STRUCTURE (SUBJECTS, SECTIONS, ROOMS, TRACKS) */}
          {(activeTab === 'subjects' ||
            activeTab === 'grade_levels' ||
            activeTab === 'tracks_strands' ||
            activeTab === 'sections' ||
            activeTab === 'rooms' ||
            activeTab === 'school_overview' ||
            activeTab === 'academic_overview') && (
            <AcademicStructure
              subjects={db.subjects}
              sections={db.sections}
              gradeLevels={db.gradeLevels}
              tracks={db.tracks}
              strands={db.strands}
              rooms={db.rooms}
              teachers={db.teachers}
              schoolYears={db.schoolYears}
              initialTab={
                activeTab === 'sections'
                  ? 'sections'
                  : activeTab === 'grade_levels'
                  ? 'grade_levels'
                  : activeTab === 'tracks_strands'
                  ? 'tracks_strands'
                  : activeTab === 'rooms'
                  ? 'rooms'
                  : 'subjects'
              }
              onSaveSubject={handleSaveSubject}
              onSaveSection={handleSaveSection}
              onSaveRoom={handleSaveRoom}
              onSaveTrack={handleSaveTrack}
              onSaveStrand={handleSaveStrand}
            />
          )}

          {/* 7. SCHEDULES & TIMETABLE */}
          {(activeTab === 'schedules' || activeTab === 'my_schedule') && (
            <ScheduleManager
              schedules={db.schedules}
              teachers={db.teachers}
              subjects={db.subjects}
              sections={db.sections}
              rooms={db.rooms}
              gradeLevels={db.gradeLevels}
              currentUser={currentUser}
              onSaveSchedule={handleSaveSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {/* 8. GRADES & GRADING WORKFLOW */}
          {activeTab === 'grades' && (
            <GradeManagement
              grades={db.grades}
              students={db.students}
              subjects={db.subjects}
              sections={db.sections}
              teachers={db.teachers}
              currentUser={currentUser}
              onSaveBatchGrades={handleSaveBatchGrades}
            />
          )}

          {/* 9. ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <AnnouncementsManager
              announcements={db.announcements}
              currentUser={currentUser}
              onSaveAnnouncement={handleSaveAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}

          {/* 10. RECORDS ARCHIVE */}
          {activeTab === 'records_archive' && (
            <RecordsArchive
              currentUser={currentUser}
              schoolProfile={db.schoolProfile}
            />
          )}

          {/* 10. REPORTS */}
          {activeTab === 'reports' && (
            <ReportsViewer
              students={db.students}
              teachers={db.teachers}
              subjects={db.subjects}
              sections={db.sections}
              gradeLevels={db.gradeLevels}
              grades={db.grades}
              schedules={db.schedules}
              assignments={db.teacherAssignments}
              schoolProfile={db.schoolProfile}
            />
          )}

          {/* 11. USERS & ROLES */}
          {activeTab === 'users' && (
            <UserManagement users={db.users} onSaveUser={handleSaveUser} />
          )}

          {/* 12. AUDIT LOGS */}
          {activeTab === 'audit_logs' && <AuditLogsViewer logs={db.auditLogs} />}

          {/* 13. SCHOOL PROFILE & SETTINGS */}
          {(activeTab === 'school_profile' || activeTab === 'settings') && (
            <SchoolProfileSettings
              schoolProfile={db.schoolProfile}
              currentUser={currentUser}
              onSaveProfile={handleSaveProfile}
              onExportData={handleExportBackup}
              onImportData={handleImportBackup}
              onResetFactoryData={handleResetFactory}
            />
          )}

          {/* 14. USER PROFILE */}
          
          {(activeTab === 'requests' || activeTab === 'my_requests') && (
            <DocumentRequests
              currentUser={currentUser}
              requests={db.documentRequests || []}
              students={db.students}
              onSaveRequest={handleSaveRequest}
            />
          )}
  
          {activeTab === 'profile' && (
            <UserProfile
              currentUser={currentUser}
              onUpdateUser={handleSaveUser}
            />
          )}
        </main>
      </div>

      {/* Header Quick Announcements Modal */}
      {showAnnouncementsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">Official Notices & Circulars</h3>
              </div>
              <button
                onClick={() => setShowAnnouncementsModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {db.announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ann.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {ann.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{ann.content}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Author: {ann.authorName}</span>
                    <span>{ann.publishDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
