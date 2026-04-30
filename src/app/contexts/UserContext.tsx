import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, isFromMagicLink } from '../../lib/supabase';

interface UserProfile {
  id: string;
  navn: string;
  epost: string;
  telefon?: string;
  rolle: string;
  status: string;
  avatar_initials?: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirstLogin: boolean;
  clearFirstLogin: () => void;
  stampActivity: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  isFirstLogin: false,
  clearFirstLogin: () => {},
  stampActivity: () => {},
  signIn: async () => ({ error: null }),
  signOut: () => {},
  updateProfile: () => {},
});

const SESSION_KEY = 'sb-wqjomkmlgtuuhlkghnfr-auth-token';

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.user && data?.expires_at && data.expires_at * 1000 > Date.now()) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const session = readSession();

  const [user, setUser] = useState<UserProfile | null>(
    session?.user ? {
      id: session.user.id,
      navn: session.user.email?.split('@')[0] || 'Bruker',
      epost: session.user.email || '',
      rolle: 'selger',
      status: 'active',
    } : null
  );
  const [loading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(isFromMagicLink);

  const clearFirstLogin = () => {
    setIsFirstLogin(false);
    // Clean the URL hash so reloads don't re-trigger this
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Load real profile from DB and start activity tracking
  useEffect(() => {
    if (!session?.user?.id) return;
    const id = session.user.id;

    supabase.from('profiles').select('*').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setUser(prev => prev ? {
            ...prev,
            navn: data.navn || prev.navn,
            rolle: data.rolle || prev.rolle,
            telefon: data.telefon,
            avatar_initials: data.avatar_initials,
          } : prev);
        }
      })
      .catch(() => {});

    // Stamp on app open
    void supabase.rpc('update_last_seen', { user_id: id });
  }, []);

  // Stable reference so ActivityTracker's useEffect dependency works correctly
  const userId = session?.user?.id ?? null;
  const stampActivity = useCallback(() => {
    if (userId) void supabase.rpc('update_last_seen', { user_id: userId });
  }, [userId]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // Reload page so readSession() picks up new token
    window.location.href = '/';
    return { error: null };
  };

  const signOut = () => {
    // Clear ALL Supabase auth data from localStorage without calling Supabase API
    Object.keys(localStorage)
      .filter(k => k.startsWith('sb-') || k.includes('supabase'))
      .forEach(k => localStorage.removeItem(k));
    window.location.href = '/';
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    void supabase.from('profiles').update(updates).eq('id', user.id);
  };

  return (
    <UserContext.Provider value={{ user, loading, isFirstLogin, clearFirstLogin, stampActivity, signIn, signOut, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
