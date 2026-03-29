import { useState } from 'react';
import { X } from 'lucide-react';

interface EnrollCourseModalProps {
  onClose: () => void;
  studentId: number;
  onEnrollSuccess: () => void | Promise<void>;
}

export function EnrollCourseModal({ onClose, studentId, onEnrollSuccess }: EnrollCourseModalProps) {
  const [courseCode, setCourseCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const trimmedCode = courseCode.trim();
      if (!trimmedCode) {
        setError('Introdu un ID valid al cursului.');
        return;
      }

      setIsSubmitting(true);

      const response = await fetch(
        `http://localhost:8080/api/courses/${encodeURIComponent(trimmedCode)}/enroll/${encodeURIComponent(
          String(studentId)
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        alert('Te-ai înscris cu succes la curs!');
        await onEnrollSuccess();   // <- refresh în dashboard
        onClose();
      } else {
        const msg = await response.text();
        setError(msg || 'Cod invalid sau ești deja înscris la acest curs.');
      }
    } catch (err) {
      setError('Serverul nu răspunde. Verifică conexiunea.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Înscriere la Curs</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Cod Curs (ID)
            </label>
            <input
              id="code"
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Introdu ID-ul cursului..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Se înscrie...' : 'Înscrie-te'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-60"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
