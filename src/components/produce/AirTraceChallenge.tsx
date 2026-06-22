"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
const TRACE_DURATION = 6000   // ms of active tracing
const SMOOTHING = 0.35        // EMA alpha — lower = smoother, higher = more responsive
const MIN_DIST = 0.012        // normalized distance threshold between trail points

type TraceState = "loading" | "countdown" | "tracing" | "scored" | "error"

export default function AirTraceChallenge({ letter, onComplete }: AirTraceChallengeProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef = useRef<Point[]>([])
  const isTrackingRef = useRef(false)
  const animFrameRef = useRef<number>(0)
  const handsRef = useRef<import("@mediapipe/tasks-vision").HandLandmarker | null>(null)
  const lastVideoTimeRef = useRef(-1)
  const refPathRef = useRef(letter.tracePath)
  const lastSmoothPtRef = useRef<Point | null>(null)
  const canvasSizeRef = useRef({ w: 0, h: 0 })

  const [traceState, setTraceState] = useState<TraceState>("loading")
  const [countdown, setCountdown] = useState(3)
  const [score, setScore] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(TRACE_DURATION / 1000)
  const [errorMsg, setErrorMsg] = useState("")
  const [handVisible, setHandVisible] = useState(false)

  useEffect(() => {
    refPathRef.current = letter.tracePath
  }, [letter])

  const finishTrace = useCallback(() => {
    isTrackingRef.current = false
    const trail = trailRef.current
    if (trail.length < 5) {
      setScore(0)
      setTraceState("scored")
      return
    }
    const s = comparePaths(trail, letter.tracePath)
    setScore(s)
    setTraceState("scored")
    const passed = s >= PASS_THRESHOLD
    trackEvent("produce_attempt", { letter: letter.id, challenge: "air", score: s, passed })
  }, [letter])

  const beginTrace = useCallback(() => {
    trailRef.current = []
    lastSmoothPtRef.current = null
    isTrackingRef.current = true
    setScore(null)
    setTimeLeft(TRACE_DURATION / 1000)
    setTraceState("tracing")

    const start = performance.now()
    const timerInterval = setInterval(() => {
      const elapsed = performance.now() - start
      const remaining = Math.max(0, (TRACE_DURATION - elapsed) / 1000)
      setTimeLeft(remaining)
      if (remaining <= 0) clearInterval(timerInterval)
    }, 100)

    setTimeout(() => {
      clearInterval(timerInterval)
      finishTrace()
    }, TRACE_DURATION)
  }, [finishTrace])

  // Draw + track loops — started once when camera is ready
  const startLoops = useCallback((video: HTMLVideoElement) => {
    let running = true

    function drawLoop() {
      if (!running) return
      const canvas = canvasRef.current
      if (!canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(drawLoop)
        return
      }
      const ctx = canvas.getContext("2d")
      if (!ctx) { animFrameRef.current = requestAnimationFrame(drawLoop); return }

      // Only update dimensions when they actually change
      const vw = video.videoWidth || 320
      const vh = video.videoHeight || 240
      if (canvasSizeRef.current.w !== vw || canvasSizeRef.current.h !== vh) {
        canvas.width = vw
        canvas.height = vh
        canvasSizeRef.current = { w: vw, h: vh }
      }

      const { w, h } = canvasSizeRef.current
      ctx.clearRect(0, 0, w, h)

      // Mirrored video feed
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(video, -w, 0, w, h)
      ctx.restore()

      // Dashed ghost reference path
      const refPath = refPathRef.current
      ctx.strokeStyle = "rgba(255,255,255,0.6)"
      ctx.lineWidth = Math.max(6, w * 0.018)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.setLineDash([10, 7])
      ctx.beginPath()
      refPath.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x * w, pt.y * h)
        else ctx.lineTo(pt.x * w, pt.y * h)
      })
      ctx.stroke()
      ctx.setLineDash([])

      // Smooth user trail using quadratic curves
      const trail = trailRef.current
      if (trail.length > 1) {
        ctx.strokeStyle = "#fb923c"
        ctx.lineWidth = Math.max(5, w * 0.016)
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.beginPath()
        ctx.moveTo(trail[0].x * w, trail[0].y * h)
        for (let i = 1; i < trail.length - 1; i++) {
          const mx = ((trail[i].x + trail[i + 1].x) / 2) * w
          const my = ((trail[i].y + trail[i + 1].y) / 2) * h
          ctx.quadraticCurveTo(trail[i].x * w, trail[i].y * h, mx, my)
        }
        const last = trail[trail.length - 1]
        ctx.lineTo(last.x * w, last.y * h)
        ctx.stroke()

        // Fingertip dot
        ctx.beginPath()
        ctx.arc(last.x * w, last.y * h, Math.max(8, w * 0.025), 0, Math.PI * 2)
        ctx.fillStyle = "#f97316"
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(drawLoop)
    }

    function trackLoop() {
      if (!running) return
      const hands = handsRef.current
      if (hands && video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime
        const result = hands.detectForVideo(video, performance.now())
        const hasHand = result.landmarks?.length > 0
        setHandVisible(hasHand)

        if (hasHand) {
          const tip = result.landmarks[0][8]
          const raw: Point = { x: 1 - tip.x, y: tip.y }
          const prev = lastSmoothPtRef.current
          const smoothed: Point = prev
            ? { x: SMOOTHING * raw.x + (1 - SMOOTHING) * prev.x, y: SMOOTHING * raw.y + (1 - SMOOTHING) * prev.y }
            : raw
          lastSmoothPtRef.current = smoothed

          if (isTrackingRef.current) {
            const trail = trailRef.current
            if (trail.length === 0) {
              trail.push(smoothed)
            } else {
              const last = trail[trail.length - 1]
              const dx = smoothed.x - last.x
              const dy = smoothed.y - last.y
              if (Math.sqrt(dx * dx + dy * dy) >= MIN_DIST) {
                trail.push(smoothed)
              }
            }
          }
        } else {
          lastSmoothPtRef.current = null
        }
      }
      requestAnimationFrame(trackLoop)
    }

    drawLoop()
    trackLoop()
    return () => { running = false }
  }, [])

  // Camera + MediaPipe init
  useEffect(() => {
    let stream: MediaStream | null = null
    let stopLoops: (() => void) | null = null
    let running = true

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
          minHandDetectionConfidence: 0.6,
          minHandPresenceConfidence: 0.6,
          minTrackingConfidence: 0.5,
        })
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        })
        if (!running) { stream.getTracks().forEach((t) => t.stop()); return }
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            stopLoops = startLoops(videoRef.current!)
            // Async to avoid calling setState synchronously in effect body
            setTimeout(() => {
              setTraceState("countdown")
              setCountdown(3)
            }, 0)
          }
        }
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Camera error")
        setTraceState("error")
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
      stopLoops?.()
      stream?.getTracks().forEach((t) => t.stop())
      handsRef.current?.close()
    }
  }, [startLoops])

  // Countdown tick — runs whenever traceState is "countdown"
  useEffect(() => {
    if (traceState !== "countdown") return
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [traceState])

  // When countdown hits 0, begin tracing after a brief "Go!" flash
  useEffect(() => {
    if (traceState !== "countdown" || countdown !== 0) return
    const t = setTimeout(() => beginTrace(), 600)
    return () => clearTimeout(t)
  }, [traceState, countdown, beginTrace])

  function retry() {
    trailRef.current = []
    lastSmoothPtRef.current = null
    isTrackingRef.current = false
    setScore(null)
    setCountdown(3)
    setTraceState("countdown")
  }

  const canvasHidden = traceState === "loading" || traceState === "error"

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-4">
      <p className="text-base font-semibold text-gray-500 uppercase tracking-widest text-center">
        Air trace <span className="text-orange-500">{letter.character}</span>
        <span className="ml-2">{letter.emoji}</span>
      </p>

      <div className="relative w-full max-w-sm">
        {traceState === "loading" && (
          <div className="aspect-[4/3] flex items-center justify-center bg-gray-900 rounded-2xl">
            <div className="flex flex-col items-center gap-2 text-white">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading hand tracker…</span>
            </div>
          </div>
        )}
        {traceState === "error" && (
          <div className="aspect-[4/3] flex items-center justify-center bg-gray-900 rounded-2xl p-6">
            <p className="text-white text-sm text-center">{errorMsg}</p>
          </div>
        )}

        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
        <canvas ref={canvasRef} className={`w-full rounded-2xl ${canvasHidden ? "hidden" : ""}`} />

        {/* Countdown overlay */}
        <AnimatePresence>
          {traceState === "countdown" && (
            <motion.div
              key={countdown === 0 ? "go" : countdown}
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40"
            >
              <span className="text-9xl font-black text-white drop-shadow-lg select-none">
                {countdown > 0 ? countdown : "Go!"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tracing progress bar */}
        {traceState === "tracing" && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/30 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-b-2xl"
              style={{ width: `${(timeLeft / (TRACE_DURATION / 1000)) * 100}%`, transition: "width 0.1s linear" }}
            />
          </div>
        )}

        {/* "Show your hand" hint */}
        {traceState === "tracing" && !handVisible && (
          <div className="absolute top-3 left-0 right-0 flex justify-center">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full font-medium">
              Show your hand ✋
            </span>
          </div>
        )}
      </div>

      {traceState === "tracing" && (
        <p className="text-sm font-semibold text-orange-500">
          Trace the white dashed path with your finger!
        </p>
      )}

      {traceState === "scored" && score !== null && (
        <div className="flex flex-col items-center gap-4 w-full">
          <FeedbackBanner
            status={score >= PASS_THRESHOLD ? "success" : "retry"}
            message={
              score >= PASS_THRESHOLD
                ? `Great trace! ${Math.round(score * 100)}% 🌟`
                : `Nice try! ${Math.round(score * 100)}% — try again!`
            }
          />
          <div className="flex gap-3">
            {score >= PASS_THRESHOLD ? (
              <ActionButton size="lg" onClick={() => onComplete({ score, passed: true })}>
                Continue →
              </ActionButton>
            ) : (
              <ActionButton size="lg" onClick={retry}>
                Try again
              </ActionButton>
            )}
            <ActionButton variant="ghost" onClick={() => onComplete({ score, passed: score >= PASS_THRESHOLD })}>
              Skip
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  )
}
