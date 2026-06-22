# 11 — Implementation Plan: One Long Sprint

All modes ship in one sprint.

Do not split into separate products.

## Phase 0 — Repo Setup

Goal:
Make the repo buildable.

Tasks:
- confirm Next.js app exists
- add TypeScript
- add Tailwind
- add Framer Motion
- add base folder structure
- add lint/typecheck/build scripts
- connect Vercel if not already connected

## Phase 1 — Content and App Shell

Goal:
Create the foundation.

Tasks:
- create A-E data model
- create AppShell
- create ModeCard
- create Home page
- create See/Hear/Produce routes
- create Quick Lesson route

Definition of done:
User can navigate the app.

## Phase 2 — See Mode

Goal:
Build visual recognition.

Tasks:
- LetterRecognitionChallenge
- WordRecognitionChallenge
- OCRChallenge
- Tesseract utility
- camera/image capture
- multiple-choice result

Definition of done:
User can identify A-E visually and scan text.

## Phase 3 — Hear Mode

Goal:
Build audio recognition.

Tasks:
- speech utility
- AudioMatchChallenge
- letter sound match
- word sound match

Definition of done:
User hears A/Apple and selects the right answer.

## Phase 4 — Produce Mode

Goal:
Build production.

Tasks:
- CameraView
- MediaPipe hand tracking setup
- AirTraceChallenge
- trail canvas
- path comparison
- PaperWriteChallenge
- image capture
- forgiving feedback

Definition of done:
User can air trace and capture paper writing.

## Phase 5 — Quick Lesson

Goal:
Connect modes.

Tasks:
- create sequence See -> Hear -> Produce
- support current letter index
- completion screen
- continue to next letter

Definition of done:
User completes A and continues to B.

## Phase 6 — Polish and QA

Goal:
Make it feel like a product.

Tasks:
- animation
- sound feedback
- responsive fixes
- camera error states
- mobile Safari testing
- Vercel preview testing
- Sentry setup
- analytics events

Definition of done:
Vercel preview works on phone and desktop.

## Final MVP Demo Script

1. Open app.
2. Tap Start Quick Lesson.
3. See A and answer.
4. Hear A and answer.
5. Air trace A.
6. Write A on paper and capture.
7. Celebrate completion.
8. Continue to B.
