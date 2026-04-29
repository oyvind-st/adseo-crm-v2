import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';

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
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (authUser: { id: string; email?: string }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data) {
        setUser({
          id: data.id,
          navn: data.navn || authUser.email?.split('@')[0] || 'Bruker',
          epost: data.epost || authUser.email || '',
          telefon: data.telefon,
          rolle: data.rolle || 'selger',
          status: data.status || 'active',
          avatar_initials: data.avatar_initials,
        });
      } else {
        // Profile doesn't exist yet — create it from auth user
        const navn = authUser.email?.split('@')[0] || 'Bruker';
        await supabase.from('profiles').upsert({
          id: authUser.id,
          epost: authUser.email || '',
          navn,
          rolle: 'selger',
          status: 'active',
        });
        setUser({
          id: authUser.id,
          navn,
          epost: authUser.email || '',
          rolle: 'selger',
          status: 'active',
        });
      }
    } catch (err) {
      console.error('loadProfile error:', err);
      // Still allow access even if profile load fails
      setUser({
        id: authUser.id,
        navn: authUser.email?.split('@')[0] || 'Bruker',
        epost: authUser.email || '',
        rolle: 'selger',
        status: 'active',
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    // Use only onAuthStateChange — avoids lock conflicts with getSession()
    // INITIAL_SESSION fires immediately with current session (or null)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Safety fallback — if onAuthStateChange never fires within 3 seconds
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const { data } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
      if (data) setUser({ ...user, ...data });
    } catch (err) {
      console.error('updateProfile error:', err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, signIn, signOut, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
