export function speak(text: string): void {
  if (typeof window === "undefined") return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.85
  utterance.pitch = 1.1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function speakLetter(letter: string): void {
  speak(letter)
}

export function speakWord(word: string): void {
  speak(word)
}
