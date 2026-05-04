-- Mirror of SSB Klass NACE 2007 (Norwegian standard for industry classification).
-- 1811 codes total: 21 sections (level 1, A-U), 87 divisions (level 2),
-- 270 groups (level 3), 613 classes (level 4), 820 categories (level 5).
--
-- Bulk-imported once from
--   https://data.ssb.no/api/klass/v1/classifications/6/codesAt.json?date=YYYY-MM-DD
-- via the Supabase REST API. Updates rarely (every few years) — re-import as needed.

CREATE TABLE IF NOT EXISTS brreg_naeringskoder (
  kode         TEXT PRIMARY KEY,
  parent_kode  TEXT,
  level        SMALLINT NOT NULL,
  navn         TEXT NOT NULL,
  kort_navn    TEXT
);

CREATE INDEX IF NOT EXISTS idx_brreg_naeringskoder_parent ON brreg_naeringskoder (parent_kode);
CREATE INDEX IF NOT EXISTS idx_brreg_naeringskoder_level  ON brreg_naeringskoder (level);

GRANT SELECT ON brreg_naeringskoder TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON brreg_naeringskoder TO service_role;
