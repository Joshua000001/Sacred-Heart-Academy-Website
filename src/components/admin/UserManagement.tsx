import React, { useState } from 'react';
import { User, UserRole, RolePermissionConfig } from '../../types';
import {
  UserCog,
  ShieldCheck,
  Check,
  X,
  Plus,
  Edit2,
  Lock,
  User as UserIcon,
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onSaveUser: (user: User) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onSaveUser }) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'PERMISSIONS'>('USERS');

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    status: 'Active' | 'Inactive';
  }>({
    username: '',
    fullName: '',
    email: '',
    role: 'TEACHER',
    status: 'Active',
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: 'TEACHER',
      status: 'Active',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      id: editingUser ? editingUser.id : `usr-${Date.now()}`,
      username: formData.username.toLowerCase(),
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
    };
    onSaveUser(updated);
    setShowModal(false);
  };

  const permissionMatrix: { module: string; permissions: { [role in UserRole]: string } }[] = [
    {
      module: 'Student Profiles & Enrollment',
      permissions: {
        ADMIN: 'Full Access (Create, Read, Update, Archive)',
        HEAD: 'Read-Only (All Records)',
        PRINCIPAL: 'Read-Only (All Records)',
        REGISTRAR: 'Full Access (Enroll, Update, SF10)',
        TEACHER: 'Read-Only (Assigned Sections)',
        STUDENT: 'Read-Only (Own Profile)',
        PARENT: 'Read-Only (Child Profile)',
      },
    },
    {
      module: 'Faculty & Teacher Management',
      permissions: {
        ADMIN: 'Full Access (Manage 17 Teachers)',
        HEAD: 'Read-Only (Overview & Workload)',
        PRINCIPAL: 'Read & Workload Assignment',
        REGISTRAR: 'Read-Only',
        TEACHER: 'Read-Only (Own Profile)',
        STUDENT: 'No Access',
        PARENT: 'No Access',
      },
    },
    {
      module: 'Schedule & Timetable Management',
      permissions: {
        ADMIN: 'Full Access (Create, Edit, Override Conflicts)',
        HEAD: 'Read-Only (Full School Timetable)',
        PRINCIPAL: 'Manage & Review Timetable',
        REGISTRAR: 'Read-Only (Section Timetables)',
        TEACHER: 'Read-Only (Own Class Schedule)',
        STUDENT: 'Read-Only (Own Section Schedule)',
        PARENT: 'Read-Only (Child Schedule)',
      },
    },
    {
      module: 'Grade Encoding & Academic Approvals',
      permissions: {
        ADMIN: 'Full Access (Override & Publish)',
        HEAD: 'Executive Review & Summary',
        PRINCIPAL: 'Approval & Return for Correction',
        REGISTRAR: 'Read-Only (Permanent Records)',
        TEACHER: 'Encode & Submit (Assigned Subjects)',
        STUDENT: 'Read-Only (Published Form 138)',
        PARENT: 'Read-Only (Published Form 138)',
      },
    },
    {
      module: 'System Settings & Audit Trail',
      permissions: {
        ADMIN: 'Full Access (Backups, Reset, Settings)',
        HEAD: 'Read-Only (Audit Trail)',
        PRINCIPAL: 'No Access',
        REGISTRAR: 'No Access',
        TEACHER: 'No Access',
        STUDENT: 'No Access',
        PARENT: 'No Access',
      },
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">User Accounts & Role Permissions (RBAC)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional access control configured for School Head, Principal, Registrar, Faculty, and Students
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'USERS' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Accounts
          </button>
          <button
            onClick={() => setActiveTab('PERMISSIONS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PERMISSIONS' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Permission Matrix
          </button>
        </div>
      </div>

      {/* 1. USERS LIST */}
      {activeTab === 'USERS' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleOpenAdd}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create User Account</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 uppercase border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="py-3 px-4 font-mono-code text-emerald-900 font-semibold">{u.username}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-100 text-rose-900'
                            : u.role === 'HEAD'
                            ? 'bg-purple-100 text-purple-900'
                            : u.role === 'PRINCIPAL'
                            ? 'bg-blue-100 text-blue-900'
                            : u.role === 'REGISTRAR'
                            ? 'bg-amber-100 text-amber-900'
                            : u.role === 'TEACHER'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1 rounded text-slate-400 hover:text-emerald-800 hover:bg-emerald-50"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PERMISSIONS MATRIX */}
      {activeTab === 'PERMISSIONS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Institutional Role-Based Access Control Specification
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 font-bold text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-48">System Module</th>
                  <th className="py-3 px-3">Administrator</th>
                  <th className="py-3 px-3">School Head</th>
                  <th className="py-3 px-3">Principal</th>
                  <th className="py-3 px-3">Registrar</th>
                  <th className="py-3 px-3">Teacher</th>
                  <th className="py-3 px-3">Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {permissionMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50/40">{row.module}</td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">{row.permissions.ADMIN}</td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">{row.permissions.HEAD}</td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">{row.permissions.PRINCIPAL}</td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">{row.permissions.REGISTRAR}</td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">{row.permissions.TEACHER}</td>
                    <td className="py-3 px-3 text-slate-700 text-[11px]">{row.permissions.STUDENT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UserCog className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingUser ? 'Edit User Credentials' : 'Create User Account'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none font-semibold"
                  >
                    <option value="ADMIN">Administrator</option>
                    <option value="HEAD">School Head</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="REGISTRAR">Registrar</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg shadow-sm">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
