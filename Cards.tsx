import type { Job, Listing } from '@/types';
import { formatDate } from '@/utils/helpers';
import { DB } from '@/utils/db';

interface JobCardProps {
  job: Job;
  showApply?: boolean;
  onApply?: (jobId: string) => void;
}

export function JobCard({ job, showApply = true, onApply }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 card-hover">
      <div className="flex justify-between items-start mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          {job.industry_category}
        </span>
        <span className={`status-${job.status} px-3 py-1 text-xs font-medium rounded-full`}>
          {job.status}
        </span>
      </div>
      <h3 className="font-bold text-lg text-gray-800 mb-2">{job.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-map-marker-alt w-4 text-primary"></i>
          {job.location}
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-tools w-4 text-primary"></i>
          {job.required_services}
        </div>
        {job.budget && (
          <div className="flex items-center gap-2">
            <i className="fas fa-dollar-sign w-4 text-primary"></i>
            {job.budget}
          </div>
        )}
        <div className="flex items-center gap-2">
          <i className="fas fa-calendar w-4 text-primary"></i>
          Deadline: {formatDate(job.deadline)}
        </div>
      </div>
      {showApply && job.status === 'open' && onApply && (
        <button 
          onClick={() => onApply(job.id)} 
          className="w-full bg-primary hover:bg-amber-600 text-white py-2 rounded-lg font-medium transition"
        >
          Apply Now
        </button>
      )}
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ListingCard({ listing, showActions = false, onEdit, onDelete }: ListingCardProps) {
  const photos = DB.getPhotos().filter(p => p.listing_id === listing.id);
  const mainPhoto = photos[0]?.image_url || 'https://via.placeholder.com/400x300?text=No+Image';
  const user = DB.getUsers().find(u => u.id === listing.user_id);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
      <div className="relative h-48">
        <img src={mainPhoto} className="w-full h-full object-cover" alt={listing.machine_type} />
        <span className="absolute top-3 left-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full">
          {listing.industry_category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{listing.machine_type}</h3>
        {user && <p className="text-sm text-gray-500 mb-2">by {user.name}</p>}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description || listing.capabilities}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            <i className="fas fa-map-marker-alt mr-1 text-primary"></i>
            {listing.location}
          </span>
          <span className={listing.availability === 'Available' ? 'text-green-600' : 'text-red-600'}>
            {listing.availability}
          </span>
        </div>
        {listing.price_range && (
          <p className="text-primary font-semibold mt-2">{listing.price_range}</p>
        )}
        {showActions && (
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => onEdit?.(listing.id)} 
              className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm"
            >
              <i className="fas fa-edit mr-1"></i>Edit
            </button>
            <button 
              onClick={() => onDelete?.(listing.id)} 
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg text-sm"
            >
              <i className="fas fa-trash mr-1"></i>Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}

export function StatsCard({ icon, label, value, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
          <i className={`fas fa-${icon} text-${color}-600 text-xl`}></i>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
