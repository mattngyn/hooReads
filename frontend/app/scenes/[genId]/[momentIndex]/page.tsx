import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, FileAudio2 } from "lucide-react"
import { notFound } from "next/navigation"

import { AudioPlayer } from "@/components/viewer/audio-player"
import { SceneViewer } from "@/components/viewer/scene-viewer"
import {
  buildBackendUrl,
  getGeneration,
  getMoment,
} from "@/lib/api/generations"

// Helper to normalize inconsistent story titles from backend
function normalizeStoryTitle(title: string | null): string {
  const rawTitle = (title || "Untitled Story").trim()
  
  // Specific overrides based on user request
  if (rawTitle.toLowerCase().includes("laundry room refuge")) {
    return "Ready Player One"
  }
  if (rawTitle.toLowerCase().includes("mark on the green door")) {
    return "The Hobbit"
  }
  
  return rawTitle
}

// Helper to repair common title typos
function cleanMomentTitle(title: string): string {
  if (title.startsWith("he ")) {
    return "T" + title.slice(1)
  }
  return title
}

type ScenePageProps = {
  params: Promise<{
    genId: string
    momentIndex: string
  }>
}

export default async function ScenePage({ params }: ScenePageProps) {
  const { genId, momentIndex } = await params
  const momentNumber = Number(momentIndex)

  if (!Number.isInteger(momentNumber) || momentNumber < 1) {
    notFound()
  }

  const [generation, moment] = await Promise.all([
    getGeneration(genId),
    getMoment(genId, momentNumber),
  ]).catch(() => [null, null] as const)

  if (!generation || !moment) {
    notFound()
  }

  const currentIndex = generation.moments.findIndex(
    (candidate) => candidate.moment_index === momentNumber
  )
  const previousMoment = currentIndex > 0 ? generation.moments[currentIndex - 1] : null
  const nextMoment =
    currentIndex >= 0 && currentIndex < generation.moments.length - 1
      ? generation.moments[currentIndex + 1]
      : null

  const sceneUrl = moment.scene_asset_url
    ? buildBackendUrl(moment.scene_asset_url)
    : null
  const audioUrl = buildBackendUrl(
    `/api/generations/${genId}/scenes/${momentNumber}/audio`
  )

  const bookTitle = normalizeStoryTitle(generation.title || moment.title)

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(241,245,249,0.92))] px-4 py-6 dark:bg-[linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,0.96))] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/6 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
            Back to generations
          </Link>

          <div className="flex flex-wrap gap-2">
            {previousMoment ? (
              <Link
                href={`/scenes/${genId}/${previousMoment.moment_index}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/6 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Link>
            ) : null}
            {nextMoment ? (
              <Link
                href={`/scenes/${genId}/${nextMoment.moment_index}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/6 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Next
                <ChevronRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl md:text-7xl">
              {bookTitle}
            </h1>
            <p className="text-2xl font-medium text-slate-500 dark:text-slate-400 sm:text-3xl">
              {cleanMomentTitle(moment.title)}
            </p>
          </div>

          <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="relative mx-auto w-full overflow-hidden rounded-[40px] border border-white/20 shadow-2xl">
              <SceneViewer
                assetUrl={moment.scene_status === "complete" ? sceneUrl : null}
                assetFormat={moment.scene_asset_format}
                sceneStatus={moment.scene_status}
              />
            </div>

             {/* Audio Player - Centered Below */}
            {moment.audio_status === "complete" ? (
               <div className="mx-auto w-full max-w-2xl rounded-full border border-black/5 bg-white/80 px-6 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                  <AudioPlayer src={audioUrl} autoPlay />
               </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
