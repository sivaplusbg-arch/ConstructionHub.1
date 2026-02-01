export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  phone: string;
  company: string;
  location: string;
  profile_completed: boolean;
  google_id?: string;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  industry_category: string;
  required_services: string;
  budget: string;
  location: string;
  deadline: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface Listing {
  id: string;
  user_id: string;
  machine_type: string;
  industry_category: string;
  capabilities: string;
  location: string;
  availability: 'Available' | 'Unavailable' | 'On Job';
  price_range: string;
  description: string;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Photo {
  id: string;
  listing_id: string;
  image_url: string;
  uploaded_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}
