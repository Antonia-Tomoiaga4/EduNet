import { useState } from 'react';
import { Calendar, Send, Users } from 'lucide-react';
import type { Assignment } from '../App';
import { supabase } from '../lib/supabaseClient';

interface AssignmentsListProps {
  assignments: Assignment[];
  userRole: 'student' | 'professor';
  userId: number;
}

type Submission = {
  id: string | number;
  studentId?: string;
  studentName: string;
  content: string;
  fileName?: string;
  fileUrl?: string;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
};

export function AssignmentsList({ assignments = [], userRole, userId }: AssignmentsListProps) {
  const [submissionTextById, setSubmissionTextById] = useState<Record<string, string>>({});
  const [submissionFileById, setSubmissionFileById] = useState<Record<string, File | null>>({});
  const [submittedById, setSubmittedById] = useState<Record<string, boolean>>({});
  const [submissionStatusById, setSubmissionStatusById] = useState<Record<string, 'idle' | 'sending' | 'success' | 'error'>>({});
  const [submissionErrorById, setSubmissionErrorById] = useState<Record<string, string>>({});
  const [loadedSubmissions, setLoadedSubmissions] = useState<Record<string, Submission[]>>({});
  const [loadingSubmissions, setLoadingSubmissions] = useState<Record<string, boolean>>({});
  const [gradeById, setGradeById] = useState<Record<string, string>>({});
  const [feedbackById, setFeedbackById] = useState<Record<string, string>>({});
  const [gradingStatusById, setGradingStatusById] = useState<Record<string, 'idle' | 'saving' | 'success' | 'error'>>({});
  const [gradingErrorById, setGradingErrorById] = useState<Record<string, string>>({});
  const storageBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'Materiale';

  if (!Array.isArray(assignments) || assignments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
        Nu exista nicio tema creata in acest moment.
      </div>
    );
  }

  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const timestamp = Number(dateStr);
    return Number.isNaN(timestamp) ? new Date(dateStr) : new Date(timestamp);
  };

  const uploadSubmissionFile = async (file: File, assignmentId: string | number) => {
    const listPath = `assignments/${assignmentId}/students/${userId}`;
    const filePath = `${listPath}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase
      .storage
      .from(storageBucket)
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      return { error: uploadError.message || 'Nu am putut incarca fisierul.' };
    }

    const { data } = supabase.storage.from(storageBucket).getPublicUrl(filePath);
    return { fileUrl: data.publicUrl };
  };

  const handleSubmit = async (assignmentId: string | number, currentSubmissions?: Submission[]) => {
    const safeId = String(assignmentId);
    if (submittedById[safeId]) {
      setSubmissionErrorById((prev) => ({ ...prev, [safeId]: 'Tema a fost deja trimisa.' }));
      return;
    }
    const content = (submissionTextById[safeId] || '').trim();
    const file = submissionFileById[safeId] || null;
    if (!content && !file) {
      setSubmissionErrorById((prev) => ({ ...prev, [safeId]: 'Scrie un raspuns sau incarca un fisier.' }));
      return;
    }

    setSubmissionStatusById((prev) => ({ ...prev, [safeId]: 'sending' }));
    setSubmissionErrorById((prev) => ({ ...prev, [safeId]: '' }));

    const token = localStorage.getItem('token');

    try {
      let fileUrl = '';
      let fileName = '';
      if (file) {
        const uploadResult = await uploadSubmissionFile(file, assignmentId);
        if ('error' in uploadResult) {
          setSubmissionStatusById((prev) => ({ ...prev, [safeId]: 'error' }));
          setSubmissionErrorById((prev) => ({ ...prev, [safeId]: uploadResult.error || 'Nu am putut incarca fisierul.' }));
          return;
        }
        fileUrl = uploadResult.fileUrl;
        fileName = file.name;
      }

      const res = await fetch('http://localhost:8080/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          assignmentId: assignmentId,
          studentId: userId,
          content,
          fileName: fileName || undefined,
          fileUrl: fileUrl || undefined,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setSubmissionStatusById((prev) => ({ ...prev, [safeId]: 'error' }));
        setSubmissionErrorById((prev) => ({ ...prev, [safeId]: msg || 'Nu am putut trimite tema.' }));
        return;
      }

      let createdSubmission: Submission | null = null;
      try {
        createdSubmission = await res.json();
      } catch {
        createdSubmission = null;
      }

      setSubmissionStatusById((prev) => ({ ...prev, [safeId]: 'success' }));
      setSubmissionTextById((prev) => ({ ...prev, [safeId]: '' }));
      setSubmissionFileById((prev) => ({ ...prev, [safeId]: null }));
      setSubmittedById((prev) => ({ ...prev, [safeId]: true }));
      if (createdSubmission && createdSubmission.id) {
        setLoadedSubmissions((prev) => {
          const existing = prev[safeId] ?? currentSubmissions ?? [];
          const filtered = existing.filter((sub) => String(sub.studentId) !== String(userId));
          return { ...prev, [safeId]: [...filtered, createdSubmission] };
        });
      }
    } catch (error) {
      setSubmissionStatusById((prev) => ({ ...prev, [safeId]: 'error' }));
      setSubmissionErrorById((prev) => ({ ...prev, [safeId]: 'Serverul nu raspunde.' }));
    }
  };

  const handleLoadSubmissions = async (assignmentId: string | number) => {
    const safeId = String(assignmentId);
    setLoadingSubmissions((prev) => ({ ...prev, [safeId]: true }));
    try {
      const res = await fetch(`http://localhost:8080/api/submissions/assignment/${assignmentId}`);
      if (!res.ok) {
        setSubmissionErrorById((prev) => ({ ...prev, [safeId]: 'Nu am putut incarca raspunsurile.' }));
        return;
      }
      const data = await res.json();
      setLoadedSubmissions((prev) => ({ ...prev, [safeId]: Array.isArray(data) ? data : [] }));
    } catch (error) {
      setSubmissionErrorById((prev) => ({ ...prev, [safeId]: 'Serverul nu raspunde.' }));
    } finally {
      setLoadingSubmissions((prev) => ({ ...prev, [safeId]: false }));
    }
  };

  const handleGradeSubmission = async (submissionId: string | number, assignmentId: string | number, list: Submission[]) => {
    const safeId = String(submissionId);
    const gradeValue = gradeById[safeId];
    const feedbackValue = feedbackById[safeId] || '';

    if (!gradeValue) {
      setGradingErrorById((prev) => ({ ...prev, [safeId]: 'Completeaza nota inainte de salvare.' }));
      return;
    }

    setGradingStatusById((prev) => ({ ...prev, [safeId]: 'saving' }));
    setGradingErrorById((prev) => ({ ...prev, [safeId]: '' }));

    try {
      const res = await fetch(`http://localhost:8080/api/submissions/${submissionId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: Number(gradeValue), feedback: feedbackValue }),
      });

      if (!res.ok) {
        setGradingStatusById((prev) => ({ ...prev, [safeId]: 'error' }));
        setGradingErrorById((prev) => ({ ...prev, [safeId]: 'Nu am putut salva nota.' }));
        return;
      }

      setGradingStatusById((prev) => ({ ...prev, [safeId]: 'success' }));
      setLoadedSubmissions((prev) => ({
        ...prev,
        [String(assignmentId)]: list.map((sub) =>
          String(sub.id) === safeId
            ? { ...sub, grade: Number(gradeValue), feedback: feedbackValue }
            : sub
        ),
      }));
    } catch (error) {
      setGradingStatusById((prev) => ({ ...prev, [safeId]: 'error' }));
      setGradingErrorById((prev) => ({ ...prev, [safeId]: 'Serverul nu raspunde.' }));
    }
  };

  const getDownloadUrl = (fileUrl?: string) => {
    if (!fileUrl) return '';
    return fileUrl.startsWith('/api/') ? `http://localhost:8080${fileUrl}` : fileUrl;
  };

  return (
    <div className="space-y-6">
      {assignments.map((assignment) => {
        if (!assignment || !assignment.id) return null;

        const dueDateObj = parseDate(assignment.dueDate);
        const safeId = String(assignment.id);
        const submissions = loadedSubmissions[safeId]
          ?? (assignment.submissions && assignment.submissions.length > 0 ? assignment.submissions : undefined);
        const studentSubmission = submissions?.find((sub) => String(sub.studentId) === String(userId));
        const isSubmitted = Boolean(studentSubmission) || submittedById[safeId];
        const studentDownloadUrl = studentSubmission?.fileUrl ? getDownloadUrl(studentSubmission.fileUrl) : '';

        return (
          <div key={safeId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-lg">{assignment.title || 'Tema fara titlu'}</h3>
                <p className="text-sm text-indigo-600 font-medium mb-3">
                  Curs: {assignment.courseName || 'Curs general'}
                </p>
                <p className="text-gray-600 mb-4">{assignment.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Termen: {dueDateObj.toLocaleDateString('ro-RO')}
                  </div>
                </div>
              </div>
            </div>

            {userRole === 'student' && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                {isSubmitted ? (
                  <>
                    <h4 className="text-sm font-semibold text-gray-800">Tema trimisa</h4>
                    <div className="text-sm text-green-700">
                      Tema a fost trimisa si nu mai poate fi modificata.
                    </div>
                    {studentSubmission && (studentSubmission.grade !== undefined || studentSubmission.feedback) && (
                      <div className="text-sm text-gray-700">
                        <div>Nota: {studentSubmission.grade ?? '-'}</div>
                        <div>Feedback: {studentSubmission.feedback || '-'}</div>
                      </div>
                    )}
                    {studentDownloadUrl && (
                      <a
                        href={studentDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Deschide fisierul trimis
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <h4 className="text-sm font-semibold text-gray-800">Trimite rezolvarea</h4>
                    <textarea
                      value={submissionTextById[safeId] || ''}
                      onChange={(e) =>
                        setSubmissionTextById((prev) => ({ ...prev, [safeId]: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      rows={3}
                      placeholder="Scrie rezolvarea aici..."
                    />
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      onChange={(e) => setSubmissionFileById((prev) => ({ ...prev, [safeId]: e.target.files?.[0] || null }))}
                      className="w-full text-sm"
                    />
                    {submissionFileById[safeId]?.name && (
                      <div className="text-xs text-gray-600">Fisier selectat: {submissionFileById[safeId]?.name}</div>
                    )}
                    {submissionErrorById[safeId] && (
                      <div className="text-sm text-red-600">{submissionErrorById[safeId]}</div>
                    )}
                    {submissionStatusById[safeId] === 'success' && (
                      <div className="text-sm text-green-600">Tema a fost trimisa.</div>
                    )}
                    <button
                      onClick={() => handleSubmit(assignment.id, submissions)}
                      disabled={submissionStatusById[safeId] === 'sending'}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      {submissionStatusById[safeId] === 'sending' ? 'Se trimite...' : 'Trimite tema'}
                    </button>
                  </>
                )}
              </div>
            )}

            {userRole === 'professor' && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between gap-2 text-sm text-gray-600 mb-3 font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {(submissions?.length || 0)} raspunsuri primite
                  </div>
                  {!submissions && (
                    <button
                      onClick={() => handleLoadSubmissions(assignment.id)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {loadingSubmissions[safeId] ? 'Se incarca...' : 'Incarca raspunsuri'}
                    </button>
                  )}
                </div>

                {submissions && submissions.length > 0 && (
                  <div className="space-y-3">
                    {submissions.map((sub) => {
                      const downloadUrl = getDownloadUrl(sub.fileUrl);
                      const subId = String(sub.id);
                      const isAlreadyGraded = sub.grade !== undefined || Boolean(sub.feedback?.trim());
                      return (
                        <div key={sub.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{sub.studentName}</p>
                            {downloadUrl ? (
                              <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-700"
                              >
                                {sub.fileName || 'Deschide fisier'}
                              </a>
                            ) : (
                              <p className="text-sm text-gray-600 italic">"{sub.content}"</p>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={gradeById[subId] ?? sub.grade ?? ''}
                              onChange={(e) => setGradeById((prev) => ({ ...prev, [subId]: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                              placeholder="Nota"
                            />
                            <input
                              type="text"
                              value={feedbackById[subId] ?? sub.feedback ?? ''}
                              onChange={(e) => setFeedbackById((prev) => ({ ...prev, [subId]: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2"
                              placeholder="Feedback"
                            />
                          </div>
                          {gradingErrorById[subId] && (
                            <div className="text-sm text-red-600">{gradingErrorById[subId]}</div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleGradeSubmission(sub.id, assignment.id, submissions)}
                            disabled={gradingStatusById[subId] === 'saving'}
                            className="text-sm text-white bg-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                          >
                            {gradingStatusById[subId] === 'saving'
                              ? 'Se salveaza...'
                              : isAlreadyGraded
                                ? 'Modifica nota'
                                : 'Salveaza nota'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
