"use client"

type AudioPlayerProps = {
  src: string
  autoPlay?: boolean
}

export function AudioPlayer({ src, autoPlay }: AudioPlayerProps) {
  return (
    <audio
      className="w-full"
      controls
      preload="metadata"
      src={src}
      autoPlay={autoPlay}
    >
      Your browser does not support audio playback.
    </audio>
  )
}
