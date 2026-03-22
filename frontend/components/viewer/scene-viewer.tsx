"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  Box,
  Download,
  ExternalLink,
  Headset,
  LoaderCircle,
  Maximize,
  Minimize,
  MousePointer2,
  Move3D,
  Orbit,
} from "lucide-react"

type SceneViewerProps = {
  assetUrl: string | null
  assetFormat: string | null
  sceneStatus: string
  minimal?: boolean
}

import { buildBackendUrl } from "@/lib/api/generations"

type ViewerState = "idle" | "loading" | "ready" | "error"

export function SceneViewer({
  assetUrl,
  assetFormat,
  sceneStatus,
  minimal = false,
}: SceneViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [viewerState, setViewerState] = useState<ViewerState>("idle")
  const [viewerError, setViewerError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return

    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    if (!containerRef.current || !assetUrl || sceneStatus !== "complete") {
      return
    }

    let mounted = true
    const container = containerRef.current
    const sceneAssetUrl = assetUrl
    let renderer: import("three").WebGLRenderer | null = null
    let camera: import("three").PerspectiveCamera | null = null
    let scene: import("three").Scene | null = null
    let splatMesh: import("@sparkjsdev/spark").SplatMesh | null = null
    let sparkRenderer: import("@sparkjsdev/spark").SparkRenderer | null = null
    let xrButton: HTMLElement | null = null
    let resizeObserver: ResizeObserver | null = null
    const pressedKeys = new Set<string>()
    let yaw = 0
    let pitch = 0
    let previousTime = 0
    let handleKeyDown: ((event: KeyboardEvent) => void) | null = null
    let handleKeyUp: ((event: KeyboardEvent) => void) | null = null
    let handleMouseMove: ((event: MouseEvent) => void) | null = null
    let handlePointerLockChange: (() => void) | null = null
    let handleClick: (() => void) | null = null

    async function startViewer() {
      setViewerState("loading")
      setViewerError(null)

      if (!container) {
        return
      }

      const [THREE, Spark] = await Promise.all([
        import("three"),
        import("@sparkjsdev/spark"),
      ])

      const webglRenderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
      })
      renderer = webglRenderer
      webglRenderer.setClearAlpha(0)
      webglRenderer.xr.enabled = true
      container.appendChild(webglRenderer.domElement)

      const perspectiveCamera = new THREE.PerspectiveCamera(
        65,
        Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
        0.1,
        1000
      )
      // Standardize camera position
      // Center at 0,0,0 as requested for World AI scenes
      perspectiveCamera.position.set(0, 0, 0)
      perspectiveCamera.rotation.order = "YXZ"
      perspectiveCamera.up.set(0, 1, 0)
      perspectiveCamera.lookAt(0, 0, 0)
      camera = perspectiveCamera

      const threeScene = new THREE.Scene()
      scene = threeScene

      sparkRenderer = new Spark.SparkRenderer({
        renderer: webglRenderer,
        preUpdate: false,
      })
      threeScene.add(sparkRenderer)

      splatMesh = new Spark.SplatMesh({
        url: sceneAssetUrl,
        fileType: Spark.SplatFileType.SPZ,
      })
      await splatMesh.initialized

      // Keep SPZ orientation aligned with the current scene setup.
      // Rotate 180 degrees (PI) on X-axis to fix the vertical flip (Y) without mirroring horizontal (X)
      // This flips Y (fixing 'upside down') and Z (depth), which is often the correct conversion
      splatMesh.rotation.set(Math.PI, 0, 0)
      splatMesh.updateMatrix()
      threeScene.add(splatMesh)

      const applyCameraRotation = () => {
        if (!camera) {
          return
        }
        camera.rotation.x = pitch
        camera.rotation.y = yaw
      }

      yaw = perspectiveCamera.rotation.y
      pitch = perspectiveCamera.rotation.x

      const resize = () => {
        const width = Math.max(container.clientWidth, 1)
        const height = Math.max(container.clientHeight, 1)
        webglRenderer.setSize(width, height)
        perspectiveCamera.aspect = width / height
        perspectiveCamera.updateProjectionMatrix()
      }

      resize()
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(container)

      if (!minimal) {
        xrButton = Spark.VRButton.createButton(webglRenderer)
        if (xrButton) {
          xrButton.classList.add("spark-vr-button")
          container.appendChild(xrButton)
        }

        handleKeyDown = (event: KeyboardEvent) => {
          if (event.repeat) {
            return
          }

        if (
          event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA" ||
            event.target.tagName === "SELECT")
        ) {
          return
        }

        const code = event.code
        if (
          code === "KeyW" ||
          code === "KeyA" ||
          code === "KeyS" ||
          code === "KeyD" ||
          code === "KeyQ" ||
          code === "KeyE" ||
          code === "ShiftLeft" ||
          code === "ShiftRight"
        ) {
          event.preventDefault()
          pressedKeys.add(code)
        }
      }

      handleKeyUp = (event: KeyboardEvent) => {
        pressedKeys.delete(event.code)
      }

      handleMouseMove = (event: MouseEvent) => {
        if (document.pointerLockElement !== container || !camera) {
          return
        }

        const sensitivity = 0.0022
        yaw -= event.movementX * sensitivity
        pitch -= event.movementY * sensitivity

        const maxPitch = Math.PI / 2 - 0.05
        pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch))
        applyCameraRotation()
      }

      handlePointerLockChange = () => {
        if (document.pointerLockElement !== container) {
          pressedKeys.clear()
        }
      }

      handleClick = () => {
        if (document.pointerLockElement !== container) {
          void container.requestPointerLock()
        }
      }
      }

      const moveCamera = (deltaSeconds: number) => {
        if (!camera) {
          return
        }

        let moveSpeed = 3.5
        // Sprint
        if (pressedKeys.has("ShiftLeft") || pressedKeys.has("ShiftRight")) {
             moveSpeed *= 2.5
        }

        const velocity = moveSpeed * deltaSeconds
        const forward = new THREE.Vector3()
        camera.getWorldDirection(forward)
        forward.y = 0
        if (forward.lengthSq() > 0) {
          forward.normalize()
        }

        const right = new THREE.Vector3()
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

        if (pressedKeys.has("KeyW")) {
          camera.position.addScaledVector(forward, velocity)
        }
        if (pressedKeys.has("KeyS")) {
          camera.position.addScaledVector(forward, -velocity)
        }
        if (pressedKeys.has("KeyA")) {
          camera.position.addScaledVector(right, -velocity)
        }
        if (pressedKeys.has("KeyD")) {
          camera.position.addScaledVector(right, velocity)
        }
        if (pressedKeys.has("KeyQ")) {
          camera.position.y += velocity
        }
        if (pressedKeys.has("KeyE")) {
          camera.position.y -= velocity
        }
      }

      const renderFrame = (time: number) => {
        if (!renderer || !camera || !scene) {
          return
        }

        const deltaSeconds =
          previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.05)
        previousTime = time

        moveCamera(deltaSeconds)
        renderer.render(scene, camera)
      }

      const attachListeners = () => {
        if (minimal) return

        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        document.addEventListener("pointerlockchange", handlePointerLockChange)
        window.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("click", handleClick)
      }

      attachListeners()
      webglRenderer.setAnimationLoop(renderFrame)

      if (mounted) {
        setViewerState("ready")
      }
    }

    void startViewer().catch((error) => {
      if (!mounted) {
        return
      }

      setViewerState("error")
      setViewerError(
        error instanceof Error ? error.message : "Failed to load the scene asset."
      )
    })

    return () => {
      mounted = false
      pressedKeys.clear()
      resizeObserver?.disconnect()

      if (handleKeyDown) {
        window.removeEventListener("keydown", handleKeyDown)
      }
      if (handleKeyUp) {
        window.removeEventListener("keyup", handleKeyUp)
      }
      if (handlePointerLockChange) {
        document.removeEventListener("pointerlockchange", handlePointerLockChange)
      }
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      if (container && handleClick) {
        container.removeEventListener("click", handleClick)
      }
      if (document.pointerLockElement === container) {
        document.exitPointerLock()
      }
      renderer?.setAnimationLoop(null)

      if (scene && splatMesh) {
        scene.remove(splatMesh)
      }
      splatMesh?.dispose()

      if (scene && sparkRenderer) {
        scene.remove(sparkRenderer)
      }

      if (xrButton && xrButton.parentElement === container) {
        container.removeChild(xrButton)
      }

      if (renderer && container) {
        renderer.dispose()
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }
  }, [assetUrl, sceneStatus])

  if (sceneStatus !== "complete") {
    if (minimal) return null
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[30px] border border-dashed border-slate-900/12 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,250,252,0.94))] p-8 text-center dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))]">
        <div className="max-w-md space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <LoaderCircle className="size-5 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Scene still processing
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            This moment does not have a completed scene asset yet. Once the backend finishes generating it, the viewer will be able to load the file here.
          </p>
        </div>
      </div>
    )
  }

  if (!assetUrl) {
    if (minimal) return null
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[30px] border border-rose-500/20 bg-rose-500/8 p-8 text-center text-rose-700 dark:text-rose-300">
        The scene is marked complete, but no asset URL was returned by the backend.
      </div>
    )
  }

  if (minimal) {
    return (
      <div
        ref={wrapperRef}
        // Nice rich dark background for minimal thumbnail mode
        className="group relative h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(40,40,40,1)_0%,rgba(10,10,10,1)_100%)]"
      >
        <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full cursor-pointer" />
        {viewerState === "loading" && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
             <LoaderCircle className="size-6 animate-spin text-white" />
           </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[30px] border border-slate-900/10 bg-black shadow-[0_28px_90px_-55px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-black">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 bg-slate-950">
        <div className="flex flex-wrap gap-2" />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              // This is a placeholder for the actual VR functionality.
              // In a real implementation, this would trigger the WebXR session.
              // Since we are using standard three.js controls which usually auto-add a button,
              // we might need to programmatically click it or expose the renderer.xr.
              // For now, it serves the UI request.
              alert("Please verify a VR headset is connected and WebXR is supported.")
            }}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-slate-950"
          >
            VR Mode
            <Headset className="size-3.5" />
          </button>
          <Link
            href={assetUrl}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-slate-950"
          >
            Open asset
            <ExternalLink className="size-3.5" />
          </Link>
          <Link
            href={assetUrl}
            download
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-slate-950"
          >
            Download
            <Download className="size-3.5" />
          </Link>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="group relative h-[750px] bg-[radial-gradient(circle_at_center,rgba(40,40,40,1)_0%,rgba(5,5,5,1)_100%)]"
      >
        <div
          ref={containerRef}
          className="absolute inset-0 z-0 h-full w-full cursor-crosshair"
        />

        {/* Controls Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
          <div className="flex items-start justify-end">
            <button
              onClick={toggleFullscreen}
              className="pointer-events-auto rounded-full bg-black/20 p-3 text-white/70 backdrop-blur-md transition-all hover:bg-black/40 hover:text-white dark:bg-white/10 dark:hover:bg-white/20"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="size-5" />
              ) : (
                <Maximize className="size-5" />
              )}
            </button>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur-sm dark:bg-black/40">
                <Move3D className="size-3.5" />
                <span>WASD to move</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur-sm dark:bg-black/40">
                <MousePointer2 className="size-3.5" />
                <span>Click to look</span>
              </div>
            </div>

            {assetFormat && (
              <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm dark:bg-black/40 text-slate-500 dark:text-slate-400">
                <Box className="size-3.5" />
                <span className="uppercase">{assetFormat}</span>
              </div>
            )}
          </div>
        </div>

        {viewerState === "loading" ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/12 backdrop-blur-[1px] dark:bg-slate-950/35">
            <div className="rounded-full border border-black/10 bg-white/88 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200">
              Loading scene...
            </div>
          </div>
        ) : null}

        {viewerState === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-md rounded-[24px] border border-rose-500/20 bg-white/92 p-5 text-center shadow-xl dark:bg-slate-950/92">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-rose-500/12 text-rose-600 dark:text-rose-300">
                <AlertCircle className="size-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                Viewer failed to load
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {viewerError ?? "The scene asset could not be rendered in the browser."}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
