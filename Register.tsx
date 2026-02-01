import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Input } from '@/components/Forms';

interface RegisterProps {
  onNavigate: (path: string) => void;
}

export function Register({ onNavigate }: RegisterProps) {
  const { register } = useAuth();
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    password: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      notify('Password must be at least 6 characters', 'error');
      return;
    }
    const result = register(formData);
    if (result.success) {
      notify('Account created successfully!');
      onNavigate('/dashboard');
    } else {
      notify(result.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500">Join ConstructHub today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required 
          />
          <Input 
            type="email" 
            placeholder="Email address" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required 
          />
          <Input 
            type="tel" 
            placeholder="Phone Number" 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required 
          />
          <Input 
            type="text" 
            placeholder="Company Name (optional)" 
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <Input 
            type="text" 
            placeholder="Location" 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required 
          />
          <Input 
            type="password" 
            placeholder="Password (min 6 characters)" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Create Account
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button onClick={() => onNavigate('/login')} className="text-primary font-semibold hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
