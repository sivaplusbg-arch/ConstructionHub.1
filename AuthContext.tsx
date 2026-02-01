import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DB } from '@/utils/db';
import type { User } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  canPost: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: Partial<User> & { password: string }) => { success: boolean; error?: string };
  googleSignIn: (googleUser: { email: string; name: string; sub: string }) => { success: boolean; needsProfile: boolean };
  completeProfile: (data: Partial<User>) => { success: boolean };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ch_session');
    if (stored) {
      const session = JSON.parse(stored);
      setCurrentUser(session.user);
    }
  }, []);

  const login = (email: string, password: string) => {
    const users = DB.getUsers();
    const user = users.find(u => u.email === email && u.password_hash === DB.hash(password));
    if (user) {
      const token = 'jwt_' + DB.generateId();
      localStorage.setItem('ch_session', JSON.stringify({ user, token }));
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (data: Partial<User> & { password: string }) => {
    const users = DB.getUsers();
    if (users.find(u => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const user: User = {
      id: DB.generateId(),
      name: data.name || '',
      email: data.email || '',
      password_hash: DB.hash(data.password),
      role: 'user',
      phone: data.phone || '',
      company: data.company || '',
      location: data.location || '',
      profile_completed: !!(data.name && data.phone && data.location),
      created_at: new Date().toISOString()
    };
    users.push(user);
    DB.setUsers(users);
    const token = 'jwt_' + DB.generateId();
    localStorage.setItem('ch_session', JSON.stringify({ user, token }));
    setCurrentUser(user);
    return { success: true };
  };

  const googleSignIn = (googleUser: { email: string; name: string; sub: string }) => {
    const users = DB.getUsers();
    let user = users.find(u => u.email === googleUser.email);
    if (!user) {
      user = {
        id: DB.generateId(),
        name: googleUser.name,
        email: googleUser.email,
        password_hash: '',
        role: 'user',
        phone: '',
        company: '',
        location: '',
        profile_completed: false,
        google_id: googleUser.sub,
        created_at: new Date().toISOString()
      };
      users.push(user);
      DB.setUsers(users);
    }
    const token = 'jwt_' + DB.generateId();
    localStorage.setItem('ch_session', JSON.stringify({ user, token }));
    setCurrentUser(user);
    return { success: true, needsProfile: !user.profile_completed };
  };

  const completeProfile = (data: Partial<User>) => {
    if (!currentUser) return { success: false };
    const users = DB.getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data, profile_completed: true };
      DB.setUsers(users);
      const token = 'jwt_' + DB.generateId();
      localStorage.setItem('ch_session', JSON.stringify({ user: users[idx], token }));
      setCurrentUser(users[idx]);
      return { success: true };
    }
    return { success: false };
  };

  const logout = () => {
    localStorage.removeItem('ch_session');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoggedIn: !!currentUser,
      isAdmin: currentUser?.role === 'admin',
      canPost: !!currentUser?.profile_completed,
      login,
      register,
      googleSignIn,
      completeProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
