import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export interface CreateCourseModalProps {
  onClose: () => void;
  onCreateSuccess?: () => void;
  professorId: number;
  professorName: string;
}

export function CreateCourseModal({ onClose, onCreateSuccess, professorId, professorName }: CreateCourseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storageBucket = import.meta.env.VITE_SUPABASE_BUCKET || 'Materiale';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Lu??m token-ul pentru securitate
    const token = localStorage.getItem('token');

    const courseData = {
      title: title,
      description: description,
      // Folosim PROPS, nu localStorage, pentru siguranE>??
      professorId: professorId,
      professorName: professorName,
    };

    try {
      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Dac?? nu ai securitate activat?? Arnc?? Arn Java, poE>i comenta linia de Authorization
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        let createdCourseId: string | null = null;
        try {
          const createdCourse = await response.json();
          createdCourseId = createdCourse?.id ? String(createdCourse.id) : null;
        } catch {
          createdCourseId = null;
        }

        if (!createdCourseId) {
          try {
            const coursesRes = await fetch(`http://localhost:8080/api/courses/professor/${professorId}`, {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });
            if (coursesRes.ok) {
              const courses = await coursesRes.json();
              if (Array.isArray(courses)) {
                const matches = courses.filter((course) => String(course?.title || '').trim() === title.trim());
                if (matches.length > 0) {
                  matches.sort((a, b) => {
                    const aTime = Number(a?.createdAt) || Date.parse(a?.createdAt || '') || 0;
                    const bTime = Number(b?.createdAt) || Date.parse(b?.createdAt || '') || 0;
                    return bTime - aTime;
                  });
                  createdCourseId = matches[0]?.id ? String(matches[0].id) : null;
                }
              }
            }
          } catch {
            createdCourseId = null;
          }
        }

        if (files.length > 0) {
          if (!createdCourseId) {
            alert('Curs creat, dar nu am putut incarca materialele (lipseste id-ul cursului).');
          } else {
            const uploadResults = await Promise.all(
              files.map(async (file, index) => {
                const filePath = `courses/${createdCourseId}/${Date.now()}_${index}_${file.name}`;
                const { error: uploadError } = await supabase
                  .storage
                  .from(storageBucket)
                  .upload(filePath, file, { upsert: false });
                return !uploadError;
              })
            );
            if (uploadResults.some((ok) => !ok)) {
              alert('Curs creat, dar unele materiale nu au putut fi incarcate.');
            }
          }
        }

        alert("Cursul a fost salvat cu succes!");
        onCreateSuccess?.();
        onClose(); // AZnchide modalul
      } else {
        const errorMsg = await response.text();
        alert(`Eroare server: ${response.status} - ${errorMsg}`);
      }
    } catch (error) {
      console.error("Eroare:", error);
      alert("Serverul Java (IntelliJ) nu r??spunde!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Adaugă Curs Nou</h2>
          <button
            onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Titlu curs
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Introducere în Programare"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Descriere
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Descrierea cursului..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Materiale de curs
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <label htmlFor="files" className="cursor-pointer">
                <span className="text-indigo-600 hover:text-indigo-700">
                  Încarcă fișiere
                </span>
                <span className="text-gray-600"> sau trage-le aici</span>
                <input
                  id="files"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {files.length > 0 && (
                <div className="mt-4 text-left space-y-1">
                  {files.map((file, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      • {file.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Creează curs
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
