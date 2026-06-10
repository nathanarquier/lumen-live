# Lumen — Claude Code Context

## What Lumen is
A web tool for early-career musicians (18-25, UK) that helps them understand their music income and receive actionable, geo-personalised recommendations to grow their earnings. Currently in MVP validation phase.

## Stack
- Pure HTML/CSS/JS — no framework
- Supabase backend (PostgreSQL) for data persistence
- Google Places API for venue recommendations
- Hosted on [Vercel/GitHub Pages — update when live]

## File structure
- index.html — main app UI and structure
- styles.css — all styling
- app.js — core application logic (84KB — primary file)
- places.js — Google Places API integration for venue map
- supabase.js — Supabase client initialisation
- data.js — static data

## Key features
1. Income input — user's first interaction, entry point to the tool
2. Profile assignment — 4 profiles, multiplier effect on all downstream features
3. Snapshot — primary conversion feature, determines return visits
4. Dashboard — missions (retention engine) + income graph evolution
5. Venue map / geolocation — anchors Lumen in user's physical reality
6. PDF download — low priority, under evaluation

## Supabase
Backend records: snapshots, dashboards, missions, mission completion, user IDs.
Key retention metric: second snapshot created within 14 days of first.
## Design system
Midnight Studio: deep navy #0D0E1A, indigo #6E5BF0, lilac #B8A9FF, gold #FFD166.
Fonts: Satoshi (body), Clash Display (headings).
Aurora blob animations.

## Current priorities (Week 3 prioritisation)
1. Dashboard — Missions (score: 10)
2. Snapshot (score: 9)
3. Profile Assignment (score: 8)
4. Venue Map (score: 8)
5. Income Input (score: 7)
6. Dashboard — Income Graph (score: 7)
7. PDF Download (score: 5)

## Rules for Claude Code
- Never modify Supabase connection credentials
- Always preserve existing Supabase event tracking calls
- Keep the design system consistent — use existing CSS variables
- Comment any significant logic changes
- Test changes work before committing
