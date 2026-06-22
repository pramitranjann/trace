# 05 — User Flows and Screen States

## Home Flow

Screen:
Home

User sees:

- Trace title
- subtitle: "Learn letters by seeing, hearing, and making them"
- See card
- Hear card
- Produce card
- Start Quick Lesson

Actions:

- Tap See -> See Mode
- Tap Hear -> Hear Mode
- Tap Produce -> Produce Mode
- Tap Start Quick Lesson -> guided A lesson

## Quick Lesson Flow

For letter A:

1. Intro card: "Let's learn A"
2. See challenge: identify A
3. Hear challenge: listen and match A
4. Produce challenge: air trace A
5. Paper challenge: write A on paper
6. Completion: "You learned A"
7. Continue to B

## See Mode States

### State: Select Activity

Options:
- Letter
- Word
- Scan

### State: Letter Challenge

Shows large letter.

Options appear as large buttons.

On answer:
- correct -> celebration
- incorrect -> soft retry

### State: Word Challenge

Shows word.

Options as buttons.

### State: Scan Challenge

Camera screen.

States:
- permission needed
- camera loading
- scanning
- OCR processing
- text found
- no text found
- answer prompt
- feedback

## Hear Mode States

### State: Listen

Large sound/play button.

When pressed:
- app speaks letter/word
- options appear or animate

### State: Select Answer

User selects answer.

### State: Feedback

Correct or retry.

## Produce Mode States

### State: Choose Produce Activity

Options:
- Air Trace
- Paper Write

### State: Air Trace Setup

Camera permission.
Show ghost hand / start prompt.

### State: Air Trace Active

Target path.
User trail.
Progress.

### State: Air Trace Feedback

Encouraging result.

### State: Paper Write Prompt

"Write A on paper"

### State: Paper Capture

Camera view.
Capture button.

### State: Paper Feedback

Encouraging result.

## Error States

All error states should be friendly.

Examples:

Camera blocked:
"Camera needs permission so Trace can see your writing."

OCR failed:
"I couldn't read that yet. Try getting closer."

No hand found:
"Show your hand to the camera."

Avoid technical errors in the UI.
