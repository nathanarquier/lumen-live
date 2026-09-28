# Lumen — Claude Code Context

## What Lumen is
A chat-first AI coaching product for early-career musicians (18–25, UK) built on 
top of Claude (claude-haiku-4-5, prompt caching). Users talk to Lumen like a 
trusted older sibling; Lumen infers their goal, obstacle, and career stage from 
conversation, and proposes missions when a natural opportunity arises — never 
on a schedule. Currently in MVP validation phase, live with real users.

## Stack
- Pure HTML/CSS/JS — no framework
- Supabase (PostgreSQL) — auth, persistence, RLS
- Vercel serverless functions — backend logic (`/api`)
- Anthropic API (claude-haiku-4-5, prompt caching) — all reasoning

## File structure
- `index.html` — full app: UI shell + the entire front-end logic (auth, chat, 
  dashboard, sidebar) as one inline `<script>` block. This is the primary file.
- `styles.css` — all styling (design system, see below)
- `supabase.js` — Supabase client initialisation only
- `data.js` — static data (status not fully confirmed unused; do not delete 
  without checking references first)
- `api/chat.js` — main conversational endpoint; holds the system prompt; 
  calls Claude; can return a mission offer via `offer_mission` tool
- `api/extract-profile.js` — reads conversation, extracts goal/career_stage/
  primary_obstacle/current_decision, upserts to `user_profile`
- `api/drift-check.js` — evaluates the prior conversation against the stored 
  goal at new-conversation-start; returns `{drifting: true/false}`
- `api/generate-missions.js` — NOT currently called by the front end (kept 
  for possible future use). Do not wire it back in without asking.

## Removed (do not recreate)
- `app.js`, `places.js` — the old rule-based MVP (income calculator, static 
  mission bank, venue map). Deleted 2026-07. Superseded entirely by the chat 
  architecture above. If you find yourself wanting to re-add income-input or 
  venue-map logic, stop and check with Nathan first — it was a deliberate 
  pivot, not an oversight.
- Weekly auto-generated mission cycles — removed from `renderDashboard()`. 
  Missions are chat-offered only, confirmed by the user, never auto-generated 
  on a schedule.

## Key architecture: Goal-State Machine
Governing principle: **inference proposes, only the user commits.** The model 
never silently writes a goal or a goal change — every change requires explicit 
user confirmation via an in-chat card. Three states: cold start (no goal set, 
inference may propose one), steady (goal frozen, only two paths change it: 
sustained drift or explicit user request), drift check (runs once per new 
conversation against the prior one).

## Key architecture: Mission cap
Missions are offered only mid-chat via `api/chat.js`'s `offer_mission` tool. 
Hard cap of 5 uncompleted missions per user (`MISSION_CAP` in `index.html`). 
At cap, the offer card is replaced with a capacity message ("complete one 
first") rather than silently withholding — never fail silently on this path.

## Supabase
Tables in active use: `conversations`, `user_profile` (incl. `goal_status`, 
`goal_drift_count`, `goal_drift_cooldown`), `missions`, `mission_cycles` (still 
required — `missions.cycle_id` is a NOT NULL FK, even though weekly generation 
is gone; a cycle row is silently fetched/created per calendar week purely to 
satisfy this constraint), `user_events`.

## Design system
Light, airy palette — background #eef5f7, soft translucent pastel accent washes 
(blue/green/lavender/peach) as radial gradients behind frosted-glass cards. 
Primary accent color: teal (#4db8ae). Font: Satoshi only (no secondary display 
font in use). Rounded corners throughout (18–24px radii), soft drop shadows, 
backdrop-blur on sidebar/topbar/cards.

## Model choice for dev tasks
Default to Sonnet for day-to-day work — everything built so far (redesign, 
bug fixes, the retention diagnosis) ran on Sonnet with no capability ceiling 
hit. Reach for Opus specifically for large, hard-to-reverse, many-files-at-once 
passes: breaking `index.html`'s single inline script into real modules, a 
first automated test suite, a schema migration on live user data, or the 
goal-state machine growing enough branches that interacting states become 
genuinely hard to reason about by hand. Pick the model per task, not 
permanently. Full reasoning logged in Obsidian: `300 - Lumen/304 - Technical 
Decisions.md`, 2026-09-28 entry.

## Rules for Claude Code
- Never modify Supabase connection credentials
- Always preserve existing Supabase event tracking calls (`logUserEvent`)
- Keep the design system consistent — use existing CSS variables
- Comment any significant logic changes
- Test changes work before committing
- Flag any dead code, stale docs, or architectural inconsistency you notice 
  unprompted — do not silently work around it
