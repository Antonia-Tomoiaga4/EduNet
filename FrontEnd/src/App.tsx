import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'STUDENT' | 'PROFESSOR';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  professorName?: string;
  professorId?: number;
  createdAt: string;
  files?: { id: string; name: string; size: string; url?: string; uploadedAt?: string }[];
}

export interface Assignment {
  id: string | number;
  title: string;
  description: string;
  courseName?: string;
  dueDate: string;
  submissions?: {
    id: string | number;
    studentId?: string;
    studentName: string;
    content: string;
    fileName?: string;
    fileUrl?: string;
    grade?: number;
    feedback?: string;
  }[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseName?: string;
  questions: Question[];
  createdAt: string;
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

  // Adăugăm ": void" pentru a elimina eroarea ts(7023)
  const handleLogin = (userData: User): void => {
    setUser(userData);
  };

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {user.role === 'student' || user.role === 'STUDENT' ? (
        <StudentDashboard user={user} onLogout={handleLogout} />
      ) : (
        <ProfessorDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
