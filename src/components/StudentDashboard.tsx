import { useState } from 'react';
import { LogOut, BookOpen, FileText, Brain } from 'lucide-react';
import type { User } from '../App';
import { CoursesList } from './CoursesList';
import { AssignmentsList } from './AssignmentsList';
import { QuizzesList } from './QuizzesList';
import { mockCourses, mockAssignments, mockQuizzes } from '../data/mockData';

interface StudentDashboardProps {
    user: User;
    onLogout: () => void;
}

type Tab = 'courses' | 'assignments' | 'quizzes';

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>('courses');

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
                                <h1 className="text-gray-900">Portal Student</h1>
                                <p className="text-sm text-gray-600">Bine ai venit, {user.name}</p>
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
                {activeTab === 'courses' && <CoursesList courses={mockCourses} userRole="student" />}
                {activeTab === 'assignments' && <AssignmentsList assignments={mockAssignments} userRole="student" userId={user.id} />}
                {activeTab === 'quizzes' && <QuizzesList quizzes={mockQuizzes} userRole="student" userId={user.id} />}
            </main>
        </div>
    );
}
