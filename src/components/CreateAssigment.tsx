import { useState } from 'react';
import { X } from 'lucide-react';
import type { Course } from '../App';

interface CreateAssignmentModalProps {
    onClose: () => void;
    professorId: string;
    courses: Course[];
}

export function CreateAssignmentModal({ onClose, professorId, courses }: CreateAssignmentModalProps) {
    const [courseId, setCourseId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCourse = courses.find(c => c.id === courseId);
        alert(`Temă creată cu succes!\n\nCurs: ${selectedCourse?.title}\nTitlu: ${title}\nTermen: ${dueDate} ${dueTime}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-gray-900">Adaugă Temă Nouă</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="course" className="block text-gray-700 mb-2">
                            Selectează cursul
                        </label>
                        <select
                            id="course"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
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
                        <label htmlFor="title" className="block text-gray-700 mb-2">
                            Titlu temă
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Tema 1 - Algoritmi de sortare"
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
                            placeholder="Descrierea temei și cerințele..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dueDate" className="block text-gray-700 mb-2">
                                Data limită
                            </label>
                            <input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="dueTime" className="block text-gray-700 mb-2">
                                Ora limită
                            </label>
                            <input
                                id="dueTime"
                                type="time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Creează temă
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
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
