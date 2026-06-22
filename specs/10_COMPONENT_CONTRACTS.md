# 10 — Component Contracts

## Core Types

```ts
export type Mode = "see" | "hear" | "produce"

export type ChallengeStatus =
  | "idle"
  | "active"
  | "correct"
  | "incorrect"
  | "complete"
  | "error"

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

## AppShell

Purpose:
Provides shared page layout.

Props:

```ts
interface AppShellProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
}
```

## ModeCard

Purpose:
Large home screen action.

Props:

```ts
interface ModeCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}
```

## SeeMode

Purpose:
Container for See activities.

Activities:
- LetterRecognitionChallenge
- WordRecognitionChallenge
- OCRChallenge

## LetterRecognitionChallenge

Props:

```ts
interface LetterRecognitionChallengeProps {
  letter: LetterContent
  onComplete: (correct: boolean) => void
}
```

## WordRecognitionChallenge

Props:

```ts
interface WordRecognitionChallengeProps {
  letter: LetterContent
  onComplete: (correct: boolean) => void
}
```

## OCRChallenge

Props:

```ts
interface OCRChallengeProps {
  letters: LetterContent[]
  onComplete: (result: {
    text: string
    matched?: LetterContent
    correct: boolean
  }) => void
}
```

## HearMode

Purpose:
Container for audio activities.

## AudioMatchChallenge

Props:

```ts
interface AudioMatchChallengeProps {
  letter: LetterContent
  type: "letter" | "word"
  onComplete: (correct: boolean) => void
}
```

## ProduceMode

Purpose:
Container for production activities.

## AirTraceChallenge

Props:

```ts
interface AirTraceChallengeProps {
  letter: LetterContent
  onComplete: (result: {
    score: number
    passed: boolean
  }) => void
}
```

## PaperWriteChallenge

Props:

```ts
interface PaperWriteChallengeProps {
  letter: LetterContent
  onComplete: (result: {
    imageCaptured: boolean
    passed: boolean
  }) => void
}
```

## CameraView

Props:

```ts
interface CameraViewProps {
  facingMode?: "user" | "environment"
  mirrored?: boolean
  onReady?: (video: HTMLVideoElement) => void
  onError?: (error: Error) => void
}
```

## FeedbackBanner

Props:

```ts
interface FeedbackBannerProps {
  status: "success" | "retry" | "info" | "error"
  message: string
}
```
