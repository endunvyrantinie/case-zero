# CASE//ZERO V4

Malaysian noir browser detective game with AI suspect interrogation, account sign-in, cloud-saved progress and a hard 10-minute investigation timer.

## V4 adds

- Email sign-up and sign-in with Supabase Auth
- Player/detective name
- Cloud-saved best scores, case status and attempt count
- Cloud-saved detective notes and interrogation history
- Resume an active case on another device while time remains
- Hard 10:00 timer per investigation attempt
- Server-side timer enforcement on interrogation and accusation APIs
- OpenAI interrogation endpoints now require a signed-in player
- One accusation per attempt
- 3 Malaysian cases: Kuching, Miri and Petaling Jaya

## 1. Supabase setup

Create a Supabase project.

In Supabase, open **SQL Editor**, create a new query, paste the full contents of:

`supabase/schema.sql`

and click **Run**.

Then open **Project Settings > API** and copy:

- Project URL
- anon/public key

## 2. Vercel environment variables

Keep the existing variables:

- `OPENAI_API_KEY` = your OpenAI API key
- `OPENAI_MODEL` = `gpt-5.6-luna`

Add:

- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon/public key

Redeploy after adding them.

## 3. Supabase Auth settings

For quickest testing, go to **Authentication > Providers > Email**.

Email/password login should be enabled. You may keep email confirmation enabled for a production-style flow. If enabled, a new user must click the confirmation email before signing in.

Also set your Vercel website URL under **Authentication > URL Configuration > Site URL** so confirmation links return to the correct website.

## 4. Deploy

Upload/replace the V4 files in the existing GitHub `case-zero` repository. Vercel will automatically redeploy.

No OpenAI secret belongs in GitHub. Keep it only in Vercel Environment Variables.

## Timer behavior

Opening a case with no live attempt starts a new 10-minute attempt. The deadline is stored in Supabase, so refreshing the page or switching devices does not reset the clock. When time reaches zero, interrogation and accusation are locked. The player can start a fresh 10-minute attempt.

## Next visual phase

V5 is intended for character portraits, victim portraits, case cover art, crime-scene/evidence imagery and richer dossier views. V6 can add ambience, music and subtle motion.
