"use client"

import { useEffect, useRef, useState } from "react"

interface CameraViewProps {
  facingMode?: "user" | "environment"
  mirrored?: boolean
  onReady?: (video: HTMLVideoElement) => void
  onError?: (error: Error) => void
  className?: string
}

export default function CameraView({
  facingMode = "environment",
  mirrored = false,
  onReady,
  onError,
  className = "",
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    let stream: MediaStream | null = null

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
            setStatus("ready")
            onReady?.(videoRef.current!)
          }
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Camera error")
        setStatus("error")
        if (error.name === "NotAllowedError") {
          setErrorMsg("Camera needs permission so Trace can see your writing.")
        } else if (error.name === "NotFoundError") {
          setErrorMsg("No camera found on this device.")
        } else {
          setErrorMsg("Camera couldn't start. Try refreshing.")
        }
        onError?.(error)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gray-900 ${className}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Starting camera…</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-4xl">📷</span>
            <p className="text-white text-sm font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${mirrored ? "scale-x-[-1]" : ""} ${
          status !== "ready" ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
      />
    </div>
  )
}
