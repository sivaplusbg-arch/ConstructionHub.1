import { useAuth } from '@/context/AuthContext';
import { PageLayout } from '@/components/Layout';
import { DB } from '@/utils/db';
import { timeAgo } from '@/utils/helpers';

interface MyApplicationsProps {
  onNavigate: (path: string) => void;
}

export function MyApplications({ onNavigate }: MyApplicationsProps) {
  const { currentUser } = useAuth();
  const applications = DB.getApplications().filter(a => a.user_id === currentUser?.id);
  const jobs = DB.getJobs();

  return (
    <PageLayout title="My Applications" currentPath="/applications">
      <div className="max-w-4xl mx-auto space-y-4">
        {applications.map(app => {
          const job = jobs.find(j => j.id === app.job_id);
          if (!job) return null;
          return (
            <div key={app.id} className="bg-white rounded-xl shadow-md p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                </div>
                <span className={`status-${app.status} px-3 py-1 text-xs font-medium rounded-full`}>
                  {app.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                <strong>Your message:</strong> {app.message || 'No message'}
              </p>
              <p className="text-gray-400 text-xs">Applied {timeAgo(app.created_at)}</p>
            </div>
          );
        })}
        {applications.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">No applications yet</h3>
            <p className="text-gray-500 mb-4">Browse jobs and apply to get started</p>
            <button
              onClick={() => onNavigate('/jobs')}
              className="bg-primary text-white px-6 py-2 rounded-lg inline-block"
            >
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
