"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LETTERS } from "@/data/letters"
import AudioMatchChallenge from "./AudioMatchChallenge"
import ActionButton from "@/components/shell/ActionButton"
import { trackEvent } from "@/lib/analytics"

type Activity = "pick" | "letter" | "word"

export default function HearMode() {
  const [activity, setActivity] = useState<Activity>("pick")
  const [letterIndex, setLetterIndex] = useState(0)
  const letter = LETTERS[letterIndex]

  function handleDone(correct: boolean) {
    void correct
    setActivity("pick")
  }

  if (activity === "letter") {
    return (
      <div>
        <button onClick={() => setActivity("pick")} className="m-4 text-orange-500 font-semibold text-sm">
          ← Back
        </button>
        <AudioMatchChallenge
          key={`letter-${letter.id}`}
          letter={letter}
          type="letter"
          onComplete={handleDone}
        />
      </div>
    )
  }

  if (activity === "word") {
    return (
      <div>
        <button onClick={() => setActivity("pick")} className="m-4 text-orange-500 font-semibold text-sm">
          ← Back
        </button>
        <AudioMatchChallenge
          key={`word-${letter.id}`}
          letter={letter}
          type="word"
          onComplete={handleDone}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 max-w-lg mx-auto w-full">
      {/* Letter selector */}
      <div className="flex gap-2">
        {LETTERS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => { setLetterIndex(i); trackEvent("mode_started", { mode: "hear", letter: l.id }) }}
            className={`w-11 h-11 rounded-full text-lg font-black transition-colors ${
              i === letterIndex
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white border-2 border-orange-200 text-orange-500"
            }`}
          >
            {l.character}
          </button>
        ))}
      </div>

      {/* Current letter display */}
      <motion.div
        key={letter.id}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-4 bg-white rounded-3xl px-8 py-6 shadow-md border border-orange-100"
      >
        <span className="text-8xl font-black text-orange-500">{letter.character}</span>
        <div className="flex flex-col">
          <span className="text-4xl">{letter.emoji}</span>
          <span className="text-lg font-bold text-gray-700">{letter.word}</span>
        </div>
      </motion.div>

      <p className="text-sm text-gray-500 font-medium">Choose a listening activity:</p>

      <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
        <ActionButton
          onClick={() => { setActivity("letter"); trackEvent("mode_started", { mode: "hear", challenge: "letter" }) }}
          size="lg"
          className="w-full"
        >
          🔤 Hear a Letter
        </ActionButton>
        <ActionButton
          onClick={() => { setActivity("word"); trackEvent("mode_started", { mode: "hear", challenge: "word" }) }}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          🗣️ Hear a Word
        </ActionButton>
      </div>
    </div>
  )
}
