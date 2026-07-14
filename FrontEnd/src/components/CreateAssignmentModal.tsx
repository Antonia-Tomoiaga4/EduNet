import { useState } from 'react';
import { X } from 'lucide-react';
import type { Course } from '../App';

interface CreateAssignmentModalProps {
  onClose: () => void;
  professorId: number;
  courses: Course[];
  onCreateSuccess: () => void | Promise<void>;
}

export function CreateAssignmentModal({
  onClose,
  professorId,
  courses,
  onCreateSuccess,
}: CreateAssignmentModalProps) {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // protecție simplă
    if (!dueDate || !dueTime) {
      setError('Selectează data și ora limită.');
      return;
    }

    const timestamp = new Date(`${dueDate}T${dueTime}`).getTime();

    const assignmentData = {
      courseId,           // dacă backend-ul vrea number, fă Number(courseId)
      title,
      description,
      dueDate: String(timestamp),
      professorId,        // dacă backend-ul vrea string: String(professorId)
    };

    try {
      setIsSubmitting(true);

      const response = await fetch('http://localhost:8080/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });

      if (response.ok) {
        await onCreateSuccess(); // refresh în ProfessorDashboard
        onClose();
      } else {
        const msg = await response.text();
        setError(msg || 'Serverul a refuzat cererea.');
      }
    } catch (error) {
      setError('Eroare de rețea: serverul nu răspunde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900 font-bold text-xl">Adaugă Temă Nouă</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="course" className="block text-gray-700 mb-2 font-medium">
              Selectează cursul
            </label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              disabled={isSubmitting}
            >
              <option value="">Alege un curs...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-gray-700 mb-2 font-medium">
              Titlu temă
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Tema 1 - Algoritmi"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-700 mb-2 font-medium">
              Descriere
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={4}
              placeholder="Detalii despre cerințe..."
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-gray-700 mb-2 font-medium">
                Data limită
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="dueTime" className="block text-gray-700 mb-2 font-medium">
                Ora limită
              </label>
              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all font-semibold disabled:opacity-60"
            >
              {isSubmitting ? 'Se creează...' : 'Creează temă'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 disabled:opacity-60"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
