import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { PageLayout } from '@/components/Layout';
import { JobCard, StatsCard } from '@/components/Cards';
import { Modal } from '@/components/Modal';
import { Textarea } from '@/components/Forms';
import { DB } from '@/utils/db';

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { currentUser, canPost } = useAuth();
  const { notify } = useNotification();
  const [applyModal, setApplyModal] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState('');

  const jobs = DB.getJobs().filter(j => j.status === 'open').slice(0, 3);
  const announcements = DB.getAnnouncements().slice(0, 2);
  const myListings = DB.getListings().filter(l => l.user_id === currentUser?.id);
  const myApps = DB.getApplications().filter(a => a.user_id === currentUser?.id);

  const handleApply = (jobId: string) => {
    if (!canPost) {
      notify('Please complete your profile first', 'warning');
      onNavigate('/complete-profile');
      return;
    }
    const existing = DB.getApplications().find(a => a.job_id === jobId && a.user_id === currentUser?.id);
    if (existing) {
      notify('You have already applied to this job', 'info');
      return;
    }
    setApplyModal(jobId);
  };

  const submitApplication = () => {
    if (!applyModal || !currentUser) return;
    const apps = DB.getApplications();
    apps.push({
      id: DB.generateId(),
      job_id: applyModal,
      user_id: currentUser.id,
      message: applyMessage,
      status: 'pending',
      created_at: new Date().toISOString()
    });
    DB.setApplications(apps);
    setApplyModal(null);
    setApplyMessage('');
    notify('Application submitted successfully!');
  };

  const applyJob = applyModal ? DB.getJobs().find(j => j.id === applyModal) : null;

  return (
    <PageLayout title="Dashboard" currentPath="/dashboard">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary to-amber-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h2>
          <p className="opacity-90">Find jobs and showcase your machinery services.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard icon="truck" label="My Listings" value={myListings.length} color="blue" />
          <StatsCard icon="file-alt" label="Applications" value={myApps.length} color="green" />
          <StatsCard icon="briefcase" label="Open Jobs" value={DB.getJobs().filter(j => j.status === 'open').length} color="amber" />
          <StatsCard icon="check-circle" label="Approved" value={myApps.filter(a => a.status === 'approved').length} color="purple" />
        </div>

        {announcements.length > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              <i className="fas fa-bullhorn mr-2"></i>Latest Announcements
            </h3>
            {announcements.map(a => (
              <p key={a.id} className="text-blue-700 text-sm">
                <strong>{a.title}:</strong> {a.content}
              </p>
            ))}
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Recent Job Opportunities</h3>
            <button onClick={() => onNavigate('/jobs')} className="text-primary font-medium hover:underline">
              View All →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {jobs.map(j => (
              <JobCard key={j.id} job={j} onApply={handleApply} />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={!!applyModal} onClose={() => setApplyModal(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Apply to Job</h2>
            <button onClick={() => setApplyModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="text-gray-600 mb-4"><strong>{applyJob?.title}</strong></p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <Textarea
                placeholder="Explain why you are a good fit for this job..."
                rows={5}
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setApplyModal(null)} 
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={submitApplication} 
                className="flex-1 bg-primary hover:bg-amber-600 text-white py-3 rounded-lg font-medium"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
