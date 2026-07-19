-- ============================================================
--  SIANNA TRAVEL — Agrega price_unit a packages
--  Permite marcar, por paquete, si el precio mostrado es
--  "por persona" o "por habitación" (costo total del paquete).
--  Se configura desde el panel admin, el cliente NO elige.
-- ============================================================

ALTER TABLE packages
  ADD COLUMN IF NOT EXISTS price_unit TEXT NOT NULL DEFAULT 'persona';

ALTER TABLE packages
  ADD CONSTRAINT packages_price_unit_check
  CHECK (price_unit IN ('persona', 'habitacion'));
