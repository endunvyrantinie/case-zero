# CASE//ZERO V5

V5 changes the selected-case experience into a dedicated investigation workspace.

## What changed

- Fixed investigation top bar with 10-minute timer, sound control and exit to Case Library.
- Left-side investigation navigation: Briefing, Evidence Locker, Suspects, Notes and Accuse.
- Evidence now has UNREVIEWED / REVIEWED / LOCKED states.
- Some evidence unlocks only after prerequisite material is reviewed.
- Evidence opens in a focused inspection modal.
- Suspect interrogation is a dedicated workspace with dossier cards and cloud-saved chat history.
- Only reviewed evidence can be used in interrogation or the final accusation.
- Cloud-saved reviewed-evidence progress.
- Animated noir dossier portraits for every victim and suspect.
- Case-location artwork for all three cases.
- Optional generated ambient detective hum via the browser Web Audio API; no copyrighted audio files are used.
- Sign-in, cloud progress and the 10-minute attempt system from V4 remain in place.

## IMPORTANT: existing V4 database

Before deploying V5, run this file once in Supabase > SQL Editor:

`supabase/v5_migration.sql`

It adds the `reviewed_evidence` field used by the Evidence Locker.

No new Vercel environment variables are needed. Keep:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy

Upload the V5 project files into the existing GitHub repository and commit them. Vercel should redeploy automatically.
V5 deployment
