# CASE//ZERO V3

Interactive Malaysian noir detective game built with Next.js and the OpenAI Responses API.

## What's new in V3
- Home dashboard instead of opening directly into a case
- Case library with 3 playable cases
- Local score/progress tracking
- Cases solved, average score, total score and accusation count
- Separate case URLs (`/case/CZ002`, etc.)
- Auto-saved detective notes per case
- Evidence cards can be attached directly to interrogations
- Server-side secrets and final solutions remain hidden from the browser

## Cases
- CZ002 — 11:47 — Kuching
- CZ003 — AFTER CLOSING — Miri
- CZ004 — DEAD AIR — Petaling Jaya

## Environment variables
Keep your existing Vercel environment variables:

`OPENAI_API_KEY=...`

`OPENAI_MODEL=gpt-5.6-luna`

## Deploy
Push these files to the same GitHub repository connected to Vercel. Vercel should redeploy automatically.
