# 08 — Responsive Camera Requirements

## Requirement

Trace must work on phone and desktop from day one.

## Phone Behavior

Primary orientation:
- portrait

Input:
- touch-first

Camera:
- See OCR should prefer rear camera
- Paper Write should prefer rear camera
- Air Trace can use front camera

Controls:
- large bottom buttons
- no hover-only interactions
- minimal text
- camera area should take most of the screen

## Desktop Behavior

Input:
- mouse/click
- keyboard optional

Camera:
- webcam-first
- no assumption of rear camera

Layout:
- centered stage
- max-width content
- camera/canvas should not stretch awkwardly across the full screen

## Camera Component Requirements

`CameraView` should support:

```ts
interface CameraViewProps {
  facingMode?: "user" | "environment"
  onReady?: () => void
  onError?: (error: Error) => void
  mirrored?: boolean
  className?: string
}
```

## Camera Error States

Handle:

- permission denied
- camera unavailable
- insecure context
- browser unsupported
- no rear camera
- MediaPipe failed
- OCR failed

## Mobile Safari Notes

Camera APIs often behave differently on iOS Safari.

Always test through a Vercel Preview URL.

## Completion Requirement

A camera feature is not done until tested on:

- desktop Chrome
- mobile Safari
- mobile Chrome
