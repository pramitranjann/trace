# 09 — Technical Architecture

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- MediaPipe Tasks Vision
- Tesseract.js
- Web Speech API
- Vercel

## Suggested Structure

```txt
src/
  app/
    page.tsx
    see/page.tsx
    hear/page.tsx
    produce/page.tsx
    quick/page.tsx

  components/
    shell/
      AppShell.tsx
      ModeCard.tsx
      ActionButton.tsx

    camera/
      CameraView.tsx

    see/
      SeeMode.tsx
      LetterRecognitionChallenge.tsx
      WordRecognitionChallenge.tsx
      OCRChallenge.tsx

    hear/
      HearMode.tsx
      AudioMatchChallenge.tsx

    produce/
      ProduceMode.tsx
      AirTraceChallenge.tsx
      PaperWriteChallenge.tsx

  data/
    letters.ts

  lib/
    speech.ts
    ocr.ts
    mediapipe.ts
    pathCompare.ts
    camera.ts
    analytics.ts

  types/
    trace.ts
```

## Letter Data

```ts
export interface Point {
  x: number
  y: number
}

export interface LetterContent {
  id: "A" | "B" | "C" | "D" | "E"
  character: string
  word: string
  emoji: string
  distractorLetters: string[]
  distractorWords: string[]
  tracePath: Point[]
}
```

## Example Data

```ts
export const LETTERS: LetterContent[] = [
  {
    id: "A",
    character: "A",
    word: "Apple",
    emoji: "🍎",
    distractorLetters: ["B", "C"],
    distractorWords: ["Ball", "Cat"],
    tracePath: [
      { x: 0.5, y: 0.1 },
      { x: 0.2, y: 0.9 },
      { x: 0.5, y: 0.1 },
      { x: 0.8, y: 0.9 },
      { x: 0.32, y: 0.55 },
      { x: 0.68, y: 0.55 }
    ]
  }
]
```

## Speech Utility

```ts
export function speak(text: string) {
  if (typeof window === "undefined") return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.85
  utterance.pitch = 1.1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}
```

## OCR Utility

```ts
import { createWorker } from "tesseract.js"

export async function recognizeText(image: File | Blob): Promise<string> {
  const worker = await createWorker("eng")
  const result = await worker.recognize(image)
  await worker.terminate()
  return result.data.text.trim()
}
```

## Path Comparison MVP

```ts
export function normalizePath(points: Point[]): Point[] {
  if (points.length === 0) return []

  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  const width = maxX - minX || 1
  const height = maxY - minY || 1

  return points.map(p => ({
    x: (p.x - minX) / width,
    y: (p.y - minY) / height
  }))
}
```

## State Management

Use React state.

Avoid Redux.

Context is allowed only if state becomes shared across many components.

## Deployment

No backend required.

All core functionality should run client-side.
