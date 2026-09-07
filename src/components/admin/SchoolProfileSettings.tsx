import React, { useState } from 'react';
import { SchoolProfile, User } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import {
  Award,
  Save,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Building2,
  UserCheck,
} from 'lucide-react';

interface SchoolProfileSettingsProps {
  schoolProfile: SchoolProfile;
  currentUser: User;
  onSaveProfile: (profile: SchoolProfile) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetFactoryData: () => void;
}

export const SchoolProfileSettings: React.FC<SchoolProfileSettingsProps> = ({
  schoolProfile,
  currentUser,
  onSaveProfile,
  onExportData,
  onImportData,
  onResetFactoryData,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>({ ...schoolProfile });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Institutional School Profile & Portal Settings</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official institutional credentials, administrative signatories, and database backups
          </p>
        </div>

        <SchoolLogo size="sm" />
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>School profile details successfully updated and saved!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">School Identity & Accreditation</h3>
            <p className="text-slate-500 text-[11px]">Primary institutional identification and address</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official School Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                DepEd School ID / Code
              </label>
              <input
                type="text"
                required
                value={formData.schoolId}
                onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-mono-code"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Geographical Location / Address
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone / Mobile
              </label>
              <input
                type="text"
                required
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="border-b border-slate-100 pb-3 pt-3">
            <h3 className="text-sm font-bold text-slate-900">Administrative Signatories</h3>
            <p className="text-slate-500 text-[11px]">Official names printed on Form 138, SF10, and reports</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                School Head
              </label>
              <input
                type="text"
                required
                value={formData.schoolHead}
                onChange={(e) => setFormData({ ...formData, schoolHead: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                School Principal
              </label>
              <input
                type="text"
                required
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registrar
              </label>
              <input
                type="text"
                required
                value={formData.registrar}
                onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none font-semibold text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save School Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Management: Backup & Restore */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-900">Database Backup & Recovery</h3>
          <p className="text-slate-500 text-[11px]">
            Export complete school data records to offline JSON or restore from existing backups
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Backup Button */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block mb-1">Download Backup</span>
              <p className="text-[11px] text-slate-500">
                Exports all students, teachers, grades, and schedules to a JSON file.
              </p>
            </div>
            <button
              onClick={onExportData}
              className="mt-3 w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          </div>

          {/* Restore Input */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block mb-1">Restore Backup</span>
              <p className="text-[11px] text-slate-500">
                Load previously exported institutional database snapshot.
              </p>
            </div>
            <label className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Select File to Restore</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Reset Database */}
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 flex flex-col justify-between">
            <div>
              <span className="font-bold text-xs text-rose-900 block mb-1">Factory Reset</span>
              <p className="text-[11px] text-rose-700">
                Reset database back to the authentic Sacred Heart Academy master state.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="mt-3 w-full py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in text-xs">
            <div className="flex items-center gap-3 text-rose-700 mb-3">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Reset School Database?</h3>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              This will restore all 17 authentic teachers (Austin, Eunilyn, Angela, Jenneth, etc.), sample student rosters, subjects, and schedules to the original factory configuration.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetFactoryData();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg shadow-sm"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
