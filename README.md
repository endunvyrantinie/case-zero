# CASE//ZERO — Suno Music Update

Upload these files into the existing GitHub repository, preserving the folder structure, then commit. Vercel should redeploy automatically.

## Track mapping
- CZ002 — 11:47 -> `public/audio/cz002-ambience.mp3`
- CZ003 — After Closing -> `public/audio/cz003-ambience.mp3`
- CZ004 — Dead Air -> `public/audio/cz004-ambience.mp3`
- CZ005 — Last Ferry -> `public/audio/cz005-ambience.mp3`
- CZ006 — Do Not Disturb -> `public/audio/cz006-ambience.mp3`
- CZ007 — Blackout -> `public/audio/cz007-ambience.mp3`
- General — Tenda Biru -> `public/audio/general-theme.mp3`

## Behaviour
- Homepage: click `PLAY THEME` to start Tenda Biru. It loops at a restrained background volume.
- Case pages: existing SOUND/MIX controls now play the uploaded case-specific Suno song because the files replace the old ambience tracks using the same filenames.
- No Supabase migration or Vercel environment-variable changes are needed.

Browser autoplay restrictions mean music must begin after a user click.
