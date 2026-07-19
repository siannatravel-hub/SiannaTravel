-- ============================================================
--  SIANNA TRAVEL — Agrega children a packages
--  "persons" queda como número de adultos. "children" es nuevo,
--  para que el total de ocupación de la habitación no cuente
--  solo adultos.
-- ============================================================

ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS children INTEGER NOT NULL DEFAULT 0;
