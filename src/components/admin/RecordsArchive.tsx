import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  FileArchive,
  FileText,
  GraduationCap,
  History,
  Search,
  ShieldCheck,
  Upload,
  User,
  Users,
  X,
} from 'lucide-react';
import { SchoolProfile, User as PortalUser, UserRole } from '../../types';

interface RecordsArchiveProps {
  currentUser: PortalUser;
  schoolProfile: SchoolProfile;
}

type ArchiveCategory =
  | 'Student & Alumni Records'
  | 'Diplomas'
  | 'Form 137 / Form 138'
  | 'Certificates'
  | 'Teacher Records'
  | 'School Records'
  | 'Historical Archive';

interface ArchiveRecord {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: ArchiveCategory;
  documentType: string;
  recordYear: number;
  schoolYear: string;
  personName: string;
  personNumber: string;
  gradeLevel: string;
  section: string;
  subject: string;
  description: string;
  uploadedById: string;
  uploadedBy: string;
  uploaderRole: UserRole;
  uploadedAt: string;
  folderPath: string;
  blob: Blob;
}

const DB_NAME = 'sha-records-archive';
const DB_VERSION = 1;
const STORE_NAME = 'records';

const CATEGORY_OPTIONS: ArchiveCategory[] = [
  'Student & Alumni Records',
  'Diplomas',
  'Form 137 / Form 138',
  'Certificates',
  'Teacher Records',
  'School Records',
  'Historical Archive',
];

const DOCUMENT_TYPES: Record<ArchiveCategory, string[]> = {
  'Student & Alumni Records': [
    'Student Record',
    'Alumni Record',
    'Permanent Record',
    'Enrollment Record',
    'School Record',
    'Other',
  ],
  Diplomas: [
    'Diploma',
    'Duplicate Diploma',
    'Replacement Diploma',
    'Diploma Scan',
    'Other',
  ],
  'Form 137 / Form 138': [
    'Form 137',
    'Form 138',
    'Form 137 / SF10',
    'Report Card',
    'Academic Record',
    'Other',
  ],
  Certificates: [
    'Certificate of Graduation',
    'Good Moral Certificate',
    'Certificate of Enrollment',
    'Certificate of Grades',
    'Authentication / Certification',
    'Other Certificate',
  ],
  'Teacher Records': [
    'Grades',
    'Class Record',
    'Lesson Plan',
    'Daily Lesson Log',
    'School Report',
    'Teacher Requirement',
    'Other Teacher File',
  ],
  'School Records': [
    'School Permit',
    'Memorandum',
    'Official Report',
    'Accreditation',
    'School Policy',
    'Administrative Document',
    'Other',
  ],
  'Historical Archive': [
    'Historical Document',
    'Historical Photo',
    'Yearbook',
    'Graduation Program',
    'School Memorabilia',
    'Old School Record',
    'Other Historical File',
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'System Administrator',
  HEAD: 'School Head',
  PRINCIPAL: 'Principal',
  REGISTRAR: 'Registrar',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
};

const canManageArchive = (role: UserRole) =>
  ['ADMIN', 'HEAD', 'PRINCIPAL', 'REGISTRAR', 'TEACHER'].includes(role);

const openArchiveDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('recordYear', 'recordYear', { unique: false });
        store.createIndex('personName', 'personName', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getAllArchiveRecords = async (): Promise<ArchiveRecord[]> => {
  const db = await openArchiveDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as ArchiveRecord[]);
    request.onerror = () => reject(request.error);
  });
};

