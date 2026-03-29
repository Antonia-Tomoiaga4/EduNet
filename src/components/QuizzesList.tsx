import { useState } from 'react';
import { Brain, CheckCircle, XCircle, Award } from 'lucide-react';
import type { Quiz, QuizResult } from '../App';

interface QuizzesListProps {
    quizzes: Quiz[];
    userRole: 'student' | 'professor';
    userId: string;
}

export function QuizzesList({ quizzes, userRole, userId }: QuizzesListProps) {
    const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [result, setResult] = useState<QuizResult | null>(null);

    const handleStartQuiz = (quizId: string) => {
        setActiveQuiz(quizId);
        setAnswers({});
        setResult(null);
    };

    const handleAnswerSelect = (questionId: string, answerIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleSubmitQuiz = (quiz: Quiz) => {
        let score = 0;
        const answerArray: number[] = [];

        quiz.questions.forEach((question) => {
            const userAnswer = answers[question.id];
            answerArray.push(userAnswer ?? -1);
            if (userAnswer === question.correctAnswer) {
                score++;
            }
        });

        const quizResult: QuizResult = {
            quizId: quiz.id,
            studentId: userId,
            answers: answerArray,
            score,
            totalQuestions: quiz.questions.length,
            completedAt: new Date().toISOString(),
        };

        setResult(quizResult);
    };

    const getActiveQuizData = () => {
        return quizzes.find(q => q.id === activeQuiz);
    };

    const activeQuizData = getActiveQuizData();

    if (activeQuizData && userRole === 'student') {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                        <h2 className="text-gray-900 mb-2">{activeQuizData.title}</h2>
                        <p className="text-gray-600">{activeQuizData.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Întrebări: {activeQuizData.questions.length}
                        </p>
                    </div>

                    {!result ? (
                        <div className="space-y-6">
                            {activeQuizData.questions.map((question, qIndex) => (
                                <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900 mb-4">
                                        {qIndex + 1}. {question.question}
                                    </p>
                                    <div className="space-y-2">
                                        {question.options.map((option, oIndex) => (
                                            <button
                                                key={oIndex}
                                                onClick={() => handleAnswerSelect(question.id, oIndex)}
                                                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                                                    answers[question.id] === oIndex
                                                        ? 'border-indigo-600 bg-indigo-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => handleSubmitQuiz(activeQuizData)}
                                    disabled={Object.keys(answers).length !== activeQuizData.questions.length}
                                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Trimite răspunsurile
                                </button>
                                <button
                                    onClick={() => setActiveQuiz(null)}
                                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Anulează
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
                                <Award className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h3 className="text-gray-900 mb-2">Quiz finalizat!</h3>
                            <p className="text-gray-600 mb-6">
                                Scor: {result.score} din {result.totalQuestions} ({Math.round((result.score / result.totalQuestions) * 100)}%)
                            </p>

                            <div className="space-y-4 mb-6 text-left">
                                {activeQuizData.questions.map((question, qIndex) => {
                                    const userAnswer = result.answers[qIndex];
                                    const isCorrect = userAnswer === question.correctAnswer;

                                    return (
                                        <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-900 mb-3">
                                                {qIndex + 1}. {question.question}
                                            </p>
                                            <div className="space-y-2">
                                                {question.options.map((option, oIndex) => {
                                                    const isUserAnswer = userAnswer === oIndex;
                                                    const isCorrectAnswer = oIndex === question.correctAnswer;

                                                    return (
                                                        <div
                                                            key={oIndex}
                                                            className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${
                                                                isCorrectAnswer
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : isUserAnswer
                                                                        ? 'border-red-500 bg-red-50'
                                                                        : 'border-gray-200'
                                                            }`}
                                                        >
                                                            {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                                                            {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                                                            <span className={isCorrectAnswer ? 'text-green-900' : isUserAnswer ? 'text-red-900' : 'text-gray-600'}>
                                {option}
                              </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setActiveQuiz(null)}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Înapoi la quizuri
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Brain className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-gray-900 mb-2">{quiz.title}</h3>
                            <p className="text-gray-600 mb-2">{quiz.description}</p>
                            <p className="text-sm text-gray-500">Curs: {quiz.courseName}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Întrebări:</span>
                            <span className="text-gray-900">{quiz.questions.length}</span>
                        </div>
                    </div>

                    {userRole === 'student' && (
                        <button
                            onClick={() => handleStartQuiz(quiz.id)}
                            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Începe quiz-ul
                        </button>
                    )}

                    {userRole === 'professor' && (
                        <div className="text-sm text-gray-600">
                            Creat la: {new Date(quiz.createdAt).toLocaleDateString('ro-RO')}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
