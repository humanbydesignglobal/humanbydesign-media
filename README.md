# Human by Design — the app

One codebase for iPhone, Android and web (Expo SDK 58, Expo Router, TypeScript).
Bilingual: English and Lebanese Arabic, switchable any time, right-to-left handled in the layout.

## What's in version 1
- **Today** — a short practice for your type each day, plus today's Sun gate and what it means for *your* chart
  (you carry it / it completes one of your channels / it lands in an open or defined centre), and the Moon.
- **My chart** — bodygraph (same drawing as humanbydesign.global), type, strategy, signature/not-self,
  an experiment, inner authority, profile, definition, all nine centres (tap to open), channels, gates.
- **My people** — add anyone by birth details; their chart, how to be with their type, your composite type,
  and channel-by-channel how your charts meet (spark / common ground / one leads / one bends).
- **Settings** — language, edit your birth details, about, disclaimer.

## Where things live
- `src/engine/hd.ts` — chart engine, ported from `site/hd-engine.js` (verified identical: `npm test`).
- `src/content/en.json`, `ar.json`, `draw.json` — generated from the website's content files by
  `npm run content` (needs the `humanbydesign-media/site` folder). Only free-tier content is included;
  the deep report stays the paid "Your Design, Decoded".
- `src/content/extra.ts` — app-only copy (daily practices, people tips, Arabic channel meanings, labels).
- `src/i18n/strings.ts` — interface text, EN + Lebanese AR.
- `src/state/AppState.tsx` — your profile and people, stored on the phone (no account needed yet).

## Run / build
- `npm install`, then `npx expo start` (scan with Expo Go) — or `npx expo start --web`.
- Checks: `npm run typecheck`, `npx expo lint`, `npm test`.
- Store builds use EAS (`eas.json`): `npx eas-cli@latest build --profile preview` (installable test build),
  `--profile production` for the stores. Needs an Expo account; App Store needs an Apple Developer account
  ($99/yr), Google Play a one-time $25.

## Ready for later (not switched on)
- Accounts and sync: the `Profile` shape is what a backend will store.
- Paid tier: deep report sections, Ask-AI, membership.
