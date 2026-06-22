"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { LetterContent } from "@/types/trace"
import FeedbackBanner from "@/components/shell/FeedbackBanner"
import ActionButton from "@/components/shell/ActionButton"
import { trackEvent } from "@/lib/analytics"

interface LetterRecognitionChallengeProps {
  letter: LetterContent
  onComplete: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function LetterRecognitionChallenge({
  letter,
  onComplete,
}: LetterRecognitionChallengeProps) {
  const options = shuffle([letter.character, ...letter.distractorLetters.slice(0, 2)])
  const [selected, setSelected] = useState<string | null>(null)
  const isCorrect = selected === letter.character

  function handleSelect(opt: string) {
    if (selected) return
    setSelected(opt)
    const correct = opt === letter.character
    trackEvent("challenge_completed", { letter: letter.id, mode: "see", challenge: "letter", correct })
    setTimeout(() => onComplete(correct), 1000)
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <p className="text-base font-semibold text-gray-500 uppercase tracking-widest">
        Which letter is this?
      </p>

      {/* Target */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center justify-center w-44 h-44 rounded-3xl bg-white border-4 border-orange-200 shadow-lg"
      >
        <span className="text-9xl font-black text-orange-500 select-none">
          {letter.character}
        </span>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {options.map((opt) => {
          const isThis = opt === letter.character
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
              className={`py-4 rounded-2xl text-3xl font-black transition-colors ${style}`}
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
            message={isCorrect ? "Great job! 🌟" : `That's ${letter.character} — try again next time!`}
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
