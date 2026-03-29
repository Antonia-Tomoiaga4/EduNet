import { useState } from 'react';
import { GraduationCap, UserCircle, BookOpen } from 'lucide-react';
import type { User } from '../App';

interface LoginPageProps {
  
  onLogin: (user: User) => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'student' | 'professor' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      onLogin(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      const text = await response.text();
      console.log("LOGIN FAIL:", response.status, text);
      setError(text || "Email sau parolă incorectă");
    }
  } catch (err) {
    console.error("Eroare la login:", err);
    setError("Serverul nu răspunde");
  }
};



  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !selectedRole) {
      setError('Completează toate câmpurile');
      return;
    }
    if (password.length < 6) {
      setError('Parola trebuie să aibă minimum 6 caractere');
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole!.toUpperCase() // Folosim '!' pentru a garanta că nu e null
        })
      });

      if (response.ok) {
        setActiveTab('login');
        setError('Cont creat cu succes! Te rugăm să te conectezi.');
        setPassword('');
      } else {
        try {
          const errorData = await response.json();
          // Afișăm mesajul specific de eroare venit din Java (ex: "Email already exists")
          setError(`Eroare: ${errorData.message || errorData.error}`);
        } catch (e) {
          setError(`Eroare server: ${response.statusText}`);
        }
      }
    } catch (err) {
      console.error("Eroare la signup:", err);
      setError("Serverul nu răspunde. Verifică dacă aplicația Java (IntelliJ) este pornită.");
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
          <p className="text-gray-600">EduNet</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('login');
              setError('');
              setPassword('');
            }}
            className={`flex-1 py-2 px-4 text-center transition-colors ${
              activeTab === 'login'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Conectare
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setError('');
              setPassword('');
            }}
            className={`flex-1 py-2 px-4 text-center transition-colors ${
              activeTab === 'signup'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Înregistrare
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
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
                  <UserCircle
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedRole === 'student' ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  />
                  <div className="text-center text-sm">Student</div>
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
                  <BookOpen
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedRole === 'professor' ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  />
                  <div className="text-center text-sm">Profesor</div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="login-email" className="block text-gray-700 mb-2">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="ion.popescu@universitate.ro"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-gray-700 mb-2">Parola</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Conectează-te
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-6">
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
                  <UserCircle
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedRole === 'student' ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  />
                  <div className="text-center text-sm">Student</div>
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
                  <BookOpen
                    className={`w-8 h-8 mx-auto mb-2 ${
                      selectedRole === 'professor' ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  />
                  <div className="text-center text-sm">Profesor</div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="signup-name" className="block text-gray-700 mb-2">Nume complet</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ion Popescu"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-gray-700 mb-2">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="ion.popescu@universitate.ro"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-gray-700 mb-2">Parola</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractere</p>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Înregistrează-te
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
