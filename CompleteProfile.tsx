import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Input } from '@/components/Forms';

interface CompleteProfileProps {
  onNavigate: (path: string) => void;
}

export function CompleteProfile({ onNavigate }: CompleteProfileProps) {
  const { currentUser, completeProfile } = useAuth();
  const { notify } = useNotification();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: '',
    company: '',
    location: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    completeProfile(formData);
    notify('Profile completed!');
    onNavigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-500">Just a few more details to get started</p>
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
            placeholder="Your Location" 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}
