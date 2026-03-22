import { FileText, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

export function UploadPanel() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-900/10 bg-[linear-gradient(140deg,rgba(255,250,245,0.96),rgba(255,255,255,0.92)_55%,rgba(240,249,255,0.92))] p-6 shadow-[0_26px_90px_-54px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[linear-gradient(140deg,rgba(15,23,42,0.98),rgba(15,23,42,0.94)_55%,rgba(8,47,73,0.92))] sm:p-8">
      <div className="absolute -top-16 right-0 h-56 w-56 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-300/10" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-300/10" />

      <div className="relative space-y-6">
        <div className="space-y-4">
          <div className="text-base font-bold tracking-[0.28em] uppercase text-slate-500 dark:text-slate-400 font-heading">
            Weave New Scene
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl font-heading drop-shadow-sm">
            Import Story
          </h1>
          <p className="text-2xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Create immersive 3D moments from text.
          </p>
        </div>

        <div className="rounded-[36px] border border-dashed border-slate-900/15 bg-white/75 p-8 backdrop-blur dark:border-white/15 dark:bg-slate-950/35">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <Upload className="size-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white font-heading">
                  Drag file here
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 rounded-full px-8 text-lg">
                Choose File
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-full px-8 text-lg">
                Sample
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
