-- ============================================================
-- Portfolio CMS v2 — Supabase Schema
-- Run once in the Supabase SQL Editor (supabase.com → project → SQL Editor).
-- ============================================================

-- Content table: one row per data file.
-- id is 'products' | 'labs' | 'about' | 'contact'
CREATE TABLE IF NOT EXISTS public.cms_content (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only the authenticated admin account can read/write content.
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access"
  ON public.cms_content
  FOR ALL
  USING  (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket: portfolio-assets
-- Public so image URLs work in <img src> on the live site.
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Auth update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Auth delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

-- ============================================================
-- After running this:
--   1. Authentication → Users → Invite user (your email + password)
--   2. Project Settings → API → copy Project URL + anon key
--   3. Paste both into js/supabase-client.js (SUPABASE_URL + SUPABASE_ANON_KEY)
--   4. Add the Supabase CDN script + js/supabase-client.js to admin.html
--
-- Draft rows use id prefix 'draft_products', 'draft_labs', etc.
-- Published rows use plain id 'products', 'labs', 'about', 'contact'.
-- The same RLS policy covers both.
-- ============================================================
