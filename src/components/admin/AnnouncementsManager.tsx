import React, { useState } from 'react';
import { Announcement, User } from '../../types';
import { Megaphone, Plus, Trash2, Tag, Calendar, User as UserIcon, X } from 'lucide-react';

interface AnnouncementsManagerProps {
  announcements: Announcement[];
  currentUser: User;
  onSaveAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AnnouncementsManager: React.FC<AnnouncementsManagerProps> = ({
  announcements,
  currentUser,
  onSaveAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    targetAudience: Announcement['targetAudience'];
    priority: Announcement['priority'];
  }>({
    title: '',
    content: '',
    targetAudience: 'All',
    priority: 'Normal',
  });

  const canPost = currentUser.role !== 'STUDENT';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      publishDate: new Date().toISOString().split('T')[0],
      targetAudience: formData.targetAudience,
      priority: formData.priority,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      isPinned: false,
    };

    onSaveAnnouncement(newAnnouncement);
    setShowModal(false);
    setFormData({
      title: '',
      content: '',
      targetAudience: 'All',
      priority: 'Normal',
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-slate-900">Institutional Announcements & Circulars</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Official communications, academic schedules, exam advisories, and administrative circulars
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ann.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : ann.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {ann.priority} Priority
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Audience: {ann.targetAudience}
                  </span>
                </div>

                {canPost && (
                  <button
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{ann.content}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                <span className="font-medium text-slate-600">
                  {ann.authorName} ({ann.authorRole})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{ann.publishDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-slate-900">Post Official Announcement</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule of 1st Quarter Examinations"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target Audience</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="All">All School Community</option>
                    <option value="Teachers">Faculty / Teachers Only</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Announcement Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type the announcement body, guidelines, and instructions here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-lg shadow-sm">
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
