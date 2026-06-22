# 15 — Risks and Decisions

## Risk 1 — Product becomes too broad

Mitigation:
A-E only. See/Hear/Produce only.

## Risk 2 — OCR is unreliable

Mitigation:
Use OCR as a playful scan challenge, not a high-stakes feature.
Allow retry.
Use multiple choice.
Support typed fallback later if needed.

## Risk 3 — MediaPipe is hard on mobile

Mitigation:
Keep air tracing simple.
Use forgiving scoring.
Test on Vercel preview early.

## Risk 4 — Paper writing verification becomes too complex

Mitigation:
For MVP, camera capture + encouraging feedback is enough.
Rough comparison can come after the base flow works.

## Risk 5 — UI feels like a generic dashboard

Mitigation:
Follow design brief.
No dashboard.
Large cards.
Bright colors.
One action per screen.

## Risk 6 — Agents overbuild

Mitigation:
AGENTS.md, CURRENT_TASK.md, HANDOFF.md, and DECISIONS.md define scope.

## Risk 7 — Switching Claude/Codex loses context

Mitigation:
Update HANDOFF.md before every switch.

## Key Product Decision

The MVP is about testing multimodal repetition, not perfect recognition technology.

If a technical feature is unreliable, reduce strictness rather than expanding scope.
