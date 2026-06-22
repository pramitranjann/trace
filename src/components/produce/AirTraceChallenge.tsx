"use client"

import { useRef, useEffect, useState } from "react"
import type { LetterContent, Point } from "@/types/trace"
import { comparePaths } from "@/lib/pathCompare"
import FeedbackBanner from "@/components/shell/FeedbackBanner"
import ActionButton from "@/components/shell/ActionButton"
import { trackEvent } from "@/lib/analytics"

interface AirTraceChallengeProps {
  letter: LetterContent
  onComplete: (result: { score: number; passed: boolean }) => void
}

const PASS_THRESHOLD = 0.35

export default function AirTraceChallenge({ letter, onComplete }: AirTraceChallengeProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef = useRef<Point[]>([])
  const isTrackingRef = useRef(false)
  const animFrameRef = useRef<number>(0)
  const handsRef = useRef<import("@mediapipe/tasks-vision").HandLandmarker | null>(null)
  const lastVideoTimeRef = useRef(-1)
  const refPathRef = useRef(letter.tracePath)

  const [cameraStatus, setCameraStatus] = useState<"loading" | "ready" | "error">("loading")
  const [isTracking, setIsTracking] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    let stream: MediaStream | null = null
    let running = true

    function drawLoop() {
      if (!running) return
      const canvas = canvasRef.current
      const video = videoRef.current
      if (canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          canvas.width = video.videoWidth || 320
          canvas.height = video.videoHeight || 240
          ctx.save()
          ctx.scale(-1, 1)
          ctx.drawImage(video, -canvas.width, 0)
          ctx.restore()

          // Ghost reference path
          const refPath = refPathRef.current
          ctx.strokeStyle = "rgba(251, 146, 60, 0.4)"
          ctx.lineWidth = 6
          ctx.lineCap = "round"
          ctx.lineJoin = "round"
          ctx.beginPath()
          refPath.forEach((pt, i) => {
            const px = pt.x * canvas.width
            const py = pt.y * canvas.height
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          })
          ctx.stroke()

          // User trail
          const trail = trailRef.current
          if (trail.length > 1) {
            ctx.strokeStyle = "#f97316"
            ctx.lineWidth = 5
            ctx.beginPath()
            trail.forEach((pt, i) => {
              const px = pt.x * canvas.width
              const py = pt.y * canvas.height
              if (i === 0) ctx.moveTo(px, py)
              else ctx.lineTo(px, py)
            })
            ctx.stroke()
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(drawLoop)
    }

    function trackLoop() {
      if (!running) return
      const video = videoRef.current
      const hands = handsRef.current
      if (video && hands && video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime
        const result = hands.detectForVideo(video, performance.now())
        if (result.landmarks?.length > 0) {
          const tip = result.landmarks[0][8]
          const pt: Point = { x: 1 - tip.x, y: tip.y }
          if (isTrackingRef.current) {
            trailRef.current = [...trailRef.current, pt]
          }
        }
      }
      requestAnimationFrame(trackLoop)
    }

    async function init() {
      try {
        const { HandLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision")
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        )
        handsRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        })
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setCameraStatus("ready")
            drawLoop()
            trackLoop()
          }
        }
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Camera error")
        setCameraStatus("error")
        setErrorMsg(
          e.name === "NotAllowedError"
            ? "Camera needs permission so Trace can see your hand."
            : "Camera couldn't start. Try refreshing."
        )
      }
    }

    init()
    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      stream?.getTracks().forEach((t) => t.stop())
      handsRef.current?.close()
    }
  }, [])

  function startTrace() {
    trailRef.current = []
    isTrackingRef.current = true
    setIsTracking(true)
    setScore(null)
  }

  function stopTrace() {
    isTrackingRef.current = false
    setIsTracking(false)
    const trail = trailRef.current
    if (trail.length < 5) { setScore(0); return }
    const s = comparePaths(trail, letter.tracePath)
    setScore(s)
    const passed = s >= PASS_THRESHOLD
    trackEvent("produce_attempt", { letter: letter.id, challenge: "air", score: s, passed })
    setTimeout(() => onComplete({ score: s, passed }), 1500)
  }

  function reset() {
    trailRef.current = []
    isTrackingRef.current = false
    setScore(null)
    setIsTracking(false)
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-6">
      <p className="text-base font-semibold text-gray-500 uppercase tracking-widest text-center">
        Air trace the letter <span className="text-orange-500">{letter.character}</span>
      </p>

      <div className="relative w-full max-w-sm">
        {cameraStatus === "loading" && (
          <div className="aspect-[4/3] flex items-center justify-center bg-gray-900 rounded-2xl">
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Starting camera…</span>
            </div>
          </div>
        )}
        {cameraStatus === "error" && (
          <div className="aspect-[4/3] flex items-center justify-center bg-gray-900 rounded-2xl p-6">
            <p className="text-white text-sm text-center">{errorMsg}</p>
          </div>
        )}
        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
        <canvas
          ref={canvasRef}
          className={`w-full rounded-2xl ${cameraStatus !== "ready" ? "hidden" : ""}`}
        />
      </div>

      {cameraStatus === "ready" && (
        <>
          <p className="text-xs text-gray-400 text-center">
            The faint orange path is your guide. Trace it with your finger in the air!
          </p>
          <div className="flex gap-3">
            {!isTracking ? (
              <ActionButton onClick={startTrace} size="lg">
                ✋ Start Tracing
              </ActionButton>
            ) : (
              <ActionButton onClick={stopTrace} variant="secondary" size="lg">
                ⏹ Done
              </ActionButton>
            )}
            <ActionButton onClick={reset} variant="ghost" size="md">
              Reset
            </ActionButton>
          </div>

          {score !== null && (
            <FeedbackBanner
              status={score >= PASS_THRESHOLD ? "success" : "retry"}
              message={
                score >= PASS_THRESHOLD
                  ? `Amazing trace! Score: ${Math.round(score * 100)}% 🌟`
                  : `Good try! Score: ${Math.round(score * 100)}%. Try again!`
              }
            />
          )}
        </>
      )}
    </div>
  )
}
