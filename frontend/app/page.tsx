"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ArrowRight } from "lucide-react"
import { LoadingScreen } from "@/components/home/loading-screen"
import { SceneryBackground } from "@/components/home/scenery-bg"
import {
  UploadIllustration,
  GenerateIllustration,
  ExploreIllustration,
} from "@/components/home/step-illustrations"

const ease = [0.16, 1, 0.3, 1] as const

export default function HomePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name)
      setIsLoading(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 10000)
    },
    [router]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen fileName={fileName} />}
      </AnimatePresence>

      {/* Dark sky transition when going to dashboard */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[100]"
            style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #111827 40%, #1a2035 70%, #1e2840 100%)" }}
          />
        )}
      </AnimatePresence>

      <main className="sky-bg relative flex min-h-svh flex-col items-center overflow-hidden">
        {/* Scenery silhouettes */}
        <SceneryBackground />

        {/* Hero section */}
        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 px-5 pt-36 pb-20 text-center sm:px-8 sm:pt-44">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-heading text-6xl tracking-[-1px] text-foreground sm:text-7xl lg:text-8xl"
            style={{ lineHeight: 1.15 }}
          >
            Sceneweaver
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-[17px]"
          >
            Transform any story into immersive 3D worlds.
            <br />
            Upload a PDF or TXT and watch scenes come alive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease }}
            className="flex items-center gap-3 pt-2"
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue px-6 text-[15px] font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.97]"
            >
              <Upload className="size-4" strokeWidth={2} />
              Upload File
            </button>

            <button
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => router.push("/dashboard"), 1400)
              }}
              className="group inline-flex h-11 items-center gap-1.5 rounded-lg px-5 text-[15px] font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Dashboard
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </button>
          </motion.div>
        </div>

        {/* Upload card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative z-10 w-full max-w-2xl px-5 sm:px-8"
        >
          <div
            className={`card-surface relative overflow-hidden rounded-3xl p-10 transition-all duration-200 sm:p-12 ${
              isDragging ? "scale-[1.01] ring-2 ring-blue/30" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-5">
              <motion.div
                animate={
                  isDragging
                    ? { scale: 1.08, y: -3 }
                    : { scale: 1, y: 0 }
                }
                transition={{ duration: 0.2 }}
                className="flex size-14 items-center justify-center rounded-2xl bg-white/50 dark:bg-white/8"
              >
                <Upload
                  className="size-6 text-foreground/40"
                  strokeWidth={1.5}
                />
              </motion.div>

              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-[15px] font-semibold tracking-[-0.2px] text-foreground/80">
                  Drop your PDF or TXT here
                </h2>
                <p className="text-[13px] text-muted-foreground">
                  or use the upload button above
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative z-10 w-full max-w-3xl px-5 py-24 sm:px-8"
        >
          <h2
            className="font-heading text-center text-3xl tracking-[-0.5px] text-foreground sm:text-4xl"
            style={{ lineHeight: 1.25 }}
          >
            3D worlds in 3 steps
          </h2>
          <p className="mt-3 text-center text-[15px] text-muted-foreground">
            The easiest way to bring your stories to life.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload",
                desc: "Drop a PDF or TXT file with any story or text.",
                illustration: <UploadIllustration />,
              },
              {
                step: "2",
                title: "Generate",
                desc: "AI finds the most vivid scenes and creates 3D worlds.",
                illustration: <GenerateIllustration />,
              },
              {
                step: "3",
                title: "Explore",
                desc: "Walk through your scenes in an immersive 3D viewer.",
                illustration: <ExploreIllustration />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div className="card-surface mb-5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl p-4">
                  {item.illustration}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.step}
                  </span>
                  <h3 className="text-base font-semibold tracking-[-0.2px] text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileInput}
          className="hidden"
        />
      </main>
    </>
  )
}
