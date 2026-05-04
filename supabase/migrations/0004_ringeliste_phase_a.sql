-- Phase A: assign-by-user + ringelogg event log
-- 2026-05-04

-- 1) tildelt_bruker_id på kunder (hvem på teamet eier kunden)
ALTER TABLE kunder
  ADD COLUMN IF NOT EXISTS tildelt_bruker_id UUID REFERENCES profiles(id);

-- 2) tildelt_bruker_id på ringeliste (hvem skal ringe denne)
ALTER TABLE ringeliste
  ADD COLUMN IF NOT EXISTS tildelt_bruker_id UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_ringeliste_tildelt_bruker
  ON ringeliste(tildelt_bruker_id);

-- 3) ringelogg: én rad per ringe-event
CREATE TABLE IF NOT EXISTS ringelogg (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ringeliste_id   UUID REFERENCES ringeliste(id) ON DELETE CASCADE,
  org_nummer      TEXT NOT NULL,
  bedriftsnavn    TEXT,
  bruker_id       UUID REFERENCES profiles(id),
  utfall          TEXT NOT NULL,        -- 'svar' | 'beskjed' | 'ikke_svar' | 'callback' | 'kunde' | 'ikke_interessert'
  notat           TEXT,
  callback_dato   TIMESTAMPTZ,
  varighet_sek    INT,
  opprettet_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ringelogg_bruker_dato
  ON ringelogg(bruker_id, opprettet_at DESC);

CREATE INDEX IF NOT EXISTS idx_ringelogg_orgnr
  ON ringelogg(org_nummer);
