import { useState } from 'react';
import { Download, BookOpen, FileText, ExternalLink } from 'lucide-react';
import type { Course } from '../App';
import { CourseDetailsModal } from './CourseDetailsModal';

// REPARARE: Adaugam userRole in interfata
interface CoursesListProps {
  courses: Course[];
  userRole?: 'student' | 'professor';
  onCourseUpdated?: () => void;
}

// REPARARE: Primim userRole in functie
export function CoursesList({ courses, userRole, onCourseUpdated }: CoursesListProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const selectedCourse = courses.find((course) => String(course.id) === String(selectedCourseId)) || null;
  if (!Array.isArray(courses)) {
    return <div className="text-center py-12 text-gray-500">Nu exista cursuri de afisat.</div>;
  }

  const handleDownload = (courseId: string, fileName: string, url?: string) => {
    if (!url) {
      alert(`Materialul "${fileName}" nu are link.`);
      return;
    }
    const fullUrl = url.startsWith('/api/') ? `http://localhost:8080${url}` : url;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6">
            <div className="flex items-center justify-between text-white mb-2">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-white text-xl font-semibold">{course.title}</h3>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="text-gray-500">Profesor:</span>
                <span className="text-gray-900 ml-2">{course.professorName}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Data crearii:</span>
                <span className="text-gray-900 ml-2">
                  {course.createdAt ? new Date(course.createdAt).toLocaleDateString('ro-RO') : '-'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCourseId(String(course.id))}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors mb-4"
            >
              <ExternalLink className="w-4 h-4" />
              Deschide cursul
            </button>

            {course.files && course.files.length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Materiale disponibile
                </h4>
                <div className="space-y-2">
                  {course.files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleDownload(course.id, file.name, file.url)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          userRole={userRole || 'student'}
          onClose={() => setSelectedCourseId(null)}
          onCourseUpdated={onCourseUpdated}
        />
      )}
    </div>
  );
}
