# 00 — Executive Summary

## What is Trace?

Trace is a playful multimodal literacy MVP that helps learners practice letters through three repeated modes:

- See
- Hear
- Produce

The MVP teaches only English capital letters A-E.

## Why does it exist?

Traditional literacy tools often isolate learning into one mode:

- workbooks focus on writing
- flashcards focus on recognition
- audio tools focus on listening

Trace combines these modes into one interactive experience.

The same letter is reinforced visually, audibly, physically, and through real-world scanning.

## MVP Experience

A learner opens Trace and chooses either:

- Start Quick Lesson
- See
- Hear
- Produce

Quick Lesson for A:

1. See A and identify it.
2. Hear "A" and match it.
3. Air trace A with their finger using webcam.
4. Write A on paper and show it to the camera.
5. Receive playful feedback.
6. Continue to B.

## Core Hypothesis

Learners build stronger recall and confidence when they encounter the same concept through multiple modes of repetition.

## Ship-Fast Principle

The MVP should be small but complete.

Build all three modes, but only for A-E.

Do not build a full course, login system, dashboard, or backend.

## Technical Direction

- Next.js
- TypeScript
- Tailwind
- Framer Motion
- MediaPipe Tasks Vision
- Tesseract.js
- Web Speech API
- Vercel

## Success

The first success condition is a Vercel preview that works on phone and desktop.

A user should complete A through See, Hear, and Produce in under 60 seconds.
