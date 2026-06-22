"use client"

import { useRef, useState } from "react"
import type { LetterContent } from "@/types/trace"
import CameraView from "@/components/camera/CameraView"
import ActionButton from "@/components/shell/ActionButton"
import FeedbackBanner from "@/components/shell/FeedbackBanner"
import { trackEvent } from "@/lib/analytics"

interface PaperWriteChallengeProps {
  letter: LetterContent
  onComplete: (result: { imageCaptured: boolean; passed: boolean }) => void
}

type Stage = "prompt" | "camera" | "captured" | "feedback"

export default function PaperWriteChallenge({ letter, onComplete }: PaperWriteChallengeProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stage, setStage] = useState<Stage>("prompt")
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null)

  function capture() {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
    const url = canvas.toDataURL("image/jpeg", 0.85)
    setCapturedUrl(url)
    setStage("captured")
    trackEvent("produce_attempt", { letter: letter.id, challenge: "paper", passed: true })
  }

  if (stage === "prompt") {
    return (
      <div className="flex flex-col items-center gap-8 px-4 py-8">
        <p className="text-base font-semibold text-gray-500 uppercase tracking-widest text-center">
          Paper Writing
        </p>
        <div className="flex flex-col items-center gap-3">
          <span className="text-9xl font-black text-orange-300 select-none border-4 border-dashed border-orange-200 px-8 py-4 rounded-3xl">
            {letter.character}
          </span>
          <p className="text-gray-600 text-center font-medium">
            Write <span className="font-black text-orange-500">{letter.character}</span> on paper, then hold it up to your camera.
          </p>
        </div>
        <ActionButton size="lg" onClick={() => setStage("camera")}>
          📷 Open Camera
        </ActionButton>
      </div>
    )
  }

  if (stage === "camera") {
    return (
      <div className="flex flex-col items-center gap-5 px-4 py-6">
        <p className="text-sm font-semibold text-gray-500 text-center uppercase tracking-widest">
          Hold your paper up — show the letter <span className="text-orange-500">{letter.character}</span>
        </p>
        <div className="relative w-full max-w-sm">
          <CameraView
            facingMode="environment"
            onReady={(v) => { videoRef.current = v }}
            className="aspect-[4/3] w-full"
          />
          <canvas ref={canvasRef} className="hidden" />
          {/* Corner guides */}
          <div className="absolute inset-4 border-4 border-white/50 rounded-2xl pointer-events-none" />
        </div>
        <div className="flex gap-3">
          <ActionButton size="lg" onClick={capture}>
            📸 Capture
          </ActionButton>
          <ActionButton variant="ghost" size="md" onClick={() => setStage("prompt")}>
            ← Back
          </ActionButton>
        </div>
      </div>
    )
  }

  if (stage === "captured") {
    return (
      <div className="flex flex-col items-center gap-5 px-4 py-8">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          Nice work!
        </p>
        {capturedUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedUrl}
            alt="Your writing"
            className="w-full max-w-sm rounded-2xl shadow-md"
          />
        )}
        <FeedbackBanner
          status="success"
          message={`You wrote ${letter.character}! Great job! 🌟`}
        />
        <div className="flex gap-3">
          <ActionButton
            size="lg"
            onClick={() => onComplete({ imageCaptured: true, passed: true })}
          >
            Continue →
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => { setCapturedUrl(null); setStage("camera") }}
          >
            Try again
          </ActionButton>
        </div>
      </div>
    )
  }

  return null
}
