type EventName =
  | "mode_started"
  | "challenge_completed"
  | "challenge_skipped"
  | "lesson_completed"
  | "ocr_scan_attempted"
  | "produce_attempt"

interface EventProperties {
  letter?: string
  mode?: string
  challenge?: string
  correct?: boolean
  score?: number
  [key: string]: string | boolean | number | undefined
}

export function trackEvent(event: EventName, props?: EventProperties): void {
  if (typeof window === "undefined") return
  // Hook for future analytics (Vercel Analytics, Posthog, etc.)
  console.debug("[trace:analytics]", event, props)
}
