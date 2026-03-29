import React, { useState } from 'react';
import { GraduationCap, UserCircle, BookOpen } from 'lucide-react';
import type { User } from '../App';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
    const [selectedRole, setSelectedRole] = useState<'student' | 'professor' | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRole && name && email) {
            onLogin({
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                role: selectedRole,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-indigo-900 mb-2">Platformă Educațională</h1>
                    <p className="text-gray-600">Conectează-te pentru a continua</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-3">Selectează rolul</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('student')}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    selectedRole === 'student'
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-300'
                                }`}
                            >
                                <UserCircle className={`w-8 h-8 mx-auto mb-2 ${
                                    selectedRole === 'student' ? 'text-indigo-600' : 'text-gray-400'
                                }`} />
                                <div className="text-center">Student</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole('professor')}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    selectedRole === 'professor'
                                        ? 'border-indigo-600 bg-indigo-50'
                                        : 'border-gray-200 hover:border-indigo-300'
                                }`}
                            >
                                <BookOpen className={`w-8 h-8 mx-auto mb-2 ${
                                    selectedRole === 'professor' ? 'text-indigo-600' : 'text-gray-400'
                                }`} />
                                <div className="text-center">Profesor</div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-gray-700 mb-2">Nume complet</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ion Popescu"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="ion.popescu@universitate.ro"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedRole}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Conectează-te
                    </button>
                </form>
            </div>
        </div>
    );
}
