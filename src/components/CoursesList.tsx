import { Download, BookOpen, FileText } from 'lucide-react';
import type { Course } from '../App';

interface CoursesListProps {
    courses: Course[];
}

export function CoursesList({ courses }: CoursesListProps) {
    const handleDownload = (courseId: string, fileName: string) => {
        alert(`Se descarcă: ${fileName}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6">
                        <div className="flex items-center justify-between text-white mb-2">
                            <BookOpen className="w-8 h-8" />
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                {course.credits} credite
              </span>
                        </div>
                        <h3 className="text-white text-xl font-semibold">{course.name}</h3>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-600 mb-4">{course.description}</p>

                        <div className="space-y-2 mb-4">
                            <div className="text-sm">
                                <span className="text-gray-500">Profesor:</span>
                                <span className="text-gray-900 ml-2">{course.professor}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-500">Semestru:</span>
                                <span className="text-gray-900 ml-2">{course.semester}</span>
                            </div>
                        </div>

                        {course.materials && course.materials.length > 0 && (
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Materiale disponibile
                                </h4>
                                <div className="space-y-2">
                                    {course.materials.map((material) => (
                                        <button
                                            key={material.id}
                                            onClick={() => handleDownload(course.id, material.fileName)}
                                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-gray-900">{material.fileName}</p>
                                                    <p className="text-xs text-gray-500">{material.type}</p>
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
        </div>
    );
}
