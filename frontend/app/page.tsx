import { Library, Plus } from "lucide-react"

import { StoryGroup, type StoryMoment } from "@/components/home/generation-card"
import { UploadPanel } from "@/components/home/upload-panel"
import { Button } from "@/components/ui/button"
import { getGeneration, listGenerations } from "@/lib/api/generations"
import type { GenerationDetail } from "@/lib/api/types"

async function loadGenerationsWithMoments(): Promise<{
  generations: GenerationDetail[]
  error: string | null
}> {
  try {
    const summaries = await listGenerations()
    const generations = await Promise.all(
      summaries.map((generation) => getGeneration(generation.id))
    )

    return { generations, error: null }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load generations from the backend."

    return { generations: [], error: message }
  }
}

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

export default async function Page() {
  const { generations, error } = await loadGenerationsWithMoments()

  // Group generations by title (Book)
  const stories = generations.reduce<Record<string, { title: string; moments: StoryMoment[] }>>((acc, gen) => {
    const title = normalizeStoryTitle(gen.title)
    
    if (!acc[title]) {
      acc[title] = { title, moments: [] }
    }
    
    // Add moments with generationId
    const enrichedMoments = gen.moments.map(m => ({ ...m, generationId: gen.id }))
    acc[title].moments.push(...enrichedMoments)
    
    return acc
  }, {})

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,rgba(248,250,252,1),rgba(241,245,249,0.92))] px-4 py-6 dark:bg-[linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,0.96))] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-[24px] border border-white/40 bg-white/65 px-8 pt-8 pb-6 shadow-[0_14px_50px_-40px_rgba(15,23,42,0.4)] backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl dark:from-white dark:to-slate-200">
               <span className="text-3xl text-white dark:text-slate-900">✨</span>
            </div>
            <div className="text-5xl font-bold tracking-[0.02em] text-slate-900 dark:text-white font-heading sm:text-6xl drop-shadow-sm">
              Scene Weaver
            </div>
          </div>
        </header>

        <UploadPanel />

        <section className="space-y-8">
          {error ? (
            <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/8 p-5 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </div>
          ) : null}

          {!error && Object.keys(stories).length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-900/12 bg-white/60 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/4 dark:text-slate-300">
              No generations found in the backend yet.
            </div>
          ) : null}

          <div className="space-y-12">
            {Object.values(stories).map((story) => (
              <StoryGroup key={story.title} title={story.title} moments={story.moments} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
