import type { User, Job, Listing, Application, Photo, Announcement } from '@/types';

const hash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const get = <T>(key: string): T[] => {
  return JSON.parse(localStorage.getItem('ch_' + key) || '[]');
};

const set = <T>(key: string, data: T[]): void => {
  localStorage.setItem('ch_' + key, JSON.stringify(data));
};

const seedData = () => {
  const jobs: Job[] = [
    { 
      id: generateId(), 
      title: 'Excavation Work for Commercial Building', 
      description: 'Looking for experienced excavation team with heavy machinery for a 5000 sqft commercial building foundation.', 
      industry_category: 'Construction', 
      required_services: 'Excavators, Backhoes', 
      budget: '$15,000 - $25,000', 
      location: 'Austin, TX', 
      deadline: '2026-02-28', 
      status: 'open', 
      created_at: new Date().toISOString() 
    },
    { 
      id: generateId(), 
      title: 'Crane Services for Steel Structure', 
      description: 'Need mobile crane services for steel structure installation. Project duration: 2 weeks.', 
      industry_category: 'Construction', 
      required_services: 'Mobile Crane, Tower Crane', 
      budget: '$8,000 - $12,000', 
      location: 'Houston, TX', 
      deadline: '2026-03-15', 
      status: 'open', 
      created_at: new Date().toISOString() 
    },
    { 
      id: generateId(), 
      title: 'Concrete Pumping Services', 
      description: 'Concrete pumping required for high-rise building project. Estimated 500 cubic meters.', 
      industry_category: 'Construction', 
      required_services: 'Concrete Pump Truck', 
      budget: '$5,000 - $7,000', 
      location: 'Dallas, TX', 
      deadline: '2026-02-20', 
      status: 'open', 
      created_at: new Date().toISOString() 
    }
  ];
  set('jobs', jobs);
  
  const announcements: Announcement[] = [
    { 
      id: generateId(), 
      title: 'Welcome to ConstructHub!', 
      content: 'We are excited to launch our new job and service marketplace for the construction industry.', 
      created_at: new Date().toISOString() 
    },
    { 
      id: generateId(), 
      title: 'New Features Coming Soon', 
      content: 'Stay tuned for our upcoming mobile app and enhanced search features.', 
      created_at: new Date().toISOString() 
    }
  ];
  set('announcements', announcements);
};

const init = () => {
  if (!localStorage.getItem('ch_initialized')) {
    const adminUser: User = {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@constructhub.com',
      password_hash: hash('admin123'),
      role: 'admin',
      phone: '+1234567890',
      company: 'ConstructHub Inc.',
      location: 'New York, USA',
      profile_completed: true,
      created_at: new Date().toISOString()
    };
    set('users', [adminUser]);
    set('jobs', []);
    set('listings', []);
    set('applications', []);
    set('photos', []);
    set('announcements', []);
    localStorage.setItem('ch_initialized', 'true');
    seedData();
  }
};

export const DB = {
  init,
  hash,
  generateId,
  get,
  set,
  getUsers: () => get<User>('users'),
  setUsers: (data: User[]) => set('users', data),
  getJobs: () => get<Job>('jobs'),
  setJobs: (data: Job[]) => set('jobs', data),
  getListings: () => get<Listing>('listings'),
  setListings: (data: Listing[]) => set('listings', data),
  getApplications: () => get<Application>('applications'),
  setApplications: (data: Application[]) => set('applications', data),
  getPhotos: () => get<Photo>('photos'),
  setPhotos: (data: Photo[]) => set('photos', data),
  getAnnouncements: () => get<Announcement>('announcements'),
  setAnnouncements: (data: Announcement[]) => set('announcements', data),
};
