"use client"

import { motion, useReducedMotion } from "framer-motion"
import React from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  )
}
