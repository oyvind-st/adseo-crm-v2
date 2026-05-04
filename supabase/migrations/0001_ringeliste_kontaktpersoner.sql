-- Add kontaktperson columns to ringeliste so the Prospects slide-in panel
-- can save the auto-suggested top-1 contact and the full list (top 1-3) for
-- later kundekort seeding.
--
-- Safe to re-run: ADD COLUMN IF NOT EXISTS is idempotent.

ALTER TABLE ringeliste
  ADD COLUMN IF NOT EXISTS kontaktperson_navn  TEXT,
  ADD COLUMN IF NOT EXISTS kontaktperson_rolle TEXT,
  ADD COLUMN IF NOT EXISTS kontaktpersoner     JSONB;

-- Optional: an index on kontaktperson_navn for quick filtering in the ringeliste UI.
CREATE INDEX IF NOT EXISTS idx_ringeliste_kontaktperson_navn
  ON ringeliste (kontaktperson_navn);
