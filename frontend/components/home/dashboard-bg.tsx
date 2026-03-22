"use client"

import { useEffect, useState, useMemo } from "react"

export function DashboardBackground() {
  const [starsReady, setStarsReady] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const t = setTimeout(() => setStarsReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const moonFade = Math.max(1 - Math.min(scrollY / 350, 1), 0)

  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
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
      {/* Night sky gradient - renders immediately, no transition */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #1a2035 70%, #1e2840 100%)",
        }}
      />

      {/* Stars - only render on client to avoid hydration mismatch */}
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
          background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
          opacity: starsReady ? 1 : 0,
          transition: "opacity 2s ease-out 0.8s",
        }}
      />
      <div
        className="absolute top-[40%] -right-[5%] h-[400px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)",
          opacity: starsReady ? 1 : 0,
          transition: "opacity 2s ease-out 1.2s",
        }}
      />
      <div
        className="absolute bottom-[5%] left-[30%] h-[300px] w-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(59,130,246,0.05) 0%, transparent 70%)",
          opacity: starsReady ? 1 : 0,
          transition: "opacity 2s ease-out 1.5s",
        }}
      />

      {/* Moon - fades out on scroll */}
      <div
        className="absolute top-[8%] right-[12%]"
        style={{
          opacity: starsReady ? moonFade : 0,
          transform: starsReady
            ? `translateY(${scrollY * 0.12}px) scale(${0.85 + moonFade * 0.15})`
            : "translateY(20px) scale(0.9)",
          transition: starsReady
            ? "opacity 0.4s ease-out, transform 0.4s ease-out"
            : "opacity 1.5s ease-out 0.8s, transform 1.5s ease-out 0.8s",
        }}
      >
        <div className="relative size-16">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 40% 40%, #e8e0d0 0%, #c8bfaf 60%, #a89f90 100%)",
              boxShadow: "0 0 40px 8px rgba(232,224,208,0.15), 0 0 80px 20px rgba(232,224,208,0.06)",
            }}
          />
          <div className="absolute rounded-full" style={{ width: 6, height: 6, top: "30%", left: "25%", background: "rgba(0,0,0,0.08)" }} />
          <div className="absolute rounded-full" style={{ width: 4, height: 4, top: "55%", left: "50%", background: "rgba(0,0,0,0.06)" }} />
          <div className="absolute rounded-full" style={{ width: 3, height: 3, top: "35%", left: "60%", background: "rgba(0,0,0,0.05)" }} />
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--tw-opacity, 0.3); }
          50% { opacity: calc(var(--tw-opacity, 0.3) * 0.3); }
        }
      `}</style>
    </div>
  )
}
