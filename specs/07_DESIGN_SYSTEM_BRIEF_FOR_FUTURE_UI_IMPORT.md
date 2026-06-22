# 07 — Design System Brief for Future UI Import

## Purpose

This file helps agents build UI in a way that can later be replaced by a designed system.

## Current Direction

The visual style should be:

- bright
- playful
- childlike
- brandable
- solid-color driven
- rounded
- expressive

Purple is a possible primary color, but it is not final.

## Suggested Temporary Palette

Use CSS variables so colors can be replaced later.

```css
:root {
  --trace-bg: #fbf7ff;
  --trace-primary: #7c3aed;
  --trace-primary-dark: #5b21b6;
  --trace-yellow: #facc15;
  --trace-lime: #a3e635;
  --trace-cyan: #22d3ee;
  --trace-coral: #fb7185;
  --trace-ink: #21152f;
  --trace-muted: #6b6475;
  --trace-card: #ffffff;
}
```

## Shape Language

- rounded corners
- large soft cards
- chunky buttons
- strong shadows
- playful blobs
- large letterforms

Avoid:
- thin outlines
- tiny controls
- grey-heavy UI
- dense forms

## Motion Direction

Use Framer Motion for:

- spring transitions
- card entrance
- button press
- success feedback
- mode transitions

Animations should feel organic, not mechanical.

## Future UI Import Requirements

Separate logic from presentation.

Good:
- `SeeMode` handles state
- `SeeModeView` handles UI

Avoid:
- mixing OCR logic directly into hardcoded visual components
- deeply nested Tailwind strings that are hard to replace
- dimensions that only work for one viewport

## Brandability Requirement

A screenshot should be recognizable without reading much text.

Use:
- large letters
- bold color blocks
- clear icons
- strong mode identity

The UI should be usable in:
- App Store screenshots
- TikTok demos
- portfolio case study
- landing page hero
