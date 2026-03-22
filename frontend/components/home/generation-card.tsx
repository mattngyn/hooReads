"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Play, Sparkles } from "lucide-react"

import type { MomentDetail } from "@/lib/api/types"
import { buildBackendUrl } from "@/lib/api/generations"
import { SceneViewer } from "@/components/viewer/scene-viewer"

export type StoryMoment = MomentDetail & {
  generationId: string
}

type StoryGroupProps = {
  title: string
  moments: StoryMoment[]
}

function MomentCard({ moment }: { moment: StoryMoment }) {
  const isReady = moment.scene_status === "complete"
  
  const sceneUrl = moment.scene_asset_url
    ? buildBackendUrl(moment.scene_asset_url)
    : null

  return (
    <Link
      href={`/scenes/${moment.generationId}/${moment.moment_index}`}
      className="group relative flex aspect-video w-full flex-col justify-end overflow-hidden rounded-[32px] border border-black/5 bg-slate-100 transition-all hover:scale-[1.02] hover:shadow-xl dark:border-white/10 dark:bg-slate-900/40 sm:aspect-square"
    >
      {/* Scene Viewer - Always Active */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(249,115,22,0.1),rgba(14,165,233,0.1))]">
         {isReady && sceneUrl ? (
            <div className="h-full w-full animate-in fade-in duration-500">
               <SceneViewer
                  assetUrl={sceneUrl}
                  assetFormat={moment.scene_asset_format}
                  sceneStatus={moment.scene_status}
                  minimal
               />
            </div>
         ) : null}
      </div>
      
      {/* Icon / Status - Only show if not ready */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-300 opacity-50 dark:text-slate-600">
          <div className="size-4 rounded-full bg-slate-300" />
        </div>
      )}

      {/* Title Overlay with Gradient for readability */}
      <div className="relative pointer-events-none p-6 pt-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <h4 className="line-clamp-2 text-2xl font-bold font-heading text-white drop-shadow-md">
          {moment.title}
        </h4>
      </div>
    </Link>
  )
}

export function StoryGroup({ title, moments }: StoryGroupProps) {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8 text-center">
      <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl font-heading">
        {title}
      </h3>

      <div className="flex flex-wrap justify-center gap-8">
        {moments.length > 0 ? (
          moments.map((moment) => (
            <div key={`${moment.generationId}-${moment.moment_index}`} className="w-full sm:w-[360px]">
              <MomentCard moment={moment} />
            </div>
          ))
        ) : (
          <div className="w-full rounded-3xl border border-dashed border-slate-200 p-12 text-center text-lg text-slate-500 dark:border-slate-800 dark:text-slate-400">
            No moments woven yet.
          </div>
        )}
      </div>
    </div>
  )
}
