-- ═══════════════════════════════════════════════════════════════
-- Norvyn Motors — Initial Schema
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- VEHICLES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE vehicles (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text        UNIQUE NOT NULL,
  status             text        NOT NULL DEFAULT 'draft'
                                 CHECK (status IN ('draft','available','reserved','sold')),
  category           text        NOT NULL
                                 CHECK (category IN ('performance','luxury','german_from_korea')),
  make               text        NOT NULL,
  model              text        NOT NULL,
  year               int         NOT NULL CHECK (year >= 2000),
  trim               text,
  stock_id           text        UNIQUE NOT NULL,
  mileage_km         int         CHECK (mileage_km >= 0),
  price_eur          numeric(10,2),
  price_visible      boolean     NOT NULL DEFAULT true,
  exterior_color     text,
  interior_color     text,
  fuel_type          text        CHECK (fuel_type IN ('petrol','diesel','hybrid','electric')),
  transmission       text        CHECK (transmission IN ('automatic','manual')),
  engine_cc          int         CHECK (engine_cc > 0),
  power_kw           int         CHECK (power_kw > 0),
  features           text[],
  description_de     text,
  description_en     text,
  origin_country     text        NOT NULL DEFAULT 'KR',
  import_ready       boolean     NOT NULL DEFAULT false,
  featured           boolean     NOT NULL DEFAULT false,
  sort_order         int         NOT NULL DEFAULT 0,
  seo_title_de       text,
  seo_title_en       text,
  seo_description_de text        CHECK (char_length(seo_description_de) <= 160),
  seo_description_en text        CHECK (char_length(seo_description_en) <= 160),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vehicles_status   ON vehicles (status);
CREATE INDEX idx_vehicles_category ON vehicles (category);
CREATE INDEX idx_vehicles_featured ON vehicles (featured) WHERE featured = true;
CREATE INDEX idx_vehicles_slug     ON vehicles (slug);
CREATE INDEX idx_vehicles_sort     ON vehicles (sort_order ASC, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- VEHICLE IMAGES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE vehicle_images (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id   uuid        NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  url          text        NOT NULL,
  storage_path text        NOT NULL,
  position     int         NOT NULL DEFAULT 0,
  alt_text     text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vehicle_images_vehicle   ON vehicle_images (vehicle_id);
CREATE INDEX idx_vehicle_images_position  ON vehicle_images (vehicle_id, position ASC);

-- ─────────────────────────────────────────────────────────────
-- INQUIRIES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE inquiries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  uuid        REFERENCES vehicles (id) ON DELETE SET NULL,
  stock_id    text,
  name        text        NOT NULL,
  email       text        NOT NULL,
  phone       text,
  message     text,
  locale      text        NOT NULL DEFAULT 'de' CHECK (locale IN ('de','en')),
  source      text        NOT NULL DEFAULT 'website'
                          CHECK (source IN ('website','whatsapp','phone')),
  status      text        NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new','contacted','closed')),
  admin_notes text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_inquiries_status     ON inquiries (status);
CREATE INDEX idx_inquiries_vehicle_id ON inquiries (vehicle_id);
CREATE INDEX idx_inquiries_created_at ON inquiries (created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE vehicles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries      ENABLE ROW LEVEL SECURITY;

-- Public: read available vehicles only
CREATE POLICY "public_read_available_vehicles"
  ON vehicles FOR SELECT
  USING (status = 'available');

-- Public: read images of available vehicles only
CREATE POLICY "public_read_vehicle_images"
  ON vehicle_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_images.vehicle_id
        AND v.status = 'available'
    )
  );

-- Anon: submit inquiries
CREATE POLICY "public_insert_inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

-- Note: admin access uses service_role key which bypasses RLS entirely.
-- Never expose service_role key to the browser.

-- ─────────────────────────────────────────────────────────────
-- STORAGE BUCKET
-- Run in Supabase Dashboard → Storage after applying this migration:
--
-- create bucket "vehicle-images" with (public = true);
-- ─────────────────────────────────────────────────────────────
