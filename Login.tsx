import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Input } from '@/components/Forms';

interface LoginProps {
  onNavigate: (path: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const { login, googleSignIn } = useAuth();
  const { notify } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      notify('Login successful!');
      // Need to check isAdmin after login
      const session = JSON.parse(localStorage.getItem('ch_session') || '{}');
      onNavigate(session.user?.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      notify(result.error || 'Login failed', 'error');
    }
  };

  const handleGoogleSignIn = () => {
    const email = prompt('Enter your Google email:');
    if (!email) return;
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const result = googleSignIn({ email, name, sub: 'google_' + Date.now() });
    if (result.success) {
      notify('Google sign-in successful!');
      onNavigate(result.needsProfile ? '/complete-profile' : '/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-hard-hat text-white text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ConstructHub</h1>
          <p className="text-gray-500">Job & Service Marketplace</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Sign In
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">or continue with</span>
          </div>
        </div>
        <div className="flex justify-center">
          <button 
            onClick={handleGoogleSignIn}
            className="flex items-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('/register')} className="text-primary font-semibold hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
