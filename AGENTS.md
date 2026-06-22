# AGENTS.md

This is the shared source of truth for all coding agents working on Trace.

Use this file for both Claude Code and Codex. If Claude and Codex disagree with their own local instructions, this file wins.

## Project

Trace is a multimodal literacy MVP.

It helps learners build reading and writing confidence through three repeated learning modes:

1. See
2. Hear
3. Produce

The MVP focuses only on English capital letters A-E.

## Repository

GitHub:
https://github.com/pramitranjann/trace

Hosting:
Vercel

## Core Product Rule

Trace is not only a handwriting app.
Trace is not only an OCR app.
Trace is not a Duolingo clone.

Trace is a playful literacy experience that teaches the same concept through:

- visual recognition
- audio recognition
- active production

Every MVP feature must support See, Hear, or Produce.

## MVP Letters

Only support:

- A — Apple
- B — Ball
- C — Cat
- D — Dog
- E — Elephant

Do not add more letters until the MVP is working end-to-end.

## MVP Modes

### See

The learner recognizes what they see.

Required MVP activities:

- app shows a letter, learner identifies it
- app shows a word, learner identifies it
- learner scans real-world text using OCR and answers what it says through a simple multiple-choice challenge

### Hear

The learner connects sound to symbol.

Required MVP activities:

- app plays a letter sound, learner selects the correct letter
- app plays a word sound, learner selects the correct word

Use Web Speech API for MVP pronunciation. Custom audio can come later.

### Produce

The learner creates the letter.

Required MVP activities:

- air trace with webcam using MediaPipe hand tracking
- physical paper writing checked with camera capture

The paper writing check can be forgiving and simple in MVP.

## UX Rules

- One main action per screen.
- No dashboard.
- No login.
- No profile.
- No streaks.
- No XP.
- No parent portal.
- No admin panel.
- No dense instructions.
- Show, do not tell.
- Animation and sound should guide the experience before text.
- The UI should feel playful, childlike, bright, brandable, and shippable.

## Visual Direction Before Final UI Import

The product should feel closer to:

- Duolingo
- Khan Academy Kids
- Nintendo
- Pokémon
- Osmo
- Headspace

It should not feel like:

- Notion
- Stripe Dashboard
- Google Admin
- enterprise software
- a generic Tailwind demo

Use temporary UI that is easy to replace later.

Do not hardcode visual decisions in ways that make future UI import painful.

## Platform Requirements

Trace must work on both phone and desktop from the start.

Phone:
- portrait-first
- touch-first
- rear camera preferred for See OCR and Produce paper writing
- front camera acceptable for Produce air tracing

Desktop:
- webcam-first
- centered activity stage
- large camera/canvas area
- must work for testing, demos, and classroom-style use

A feature is not complete until it works on:

- Desktop Chrome
- Mobile Safari
- Mobile Chrome

through a Vercel Preview URL.

## Technical Stack

Preferred stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- MediaPipe Tasks Vision
- Tesseract.js
- Web Speech API
- Vercel
- GitHub

Recommended tooling:

- Vercel Toolbar
- Vercel Analytics
- Vercel Speed Insights
- Sentry
- Playwright

## Forbidden MVP Features

Do not build:

- authentication
- user accounts
- database
- backend APIs
- server-side OCR
- server-side image processing
- dashboards
- streaks
- XP
- achievements
- mascot system
- payments
- subscriptions
- parent portal
- multi-language support
- more than A-E
- open-ended AI tutoring
- complex handwriting ML

## Implementation Philosophy

Detailed spec, small product.

Build the smallest version that proves the loop:

A learner opens Trace, sees A, hears A, produces A, and gets encouraging feedback.

The first successful demo is:

1. Open Vercel URL on phone.
2. Choose Start.
3. Complete See for A.
4. Complete Hear for A.
5. Complete Produce for A.
6. Finish in under 60 seconds.

## Agent Workflow

Before starting work:

1. Read AGENTS.md.
2. Read CURRENT_TASK.md.
3. Read HANDOFF.md.
4. Read DECISIONS.md.
5. Read README_INDEX.md.
6. Read only the specs relevant to the current task unless more context is needed.

Before stopping work:

1. Run lint/typecheck/build if available.
2. Update HANDOFF.md.
3. List changed files.
4. List what works.
5. List what is incomplete.
6. Suggest the next task.

## Handoff Rule

Claude and Codex may be used interchangeably based on rate limits.

Do not rely on chat history.

Persist progress in:

- CURRENT_TASK.md
- HANDOFF.md
- DECISIONS.md

Any agent should be able to continue from those files.
