import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export type Profile = {
  id: string;
  navn: string;
  epost: string;
  rolle: string;
  avatar_initials?: string;
};

/**
 * Shared hook: fetches all active employee profiles.
 * Used everywhere a team member dropdown is shown.
 */
export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, navn, epost, rolle, avatar_initials')
      .eq('status', 'active')
      .order('navn')
      .then(({ data }) => {
        if (data) setProfiles(data as Profile[]);
        setLoading(false);
      });
  }, []);

  return { profiles, loading };
}
