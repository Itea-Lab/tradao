-- Add nullable, unique slug column to community_events
BEGIN;

ALTER TABLE IF EXISTS public.community_events
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Unique constraint for non-null slugs
CREATE UNIQUE INDEX IF NOT EXISTS community_events_slug_key
ON public.community_events (slug)
WHERE slug IS NOT NULL;

COMMENT ON COLUMN public.community_events.slug IS 'A unique, human-readable identifier for the event, used in URLs.';

COMMIT;
