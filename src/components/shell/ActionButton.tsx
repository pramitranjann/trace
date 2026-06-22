"use client"

import { motion } from "framer-motion"

interface ActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}

const variants = {
  primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-md",
  secondary: "bg-white text-orange-600 border-2 border-orange-400 hover:bg-orange-50",
  ghost: "text-orange-600 hover:bg-orange-100",
}

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-xl rounded-2xl",
}

export default function ActionButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: ActionButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { scale: 1.03 }}
      className={`font-bold transition-colors ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
    >
      {children}
    </motion.button>
  )
}
