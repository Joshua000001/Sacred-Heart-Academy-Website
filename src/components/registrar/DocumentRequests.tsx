import React, { useEffect, useMemo, useState } from 'react';
import {
  User,
  DocumentRequest,
  DocumentType,
  DocumentRequestStatus,
  Student,
} from '../../types';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  CreditCard,
  RefreshCw,
  Eye,
  ShieldCheck,
  ArrowRight,
  UserRound,
  GraduationCap,
  Mail,
  Phone,
  CalendarDays,
  Loader2,
} from 'lucide-react';

import {
  getDocumentRequests,
  updateDocumentRequest,
  addDocumentRequestHistory,
  DocumentRequest as SupabaseDocumentRequest,
} from '../../services/publicDocumentRequests';

interface DocumentRequestsProps {
  currentUser: User;
  requests: DocumentRequest[];
  students: Student[];
  onSaveRequest: (req: DocumentRequest) => void;
}

type PublicRequestStatus =
  | 'PENDING'
  | 'UNDER_VERIFICATION'
  | 'VERIFIED'
  | 'FOR_HEAD_APPROVAL'
  | 'HEAD_APPROVED'
  | 'FOR_PRINCIPAL_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  | 'READY_FOR_RELEASE'
  | 'RELEASED';

const PUBLIC_STATUSES: PublicRequestStatus[] = [
  'PENDING',
  'UNDER_VERIFICATION',
  'VERIFIED',
  'FOR_HEAD_APPROVAL',
  'HEAD_APPROVED',
  'FOR_PRINCIPAL_APPROVAL',
  'APPROVED',
  'REJECTED',
  'RETURNED',
  'READY_FOR_RELEASE',
  'RELEASED',
];

const publicStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'UNDER_VERIFICATION':
      return 'Under Verification';
    case 'VERIFIED':
      return 'Verified';
    case 'FOR_HEAD_APPROVAL':
      return 'For Head Approval';
    case 'HEAD_APPROVED':
      return 'Head Approved';
    case 'FOR_PRINCIPAL_APPROVAL':
      return 'For Principal Approval';
    case 'APPROVED':
      return 'Approved';
    case 'REJECTED':
      return 'Rejected';
    case 'RETURNED':
      return 'Returned';
    case 'READY_FOR_RELEASE':
      return 'Ready for Release';
    case 'RELEASED':
      return 'Released';
    default:
      return status;
  }
};

const publicStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'UNDER_VERIFICATION':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'VERIFIED':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'FOR_HEAD_APPROVAL':
      return 'bg-violet-100 text-violet-800 border-violet-200';
    case 'HEAD_APPROVED':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'FOR_PRINCIPAL_APPROVAL':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'APPROVED':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'REJECTED':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'RETURNED':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'READY_FOR_RELEASE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'RELEASED':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const localStatusColor = (status: DocumentRequestStatus) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'For Release':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Claimed':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'Rejected':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getFriendlyPublicStatus = (status: string) =>
  publicStatusLabel(status);

const calculateFee = (type: DocumentType, copies: number) => {
  let base = 75;

  if (type === 'Transcript of Records') {
    base = 150;
  }

  return base * Math.max(1, copies) + 30;
};

