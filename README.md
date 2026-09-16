# CASE//ZERO — Combined Commercial Update

This is the consolidated build requested after V6. It keeps the existing account/progress system and adds the commercial layer in one update.

## Included

- Email sign-up/sign-in with Supabase
- Cloud-saved progress, notes, interrogation history and scores
- 10-minute investigation attempts
- AI suspect interrogation via the OpenAI Responses API
- Three current Malaysian cases with case-specific visual styling
- Evidence locker with reviewed/unreviewed/locked progression
- Realistic portrait/case-art refresh for key current assets
- Original CASE//ZERO ambient audio loops for Kuching, Miri and Petaling Jaya
- SFX for evidence, warnings, case solved and case failed
- Music/SFX volume controls
- Free users: unlimited cases + ad placements
- Paid users: RM6.90 one-time lifetime ad removal
- Account-level ad-free entitlement stored in Supabase
- Stripe Checkout integration for the RM6.90 one-time purchase
- Google AdSense-ready ad component; until AdSense is configured, the ad slots show a CASE//ZERO house ad instead

## Existing V6 users: upgrade steps

1. In **Supabase > SQL Editor**, run:
   `supabase/full_update_migration.sql`
2. Replace the files in the existing GitHub `case-zero` repository with this build and commit.
3. Keep the existing OpenAI and Supabase public environment variables.
4. In Vercel add these **Secret** environment variables:
   - `SUPABASE_SERVICE_ROLE_KEY` — from Supabase server/admin API keys. Never expose it as NEXT_PUBLIC.
   - `STRIPE_SECRET_KEY` — your Stripe secret API key.
5. Optional, when Google AdSense is ready, add these **Config/public** variables:
   - `NEXT_PUBLIC_ADSENSE_CLIENT` — e.g. `ca-pub-...`
   - `NEXT_PUBLIC_ADSENSE_SLOT` — your display ad unit slot ID.
6. Redeploy.

## Payment flow

Signed-in free user -> `/upgrade` -> server creates Stripe Checkout for **MYR 6.90** -> Stripe returns to `/upgrade/success` -> server verifies the paid checkout -> Supabase saves `ad_free_lifetime = true` -> ads disappear on that account.

The browser never receives `STRIPE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`.

## Important

Do not put secret keys in GitHub. Add them only in Vercel Environment Variables.

The generated audio files under `public/audio` are original programmatically-created ambience/SFX for this project and do not depend on commercial music tracks.
