import { supabase } from '../lib/supabase';

export interface PublicDocumentRequestInput {
  requesterName: string;
  requesterEmail: string;
  requesterMobile: string;
  relationship: string;

  studentName: string;
  studentNumber?: string;
  yearGraduated?: number;
  gradeLevel?: string;
  strand?: string;
  schoolYear?: string;

  documentType: string;
  copies: number;
  purpose: string;
  details?: string;
}

export interface PublicDocumentRequestResult {
  id: string;
  request_number: string;
}

export interface DocumentRequest {
  id: string;
  request_number: string;

  requester_name: string;
  requester_email: string;
  requester_mobile: string;
  relationship: string;

  student_name: string;
  student_number: string | null;
  year_graduated: number | null;
  grade_level: string | null;
  strand: string | null;
  school_year: string | null;

  document_type: string;
  copies: number;
  purpose: string;
  details: string | null;

  status: string;

  registrar_id: string | null;
  registrar_name: string | null;
  registrar_remarks: string | null;

  head_id: string | null;
  head_name: string | null;
  head_remarks: string | null;

  principal_id: string | null;
  principal_name: string | null;
  principal_remarks: string | null;

  created_at: string;
  updated_at: string;
}

/* =========================================================
   PUBLIC DOCUMENT REQUEST
   ========================================================= */

export async function createPublicDocumentRequest(
  input: PublicDocumentRequestInput
): Promise<PublicDocumentRequestResult> {
  const { data, error } = await supabase.rpc(
    'submit_public_document_request',
    {
      p_requester_name:
        input.requesterName.trim(),

      p_requester_email:
        input.requesterEmail.trim(),

      p_requester_mobile:
        input.requesterMobile.trim(),

      p_relationship:
        input.relationship,

      p_student_name:
        input.studentName.trim(),

      p_student_number:
        input.studentNumber?.trim() || null,

      p_year_graduated:
        input.yearGraduated ?? null,

      p_grade_level:
        input.gradeLevel?.trim() || null,

      p_strand:
        input.strand?.trim() || null,

      p_school_year:
        input.schoolYear?.trim() || null,

      p_document_type:
        input.documentType,

      p_copies:
        input.copies,

      p_purpose:
        input.purpose,

      p_details:
        input.details?.trim() || null,
    }
  );

  if (error) {
    console.error(
      'Supabase public document request error:',
      error
    );

    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Request was submitted but no Request ID was returned.'
    );
  }

  return {
    id: data[0].id,
    request_number: data[0].request_number,
  };
}

/* =========================================================
   STAFF: GET DOCUMENT REQUESTS
   ========================================================= */

export async function getDocumentRequests(): Promise<
  DocumentRequest[]
> {
  const { data, error } = await supabase
    .from('document_requests')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Get document requests error:',
      error
    );

    throw new Error(error.message);
  }

  return (data || []) as DocumentRequest[];
}

/* =========================================================
   STAFF: UPDATE DOCUMENT REQUEST
   ========================================================= */

export async function updateDocumentRequest(
  id: string,
  updates: Partial<DocumentRequest>
): Promise<DocumentRequest> {
  const { data, error } = await supabase
    .from('document_requests')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error(
      'Update document request error:',
      error
    );

    throw new Error(error.message);
  }

  return data as DocumentRequest;
}

/* =========================================================
   STAFF: ADD REQUEST HISTORY
   ========================================================= */

export async function addDocumentRequestHistory(
  requestId: string,
  userId: string,
  userName: string,
  userRole: string,
  action: string,
  remarks?: string
): Promise<void> {
  const { error } = await supabase
    .from('document_request_history')
    .insert({
      request_id: requestId,
      user_id: userId,
      user_name: userName,
      user_role: userRole,
      action,
      remarks:
        remarks?.trim() || null,
    });

  if (error) {
    console.error(
      'Add request history error:',
      error
    );

    throw new Error(error.message);
  }
}