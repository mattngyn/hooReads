"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type LoadingScreenProps = {
  fileName: string | null
}

const stages = [
  { label: "Indexing text", duration: 2500 },
  { label: "Analyzing narrative structure", duration: 2000 },
  { label: "Finding most relevant scenes", duration: 2500 },
  { label: "Generating worlds", duration: 2500 },
  { label: "Finalizing", duration: 500 },
]

export function LoadingScreen({ fileName }: LoadingScreenProps) {
  const [stageIndex, setStageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 10000
    const startTime = Date.now()

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(pct)
    }, 30)

    let timeoutId: ReturnType<typeof setTimeout>

    function advanceStage(index: number) {
      if (index >= stages.length) return
      setStageIndex(index)
      timeoutId = setTimeout(() => advanceStage(index + 1), stages[index].duration)
    }

    advanceStage(0)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timeoutId)
    }
  }, [])

  const currentLabel = stages[Math.min(stageIndex, stages.length - 1)].label

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-2xl"
    >
      <div className="flex flex-col items-center gap-10">
        {/* Spinner */}
        <div className="relative flex size-28 items-center justify-center">
          {/* Pulsing rings */}
          <div className="pulse-soft absolute inset-0 rounded-full border border-foreground/10" />
          <div
            className="pulse-soft absolute inset-[-10px] rounded-full border border-foreground/5"
            style={{ animationDelay: "1s" }}
          />

          {/* Spinning arc */}
          <svg className="spin-slow absolute inset-0 size-full" viewBox="0 0 112 112">
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="70 260"
              strokeLinecap="round"
              className="text-blue"
            />
          </svg>

          {/* Center dot */}
          <div className="size-2.5 rounded-full bg-blue shadow-lg shadow-blue/30" />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            key={currentLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[15px] font-medium text-foreground"
          >
            {currentLabel}...
          </motion.p>
          {fileName && (
            <p className="text-[13px] text-muted-foreground">{fileName}</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-[3px] w-56 overflow-hidden rounded-full bg-foreground/[0.06]">
          <motion.div
            className="shimmer relative h-full rounded-full bg-blue/70"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  )
}
