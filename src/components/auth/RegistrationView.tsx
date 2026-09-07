import React, { useState } from 'react';
import { SchoolProfile, User, Student, GradeLevel } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { ArrowLeft, UserPlus, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RegistrationViewProps {
  schoolProfile: SchoolProfile;
  onBack: () => void;
  onRegisterSuccess: (user: User, student: Student) => void;
  gradeLevels: GradeLevel[];
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  schoolProfile,
  onBack,
  onRegisterSuccess,
  gradeLevels,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gradeLevelId, setGradeLevelId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !gradeLevelId) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    // Generate unique IDs
    const studentTempId = `stud-new-${Date.now()}`;
    const username = `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase().replace(/\s+/g, '')}`;
    const officialStudentId = `ID-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Construct Student object
    const newStudent: Student = {
      id: studentTempId,
      studentId: officialStudentId,
      lrn: `109${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      gradeLevelId,
      enrollmentStatus: 'Active', // Correct type 'EnrollmentStatus'
      birthdate: new Date().toISOString(),
      sex: 'Female', // Default, should ideally be in form
      address: '',
      contactNumber: '',
      parentGuardian: '',
      guardianContact: '',
      sectionId: '',
      schoolYearId: 'sy-2026-2027', // Use active school year
      createdAt: new Date().toISOString()
    };

    // Construct User object
    const newUser: User = {
      id: `user-${studentTempId}`,
      username: username,
      email: email,
      fullName: newStudent.fullName,
      role: 'STUDENT',
      relatedEntityId: studentTempId,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    setSuccess(true);

    // Call success handler after showing success screen briefly
    setTimeout(() => {
      onRegisterSuccess(newUser, newStudent);
    }, 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-6 shadow-xl rounded-2xl text-center border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Successful!</h2>
            <p className="text-sm text-slate-500 mb-6">
              Welcome to {schoolProfile.name}. Your portal account has been created.
            </p>
            <p className="text-xs text-slate-400">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <div className="flex justify-center mb-3">
          <SchoolLogo size="xl" className="shadow-lg rounded-full" />
        </div>
        <h2 className="font-seal text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight uppercase">
          {schoolProfile.name}
        </h2>
        <p className="mt-1 text-sm font-semibold text-emerald-800 tracking-wide">
          Student Enrollment Application
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200">
          <div className="mb-6 pb-6 border-b border-slate-100 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex justify-center items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-700" /> Create Portal Account
            </h3>
            <p className="text-xs text-slate-500">Fill out this form to apply for admission and create your student account.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400"
                  placeholder="e.g. Juan"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400"
                  placeholder="e.g. Dela Cruz"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400"
                placeholder="juan@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Grade Level Applying For
              </label>
              <select
                required
                value={gradeLevelId}
                onChange={(e) => setGradeLevelId(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
              >
                <option value="">Select Grade Level</option>
                {gradeLevels.map((gl) => (
                  <option key={gl.id} value={gl.id}>
                    {gl.name} ({gl.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Portal Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400"
                placeholder="Min 6 characters"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 transition-colors"
              >
                <span>Submit Enrollment Application</span>
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Your data is securely stored and protected by {schoolProfile.name}.</span>
        </div>
      </div>
    </div>
  );
};
