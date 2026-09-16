# CASE//ZERO V2 — 11:47

A deployable Next.js prototype for a Malaysian noir AI detective game.

## What is included
- Malaysian case: `11:47`, set at fictional Seroja House in Kuching
- Four suspects with different hidden secrets
- AI-powered interrogation via OpenAI Responses API
- Evidence attachment during interrogation
- Server-side case secrets (killer is not shipped to the browser)
- Server-side final accusation scoring
- Detective notes and responsive noir UI

## Required environment variables
Create `.env.local` for local development, or add these in Vercel Project Settings → Environment Variables:

```
OPENAI_API_KEY=your_secret_key
OPENAI_MODEL=gpt-5.6-luna
```

Never commit `.env.local`.

## Deploy on Vercel
1. Put this project in a GitHub repository, or import the folder through your preferred Vercel workflow.
2. In Vercel, create/import the project.
3. Add `OPENAI_API_KEY` and `OPENAI_MODEL` under Settings → Environment Variables.
4. Deploy.

## Local development
```
npm install
npm run dev
```
Then open http://localhost:3000

## Important
The case is fictional. The names, hotel, company, events, and crime are invented for the game.
