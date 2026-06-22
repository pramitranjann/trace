"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { LetterContent } from "@/types/trace"
import FeedbackBanner from "@/components/shell/FeedbackBanner"
import ActionButton from "@/components/shell/ActionButton"
import { trackEvent } from "@/lib/analytics"

interface WordRecognitionChallengeProps {
  letter: LetterContent
  onComplete: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WordRecognitionChallenge({
  letter,
  onComplete,
}: WordRecognitionChallengeProps) {
  // Show only the emoji — no word text — and ask which word matches
  const options = useMemo(
    () => shuffle([letter.word, ...letter.distractorWords.slice(0, 2)]),
    [letter]
  )
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === letter.word

  function handleSelect(opt: string) {
    if (selected) return
    setSelected(opt)
    const correct = opt === letter.word
    trackEvent("challenge_completed", { letter: letter.id, mode: "see", challenge: "word", correct })
    setTimeout(() => onComplete(correct), 1000)
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <p className="text-base font-semibold text-gray-500 uppercase tracking-widest">
        What is this?
      </p>

      {/* Emoji only — no word text shown */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center justify-center w-44 h-44 rounded-3xl bg-white border-4 border-orange-100 shadow-lg"
      >
        <span className="text-9xl select-none">{letter.emoji}</span>
      </motion.div>

      {/* Word choices */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {options.map((opt) => {
          const isThis = opt === letter.word
          const picked = selected === opt
          let style = "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300"
          if (picked && isThis) style = "bg-green-100 border-2 border-green-500 text-green-700"
          if (picked && !isThis) style = "bg-red-100 border-2 border-red-400 text-red-700"
          if (selected && !picked && isThis) style = "bg-green-100 border-2 border-green-500 text-green-700"
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`py-4 px-6 rounded-2xl text-2xl font-bold text-left transition-colors ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <FeedbackBanner
            status={isCorrect ? "success" : "retry"}
            message={
              isCorrect
                ? `Yes! That's ${letter.word}! ${letter.emoji}`
                : `That's ${letter.word} ${letter.emoji} — nice try!`
            }
          />
        )}
      </AnimatePresence>

      {selected && (
        <ActionButton onClick={() => onComplete(isCorrect)}>
          Continue →
        </ActionButton>
      )}
    </div>
  )
}
