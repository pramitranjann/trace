"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LETTERS } from "@/data/letters"
import LetterRecognitionChallenge from "@/components/see/LetterRecognitionChallenge"
import AudioMatchChallenge from "@/components/hear/AudioMatchChallenge"
import AirTraceChallenge from "@/components/produce/AirTraceChallenge"
import PaperWriteChallenge from "@/components/produce/PaperWriteChallenge"
import ActionButton from "@/components/shell/ActionButton"
import { trackEvent } from "@/lib/analytics"

type Step = "intro" | "see" | "hear" | "air" | "paper" | "complete"

export default function QuickLesson() {
  const [letterIndex, setLetterIndex] = useState(0)
  const [step, setStep] = useState<Step>("intro")
  const letter = LETTERS[letterIndex]
  const isLastLetter = letterIndex === LETTERS.length - 1

  function advance(nextStep: Step) {
    setStep(nextStep)
  }

  function nextLetter() {
    const next = letterIndex + 1
    if (next < LETTERS.length) {
      setLetterIndex(next)
      setStep("intro")
    }
  }

  if (step === "intro") {
    return (
      <motion.div
        key="intro"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8 px-4 py-12 max-w-lg mx-auto w-full"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-7xl">{letter.emoji}</span>
          <div className="flex flex-col items-center">
            <span className="text-8xl font-black text-orange-500">{letter.character}</span>
            <span className="text-3xl font-bold text-gray-600 -mt-2">{letter.word}</span>
          </div>
        </div>

        <p className="text-xl font-bold text-gray-700 text-center">
          Let&apos;s learn <span className="text-orange-500">{letter.character}</span>!
        </p>

        {/* Step preview */}
        <div className="flex gap-3 text-sm text-gray-500">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">👁 See</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">👂 Hear</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">✋ Make</span>
        </div>

        <ActionButton
          size="lg"
          onClick={() => {
            trackEvent("lesson_completed", { letter: letter.id, step: "start" })
            advance("see")
          }}
        >
          Start! →
        </ActionButton>

        {/* Letter progress dots */}
        <div className="flex gap-2">
          {LETTERS.map((l, i) => (
            <div
              key={l.id}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < letterIndex
                  ? "bg-green-400"
                  : i === letterIndex
                  ? "bg-orange-500"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  if (step === "see") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="see" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
          <div className="px-4 pt-4">
            <StepIndicator current={1} total={4} label="See" />
          </div>
          <LetterRecognitionChallenge
            key={`see-${letter.id}`}
            letter={letter}
            onComplete={() => advance("hear")}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  if (step === "hear") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="hear" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
          <div className="px-4 pt-4">
            <StepIndicator current={2} total={4} label="Hear" />
          </div>
          <AudioMatchChallenge
            key={`hear-${letter.id}`}
            letter={letter}
            type="letter"
            onComplete={() => advance("air")}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  if (step === "air") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="air" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
          <div className="px-4 pt-4">
            <StepIndicator current={3} total={4} label="Air Trace" />
          </div>
          <AirTraceChallenge
            key={`air-${letter.id}`}
            letter={letter}
            onComplete={() => advance("paper")}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  if (step === "paper") {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="paper" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
          <div className="px-4 pt-4">
            <StepIndicator current={4} total={4} label="Paper Write" />
          </div>
          <PaperWriteChallenge
            key={`paper-${letter.id}`}
            letter={letter}
            onComplete={() => {
              trackEvent("lesson_completed", { letter: letter.id })
              advance("complete")
            }}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  if (step === "complete") {
    return (
      <motion.div
        key="complete"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8 px-4 py-12 max-w-lg mx-auto w-full"
      >
        <div className="text-7xl">🎉</div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-4xl font-black text-orange-500">You learned {letter.character}!</h2>
          <p className="text-gray-600 text-center">
            {letter.emoji} {letter.word} — you saw it, heard it, and made it!
          </p>
        </div>

        {!isLastLetter ? (
          <ActionButton size="lg" onClick={nextLetter}>
            Continue to {LETTERS[letterIndex + 1].character} →
          </ActionButton>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-xl font-bold text-green-600">You finished all 5 letters! 🌟</p>
            <ActionButton size="lg" onClick={() => { setLetterIndex(0); setStep("intro") }}>
              Start over
            </ActionButton>
          </div>
        )}
      </motion.div>
    )
  }

  return null
}

function StepIndicator({ current, total, label }: { current: number; total: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm font-bold text-orange-500">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < current ? "bg-orange-500 w-6" : i === current - 1 ? "bg-orange-500 w-6" : "bg-gray-200 w-4"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
