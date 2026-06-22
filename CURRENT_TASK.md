# CURRENT_TASK.md

## Current Task

Build the Trace MVP end-to-end as one long sprint.

All three modes should ship in the MVP:

1. See
2. Hear
3. Produce

## Goal

Create a working browser-based prototype where a user can learn letters A-E through:

- visual recognition
- audio recognition
- air tracing
- paper writing capture

## Required MVP Features

### App Shell

- responsive Next.js app
- playful temporary UI
- home screen with three mode cards: See, Hear, Produce
- Start Quick Lesson button

### See Mode

- letter recognition challenge
- word recognition challenge
- OCR scan challenge using Tesseract.js
- multiple-choice response

### Hear Mode

- Web Speech API pronunciation
- letter sound matching
- word sound matching

### Produce Mode

- MediaPipe hand tracking
- air tracing canvas
- rough path matching
- paper writing camera capture
- forgiving feedback

### Deployment / QA

- deployable to Vercel
- works on desktop and mobile
- lint/typecheck/build scripts
- basic analytics event hooks
- Sentry-ready error capture

## Do Not Build

- login
- database
- backend
- parent dashboard
- streaks
- XP
- mascot system
- payments
- more than A-E
- Hindi or other scripts yet

## Definition of Done

A user can:

1. Open the app.
2. Start with A.
3. Complete a See challenge.
4. Complete a Hear challenge.
5. Complete a Produce challenge.
6. Continue to B.
7. Use the app on phone and desktop.
8. Deploy successfully to Vercel.
