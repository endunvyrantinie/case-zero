# CASE//ZERO V6 — Cinematic Evidence Build

V6 upgrades the visual system without changing your existing Supabase database.

## What is new

- Realistic human portrait assets for victims and suspects.
- Cinematic case-cover artwork on the homepage and investigation sidebar.
- Every current evidence item now has a matching evidence image.
- Evidence thumbnails appear directly in the Evidence Locker.
- Opening evidence shows a large visual inspection view.
- Subtle portrait/scene motion gives the workspace a more alive feel without video-generation costs.
- Existing 10-minute timer, sign-in, Supabase progress and OpenAI interrogation remain unchanged.

## Upgrade from V5

1. Replace the files in your existing GitHub `case-zero` repository with this V6 project.
2. Commit the changes.
3. Vercel will redeploy automatically.
4. No new SQL migration is required for V6.
5. Keep all current Vercel environment variables exactly as they are.

## Visual convention for every future case

The site now uses predictable asset paths. Future cases should follow the same naming system:

### Case cover

`public/case-art/<case-id-lowercase>.webp`

Example:

`public/case-art/cz005.webp`

### Victim portrait

`public/portraits/<case-id-lowercase>-victim.webp`

Example:

`public/portraits/cz005-victim.webp`

### Suspect portrait

`public/portraits/<case-id-lowercase>-<suspect-id>.webp`

Example:

`public/portraits/cz005-siti.webp`

### Evidence image

`public/evidence/<case-id-lowercase>-<evidence-id>.webp`

Example:

`public/evidence/cz005-silver-earring.webp`

The UI automatically builds these paths from the case ID and item ID, so future cases do not require special image wiring in the React components.

## Notes

All CASE//ZERO people and cases are fictional. The V6 portraits are visual casting assets for the prototype. The evidence visuals are fictional forensic/game props created specifically to match the clue named in each case.
