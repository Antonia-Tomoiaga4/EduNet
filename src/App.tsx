import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';

export type UserRole = 'student' | 'professor' | null;

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'professor';
}

export interface Course {
    id: string;
    title: string;
    description: string;
    professorId: string;
    professorName: string;
    files: CourseFile[];
    createdAt: string;
}

export interface CourseFile {
    id: string;
    name: string;
    url: string;
    size: string;
}

export interface Assignment {
    id: string;
    courseId: string;
    courseName: string;
    title: string;
    description: string;
    dueDate: string;
    professorId: string;
    submissions?: Submission[];
}

export interface Submission {
    id: string;
    studentId: string;
    studentName: string;
    content: string;
    submittedAt: string;
}

export interface Quiz {
    id: string;
    courseId: string;
    courseName: string;
    title: string;
    description: string;
    questions: Question[];
    professorId: string;
    createdAt: string;
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface QuizResult {
    quizId: string;
    studentId: string;
    answers: number[];
    score: number;
    totalQuestions: number;
    completedAt: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = (userData: User) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
    };

    if (!user) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <>
            {user.role === 'student' ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
            ) : (
                <ProfessorDashboard user={user} onLogout={handleLogout} />
            )}
        </>
    );
}

export default App;
