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

  // Invite the user — creates auth entry and sends invite email
  const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    email,
    { redirectTo: process.env.APP_URL || 'https://adseo-crm-v2.vercel.app', data: { rolle, navn } }
  );

  if (inviteError) {
    return res.status(400).json({ error: inviteError.message });
  }

  // Upsert profile row so user appears in the app immediately
  if (inviteData?.user?.id) {
    const initials = (navn || email).substring(0, 2).toUpperCase();
    await admin.from('profiles').upsert({
      id: inviteData.user.id,
      epost: email,
      navn: navn || email.split('@')[0],
      rolle: rolle || 'selger',
      status: 'active',
      avatar_initials: initials
    }, { onConflict: 'id' });
  }

  return res.status(200).json({ success: true, userId: inviteData?.user?.id });
}
