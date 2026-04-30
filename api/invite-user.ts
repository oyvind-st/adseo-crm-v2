import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, rolle, navn } = req.body ?? {};
  if (!email) return res.status(400).json({ error: 'E-post er påkrevd' });

  // Service key lives ONLY in Vercel server env (no VITE_ prefix — never in browser bundle)
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  if (!serviceKey || !supabaseUrl) {
    return res.status(500).json({ error: 'Server-konfigurasjon mangler' });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const appUrl = process.env.APP_URL || 'https://adseo-crm-v2.vercel.app';

  // Try invite first; if user already exists, send a magic link instead
  let userId: string | undefined;
  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    email,
    { redirectTo: appUrl, data: { rolle, navn } }
  );

  if (inviteError) {
    if (inviteError.message.includes('already been registered')) {
      // User exists — generate a magic link so they can log in and set a password
      const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: { redirectTo: appUrl }
      });
      if (linkError) return res.status(400).json({ error: linkError.message });
      userId = linkData?.user?.id;
    } else {
      return res.status(400).json({ error: inviteError.message });
    }
  } else {
    userId = inviteData?.user?.id;
  }

  // Upsert profile row so user appears in the app immediately
  if (userId) {
    const initials = (navn || email).substring(0, 2).toUpperCase();
    await admin.from('profiles').upsert({
      id: userId,
      epost: email,
      navn: navn || email.split('@')[0],
      rolle: rolle || 'selger',
      status: 'active',
      avatar_initials: initials
    }, { onConflict: 'id' });
  }

  return res.status(200).json({ success: true, userId });
}
