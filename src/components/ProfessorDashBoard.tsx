import { useState } from 'react';
import { LogOut, BookOpen, FileText, Brain, Plus } from 'lucide-react';
import type { User } from '../App';
import { CoursesList } from './CoursesList';
import { AssignmentsList } from './AssignmentsList';
import { QuizzesList } from './QuizzesList';
import { CreateCourseModal } from './CreateCourseModal';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { CreateQuizModal } from './CreateQuizModal';
import { mockCourses, mockAssignments, mockQuizzes } from '../data/mockData';

interface ProfessorDashboardProps {
    user: User;
    onLogout: () => void;
}

type Tab = 'courses' | 'assignments' | 'quizzes';

export function ProfessorDashboard({ user, onLogout }: ProfessorDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('courses');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const getModalTitle = () => {
        switch (activeTab) {
            case 'courses': return 'Adaugă Curs Nou';
            case 'assignments': return 'Adaugă Temă Nouă';
            case 'quizzes': return 'Adaugă Quiz Nou';
        }
    };

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
                                <h1 className="text-gray-900">Portal Profesor</h1>
                                <p className="text-sm text-gray-600">Bine ai venit, Prof. {user.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                            className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
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
                            className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
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
                            className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
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
                    <h2 className="text-gray-900">
                        {activeTab === 'courses' && 'Cursurile Mele'}
                        {activeTab === 'assignments' && 'Temele Mele'}
                        {activeTab === 'quizzes' && 'Quizurile Mele'}
                    </h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {activeTab === 'courses' && 'Adaugă Curs'}
                        {activeTab === 'assignments' && 'Adaugă Temă'}
                        {activeTab === 'quizzes' && 'Adaugă Quiz'}
                    </button>
                </div>

                {activeTab === 'courses' && <CoursesList courses={mockCourses} userRole="professor" />}
                {activeTab === 'assignments' && <AssignmentsList assignments={mockAssignments} userRole="professor" userId={user.id} />}
                {activeTab === 'quizzes' && <QuizzesList quizzes={mockQuizzes} userRole="professor" userId={user.id} />}
            </main>

            {/* Modals */}
            {showCreateModal && activeTab === 'courses' && (
                <CreateCourseModal
                    onClose={() => setShowCreateModal(false)}
                    professorId={user.id}
                    professorName={user.name}
                />
            )}
            {showCreateModal && activeTab === 'assignments' && (
                <CreateAssignmentModal
                    onClose={() => setShowCreateModal(false)}
                    professorId={user.id}
                    courses={mockCourses}
                />
            )}
            {showCreateModal && activeTab === 'quizzes' && (
                <CreateQuizModal
                    onClose={() => setShowCreateModal(false)}
                    professorId={user.id}
                    courses={mockCourses}
                />
            )}
        </div>
    );
}
