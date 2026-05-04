-- Sørg for at ringeliste-tabellen har alle kolonnene koden forventer.
-- Trygg å kjøre flere ganger.

ALTER TABLE ringeliste
  ADD COLUMN IF NOT EXISTS bedriftsnavn        TEXT,
  ADD COLUMN IF NOT EXISTS orgnr               TEXT,
  ADD COLUMN IF NOT EXISTS bransje_kode        TEXT,
  ADD COLUMN IF NOT EXISTS bransje_navn        TEXT,
  ADD COLUMN IF NOT EXISTS kommune             TEXT,
  ADD COLUMN IF NOT EXISTS kommunenummer       TEXT,
  ADD COLUMN IF NOT EXISTS ansatte             INTEGER,
  ADD COLUMN IF NOT EXISTS registrert_dato     DATE,
  ADD COLUMN IF NOT EXISTS mva_registrert      BOOLEAN,
  ADD COLUMN IF NOT EXISTS kilde               TEXT,
  ADD COLUMN IF NOT EXISTS stage               TEXT DEFAULT 'ny_lead',
  ADD COLUMN IF NOT EXISTS opprettet_at        TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS sist_kontaktet      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tildelt_bruker_id   UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS kontaktperson_navn  TEXT,
  ADD COLUMN IF NOT EXISTS kontaktperson_rolle TEXT,
  ADD COLUMN IF NOT EXISTS kontaktpersoner     JSONB;

-- Unique på orgnr så vi ikke kan duplisere samme bedrift i ringelisten
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
     WHERE schemaname = 'public' AND indexname = 'ringeliste_orgnr_unique'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX ringeliste_orgnr_unique ON ringeliste(orgnr)';
  END IF;
END $$;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
