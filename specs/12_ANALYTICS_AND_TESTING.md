# 12 — Analytics and Testing

## Analytics Goals

Track whether users engage with all three modes.

## Events

```ts
type TraceEvent =
  | "app_opened"
  | "quick_lesson_started"
  | "see_started"
  | "see_completed"
  | "hear_started"
  | "hear_completed"
  | "produce_started"
  | "air_trace_completed"
  | "paper_write_completed"
  | "quick_lesson_completed"
  | "ocr_started"
  | "ocr_completed"
  | "ocr_failed"
  | "camera_permission_denied"
```

## MVP Event Payload

```ts
interface TraceEventPayload {
  letter?: "A" | "B" | "C" | "D" | "E"
  mode?: "see" | "hear" | "produce"
  success?: boolean
  device?: "mobile" | "desktop"
}
```

## Testing Priorities

### Manual QA

Required devices:
- desktop Chrome
- mobile Safari
- mobile Chrome

Required flows:
- home loads
- See letter challenge
- See word challenge
- OCR challenge
- Hear letter challenge
- Hear word challenge
- Air trace
- Paper write capture
- Quick Lesson

### Playwright

Use Playwright for:
- routing
- buttons
- lesson progression
- non-camera UI states

Do not rely on Playwright for:
- real OCR accuracy
- MediaPipe quality
- physical writing verification

### User Testing

Fast test with 3-5 people.

Ask:
- Do you understand what to do?
- Which mode feels most fun?
- Does this feel better than a worksheet?
- Did you want to continue?
- Did the camera feel confusing?

## Before/After Learning Test

Before:
Ask user to identify/write A-E.

Use app:
One Quick Lesson.

After:
Ask user to identify/write A-E again.

Measure:
- confidence
- completion
- enjoyment
- obvious improvement