const saveArchiveRecord = async (record: ArchiveRecord) => {
  const db = await openArchiveDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const deleteArchiveRecord = async (id: string) => {
  const db = await openArchiveDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

const fileType = (name: string) => {
  const ext = name.split('.').pop();
  return ext ? ext.toUpperCase() : 'FILE';
};

export const RecordsArchive: React.FC<RecordsArchiveProps> = ({
  currentUser,
  schoolProfile,
}) => {
  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ArchiveCategory>('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [showUploadForm, setShowUploadForm] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [category, setCategory] = useState<ArchiveCategory>(
    currentUser.role === 'TEACHER' ? 'Teacher Records' : 'Student & Alumni Records'
  );
  const [documentType, setDocumentType] = useState(
    currentUser.role === 'TEACHER' ? 'Grades' : 'Student Record'
  );
  const [recordYear, setRecordYear] = useState(new Date().getFullYear());
  const [schoolYear, setSchoolYear] = useState('2026-2027');
  const [personName, setPersonName] = useState('');
  const [personNumber, setPersonNumber] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllArchiveRecords();
        data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setRecords(data);
      } catch (error) {
        console.error(error);
        setErrorMessage('Unable to load the archive.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setCategory(currentUser.role === 'TEACHER' ? 'Teacher Records' : 'Student & Alumni Records');
  }, [currentUser.role]);

  useEffect(() => {
    setDocumentType(DOCUMENT_TYPES[category][0]);
  }, [category]);

  const allowedCategories = currentUser.role === 'TEACHER'
    ? (['Teacher Records'] as ArchiveCategory[])
    : CATEGORY_OPTIONS;

  const visibleRecords = useMemo(() => {
    let data = [...records];
    if (currentUser.role === 'TEACHER') {
      data = data.filter((record) => record.uploadedById === currentUser.id);
    }
    if (categoryFilter !== 'ALL') {
      data = data.filter((record) => record.category === categoryFilter);
    }
    if (yearFilter !== 'ALL') {
      data = data.filter((record) => String(record.recordYear) === yearFilter);
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter((record) =>
        [
          record.fileName,
          record.documentType,
          record.category,
          record.personName,
          record.personNumber,
          record.uploadedBy,
          record.subject,
          record.section,
          record.folderPath,
        ].join(' ').toLowerCase().includes(q)
      );
    }

    return data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [records, currentUser.id, currentUser.role, categoryFilter, yearFilter, searchTerm]);

  const stats = useMemo(() => {
    const base = currentUser.role === 'TEACHER'
      ? records.filter((record) => record.uploadedById === currentUser.id)
      : records;

    return {
      total: base.length,
      student: base.filter((r) => ['Student & Alumni Records', 'Diplomas', 'Form 137 / Form 138'].includes(r.category)).length,
      teacher: base.filter((r) => r.category === 'Teacher Records').length,
      historical: base.filter((r) => r.category === 'Historical Archive').length,
    };
  }, [records, currentUser.id, currentUser.role]);

  const years = useMemo(() => {
    const set = new Set<number>(records
      .filter((record) => currentUser.role !== 'TEACHER' || record.uploadedById === currentUser.id)
      .map((record) => record.recordYear));
    set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [records, currentUser.id, currentUser.role]);

  const folderPath = [
    'Sacred Heart Academy',
    category,
    String(recordYear),
    personName.trim() || 'Unassigned Person',
  ].join(' / ');

  const selectFiles = (files: File[]) => {
    setSelectedFiles(files.filter((file) => file.size > 0));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const uploadFiles = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (!selectedFiles.length) {
      setErrorMessage('Please choose at least one file.');
      return;
    }

    if (!personName.trim()) {
      setErrorMessage(currentUser.role === 'TEACHER'
        ? 'Please enter the teacher / staff name.'
        : 'Please enter the student / graduate name.');
      return;
    }

    try {
      const uploadedAt = new Date().toISOString();

      for (const file of selectedFiles) {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        await saveArchiveRecord({
          id,
          fileName: file.name,
          fileType: fileType(file.name),
          fileSize: file.size,
          category,
          documentType,
          recordYear,
          schoolYear,
          personName: personName.trim(),
          personNumber: personNumber.trim(),
          gradeLevel: gradeLevel.trim(),
          section: section.trim(),
          subject: subject.trim(),
          description: description.trim(),
          uploadedById: currentUser.id,
          uploadedBy: currentUser.fullName,
          uploaderRole: currentUser.role,
          uploadedAt,
          folderPath,
          blob: file,
        });
      }

      const refreshed = await getAllArchiveRecords();
      refreshed.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      setRecords(refreshed);

      const count = selectedFiles.length;
      setSelectedFiles([]);
      setPersonName('');
      setPersonNumber('');
      setGradeLevel('');
      setSection('');
      setSubject('');
      setDescription('');

      setSuccessMessage(`${count} file${count === 1 ? '' : 's'} uploaded and organized successfully.`);
    } catch (error) {
      console.error(error);
      setErrorMessage('Upload failed. Please try again.');
    }
  };

  const viewRecord = (record: ArchiveRecord) => {
    const url = URL.createObjectURL(record.blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const downloadRecord = (record: ArchiveRecord) => {
    const url = URL.createObjectURL(record.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = record.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const removeRecord = async (record: ArchiveRecord) => {
    if (currentUser.role === 'TEACHER' && record.uploadedById !== currentUser.id) {
      setErrorMessage('Teachers can only remove files they uploaded.');
      return;
    }

    if (!window.confirm(`Delete "${record.fileName}" from the local archive?`)) return;

    await deleteArchiveRecord(record.id);
    setRecords((items) => items.filter((item) => item.id !== record.id));
    setSuccessMessage(`Deleted: ${record.fileName}`);
  };

  if (!canManageArchive(currentUser.role)) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <ShieldCheck className="w-8 h-8 text-rose-600" />
        <h2 className="text-xl font-extrabold text-slate-900 mt-3">Access Restricted</h2>
        <p className="text-sm text-slate-500 mt-1">Your role does not have access to the Records Archive.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="bg-emerald-950 text-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-7 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Archive className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-300 font-bold">Sacred Heart Academy</p>
                  <h1 className="text-2xl sm:text-3xl font-black">Records Archive</h1>
                </div>
              </div>
              <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl">
                Preserve, organize, and manage important school records from 1956 to present.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl px-4 py-3 min-w-[220px] border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Current Account</p>
              <p className="font-bold mt-1">{currentUser.fullName}</p>
              <p className="text-xs text-emerald-200">{ROLE_LABELS[currentUser.role]}</p>
              <p className="text-xs text-emerald-300/70 mt-1">{schoolProfile.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{
          label: 'Total Files', value: stats.total, icon: FileArchive,
        }, {
          label: 'Student / Alumni', value: stats.student, icon: GraduationCap,
        }, {
          label: 'Teacher Files', value: stats.teacher, icon: BookOpen,
        }, {
          label: 'Historical Archive', value: stats.historical, icon: History,
        }].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-emerald-950">{item.value}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4">{item.label}</p>
            </div>
          );
        })}
      </div>

      {successMessage && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-700" />
          <p className="text-sm font-medium flex-1">{successMessage}</p>
          <button type="button" onClick={() => setSuccessMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl px-4 py-3">
          <ShieldCheck className="w-5 h-5 mt-0.5 text-rose-700" />
          <p className="text-sm font-medium flex-1">{errorMessage}</p>
          <button type="button" onClick={() => setErrorMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-emerald-950">Upload School Records</h2>
            <p className="text-sm text-slate-500 mt-1">Files are organized using category, year, person, and uploader.</p>
          </div>
          <button type="button" onClick={() => setShowUploadForm((value) => !value)} className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900">
            {showUploadForm ? 'Hide Form' : 'Upload Files'}
          </button>
        </div>

        {showUploadForm && (
          <div className="p-6 space-y-6">
            <div className="grid lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as ArchiveCategory)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white">
                  {allowedCategories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Document Type</label>
                <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white">
                  {DOCUMENT_TYPES[category].map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Record Year / Year Graduated</label>
                <select value={recordYear} onChange={(e) => setRecordYear(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white">
                  {Array.from({ length: new Date().getFullYear() - 1955 }, (_, i) => 1956 + i).reverse().map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-5">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{currentUser.role === 'TEACHER' ? 'Teacher / Staff Name' : 'Student / Graduate Name'}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder={currentUser.role === 'TEACHER' ? 'e.g. Teacher Austin' : 'e.g. Juan Dela Cruz'} className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">ID / Student No. / Employee No.</label>
                <input value={personNumber} onChange={(e) => setPersonNumber(e.target.value)} placeholder="Optional" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">School Year</label>
                <input value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Grade Level</label>
                <input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="e.g. Grade 10" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Section</label>
                <input value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. St. Joseph" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="For grades / teacher files" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
              </div>
            </div>

            <div
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); selectFiles(Array.from(e.dataTransfer.files)); }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center ${dragActive ? 'border-emerald-600 bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center"><Upload className="w-7 h-7" /></div>
              <h3 className="mt-4 text-lg font-extrabold text-emerald-950">Drag and drop files here</h3>
              <p className="text-sm text-slate-500 mt-1">or choose files from your computer</p>
              <label className="inline-flex items-center gap-2 mt-5 px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl cursor-pointer font-bold text-sm">
                <Upload className="w-4 h-4" /> Choose Files
                <input type="file" multiple className="hidden" onChange={(e) => selectFiles(Array.from(e.target.files || []))} />
              </label>
              <p className="text-xs text-slate-400 mt-4">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG and other browser-supported files</p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">Selected Files ({selectedFiles.length})</h4>
                  <button type="button" onClick={() => setSelectedFiles([])} className="text-xs font-bold text-rose-600">Clear</button>
                </div>
                <div className="space-y-2">
                  {selectedFiles.map((file) => (
                    <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
                      <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description / Remarks</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Add notes or important details..." className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm resize-none" />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Archive className="w-5 h-5 text-emerald-700 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-emerald-700">Automatic Archive Location</p>
                  <p className="text-sm font-bold text-emerald-950 mt-1 break-words">{folderPath}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-slate-500">Uploaded by <b>{currentUser.fullName}</b> · {ROLE_LABELS[currentUser.role]}</p>
              <button type="button" onClick={uploadFiles} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold">
                <Upload className="w-4 h-4" /> Upload & Organize
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search filename, student, graduate, teacher, document..." className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 text-sm" />
          </div>
          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as 'ALL' | ArchiveCategory)} className="appearance-none min-w-[230px] rounded-xl border border-slate-300 px-4 pr-10 py-3 text-sm bg-white">
              <option value="ALL">All Categories</option>
              {allowedCategories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="relative">
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="appearance-none min-w-[140px] rounded-xl border border-slate-300 px-4 pr-10 py-3 text-sm bg-white">
              <option value="ALL">All Years</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-emerald-950">Archived Records</h2>
            <p className="text-sm text-slate-500 mt-1">{loading ? 'Loading records...' : `${visibleRecords.length} record${visibleRecords.length === 1 ? '' : 's'} found`}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"><Calendar className="w-4 h-4" /> 1956 → {new Date().getFullYear()}</div>
        </div>

        <div className="overflow-x-auto">
          {visibleRecords.length === 0 && !loading ? (
            <div className="px-6 py-16 text-center">
              <Archive className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-extrabold text-slate-700 mt-4">No records found</h3>
              <p className="text-sm text-slate-400 mt-1">Upload a record or change the search/filter.</p>
            </div>
          ) : (
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50">
                <tr>
                  {['File', 'Type', 'Person', 'Year', 'Uploaded By', 'Archive Path', 'Actions'].map((head) => (
                    <th key={head} className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-slate-500 font-bold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><FileText className="w-4 h-4" /></div><div className="min-w-0"><p className="text-sm font-bold text-slate-800 truncate max-w-[240px]">{record.fileName}</p><p className="text-[11px] text-slate-400">{record.fileType} · {formatBytes(record.fileSize)}</p></div></div></td>
                    <td className="px-5 py-4"><p className="text-sm font-semibold text-slate-700">{record.documentType}</p><p className="text-[11px] text-emerald-700 mt-1">{record.category}</p></td>
                    <td className="px-5 py-4"><p className="text-sm font-bold text-slate-800">{record.personName}</p>{record.personNumber && <p className="text-[11px] text-slate-400 mt-1">ID: {record.personNumber}</p>}{record.subject && <p className="text-[11px] text-slate-400 mt-1">Subject: {record.subject}</p>}</td>
                    <td className="px-5 py-4"><p className="text-sm font-black text-emerald-900">{record.recordYear}</p><p className="text-[11px] text-slate-400 mt-1">SY {record.schoolYear}</p></td>
                    <td className="px-5 py-4"><p className="text-sm font-semibold text-slate-700">{record.uploadedBy}</p><p className="text-[11px] uppercase tracking-wider text-emerald-700 mt-1">{ROLE_LABELS[record.uploaderRole]}</p><p className="text-[11px] text-slate-400 mt-1">{formatDateTime(record.uploadedAt)}</p></td>
                    <td className="px-5 py-4"><p className="text-xs text-slate-500 max-w-[250px] break-words">{record.folderPath}</p></td>
                    <td className="px-5 py-4"><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => viewRecord(record)} className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold">View</button><button type="button" onClick={() => downloadRecord(record)} className="p-2 rounded-lg bg-slate-100 text-slate-600" title="Download"><Download className="w-4 h-4" /></button><button type="button" onClick={() => removeRecord(record)} className="p-2 rounded-lg bg-rose-50 text-rose-600" title="Delete"><X className="w-4 h-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5"><div className="flex items-center gap-3"><Award className="w-6 h-6 text-emerald-700" /><h3 className="font-extrabold text-emerald-950">Organized Records</h3></div><p className="text-sm text-emerald-900/70 mt-3">Category, year, person, and uploader are stored with every record.</p></div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5"><div className="flex items-center gap-3"><Users className="w-6 h-6 text-blue-700" /><h3 className="font-extrabold text-blue-950">Teacher Uploads</h3></div><p className="text-sm text-blue-900/70 mt-3">Teachers can upload grades, class records, lesson plans, and other teacher files.</p></div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5"><div className="flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-amber-700" /><h3 className="font-extrabold text-amber-950">Audit Ready</h3></div><p className="text-sm text-amber-900/70 mt-3">The archive records who uploaded each file, the role, and the upload date.</p></div>
      </div>
    </section>
  );
};

export default RecordsArchive;
