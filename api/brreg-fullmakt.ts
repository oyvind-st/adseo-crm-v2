import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxy for Brreg's /fullmakt API. Brreg's enhetsregister API has CORS
// configured, but /fullmakt does NOT — the browser blocks direct fetches.
// We forward the request server-side and add the missing CORS headers.
//
// Usage from frontend:
//   GET /api/brreg-fullmakt?orgnr=923609016&type=signatur
//   GET /api/brreg-fullmakt?orgnr=923609016&type=prokura
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const orgnr = String(req.query.orgnr || '').replace(/[^0-9]/g, '');
  const type = String(req.query.type || '');
  if (!/^\d{9}$/.test(orgnr)) return res.status(400).json({ error: 'Invalid orgnr' });
  if (type !== 'signatur' && type !== 'prokura') {
    return res.status(400).json({ error: 'type must be signatur or prokura' });
  }

  try {
    const upstream = await fetch(
      `https://data.brreg.no/fullmakt/enheter/${orgnr}/${type}`,
      { headers: { Accept: 'application/json' } }
    );
    // Forward upstream status (404 means "no signature/prokura registered" — caller knows what to do)
    res.status(upstream.status);
    // Cache successful responses for an hour — these change very rarely
    if (upstream.ok) res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    const text = await upstream.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.send(text);
  } catch (e) {
    return res.status(502).json({ error: 'Upstream Brreg fetch failed', detail: String(e) });
  }
}
