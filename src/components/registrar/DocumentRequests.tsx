import React, { useState } from 'react';
import { User, DocumentRequest, DocumentType, DocumentRequestStatus, Student } from '../../types';
import { FileSpreadsheet, Plus, Search, Filter, CheckCircle2, Clock, XCircle, AlertCircle, FileText, CreditCard } from 'lucide-react';

interface DocumentRequestsProps {
  currentUser: User;
  requests: DocumentRequest[];
  students: Student[];
  onSaveRequest: (req: DocumentRequest) => void;
}

export const DocumentRequests: React.FC<DocumentRequestsProps> = ({
  currentUser,
  requests,
  students,
  onSaveRequest,
}) => {
  const isStudent = currentUser.role === 'STUDENT';
  const myStudentId = isStudent ? (currentUser.relatedEntityId || '') : '';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentRequestStatus | 'All'>('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<DocumentRequest | null>(null);

  // New request form state
  const [docType, setDocType] = useState<DocumentType>('Transcript of Records');
  const [copies, setCopies] = useState(1);
  const [purpose, setPurpose] = useState('');

  const displayRequests = requests
    .filter(r => isStudent ? r.studentId === myStudentId : true)
    .filter(r => statusFilter === 'All' ? true : r.status === statusFilter)
    .filter(r => {
      if (!searchTerm) return true;
      const student = students.find(s => s.id === r.studentId);
      const searchStr = `${r.documentType} ${student?.firstName} ${student?.lastName} ${r.purpose}`.toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  const getFeeAmount = (type: DocumentType, numCopies: number) => {
    let base = 75;
    if (type === 'Transcript of Records') base = 150;
    return (base * numCopies) + 30; // 30 is documentary stamp
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myStudentId) return;

    const newReq: DocumentRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      studentId: myStudentId,
      documentType: docType,
      copies: copies,
      purpose: purpose,
      status: 'Pending',
      requestDate: new Date().toISOString(),
      feeAmount: getFeeAmount(docType, copies),
      paymentStatus: 'Pending',
    };
    onSaveRequest(newReq);
    setShowNewModal(false);
    setPurpose('');
    setCopies(1);
  };

  const handleUpdateStatus = (req: DocumentRequest, newStatus: DocumentRequestStatus) => {
    onSaveRequest({
      ...req,
      status: newStatus,
      releaseDate: newStatus === 'Claimed' ? new Date().toISOString() : req.releaseDate,
      paymentStatus: (newStatus === 'Processing' || newStatus === 'For Release' || newStatus === 'Claimed') ? 'Paid' : req.paymentStatus
    });
    setSelectedReq(null);
  };

  const getStatusColor = (status: DocumentRequestStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'For Release': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Claimed': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            {isStudent ? 'My Document Requests' : 'Registrar Document Requests'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {isStudent ? 'Request academic records and track their status online.' : 'Manage and process student academic document requests.'}
          </p>
        </div>
        {isStudent && (
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Request Document</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-emerald-700 focus:outline-none w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="For Release">For Release</option>
              <option value="Claimed">Claimed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                {!isStudent && <th className="px-6 py-4">Student</th>}
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Date Requested</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                {!isStudent && <th className="px-6 py-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayRequests.length === 0 ? (
                <tr>
                  <td colSpan={isStudent ? 5 : 7} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-lg text-slate-500">No requests found</p>
                    {isStudent && <p className="text-sm mt-1">Click 'Request Document' to submit a new request.</p>}
                  </td>
                </tr>
              ) : (
                displayRequests.map((req) => {
                  const student = students.find(s => s.id === req.studentId);
                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono-code font-bold text-emerald-700">{req.id}</td>
                      {!isStudent && (
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{student?.firstName} {student?.lastName}</div>
                          <div className="text-xs text-slate-500 font-mono-code">{student?.lrn}</div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{req.documentType}</div>
                        <div className="text-xs text-slate-500">{req.copies} copy(ies) • ₱{req.feeAmount}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(req.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${req.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {req.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      {!isStudent && (
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors shadow-sm"
                          >
                            Manage
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {showNewModal && isStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-6 bg-emerald-950 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Request Academic Document</h3>
                <p className="text-emerald-300 text-xs mt-1">Submit an online request to the Registrar's Office.</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-emerald-300 hover:text-white transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Transcript of Records">Transcript of Records</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate of Graduation">Certificate of Graduation</option>
                  <option value="Certificate of Enrollment">Certificate of Enrollment</option>
                  <option value="Certificate of Good Moral Character">Certificate of Good Moral Character</option>
                  <option value="Certificate of Grades">Certificate of Grades</option>
                  <option value="Form 137">Form 137</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Number of Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={copies}
                    onChange={(e) => setCopies(parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Estimated Fee</label>
                  <div className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-emerald-800 flex items-center justify-between">
                    <span>₱{getFeeAmount(docType, copies)}.00</span>
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Purpose of Request</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Employment, Board Exam, Further Studies"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-xs text-amber-900 leading-relaxed">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <p>
                  <strong>Note:</strong> Processing takes 1-2 weeks. Please proceed to the Cashier's Office to settle the fee before the document can be processed. You will be notified here once ready for release.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
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

      {/* Registrar Manage Modal */}
      {selectedReq && !isStudent && (
         <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fade-in">
           <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold">Process Request</h3>
               <p className="text-slate-400 text-xs mt-1">Update status for {selectedReq.id}</p>
             </div>
             <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-white transition-colors">
               <XCircle className="w-6 h-6" />
             </button>
           </div>
           
           <div className="p-6 space-y-4">
             <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500 font-semibold">Document:</span>
                  <span className="font-bold text-slate-900">{selectedReq.documentType} ({selectedReq.copies})</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500 font-semibold">Purpose:</span>
                  <span className="font-medium text-slate-900">{selectedReq.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Total Fee:</span>
                  <span className="font-bold text-emerald-700">₱{selectedReq.feeAmount}.00</span>
                </div>
             </div>

             <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Update Status To</label>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={() => handleUpdateStatus(selectedReq, 'Pending')} className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${selectedReq.status === 'Pending' ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>Pending</button>
               <button onClick={() => handleUpdateStatus(selectedReq, 'Processing')} className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${selectedReq.status === 'Processing' ? 'bg-blue-100 border-blue-300 text-blue-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>Processing (Paid)</button>
               <button onClick={() => handleUpdateStatus(selectedReq, 'For Release')} className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${selectedReq.status === 'For Release' ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>For Release</button>
               <button onClick={() => handleUpdateStatus(selectedReq, 'Claimed')} className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${selectedReq.status === 'Claimed' ? 'bg-slate-200 border-slate-400 text-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>Claimed</button>
               <button onClick={() => handleUpdateStatus(selectedReq, 'Rejected')} className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${selectedReq.status === 'Rejected' ? 'bg-rose-100 border-rose-300 text-rose-900' : 'bg-white border-slate-200 hover:bg-slate-50 col-span-2'}`}>Rejected</button>
             </div>
             
             <div className="pt-4 border-t border-slate-100 flex justify-end">
               <button onClick={() => setSelectedReq(null)} className="px-4 py-2 text-slate-600 text-sm font-semibold hover:bg-slate-100 rounded-lg">Close</button>
             </div>
           </div>
         </div>
       </div>
      )}

    </div>
  );
};
