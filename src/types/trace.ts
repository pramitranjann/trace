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
