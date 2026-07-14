import { useEffect, useState } from 'react';
import { X, FileText, BookOpen, Brain } from 'lucide-react';
import type { Course, Assignment, Quiz } from '../App';
import { supabase } from '../lib/supabaseClient';

interface CourseDetailsModalProps {
  course: Course;
  userRole: 'student' | 'professor';
  onClose: () => void;
  onCourseUpdated?: () => void;
}

type CourseFile = {
  id: string;
  name: string;
  size?: string;
  url?: string;
  path: string;
};

export function CourseDetailsModal({ course, userRole, onClose, onCourseUpdated }: CourseDetailsModalProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || '');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const storageBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'Materiale';

  const formatSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const buildPublicUrl = (path: string) => {
    const { data } = supabase.storage.from(storageBucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadSelectedFile = async (file: File) => {
    const listPath = `courses/${course.id}`;
    const filePath = `${listPath}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase
      .storage
      .from(storageBucket)
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      setError(uploadError.message || 'Nu am putut adauga materialul.');
      return false;
    }

    const publicUrl = buildPublicUrl(filePath);
    setFiles((prev) => [
      ...prev,
      {
        id: filePath,
        name: file.name,
        size: formatSize(file.size),
        url: publicUrl,
        path: filePath,
      },
    ]);
    setSelectedFile(null);
    setInfo('Materialul a fost incarcat.');
    return true;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      setInfo('');
      try {
        const baseUrl = 'http://localhost:8080/api';
        const [assignmentsRes, quizzesRes] = await Promise.all([
          fetch(`${baseUrl}/assignments/course/${course.id}`),
          fetch(`${baseUrl}/quizzes/course/${course.id}`),
        ]);
        if (assignmentsRes.ok) {
          const data = await assignmentsRes.json();
          setAssignments(Array.isArray(data) ? data : []);
        }
        if (quizzesRes.ok) {
          const data = await quizzesRes.json();
          setQuizzes(Array.isArray(data) ? data : []);
        }

        const listPath = `courses/${course.id}`;
        const { data: storageFiles, error: storageError } = await supabase
          .storage
          .from(storageBucket)
          .list(listPath, { limit: 200 });

        if (storageError) {
          setError(storageError.message || 'Nu pot incarca materialele.');
          setFiles([]);
        } else {
          const nextFiles = (storageFiles || [])
            .filter((item) => item.name && !item.name.startsWith('.'))
            .map((item) => {
              const path = `${listPath}/${item.name}`;
              return {
                id: path,
                name: item.name,
                size: formatSize(item.metadata?.size),
                url: buildPublicUrl(path),
                path,
              };
            });
          setFiles(nextFiles);
        }
      } catch (err) {
        setError('Nu pot incarca datele cursului.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [course.id]);

  const handleSaveCourse = async () => {
    setSaving(true);
    setError('');
    setInfo('');
    try {
      const res = await fetch(`http://localhost:8080/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || 'Nu am putut salva cursul.');
        return;
      }
      if (selectedFile) {
        await uploadSelectedFile(selectedFile);
      }
      onCourseUpdated?.();
    } catch (err) {
      setError('Serverul nu raspunde.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFile = async () => {
    if (!selectedFile) {
      setError('Selecteaza un fisier inainte de incarcare.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await uploadSelectedFile(selectedFile);
      onCourseUpdated?.();
    } catch (err) {
      setError('Serverul nu raspunde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (file: CourseFile) => {
    const url = file.url || buildPublicUrl(file.path);
    if (!url) {
      setError('Materialul nu are link de descarcare.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteFile = async (file: CourseFile) => {
    setSaving(true);
    setError('');
    setInfo('');
    try {
      const { error: deleteError } = await supabase
        .storage
        .from(storageBucket)
        .remove([file.path]);
      if (deleteError) {
        setError(deleteError.message || 'Nu am putut sterge materialul.');
        return;
      }
      setFiles((prev) => prev.filter((item) => item.path !== file.path));
      setInfo('Materialul a fost sters.');
      onCourseUpdated?.();
    } catch (err) {
      setError('Serverul nu raspunde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900 font-bold text-xl">{course.title}</h2>
            <p className="text-sm text-gray-600">ID curs: {course.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          {info && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
              {info}
            </div>
          )}

          {userRole === 'professor' ? (
            <section className="space-y-4">
              <h3 className="text-gray-900 font-semibold">Editeaza cursul</h3>
              <div className="grid gap-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Titlu curs"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  rows={3}
                  placeholder="Descriere"
                />
                <button
                  onClick={handleSaveCourse}
                  disabled={saving}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Se salveaza...' : 'Salveaza modificarile'}
                </button>
              </div>
            </section>
          ) : (
            <section>
              <h3 className="text-gray-900 font-semibold mb-2">Descriere</h3>
              <p className="text-gray-700">{course.description || 'Fara descriere.'}</p>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Materiale
            </h3>
            {files.length === 0 ? (
              <div className="text-sm text-gray-500">Nu exista materiale inca.</div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size || 'N/A'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDownload(file)}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          Deschide
                        </button>
                        {userRole === 'professor' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Sterge
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {userRole === 'professor' && (
              <div className="mt-4 grid gap-3">
                <h4 className="text-sm font-semibold text-gray-800">Adauga material (fisier)</h4>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
                <button
                  onClick={handleAddFile}
                  disabled={saving}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Se adauga...' : 'Adauga material'}
                </button>
              </div>
            )}
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Teme
              </h3>
              {loading ? (
                <div className="text-sm text-gray-500">Se incarca...</div>
              ) : assignments.length === 0 ? (
                <div className="text-sm text-gray-500">Nu exista teme.</div>
              ) : (
                <div className="space-y-2">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500">
                        Termen: {assignment.dueDate ? new Date(Number(assignment.dueDate)).toLocaleDateString('ro-RO') : '-'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Quizuri
              </h3>
              {loading ? (
                <div className="text-sm text-gray-500">Se incarca...</div>
              ) : quizzes.length === 0 ? (
                <div className="text-sm text-gray-500">Nu exista quizuri.</div>
              ) : (
                <div className="space-y-2">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{quiz.title}</p>
                      <p className="text-xs text-gray-500">{quiz.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
