"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { LetterContent } from "@/types/trace"
import { speak } from "@/lib/speech"
import FeedbackBanner from "@/components/shell/FeedbackBanner"
import ActionButton from "@/components/shell/ActionButton"
import { trackEvent } from "@/lib/analytics"

interface AudioMatchChallengeProps {
  letter: LetterContent
  type: "letter" | "word"
  onComplete: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function AudioMatchChallenge({
  letter,
  type,
  onComplete,
}: AudioMatchChallengeProps) {
  const target = type === "letter" ? letter.character : letter.word
  const distractors = type === "letter" ? letter.distractorLetters.slice(0, 2) : letter.distractorWords.slice(0, 2)
  const options = shuffle([target, ...distractors])
  const [selected, setSelected] = useState<string | null>(null)
  const [played, setPlayed] = useState(false)
  const isCorrect = selected === target

  useEffect(() => {
    const t = setTimeout(() => {
      speak(target)
      setPlayed(true)
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function playAgain() {
    speak(target)
    setPlayed(true)
  }

  function handleSelect(opt: string) {
    if (selected) return
    setSelected(opt)
    const correct = opt === target
    trackEvent("challenge_completed", { letter: letter.id, mode: "hear", challenge: type, correct })
    setTimeout(() => onComplete(correct), 1000)
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <p className="text-base font-semibold text-gray-500 uppercase tracking-widest">
        {type === "letter" ? "Which letter do you hear?" : "Which word do you hear?"}
      </p>

      {/* Play button */}
      <motion.button
        onClick={playAgain}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="flex flex-col items-center justify-center w-36 h-36 rounded-full bg-orange-100 border-4 border-orange-300 shadow-lg text-orange-500 hover:bg-orange-200 transition-colors"
      >
        <span className="text-5xl">{played ? "🔊" : "👂"}</span>
        <span className="text-xs font-bold mt-1 text-orange-600">
          {played ? "Play again" : "Listen!"}
        </span>
      </motion.button>

      {/* Choices */}
      <div className={`grid gap-3 w-full max-w-xs ${type === "letter" ? "grid-cols-3" : "grid-cols-1"}`}>
        {options.map((opt) => {
          const isThis = opt === target
          const picked = selected === opt
          let style = "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300"
          if (picked && isThis) style = "bg-green-100 border-2 border-green-500 text-green-700"
          if (picked && !isThis) style = "bg-red-100 border-2 border-red-400 text-red-700"
          if (selected && !picked && isThis) style = "bg-green-100 border-2 border-green-500 text-green-700"
          const textSize = type === "letter" ? "text-3xl font-black" : "text-xl font-bold text-left px-4"
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selected || !played}
              className={`py-4 rounded-2xl transition-colors ${textSize} ${style} ${!played ? "opacity-50" : ""}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {!played && (
        <p className="text-sm text-gray-400">Press the button above to hear the sound</p>
      )}

      <AnimatePresence>
        {selected && (
          <FeedbackBanner
            status={isCorrect ? "success" : "retry"}
            message={
              isCorrect
                ? "You got it! 👂✨"
                : `It was "${target}" — nice try!`
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
