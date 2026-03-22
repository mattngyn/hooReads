"use client"

import { useEffect, useState, useMemo } from "react"

export function SceneBackground() {
  const [starsReady, setStarsReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const t = setTimeout(() => setStarsReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 0.5,
      opacity: Math.random() * 0.5 + 0.15,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }))
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Night sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #1a2035 70%, #1e2840 100%)",
        }}
      />

      {/* Stars */}
      {isMounted && stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: starsReady ? star.opacity : 0,
            transition: `opacity ${0.8 + star.delay * 0.3}s ease-out ${star.delay * 0.2}s`,
            animation: starsReady
              ? `twinkle ${star.duration}s ease-in-out ${star.delay + 1}s infinite`
              : "none",
          }}
        />
      ))}

      {/* Nebula washes */}
      <div
        className="absolute top-[10%] -left-[10%] h-[500px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
          opacity: starsReady ? 1 : 0,
          transition: "opacity 2s ease-out 0.8s",
        }}
      />
      <div
        className="absolute top-[40%] -right-[5%] h-[400px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)",
          opacity: starsReady ? 1 : 0,
          transition: "opacity 2s ease-out 1.2s",
        }}
      />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--tw-opacity, 0.3); }
          50% { opacity: calc(var(--tw-opacity, 0.3) * 0.3); }
        }
      `}</style>
    </div>
  )
}
