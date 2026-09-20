# CASE//ZERO — Combined Content, Sound, Analytics & Ads Update

This build keeps the existing account, progress, Stripe RM6.90 lifetime ad-free entitlement, 10-minute cases and AI interrogation system.

## Included in this update

- 3 new playable Malaysian cases:
  - CZ005 — LAST FERRY — Kota Kinabalu
  - CZ006 — DO NOT DISTURB — Kuala Lumpur
  - CZ007 — BLACKOUT — George Town
- 3 new case-specific ambience tracks.
- Supabase product analytics events for case opens, evidence reviews, suspect questions, accusations, restarts and sound activation.
- AdSense placements separated into Home, Case and Result slots.
- AdSense script only loads for free users when a real slot is configured. Ad-free lifetime users do not load the ad script.
- Verified AdSense meta tag remains in the site head.
- Visual fallback system so new cases remain usable even before bespoke portraits/evidence artwork is added.
- Stripe webhook route at `/api/stripe/webhook` so the webhook you already configured can permanently grant ad-free access even if the success-page verification is interrupted.

## Update steps

1. In Supabase -> SQL Editor -> New query, run:
   `supabase/content_analytics_ads_update.sql`
2. Replace your current GitHub project files with this build and commit.
3. Let Vercel redeploy.
4. No OpenAI, Stripe or Supabase keys need to be changed.

## AdSense slots

Do not add slot IDs until AdSense approves the site and you can create display ad units.

When approved, create up to three responsive Display ad units and add their numeric slot IDs in Vercel:

- `NEXT_PUBLIC_ADSENSE_SLOT_HOME`
- `NEXT_PUBLIC_ADSENSE_SLOT_CASE`
- `NEXT_PUBLIC_ADSENSE_SLOT_RESULT`

`NEXT_PUBLIC_ADSENSE_SLOT` remains supported as a fallback if you want one ad unit everywhere.

The publisher ID is already wired as `ca-pub-3818857321969667` and the verification meta tag remains present.

## Analytics

Events are stored in `public.analytics_events`. No interrogation text or detective notes are sent to analytics.

Useful owner-only SQL examples are in:
`supabase/analytics_queries.sql`

Run those queries from the Supabase SQL Editor whenever you want to see case opens, solve rate, average score, engagement and daily active players.

## New-case visual system

For future artwork, use the existing convention:

- `/public/case-art/cz008.webp`
- `/public/portraits/cz008-victim.webp`
- `/public/portraits/cz008-suspect-id.webp`
- `/public/evidence/cz008-evidence-id.webp`
- `/public/audio/cz008-ambience.mp3`

If an image has not yet been supplied, the game now renders a styled dossier/evidence fallback instead of a broken image.
