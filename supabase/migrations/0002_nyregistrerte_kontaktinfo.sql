-- Add contact-info columns to nyregistrerte so we can filter on them in the UI.
-- The Brreg sync (see Prospects.mvp.tsx :: handleSync) needs to populate these
-- on its next run. Existing rows stay null until re-synced — they just won't
-- match a "Har hjemmeside" filter, which is the correct behaviour.
ALTER TABLE nyregistrerte
  ADD COLUMN IF NOT EXISTS hjemmeside TEXT,
  ADD COLUMN IF NOT EXISTS telefon    TEXT,
  ADD COLUMN IF NOT EXISTS mobil      TEXT,
  ADD COLUMN IF NOT EXISTS epost      TEXT;
