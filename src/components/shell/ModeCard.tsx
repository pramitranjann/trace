"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface ModeCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  bgColor: string
  buttonColor?: string
}

export default function ModeCard({
  title,
  description,
  icon,
  href,
  color,
  bgColor,
  buttonColor = "bg-orange-500",
}: ModeCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        className={`flex flex-col gap-3 p-6 rounded-3xl ${bgColor} border-2 ${color} shadow-sm hover:shadow-md transition-shadow`}
      >
        <div className="text-5xl">{icon}</div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        </div>
        <div className={`self-start mt-1 px-4 py-1.5 rounded-full text-sm font-bold text-white ${buttonColor}`}>
          Start →
        </div>
      </Link>
    </motion.div>
  )
}
