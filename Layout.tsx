import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const { isLoggedIn, currentUser, logout } = useAuth();

  return (
    <header className="bg-secondary text-white px-4 py-4 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => window.history.back()} className="p-2 hover:bg-white/10 rounded-lg">
              <i className="fas fa-arrow-left"></i>
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <>
              <span className="hidden md:block text-sm">{currentUser?.name}</span>
              <button onClick={logout} className="p-2 hover:bg-white/10 rounded-lg" title="Logout">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

interface SidebarProps {
  isAdmin: boolean;
  currentPath: string;
}

export function Sidebar({ isAdmin, currentPath }: SidebarProps) {
  const { logout } = useAuth();
  
  const links = isAdmin ? [
    { path: '/admin', icon: 'tachometer-alt', label: 'Dashboard' },
    { path: '/admin/jobs', icon: 'briefcase', label: 'Manage Jobs' },
    { path: '/admin/users', icon: 'users', label: 'Manage Users' },
    { path: '/admin/listings', icon: 'list', label: 'Listings' },
    { path: '/admin/applications', icon: 'file-alt', label: 'Applications' },
    { path: '/admin/news', icon: 'bullhorn', label: 'Announcements' },
    { path: '/admin/analytics', icon: 'chart-bar', label: 'Analytics' }
  ] : [
    { path: '/dashboard', icon: 'home', label: 'Dashboard' },
    { path: '/jobs', icon: 'briefcase', label: 'Browse Jobs' },
    { path: '/my-listings', icon: 'truck', label: 'My Machines' },
    { path: '/applications', icon: 'file-alt', label: 'My Applications' },
    { path: '/profile', icon: 'user-cog', label: 'Profile' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-secondary min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <i className="fas fa-hard-hat text-white text-xl"></i>
        </div>
        <span className="text-white font-bold text-lg">ConstructHub</span>
      </div>
      <nav className="flex-1 space-y-2">
        {links.map(l => (
          <a 
            key={l.path}
            href={`#${l.path}`} 
            className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition ${currentPath === l.path ? 'active' : ''}`}
          >
            <i className={`fas fa-${l.icon} w-5`}></i>
            <span>{l.label}</span>
          </a>
        ))}
      </nav>
      <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg mt-auto">
        <i className="fas fa-sign-out-alt w-5"></i>
        <span>Logout</span>
      </button>
    </aside>
  );
}

interface MobileNavProps {
  isAdmin: boolean;
  currentPath: string;
}

export function MobileNav({ isAdmin, currentPath }: MobileNavProps) {
  const links = isAdmin ? [
    { path: '/admin', icon: 'home', label: 'Dashboard' },
    { path: '/admin/jobs', icon: 'briefcase', label: 'Jobs' },
    { path: '/admin/users', icon: 'users', label: 'Users' },
    { path: '/admin/listings', icon: 'list', label: 'Listings' },
    { path: '/admin/news', icon: 'bullhorn', label: 'News' }
  ] : [
    { path: '/dashboard', icon: 'home', label: 'Home' },
    { path: '/jobs', icon: 'briefcase', label: 'Jobs' },
    { path: '/my-listings', icon: 'truck', label: 'Machines' },
    { path: '/applications', icon: 'file-alt', label: 'Applied' },
    { path: '/profile', icon: 'user', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
      <div className="flex justify-around py-2">
        {links.map(l => (
          <a 
            key={l.path}
            href={`#${l.path}`} 
            className={`flex flex-col items-center p-2 ${currentPath === l.path ? 'text-primary' : 'text-gray-500'}`}
          >
            <i className={`fas fa-${l.icon} text-lg`}></i>
            <span className="text-xs mt-1">{l.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  currentPath: string;
}

export function PageLayout({ children, title, currentPath }: PageLayoutProps) {
  const { isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={isAdmin} currentPath={currentPath} />
      <div className="flex-1">
        <Header title={title} />
        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <MobileNav isAdmin={isAdmin} currentPath={currentPath} />
      </div>
    </div>
  );
}
