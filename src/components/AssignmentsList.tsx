import { useState } from 'react';
import { Calendar, Clock, Send, Users } from 'lucide-react';
import type { Assignment } from '../App';

interface AssignmentsListProps {
    assignments: Assignment[];
    userRole: 'student' | 'professor';
    userId: string;
}

export function AssignmentsList({ assignments, userRole, userId }: AssignmentsListProps) {
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
    const [submissionText, setSubmissionText] = useState('');

    const handleSubmit = (assignmentId: string) => {
        if (submissionText.trim()) {
            alert(`Temă trimisă cu succes!\n\n${submissionText}`);
            setSubmissionText('');
            setSelectedAssignment(null);
        }
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    return (
        <div className="space-y-6">
            {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                <h3 className="text-gray-900">{assignment.title}</h3>
    {isOverdue(assignment.dueDate) && (
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
            Expirat
            </span>
    )}
    </div>
    <p className="text-sm text-gray-600 mb-3">Curs: {assignment.courseName}</p>
    <p className="text-gray-600 mb-4">{assignment.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
    <div className="flex items-center gap-1">
    <Calendar className="w-4 h-4" />
        Termen: {new Date(assignment.dueDate).toLocaleDateString('ro-RO')}
    </div>
    <div className="flex items-center gap-1">
    <Clock className="w-4 h-4" />
        {new Date(assignment.dueDate).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
        </div>
        </div>
        </div>
        </div>

    {userRole === 'student' && (
        <div className="border-t border-gray-200 pt-4">
        {selectedAssignment === assignment.id ? (
                <div className="space-y-3">
                <textarea
                    value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
        placeholder="Scrie răspunsul tău aici..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        rows={4}
        />
        <div className="flex gap-2">
    <button
        onClick={() => handleSubmit(assignment.id)}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
        <Send className="w-4 h-4" />
            Trimite tema
    </button>
    <button
        onClick={() => {
        setSelectedAssignment(null);
        setSubmissionText('');
    }}
        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
            Anulează
            </button>
            </div>
            </div>
    ) : (
        <button
            onClick={() => setSelectedAssignment(assignment.id)}
        disabled={isOverdue(assignment.dueDate)}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
            Trimite răspuns
    </button>
    )}
        </div>
    )}

    {userRole === 'professor' && assignment.submissions && (
        <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Users className="w-4 h-4" />
            {assignment.submissions.length} răspunsuri primite
    </div>
    <div className="space-y-2">
        {assignment.submissions.map((submission) => (
                <div key={submission.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
            <span className="text-gray-900">{submission.studentName}</span>
                <span className="text-xs text-gray-500">
            {new Date(submission.submittedAt).toLocaleString('ro-RO')}
            </span>
            </div>
            <p className="text-sm text-gray-600">{submission.content}</p>
            </div>
    ))}
        </div>
        </div>
    )}
    </div>
))}
    </div>
);
}
