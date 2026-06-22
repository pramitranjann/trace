"use client"

import { motion, AnimatePresence } from "framer-motion"

interface FeedbackBannerProps {
  status: "success" | "retry" | "info" | "error"
  message: string
  visible?: boolean
}

const styles = {
  success: "bg-green-100 border-green-400 text-green-800",
  retry: "bg-yellow-100 border-yellow-400 text-yellow-800",
  info: "bg-blue-100 border-blue-400 text-blue-800",
  error: "bg-red-100 border-red-400 text-red-800",
}

const icons = {
  success: "🎉",
  retry: "🔄",
  info: "💡",
  error: "😅",
}

export default function FeedbackBanner({
  status,
  message,
  visible = true,
}: FeedbackBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 text-base font-semibold ${styles[status]}`}
        >
          <span className="text-2xl">{icons[status]}</span>
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
