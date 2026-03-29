// Tipuri pentru utilizatori
export type UserRole = 'student' | 'professor' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor';
}

// Tipuri pentru cursuri
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

// Tipuri pentru teme
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

// Tipuri pentru quizuri
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