export const DocumentRequests: React.FC<DocumentRequestsProps> = ({
  currentUser,
  requests,
  students,
  onSaveRequest,
}) => {
  const isStudent = currentUser.role === 'STUDENT';
  const isStaff =
    currentUser.role === 'ADMIN' ||
    currentUser.role === 'REGISTRAR' ||
    currentUser.role === 'HEAD' ||
    currentUser.role === 'PRINCIPAL';

  const myStudentId = isStudent
    ? currentUser.relatedEntityId || ''
    : '';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<DocumentRequestStatus | 'All'>('All');

  const [publicSearchTerm, setPublicSearchTerm] = useState('');
  const [publicStatusFilter, setPublicStatusFilter] =
    useState<PublicRequestStatus | 'All'>('All');

  const [showNewModal, setShowNewModal] =
    useState(false);

  const [selectedReq, setSelectedReq] =
    useState<DocumentRequest | null>(null);

  const [selectedPublicRequest, setSelectedPublicRequest] =
    useState<SupabaseDocumentRequest | null>(null);

  const [publicRequests, setPublicRequests] =
    useState<SupabaseDocumentRequest[]>([]);

  const [publicLoading, setPublicLoading] =
    useState(false);

  const [publicError, setPublicError] =
    useState('');

  const [processingPublicId, setProcessingPublicId] =
    useState<string | null>(null);

  // New local/student request form.
  const [docType, setDocType] =
    useState<DocumentType>('Transcript of Records');

  const [copies, setCopies] = useState(1);
  const [purpose, setPurpose] = useState('');

  // =========================================================
  // LOAD PUBLIC REQUESTS FROM SUPABASE
  // =========================================================

  const loadPublicRequests = async () => {
    if (!isStaff) {
      setPublicRequests([]);
      return;
    }

    setPublicLoading(true);
    setPublicError('');

    try {
      const data = await getDocumentRequests();

      setPublicRequests(data);
    } catch (error) {
      console.error(
        'Unable to load public document requests:',
        error
      );

      setPublicError(
        error instanceof Error
          ? error.message
          : 'Unable to load document requests.'
      );
    } finally {
      setPublicLoading(false);
    }
  };

  useEffect(() => {
    void loadPublicRequests();
  }, [isStaff]);

  // =========================================================
  // LOCAL / EXISTING PORTAL REQUESTS
  // =========================================================

  const displayRequests = useMemo(() => {
    return requests
      .filter((request) =>
        isStudent
          ? request.studentId === myStudentId
          : true
      )
      .filter((request) =>
        statusFilter === 'All'
          ? true
          : request.status === statusFilter
      )
      .filter((request) => {
        if (!searchTerm) {
          return true;
        }

        const student = students.find(
          (item) => item.id === request.studentId
        );

        const searchString = [
          request.id,
          request.documentType,
          student?.firstName,
          student?.lastName,
          student?.lrn,
          request.purpose,
          request.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchString.includes(
          searchTerm.toLowerCase()
        );
      })
      .sort(
        (a, b) =>
          new Date(b.requestDate).getTime() -
          new Date(a.requestDate).getTime()
      );
  }, [
    requests,
    isStudent,
    myStudentId,
    statusFilter,
    searchTerm,
    students,
  ]);

  // =========================================================
  // PUBLIC REQUESTS FROM SUPABASE
  // =========================================================

  const displayPublicRequests = useMemo(() => {
    return publicRequests
      .filter((request) =>
        publicStatusFilter === 'All'
          ? true
          : request.status === publicStatusFilter
      )
      .filter((request) => {
        if (!publicSearchTerm) {
          return true;
        }

        const searchString = [
          request.request_number,
          request.requester_name,
          request.requester_email,
          request.requester_mobile,
          request.student_name,
          request.student_number,
          request.year_graduated,
          request.document_type,
          request.purpose,
          request.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchString.includes(
          publicSearchTerm.toLowerCase()
        );
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  }, [
    publicRequests,
    publicSearchTerm,
    publicStatusFilter,
  ]);

  // =========================================================
  // LOCAL REQUEST ACTIONS
  // =========================================================

  const handleSubmitRequest = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!myStudentId) {
      return;
    }

    const safeCopies =
      Number.isFinite(copies) && copies > 0
        ? copies
        : 1;

    const newRequest: DocumentRequest = {
      id: `REQ-${Date.now()
        .toString()
        .slice(-6)}`,

      studentId: myStudentId,

      documentType: docType,

      copies: safeCopies,

      purpose,

      status: 'Pending',

      requestDate:
        new Date().toISOString(),

      feeAmount:
        calculateFee(
          docType,
          safeCopies
        ),

      paymentStatus: 'Pending',
    };

    onSaveRequest(newRequest);

    setShowNewModal(false);
    setPurpose('');
    setCopies(1);
  };

  const handleUpdateStatus = (
    request: DocumentRequest,
    newStatus: DocumentRequestStatus
  ) => {
    onSaveRequest({
      ...request,
      status: newStatus,

      releaseDate:
        newStatus === 'Claimed'
          ? new Date().toISOString()
          : request.releaseDate,

      paymentStatus:
        newStatus === 'Processing' ||
        newStatus === 'For Release' ||
        newStatus === 'Claimed'
          ? 'Paid'
          : request.paymentStatus,
    });

    setSelectedReq(null);
  };

  // =========================================================
  // SUPABASE PUBLIC REQUEST WORKFLOW
  // =========================================================

  const updatePublicStatus = async (
    request: SupabaseDocumentRequest,
    newStatus: PublicRequestStatus,
    actionLabel: string
  ) => {
    setProcessingPublicId(request.id);
    setPublicError('');

    try {
      const currentUserWithOptionalId =
        currentUser as User & {
          id?: string;
        };

      const userId =
        currentUserWithOptionalId.id;

      const userName =
        currentUser.fullName ||
        currentUser.username ||
        'Staff User';

      const updated =
        await updateDocumentRequest(
          request.id,
          {
            status: newStatus,
            ...(newStatus ===
              'UNDER_VERIFICATION'
              ? {
                  registrar_id:
                    userId || null,
                  registrar_name:
                    userName,
                }
              : {}),
          }
        );

      if (userId) {
        try {
          await addDocumentRequestHistory(
            request.id,
            userId,
            userName,
            currentUser.role,
            actionLabel
          );
        } catch (historyError) {
          console.warn(
            'Request updated but history could not be saved:',
            historyError
          );
        }
      }

      setPublicRequests((current) =>
        current.map((item) =>
          item.id === request.id
            ? updated
            : item
        )
      );

      setSelectedPublicRequest(updated);

    } catch (error) {
      console.error(
        'Unable to update public request:',
        error
      );

      setPublicError(
        error instanceof Error
          ? error.message
          : 'Unable to update this request.'
      );

      await loadPublicRequests();
    } finally {
      setProcessingPublicId(null);
    }
  };

  const canStartVerification =
    selectedPublicRequest?.status ===
    'PENDING';

  const canMarkVerified =
    selectedPublicRequest?.status ===
    'UNDER_VERIFICATION';

  const canForwardToHead =
    selectedPublicRequest?.status ===
    'VERIFIED';

  const canRejectPublicRequest =
    selectedPublicRequest &&
    ![
      'REJECTED',
      'RELEASED',
    ].includes(
      selectedPublicRequest.status as PublicRequestStatus
    );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6 animate-fade-in">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">

            <FileSpreadsheet className="w-6 h-6 text-emerald-700" />

            {isStudent
              ? 'My Document Requests'
              : 'Document Requests'}

          </h2>

          <p className="text-sm text-slate-500 font-medium mt-1">

            {isStudent
              ? 'Request academic records and track their status online.'
              : 'Manage online school-document requests and existing portal requests.'}

          </p>

        </div>

        <div className="flex items-center gap-2">

          {isStaff && (
            <button
              type="button"
              onClick={() =>
                void loadPublicRequests()
              }
              disabled={publicLoading}
              className="px-4 py-2 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  publicLoading
                    ? 'animate-spin'
                    : ''
                }`}
              />

              Refresh
            </button>
          )}

          {isStudent && (
            <button
              type="button"
              onClick={() =>
                setShowNewModal(true)
              }
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Request Document
            </button>
          )}

        </div>
      </div>

      {/* =====================================================
          ONLINE PUBLIC REQUESTS - STAFF ONLY
      ====================================================== */}
      {isStaff && (
        <section className="space-y-4">

          <div className="bg-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-xl font-black">
                      Online Document Requests
                    </h3>

                    <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-emerald-100">
                      Supabase
                    </span>

                  </div>

                  <p className="text-sm text-emerald-100/75 mt-1">
                    Requests submitted from the public website without an account.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="px-4 py-3 bg-white/10 rounded-xl border border-white/10 text-center min-w-[90px]">
                  <div className="text-2xl font-black">
                    {publicRequests.length}
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-emerald-200/70 font-bold">
                    Total
                  </div>
                </div>

                <div className="px-4 py-3 bg-amber-400 text-emerald-950 rounded-xl border border-amber-300 text-center min-w-[90px]">
                  <div className="text-2xl font-black">
                    {
                      publicRequests.filter(
                        (request) =>
                          request.status ===
                          'PENDING'
                      ).length
                    }
                  </div>

                  <div className="text-[10px] uppercase tracking-wider font-black">
                    Pending
                  </div>
                </div>

              </div>
            </div>
          </div>

          {publicError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />

              <div>
                <p className="font-bold">
                  Could not load online requests.
                </p>

                <p className="text-sm mt-1">
                  {publicError}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">

            <div className="flex flex-col md:flex-row items-center gap-4">

              <div className="flex-1 relative w-full">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search requester, graduate, request ID, document..."
                  value={publicSearchTerm}
                  onChange={(event) =>
                    setPublicSearchTerm(
                      event.target.value
                    )
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />

              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">

                <Filter className="w-4 h-4 text-slate-400" />

                <select
                  value={publicStatusFilter}
                  onChange={(event) =>
                    setPublicStatusFilter(
                      event.target.value as
                        | PublicRequestStatus
                        | 'All'
                    )
                  }
                  className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-emerald-700 focus:outline-none w-full md:w-auto"
                >
                  <option value="All">
                    All Statuses
                  </option>

                  {PUBLIC_STATUSES.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {publicStatusLabel(
                          status
                        )}
                      </option>
                    )
                  )}

                </select>

              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm text-slate-800">

                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">

                  <tr>

                    <th className="px-5 py-4">
                      Request ID
                    </th>

                    <th className="px-5 py-4">
                      Requester
                    </th>

                    <th className="px-5 py-4">
                      Graduate
                    </th>

                    <th className="px-5 py-4">
                      Document
                    </th>

                    <th className="px-5 py-4">
                      Year
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {publicLoading ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-6 py-14 text-center"
                      >

                        <Loader2 className="w-8 h-8 mx-auto text-emerald-700 animate-spin" />

                        <p className="mt-3 font-semibold text-slate-500">
                          Loading online requests...
                        </p>

                      </td>

                    </tr>

                  ) : displayPublicRequests.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="px-6 py-14 text-center text-slate-400"
                      >

                        <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />

                        <p className="font-bold text-lg text-slate-500">
                          No online requests found
                        </p>

                        <p className="text-sm mt-1">
                          New public requests will appear here automatically.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    displayPublicRequests.map(
                      (request) => (

                        <tr
                          key={request.id}
                          className="hover:bg-slate-50 transition-colors"
                        >

                          <td className="px-5 py-4">

                            <div className="font-mono-code font-black text-emerald-700">
                              {request.request_number}
                            </div>

                            <div className="text-[11px] text-slate-400 mt-1">
                              {new Date(
                                request.created_at
                              ).toLocaleString()}
                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <div className="font-bold text-slate-900">
                              {request.requester_name}
                            </div>

                            <div className="text-xs text-slate-500 mt-1">
                              {request.relationship}
                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <div className="font-bold text-slate-900">
                              {request.student_name}
                            </div>

                            <div className="text-xs text-slate-500">
                              {request.student_number ||
                                'Student number not provided'}
                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <div className="font-bold text-slate-900">
                              {request.document_type}
                            </div>

                            <div className="text-xs text-slate-500">
                              {request.copies}{' '}
                              {request.copies ===
                              1
                                ? 'copy'
                                : 'copies'}
                            </div>

                          </td>

                          <td className="px-5 py-4 text-slate-600 font-semibold">
                            {request.year_graduated ||
                              '—'}
                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`px-2.5 py-1.5 rounded-full text-xs font-bold border ${publicStatusColor(
                                request.status
                              )}`}
                            >
                              {getFriendlyPublicStatus(
                                request.status
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedPublicRequest(
                                  request
                                )
                              }
                              className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                            >
                              <Eye className="w-4 h-4" />
                              Review
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>
              </table>
            </div>
          </div>

        </section>
      )}

      {/* =====================================================
          EXISTING PORTAL REQUESTS
      ====================================================== */}
      <section className="space-y-4">

        {isStaff && (
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-slate-600" />
            </div>

            <div>

              <h3 className="font-black text-slate-900">
                Existing Portal Requests
              </h3>

              <p className="text-xs text-slate-500">
                Requests created by authenticated student accounts.
              </p>

            </div>

          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">

          <div className="flex flex-col sm:flex-row items-center gap-4">

            <div className="flex-1 relative w-full">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                placeholder="Search portal requests..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />

            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">

              <Filter className="w-4 h-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | DocumentRequestStatus
                      | 'All'
                  )
                }
                className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none w-full sm:w-auto"
              >

                <option value="All">
                  All Statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Processing">
                  Processing
                </option>

                <option value="For Release">
                  For Release
                </option>

                <option value="Claimed">
                  Claimed
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm text-slate-800">

              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">

                <tr>

                  <th className="px-6 py-4">
                    Request ID
                  </th>

                  {!isStudent && (
                    <th className="px-6 py-4">
                      Student
                    </th>
                  )}

                  <th className="px-6 py-4">
                    Document
                  </th>

                  <th className="px-6 py-4">
                    Date Requested
                  </th>

                  <th className="px-6 py-4">
                    Payment
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  {!isStudent && (
                    <th className="px-6 py-4 text-right">
                      Action
                    </th>
                  )}

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {displayRequests.length === 0 ? (

                  <tr>

                    <td
                      colSpan={
                        isStudent
                          ? 5
                          : 7
                      }
                      className="px-6 py-12 text-center text-slate-400"
                    >

                      <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />

                      <p className="font-medium text-lg text-slate-500">
                        No requests found
                      </p>

                      {isStudent && (
                        <p className="text-sm mt-1">
                          Click 'Request Document' to submit a new request.
                        </p>
                      )}

                    </td>

                  </tr>

                ) : (

                  displayRequests.map(
                    (request) => {

                      const student =
                        students.find(
                          (item) =>
                            item.id ===
                            request.studentId
                        );

                      return (
                        <tr
                          key={request.id}
                          className="hover:bg-slate-50 transition-colors"
                        >

                          <td className="px-6 py-4 font-mono-code font-bold text-emerald-700">
                            {request.id}
                          </td>

                          {!isStudent && (
                            <td className="px-6 py-4">

                              <div className="font-bold text-slate-900">
                                {student?.firstName}{' '}
                                {student?.lastName}
                              </div>

                              <div className="text-xs text-slate-500 font-mono-code">
                                {student?.lrn}
                              </div>

                            </td>
                          )}

                          <td className="px-6 py-4">

                            <div className="font-bold text-slate-900">
                              {request.documentType}
                            </div>

                            <div className="text-xs text-slate-500">
                              {request.copies} copy(ies)
                              {' • '}
                              ₱{request.feeAmount}
                            </div>

                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {new Date(
                              request.requestDate
                            ).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                request.paymentStatus ===
                                'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {request.paymentStatus}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${localStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>

                          </td>

                          {!isStudent && (
                            <td className="px-6 py-4 text-right">

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedReq(
                                    request
                                  )
                                }
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                              >
                                Manage
                              </button>

                            </td>
                          )}

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>
      </section>

      {/* =====================================================
          STUDENT NEW REQUEST MODAL
      ====================================================== */}
      {showNewModal && isStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">

            <div className="p-6 bg-emerald-950 text-white flex justify-between items-center">

              <div>

                <h3 className="text-lg font-bold">
                  Request Academic Document
                </h3>

                <p className="text-emerald-300 text-xs mt-1">
                  Submit an online request to the Registrar's Office.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowNewModal(false)
                }
                className="text-emerald-300 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>

            </div>

            <form
              onSubmit={
                handleSubmitRequest
              }
              className="p-6 space-y-4"
            >

              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Document Type
                </label>

                <select
                  value={docType}
                  onChange={(event) =>
                    setDocType(
                      event.target.value as DocumentType
                    )
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-700"
                >

                  <option value="Transcript of Records">
                    Transcript of Records
                  </option>

                  <option value="Diploma">
                    Diploma
                  </option>

                  <option value="Certificate of Graduation">
                    Certificate of Graduation
                  </option>

                  <option value="Certificate of Enrollment">
                    Certificate of Enrollment
                  </option>

                  <option value="Certificate of Good Moral Character">
                    Certificate of Good Moral Character
                  </option>

                  <option value="Certificate of Grades">
                    Certificate of Grades
                  </option>

                  <option value="Form 137">
                    Form 137
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Number of Copies
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={copies}
                    onChange={(event) =>
                      setCopies(
                        Math.max(
                          1,
                          parseInt(
                            event.target.value ||
                              '1',
                            10
                          )
                        )
                      )
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Estimated Fee
                  </label>

                  <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-emerald-800 flex items-center justify-between">

                    <span>
                      ₱{calculateFee(docType, copies)}.00
                    </span>

                    <CreditCard className="w-4 h-4 text-emerald-600" />

                  </div>

                </div>

              </div>

              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Purpose of Request
                </label>

                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(event) =>
                    setPurpose(
                      event.target.value
                    )
                  }
                  placeholder="e.g., Employment, Board Exam, Further Studies"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-700"
                />

              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-xs text-amber-900 leading-relaxed">

                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />

                <p>
                  <strong>Note:</strong>{' '}
                  Processing takes 1–2 weeks.
                  Please proceed to the Cashier's
                  Office to settle the fee before
                  the document can be processed.
                </p>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowNewModal(false)
                  }
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold transition-colors shadow-md"
                >
                  Submit Request
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          LEGACY / PORTAL MANAGE MODAL
      ====================================================== */}
      {selectedReq && !isStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">

            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">

              <div>

                <h3 className="text-lg font-bold">
                  Process Request
                </h3>

                <p className="text-slate-400 text-xs mt-1">
                  Update status for{' '}
                  {selectedReq.id}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedReq(null)
                }
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>

            </div>

            <div className="p-6 space-y-4">

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-sm">

                <div className="flex justify-between mb-2">

                  <span className="text-slate-500 font-semibold">
                    Document:
                  </span>

                  <span className="font-bold text-slate-900">
                    {selectedReq.documentType}{' '}
                    ({selectedReq.copies})
                  </span>

                </div>

                <div className="flex justify-between mb-2">

                  <span className="text-slate-500 font-semibold">
                    Purpose:
                  </span>

                  <span className="font-medium text-slate-900">
                    {selectedReq.purpose}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500 font-semibold">
                    Total Fee:
                  </span>

                  <span className="font-bold text-emerald-700">
                    ₱{selectedReq.feeAmount}.00
                  </span>

                </div>

              </div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Update Status To
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedReq,
                      'Pending'
                    )
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    selectedReq.status ===
                    'Pending'
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Pending
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedReq,
                      'Processing'
                    )
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    selectedReq.status ===
                    'Processing'
                      ? 'bg-blue-100 border-blue-300 text-blue-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Processing
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedReq,
                      'For Release'
                    )
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    selectedReq.status ===
                    'For Release'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  For Release
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedReq,
                      'Claimed'
                    )
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    selectedReq.status ===
                    'Claimed'
                      ? 'bg-slate-200 border-slate-400 text-slate-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Claimed
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateStatus(
                      selectedReq,
                      'Rejected'
                    )
                  }
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    selectedReq.status ===
                    'Rejected'
                      ? 'bg-rose-100 border-rose-300 text-rose-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 col-span-2'
                  }`}
                >
                  Rejected
                </button>

              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedReq(null)
                  }
                  className="px-4 py-2 text-slate-600 text-sm font-semibold hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* =====================================================
          PUBLIC REQUEST REVIEW MODAL
      ====================================================== */}
      {selectedPublicRequest && isStaff && (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">

          <div className="min-h-full flex items-center justify-center">

            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="bg-emerald-950 text-white p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-black">
                        Online Request
                      </p>

                      <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold">
                        No Account Required
                      </span>

                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black mt-2">
                      {selectedPublicRequest.request_number}
                    </h3>

                    <p className="text-sm text-emerald-100/75 mt-1">
                      Submitted{' '}
                      {new Date(
                        selectedPublicRequest.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPublicRequest(
                        null
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"
                    aria-label="Close request"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>

                </div>

              </div>

              <div className="p-6 sm:p-8 space-y-7">

                {/* Status */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 rounded-2xl border border-slate-200 p-4">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Current Status
                    </p>

                    <span
                      className={`inline-flex mt-2 px-3 py-1.5 rounded-full text-xs font-black border ${publicStatusColor(
                        selectedPublicRequest.status
                      )}`}
                    >
                      {publicStatusLabel(
                        selectedPublicRequest.status
                      )}
                    </span>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-500">
                      Submitted
                    </p>

                    <p className="text-sm font-bold text-slate-800">
                      {new Date(
                        selectedPublicRequest.created_at
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                {/* Requester + Graduate */}
                <div className="grid lg:grid-cols-2 gap-5">

                  <div className="rounded-2xl border border-slate-200 p-5">

                    <h4 className="font-black text-emerald-950 flex items-center gap-2 mb-4">
                      <UserRound className="w-5 h-5 text-emerald-700" />
                      Requester Information
                    </h4>

                    <div className="space-y-3 text-sm">

                      <div>
                        <p className="text-xs text-slate-500">
                          Name
                        </p>
                        <p className="font-bold">
                          {selectedPublicRequest.requester_name}
                        </p>
                      </div>

                      <div className="flex items-start gap-3">

                        <Mail className="w-4 h-4 text-slate-400 mt-0.5" />

                        <div>
                          <p className="text-xs text-slate-500">
                            Email
                          </p>

                          <p className="font-semibold break-all">
                            {selectedPublicRequest.requester_email}
                          </p>
                        </div>

                      </div>

                      <div className="flex items-start gap-3">

                        <Phone className="w-4 h-4 text-slate-400 mt-0.5" />

                        <div>
                          <p className="text-xs text-slate-500">
                            Mobile
                          </p>

                          <p className="font-semibold">
                            {selectedPublicRequest.requester_mobile}
                          </p>
                        </div>

                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Relationship
                        </p>

                        <p className="font-semibold">
                          {selectedPublicRequest.relationship}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">

                    <h4 className="font-black text-emerald-950 flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-emerald-700" />
                      Graduate Information
                    </h4>

                    <div className="space-y-3 text-sm">

                      <div>
                        <p className="text-xs text-slate-500">
                          Full Name
                        </p>

                        <p className="font-bold">
                          {selectedPublicRequest.student_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Student Number
                        </p>

                        <p className="font-semibold">
                          {selectedPublicRequest.student_number ||
                            'Not provided'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">

                        <div>
                          <p className="text-xs text-slate-500">
                            Year Graduated
                          </p>

                          <p className="font-bold">
                            {selectedPublicRequest.year_graduated ||
                              'Not provided'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Grade / Level
                          </p>

                          <p className="font-semibold">
                            {selectedPublicRequest.grade_level ||
                              'Not provided'}
                          </p>
                        </div>

                      </div>

                      <div className="grid grid-cols-2 gap-4">

                        <div>
                          <p className="text-xs text-slate-500">
                            Strand / Program
                          </p>

                          <p className="font-semibold">
                            {selectedPublicRequest.strand ||
                              'Not provided'}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            School Year
                          </p>

                          <p className="font-semibold">
                            {selectedPublicRequest.school_year ||
                              'Not provided'}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Document Details */}
                <div className="rounded-2xl border border-slate-200 p-5">

                  <h4 className="font-black text-emerald-950 flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-emerald-700" />
                    Requested Document
                  </h4>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">

                    <div>
                      <p className="text-xs text-slate-500">
                        Document
                      </p>

                      <p className="font-bold">
                        {selectedPublicRequest.document_type}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Copies
                      </p>

                      <p className="font-bold">
                        {selectedPublicRequest.copies}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Purpose
                      </p>

                      <p className="font-bold">
                        {selectedPublicRequest.purpose}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        School Year
                      </p>

                      <p className="font-bold">
                        {selectedPublicRequest.school_year ||
                          'Not provided'}
                      </p>
                    </div>

                  </div>

                  {selectedPublicRequest.details && (
                    <div className="mt-5 pt-5 border-t border-slate-100">

                      <p className="text-xs text-slate-500 mb-2">
                        Additional Details
                      </p>

                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedPublicRequest.details}
                      </p>

                    </div>
                  )}

                </div>

                {/* Processing Information */}
                <div className="grid lg:grid-cols-3 gap-4">

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Registrar
                    </p>

                    <p className="font-bold text-slate-900 mt-2">
                      {selectedPublicRequest.registrar_name ||
                        'Not yet assigned'}
                    </p>

                    {selectedPublicRequest.registrar_remarks && (
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedPublicRequest.registrar_remarks}
                      </p>
                    )}

                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      School Head
                    </p>

                    <p className="font-bold text-slate-900 mt-2">
                      {selectedPublicRequest.head_name ||
                        'Pending'}
                    </p>

                    {selectedPublicRequest.head_remarks && (
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedPublicRequest.head_remarks}
                      </p>
                    )}

                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Principal
                    </p>

                    <p className="font-bold text-slate-900 mt-2">
                      {selectedPublicRequest.principal_name ||
                        'Pending'}
                    </p>

                    {selectedPublicRequest.principal_remarks && (
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedPublicRequest.principal_remarks}
                      </p>
                    )}

                  </div>

                </div>

                {/* Registrar Actions */}
                {currentUser.role === 'REGISTRAR' && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">

                    <div className="flex items-start gap-3">

                      <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />

                      <div>

                        <h4 className="font-black text-emerald-950">
                          Registrar Actions
                        </h4>

                        <p className="text-sm text-emerald-900/70 mt-1">
                          Verify the request and forward it to the School Head.
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-5">

                      {canStartVerification && (
                        <button
                          type="button"
                          disabled={
                            processingPublicId ===
                            selectedPublicRequest.id
                          }
                          onClick={() =>
                            void updatePublicStatus(
                              selectedPublicRequest,
                              'UNDER_VERIFICATION',
                              'Started verification'
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-60"
                        >
                          {processingPublicId ===
                          selectedPublicRequest.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}

                          Start Verification
                        </button>
                      )}

                      {canMarkVerified && (
                        <button
                          type="button"
                          disabled={
                            processingPublicId ===
                            selectedPublicRequest.id
                          }
                          onClick={() =>
                            void updatePublicStatus(
                              selectedPublicRequest,
                              'VERIFIED',
                              'Verified request and records'
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold disabled:opacity-60"
                        >
                          {processingPublicId ===
                          selectedPublicRequest.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}

                          Mark Verified
                        </button>
                      )}

                      {canForwardToHead && (
                        <button
                          type="button"
                          disabled={
                            processingPublicId ===
                            selectedPublicRequest.id
                          }
                          onClick={() =>
                            void updatePublicStatus(
                              selectedPublicRequest,
                              'FOR_HEAD_APPROVAL',
                              'Forwarded request to School Head'
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold disabled:opacity-60"
                        >
                          {processingPublicId ===
                          selectedPublicRequest.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}

                          Forward to School Head
                        </button>
                      )}

                      {canRejectPublicRequest && (
                        <button
                          type="button"
                          disabled={
                            processingPublicId ===
                            selectedPublicRequest.id
                          }
                          onClick={() =>
                            void updatePublicStatus(
                              selectedPublicRequest,
                              'REJECTED',
                              'Rejected request'
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-60"
                        >
                          {processingPublicId ===
                          selectedPublicRequest.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}

                          Reject
                        </button>
                      )}

                      {!canStartVerification &&
                        !canMarkVerified &&
                        !canForwardToHead &&
                        !canRejectPublicRequest && (
                          <p className="text-sm font-semibold text-slate-600">
                            No Registrar action is available for this status.
                          </p>
                        )}

                    </div>

                  </div>
                )}

                <div className="flex justify-end pt-2">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPublicRequest(
                        null
                      )
                    }
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Close
                  </button>

                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentRequests;
