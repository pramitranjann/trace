# DECISIONS.md

This file records product and engineering decisions so agents do not re-argue them.

## 001 — MVP is A-E only

Reason:
The goal is to test the learning model, not build a full alphabet course.

## 002 — All three modes ship in one long sprint

Reason:
See, Hear, and Produce are the core product model. Shipping only one mode would misrepresent the product.

## 003 — OCR is in the MVP

Reason:
Real-world recognition is part of the See mode and makes the product feel meaningfully different from a digital worksheet.

## 004 — Web Speech API is acceptable for MVP

Reason:
Custom audio can come later. Web Speech API allows quick testing of the Hear mode.

## 005 — Paper writing verification can be forgiving

Reason:
The MVP is about confidence and interaction. Strict handwriting grading or ML models are out of scope.

## 006 — No backend for MVP

Reason:
Client-side implementation is faster, easier to deploy on Vercel, and enough for validation.

## 007 — Mobile and desktop both matter from day one

Reason:
Phone is the natural learning device, but desktop is important for demos, testing, and webcam use.

## 008 — UI is temporary until future design import

Reason:
The MVP should feel playful but must remain easy to reskin once final UI is designed.

## 009 — Agents must update HANDOFF.md

Reason:
Claude and Codex will be used interchangeably based on rate limits.
