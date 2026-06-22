"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface AppShellProps {
  children: React.ReactNode
  title?: string
  showBack?: boolean
  backHref?: string
}

export default function AppShell({
  children,
  title,
  showBack = false,
  backHref = "/",
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        {showBack && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors text-xl font-bold"
          >
            ←
          </Link>
        )}
        {title ? (
          <h1 className="text-xl font-bold text-orange-700 tracking-tight">{title}</h1>
        ) : (
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-orange-500 tracking-tight">Trace</span>
          </Link>
        )}
      </header>

      {/* Content */}
      <motion.main
        className="flex-1 flex flex-col"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.main>
    </div>
  )
}
