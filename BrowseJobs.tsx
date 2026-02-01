import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { PageLayout } from '@/components/Layout';
import { JobCard } from '@/components/Cards';
import { Modal } from '@/components/Modal';
import { Textarea } from '@/components/Forms';
import { DB } from '@/utils/db';
import { INDUSTRIES } from '@/utils/helpers';

interface BrowseJobsProps {
  onNavigate: (path: string) => void;
}

export function BrowseJobs({ onNavigate }: BrowseJobsProps) {
  const { currentUser, canPost } = useAuth();
  const { notify } = useNotification();
  const [search, setSearch] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [applyModal, setApplyModal] = useState<string | null>(null);
  const [applyMessage, setApplyMessage] = useState('');

  const jobs = useMemo(() => {
    let result = DB.getJobs();
    if (search) {
      result = result.filter(j => 
        j.title.toLowerCase().includes(search.toLowerCase()) || 
        j.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterIndustry) {
      result = result.filter(j => j.industry_category === filterIndustry);
    }
    if (filterStatus) {
      result = result.filter(j => j.status === filterStatus);
    }
    if (filterLocation) {
      result = result.filter(j => j.location.toLowerCase().includes(filterLocation.toLowerCase()));
    }
    return result;
  }, [search, filterIndustry, filterStatus, filterLocation]);

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
    <PageLayout title="Browse Jobs" currentPath="/jobs">
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            className="px-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
          >
            <option value="">All Industries</option>
            {INDUSTRIES.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <input
            type="text"
            placeholder="Location..."
            className="px-4 py-2 border rounded-lg"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(j => (
          <JobCard key={j.id} job={j} onApply={handleApply} />
        ))}
      </div>
      {jobs.length === 0 && (
        <p className="text-center text-gray-500 py-12">No jobs match your criteria.</p>
      )}

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
