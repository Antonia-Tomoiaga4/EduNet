import { useState, useEffect, useCallback } from 'react';
import { LogOut, BookOpen, FileText, Brain, Plus } from 'lucide-react';
import type { User } from '../App';
import { CoursesList } from './CoursesList';
import { AssignmentsList } from './AssignmentsList';
import { QuizzesList } from './QuizzesList';
import { EnrollCourseModal } from './EnrollCourseModal';
import type { Course, Assignment, Quiz } from '../App';
interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'courses' | 'assignments' | 'quizzes';

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('courses');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  
  // State-uri pentru datele reale
 const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Aduce datele de la backend (IntelliJ)
  const fetchStudentData = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = "http://localhost:8080/api";

      // Luam datele specifice studentului
      const [assignmentsRes, coursesRes, quizzesRes] = await Promise.all([
        fetch(`${baseUrl}/assignments/student/${user.id}`),
        fetch(`${baseUrl}/courses/student/${user.id}`),
        fetch(`${baseUrl}/quizzes/student/${user.id}`)
      ]);

      const [assignmentsData, coursesData, quizzesData] = await Promise.all([
        assignmentsRes.json(),
        coursesRes.json(),
        quizzesRes.json()
      ]);

      setAssignments(assignmentsData);
      setCourses(coursesData);
      setQuizzes(quizzesData);
      setLoading(false);
    } catch (error) {
      console.error("Eroare la incarcarea datelor studentului:", error);
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Portal Student</h1>
                <p className="text-sm text-gray-600">Bine ai venit, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <LogOut className="w-4 h-4" />
              Deconectare
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors font-medium ${
                activeTab === 'courses'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Cursuri
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors font-medium ${
                activeTab === 'assignments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Teme
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors font-medium ${
                activeTab === 'quizzes'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Brain className="w-5 h-5" />
              Quizuri
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab === 'courses' && 'Cursurile Mele'}
            {activeTab === 'assignments' && 'Temele Mele'}
            {activeTab === 'quizzes' && 'Quizurile Mele'}
          </h2>
          {activeTab === 'courses' && (
            <button
              onClick={() => setShowEnrollModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Înscrie-te la un curs
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            Se încarcă datele din baza de date...
          </div>
        ) : (
          <>
            {activeTab === 'courses' && (
              <CoursesList courses={courses} userRole="student" onCourseUpdated={fetchStudentData} />
            )}
            {activeTab === 'assignments' && (
              <AssignmentsList assignments={assignments} userRole="student" userId={user.id} />
            )}
            {activeTab === 'quizzes' && <QuizzesList quizzes={quizzes} userRole="student" userId={user.id} />}
          </>
        )}
      </main>

      {showEnrollModal && (
        <EnrollCourseModal
          onClose={() => { setShowEnrollModal(false) }}
          onEnrollSuccess={fetchStudentData}
          studentId={user.id}
        />
      )}
    </div>
  );
}
