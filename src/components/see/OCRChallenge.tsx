"use client"

import { useRef, useState, useMemo } from "react"
import type { LetterContent } from "@/types/trace"
import CameraView from "@/components/camera/CameraView"
import ActionButton from "@/components/shell/ActionButton"
import FeedbackBanner from "@/components/shell/FeedbackBanner"
import { recognizeText } from "@/lib/ocr"
import { trackEvent } from "@/lib/analytics"

interface OCRChallengeProps {
  letters: LetterContent[]
  onComplete: (result: { text: string; matched?: LetterContent; correct: boolean }) => void
}

type Stage = "camera" | "processing" | "answer"

export default function OCRChallenge({ letters, onComplete }: OCRChallengeProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stage, setStage] = useState<Stage>("camera")
  const [scannedText, setScannedText] = useState("")
  const [matched, setMatched] = useState<LetterContent | undefined>()
  const [selected, setSelected] = useState<string | null>(null)

  async function capture() {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
    setStage("processing")
    canvas.toBlob(async (blob) => {
      if (!blob) { setStage("camera"); return }
      try {
        const text = await recognizeText(blob)
        trackEvent("ocr_scan_attempted", { text })
        const upper = text.toUpperCase()
        const found =
          letters.find((l) => upper.includes(l.word.toUpperCase())) ??
          letters.find((l) => new RegExp(`\\b${l.character}\\b`).test(upper))
        setScannedText(text || "")
        setMatched(found)
        setStage("answer")
      } catch {
        setStage("camera")
      }
    }, "image/jpeg", 0.85)
  }

  function handleAnswer(opt: string) {
    if (selected) return
    setSelected(opt)
    const correct = matched ? opt === matched.character : false
    trackEvent("challenge_completed", { mode: "see", challenge: "ocr", correct })
    setTimeout(() => onComplete({ text: scannedText, matched, correct }), 900)
  }

  const answerOptions = useMemo(() => {
    const base = letters.slice(0, 4).map((l) => l.character)
    if (matched && !base.includes(matched.character)) {
      base[base.length - 1] = matched.character
    }
    return base
  }, [letters, matched])

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest text-center">
        Point your camera at a letter or word
      </p>

      <div className="relative w-full max-w-sm">
        <CameraView
          facingMode="environment"
          onReady={(v) => { videoRef.current = v }}
          className="aspect-[4/3] w-full"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {stage === "camera" && (
        <ActionButton onClick={capture} size="lg">
          📷 Scan
        </ActionButton>
      )}

      {stage === "processing" && (
        <div className="flex flex-col items-center gap-2 text-orange-500">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Reading…</span>
        </div>
      )}

      {stage === "answer" && (
        <div className="flex flex-col items-center gap-5 w-full">
          {scannedText ? (
            <div className="bg-white border-2 border-orange-200 rounded-2xl px-6 py-3">
              <span className="text-sm text-gray-500">I see: </span>
              <span className="text-lg font-bold text-gray-800">{scannedText.slice(0, 40)}</span>
            </div>
          ) : (
            <FeedbackBanner
              status="retry"
              message="I couldn't read that yet. Try getting closer."
            />
          )}

          {scannedText && (
            <>
              <p className="text-sm text-gray-600 font-medium">Which letter did I find?</p>
              <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
                {answerOptions.map((opt) => {
                  const picked = selected === opt
                  const isCorrect = matched ? opt === matched.character : false
                  let style = "bg-white border-2 border-gray-200"
                  if (picked && isCorrect) style = "bg-green-100 border-2 border-green-500"
                  if (picked && !isCorrect) style = "bg-red-100 border-2 border-red-400"
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      disabled={!!selected}
                      className={`py-3 rounded-xl text-2xl font-black text-gray-700 ${style}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {(!scannedText || selected !== null) && (
            <ActionButton
              variant="secondary"
              onClick={() => { setStage("camera"); setSelected(null); setScannedText("") }}
            >
              Try again
            </ActionButton>
          )}
        </div>
      )}
    </div>
  )
}
