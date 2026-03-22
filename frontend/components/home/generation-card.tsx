"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import type { MomentDetail } from "@/lib/api/types"
import { buildBackendUrl } from "@/lib/api/generations"
import { SceneViewer } from "@/components/viewer/scene-viewer"

export type StoryMoment = MomentDetail & {
  generationId: string
}

type StoryGroupProps = {
  title: string
  moments: StoryMoment[]
  darkMode?: boolean
}

// Shared transition state so only one overlay shows at a time
let globalSetTransition: ((v: boolean) => void) | null = null

export function SceneTransitionOverlay() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    globalSetTransition = setActive
    return () => { globalSetTransition = null }
  }, [])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100]"
          style={{
            background: "linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #1a2035 70%, #1e2840 100%)",
          }}
        />
      )}
    </AnimatePresence>
  )
}

function MomentCard({
  moment,
  featured = false,
  noFlip = false,
  index = 0,
}: {
  moment: StoryMoment
  featured?: boolean
  noFlip?: boolean
  index?: number
}) {
  const router = useRouter()
  const isReady = moment.scene_status === "complete"
  const sceneUrl = moment.scene_asset_url
    ? buildBackendUrl(moment.scene_asset_url)
    : null

  const ref = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !isReady || !sceneUrl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "100px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isReady, sceneUrl])

  const handleClick = useCallback(() => {
    globalSetTransition?.(true)
    setTimeout(() => {
      router.push(`/scenes/${moment.generationId}/${moment.moment_index}`)
    }, 900)
  }, [router, moment.generationId, moment.moment_index])

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`group relative flex w-full cursor-pointer flex-col justify-end overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 ${
        featured ? "aspect-[16/9]" : "aspect-[4/3]"
      }`}
      style={{ minHeight: featured ? 320 : 220 }}
    >
      {/* 3D Scene or placeholder */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl bg-neutral-900">
        {isReady && sceneUrl && shouldLoad ? (
          <SceneViewer
            assetUrl={sceneUrl}
            assetFormat={moment.scene_asset_format}
            sceneStatus={moment.scene_status}
            minimal
            noFlip={noFlip}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/5">
              <Play className="size-4 text-white/20" strokeWidth={1.5} />
            </div>
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

      {/* Title */}
      <div className="relative z-10 bg-gradient-to-t from-black/70 via-black/35 to-transparent p-5 pt-16">
        <p
          className={`font-semibold leading-snug text-white drop-shadow-sm ${
            featured ? "text-lg" : "text-[14px]"
          }`}
        >
          {moment.title}
        </p>
        {moment.scene_description && (
          <p
            className={`mt-1 text-[13px] leading-relaxed text-white/55 ${
              featured ? "line-clamp-2" : "line-clamp-1"
            }`}
          >
            {moment.scene_description}
          </p>
        )}
      </div>
    </div>
  )
}

function isGreenDoor(moment: StoryMoment): boolean {
  return moment.title.toLowerCase().includes("green door") ||
    moment.title.toLowerCase().includes("mark on")
}

export function StoryGroup({ title, moments, darkMode = false }: StoryGroupProps) {
  const featured = moments[0]
  const rest = moments.slice(1)

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h3 className={`font-heading text-2xl tracking-[-0.3px] sm:text-3xl ${
          darkMode ? "text-white" : "text-foreground"
        }`}>
          {title}
        </h3>
        <span className={`text-[13px] ${darkMode ? "text-white/40" : "text-muted-foreground"}`}>
          {moments.length} {moments.length === 1 ? "scene" : "scenes"}
        </span>
      </div>

      {moments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {featured && (
            <div className={rest.length > 0 ? "lg:row-span-2" : ""}>
              <MomentCard moment={featured} featured noFlip={isGreenDoor(featured)} index={0} />
            </div>
          )}

          {rest.map((moment, i) => (
            <MomentCard
              key={`${moment.generationId}-${moment.moment_index}`}
              moment={moment}
              noFlip={isGreenDoor(moment)}
              index={i + 1}
            />
          ))}
        </div>
      ) : (
        <div className={`flex items-center justify-center rounded-2xl border p-10 text-sm ${
          darkMode
            ? "border-white/10 bg-white/5 text-white/40"
            : "card-surface text-muted-foreground"
        }`}>
          No moments generated yet.
        </div>
      )}
    </div>
  )
}
