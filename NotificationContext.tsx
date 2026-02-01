import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: Notification['type'] = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, notify }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`notification px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white ${
              n.type === 'success' ? 'bg-green-500' :
              n.type === 'error' ? 'bg-red-500' :
              n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
          >
            <i className={`fas fa-${
              n.type === 'success' ? 'check-circle' :
              n.type === 'error' ? 'exclamation-circle' : 'info-circle'
            }`}></i>
            <span>{n.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
