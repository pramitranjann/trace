# 04 — Product Requirements

## App Shell

### Requirements

- Next.js App Router app.
- Responsive layout for phone and desktop.
- Home screen with:
  - Trace logo/title
  - See card
  - Hear card
  - Produce card
  - Start Quick Lesson button
- No login.
- No dashboard.

## Data Model

Use hardcoded content for A-E.

```ts
export type LetterId = "A" | "B" | "C" | "D" | "E"

export interface Point {
  x: number
  y: number
}

export interface LetterContent {
  id: LetterId
  character: string
  word: string
  emoji: string
  options: string[]
  tracePath: Point[]
}
```

## See Mode Requirements

### See Activity 1: Letter Recognition

Show one letter.

Ask user to pick the matching letter from multiple choice.

Example:

- prompt: "What letter is this?"
- visual: A
- options: A, B, C

### See Activity 2: Word Recognition

Show one word.

Ask user to pick the matching word.

Example:

- visual: APPLE
- options: Apple, Ball, Cat

### See Activity 3: OCR Scan

Open camera or image input.
Run OCR.
Extract recognized text.
If text contains an MVP letter/word, ask a multiple-choice question.

For MVP:
- simple text extraction is enough
- answer can be multiple-choice
- no open voice input needed

## Hear Mode Requirements

### Hear Activity 1: Letter Sound Match

Play the letter using Web Speech API.

Options:
A, B, C

User selects correct letter.

### Hear Activity 2: Word Sound Match

Play the word using Web Speech API.

Options:
Apple, Ball, Cat

User selects correct word.

## Produce Mode Requirements

### Produce Activity 1: Air Trace

Use MediaPipe hand tracking.

Track index finger tip.

Render:
- target letter path
- user's trail
- completion feedback

Scoring should be forgiving.

### Produce Activity 2: Paper Write

User writes letter on paper.
User shows writing to camera.
App captures frame.
App gives feedback.

MVP verification can be basic:
- image capture succeeded
- optional rough contour/template check
- forgiving result

## Quick Lesson Requirements

Quick Lesson should run one letter through:

1. See
2. Hear
3. Produce

For MVP, start with A and allow continuing to B.

## Feedback Requirements

Feedback should be encouraging.

Use:

- "Nice!"
- "Great movement!"
- "Almost there!"
- "Try once more!"

Avoid harsh failure language.
