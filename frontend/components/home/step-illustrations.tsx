"use client"

export function UploadIllustration() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Document */}
      <rect x="90" y="40" width="80" height="105" rx="6" fill="white" stroke="#C9D0E4" strokeWidth="1.5" />
      {/* Text lines */}
      <rect x="104" y="60" width="52" height="3" rx="1.5" fill="#C9D0E4" />
      <rect x="104" y="70" width="40" height="3" rx="1.5" fill="#C9D0E4" />
      <rect x="104" y="80" width="48" height="3" rx="1.5" fill="#C9D0E4" />
      <rect x="104" y="90" width="36" height="3" rx="1.5" fill="#C9D0E4" />
      <rect x="104" y="100" width="52" height="3" rx="1.5" fill="#DDE2EE" />
      <rect x="104" y="110" width="44" height="3" rx="1.5" fill="#DDE2EE" />
      <rect x="104" y="120" width="50" height="3" rx="1.5" fill="#DDE2EE" />

      {/* Upload arrow */}
      <g opacity="0.7">
        <path d="M170 95 L190 95 L190 115 L200 115 L182 135 L164 115 L174 115 L174 95Z" fill="none" stroke="#4A7BF7" strokeWidth="1.5" transform="rotate(180 182 115)" />
      </g>

      {/* Corner fold */}
      <path d="M150 40 L170 40 L170 58 L150 40Z" fill="#EEF1F7" stroke="#C9D0E4" strokeWidth="1" />

      {/* PDF badge */}
      <rect x="100" y="128" width="28" height="12" rx="3" fill="#4A7BF7" opacity="0.15" />
      <text x="107" y="137" fontSize="7" fill="#4A7BF7" fontWeight="600" fontFamily="sans-serif">PDF</text>
    </svg>
  )
}

export function GenerateIllustration() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Central processing circle */}
      <circle cx="140" cy="100" r="40" fill="#EEF1F7" stroke="#C9D0E4" strokeWidth="1" />
      <circle cx="140" cy="100" r="28" fill="white" stroke="#DDE2EE" strokeWidth="1" />

      {/* Gear-like notches */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="138"
          y="56"
          width="4"
          height="8"
          rx="2"
          fill="#BBC5DD"
          transform={`rotate(${angle} 140 100)`}
        />
      ))}

      {/* Sparkle in center */}
      <path d="M140 90 L142 97 L149 100 L142 103 L140 110 L138 103 L131 100 L138 97Z" fill="#4A7BF7" opacity="0.6" />

      {/* Text block going in - left */}
      <g opacity="0.5">
        <rect x="50" y="88" width="35" height="3" rx="1.5" fill="#7D8390" />
        <rect x="55" y="95" width="28" height="3" rx="1.5" fill="#BBC5DD" />
        <rect x="52" y="102" width="32" height="3" rx="1.5" fill="#7D8390" />
        {/* Arrow */}
        <path d="M90 97 L98 97" stroke="#BBC5DD" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 3D cube coming out - right */}
      <g opacity="0.6" transform="translate(195, 82)">
        <path d="M0 12 L18 0 L36 12 L18 24Z" fill="#DDE2EE" stroke="#BBC5DD" strokeWidth="1" />
        <path d="M0 12 L0 30 L18 42 L18 24Z" fill="#C9D0E4" stroke="#BBC5DD" strokeWidth="1" />
        <path d="M36 12 L36 30 L18 42 L18 24Z" fill="#B0BAD4" stroke="#BBC5DD" strokeWidth="1" />
      </g>

      {/* Arrow from center to cube */}
      <path d="M182 100 L190 100" stroke="#BBC5DD" strokeWidth="1.5" strokeLinecap="round" />

      {/* Small orbiting dots */}
      <circle cx="140" cy="55" r="2" fill="#4A7BF7" opacity="0.3" />
      <circle cx="175" cy="75" r="1.5" fill="#4A7BF7" opacity="0.2" />
      <circle cx="105" cy="80" r="1.5" fill="#4A7BF7" opacity="0.2" />
    </svg>
  )
}

export function ExploreIllustration() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Browser/viewer frame */}
      <rect x="55" y="35" width="170" height="120" rx="8" fill="white" stroke="#C9D0E4" strokeWidth="1.5" />

      {/* Title bar */}
      <rect x="55" y="35" width="170" height="20" rx="8" fill="#EEF1F7" />
      <rect x="55" y="47" width="170" height="8" fill="#EEF1F7" />
      <circle cx="70" cy="45" r="3" fill="#E5484D" opacity="0.5" />
      <circle cx="80" cy="45" r="3" fill="#F0C040" opacity="0.5" />
      <circle cx="90" cy="45" r="3" fill="#4ADE80" opacity="0.5" />

      {/* 3D scene inside - mountains */}
      <path d="M55 155 L100 90 L120 110 L150 75 L180 100 L225 155Z" fill="#DDE2EE" />
      <path d="M150 75 L158 88 L142 88Z" fill="white" opacity="0.6" />

      {/* Sky gradient in viewer */}
      <rect x="56" y="55" width="168" height="50" fill="url(#viewerSky)" opacity="0.5" />

      {/* Person/cursor icon */}
      <g transform="translate(130, 110)" opacity="0.6">
        <circle cx="0" cy="0" r="4" fill="#4A7BF7" opacity="0.3" />
        <circle cx="0" cy="0" r="1.5" fill="#4A7BF7" />
      </g>

      {/* WASD hint */}
      <g opacity="0.35" transform="translate(135, 160)">
        <rect x="-8" y="0" width="16" height="10" rx="2" fill="#BBC5DD" />
        <text x="0" y="8" fontSize="6" fill="#7D8390" textAnchor="middle" fontWeight="600" fontFamily="sans-serif">W</text>
      </g>

      {/* Movement lines */}
      <path d="M132 118 L125 124" stroke="#4A7BF7" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <path d="M128 118 L118 126" stroke="#4A7BF7" strokeWidth="1" opacity="0.2" strokeLinecap="round" />

      <defs>
        <linearGradient id="viewerSky" x1="140" y1="55" x2="140" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8C8F0" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  )
}
