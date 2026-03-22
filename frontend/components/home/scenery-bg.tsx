"use client"

import { useEffect, useState } from "react"

export function SceneryBackground() {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        // Ease out curve for smoother fade
        const t = Math.min(y / 500, 1)
        const fade = 1 - t * t
        setOpacity(fade)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[55%] overflow-hidden"
      style={{ opacity, transition: "opacity 0.3s ease-out" }}
    >
      {/* Animated clouds layer - behind scenery */}
      <svg
        className="absolute inset-0 z-[5] h-full w-full"
        viewBox="0 10 1600 490"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cloud 1 - large, drifts right */}
        <g opacity="0.18">
          <ellipse cx="200" cy="80" rx="70" ry="20" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;120,0;0,0" dur="45s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="235" cy="72" rx="48" ry="16" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;120,0;0,0" dur="45s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="175" cy="76" rx="35" ry="14" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;120,0;0,0" dur="45s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Cloud 2 - medium, drifts left */}
        <g opacity="0.15">
          <ellipse cx="700" cy="55" rx="58" ry="17" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;-80,0;0,0" dur="55s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="730" cy="48" rx="40" ry="14" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;-80,0;0,0" dur="55s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="675" cy="52" rx="30" ry="11" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;-80,0;0,0" dur="55s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Cloud 3 - wispy, drifts right */}
        <g opacity="0.13">
          <ellipse cx="1100" cy="90" rx="52" ry="12" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;100,0;0,0" dur="60s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1130" cy="84" rx="32" ry="10" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;100,0;0,0" dur="60s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Cloud 4 - large fluffy, drifts left slowly */}
        <g opacity="0.16">
          <ellipse cx="1400" cy="65" rx="65" ry="18" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;-140,0;0,0" dur="70s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1435" cy="56" rx="42" ry="15" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;-140,0;0,0" dur="70s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1370" cy="60" rx="35" ry="13" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;-140,0;0,0" dur="70s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Cloud 5 - small accent */}
        <g opacity="0.12">
          <ellipse cx="450" cy="110" rx="35" ry="10" fill="white">
            <animateTransform attributeName="transform" type="translate" values="0,0;60,0;0,0" dur="40s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* ═══════ ANIMATED BIRDS ═══════ */}
        {/* Bird flock 1 - near volcano, drifts right */}
        <g opacity="0.3">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;200,-20;400,0" dur="30s" repeatCount="indefinite" />
            <path d="M120 120 Q126 113 132 120" stroke="#3A2820" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M140 115 Q146 108 152 115" stroke="#3A2820" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M130 126 Q135 121 140 126" stroke="#3A2820" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* Bird flock 2 - near mountains, drifts left */}
        <g opacity="0.25">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;-150,10;-300,0;-150,-10;0,0" dur="40s" repeatCount="indefinite" />
            <path d="M850 100 Q857 92 864 100" stroke="#3A4560" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M872 95 Q879 87 886 95" stroke="#3A4560" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M860 106 Q866 100 872 106" stroke="#3A4560" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M840 103 Q845 98 850 103" stroke="#3A4560" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* Bird flock 3 - near castle, drifts right */}
        <g opacity="0.22">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;180,-15;0,0" dur="35s" repeatCount="indefinite" />
            <path d="M1250 90 Q1256 83 1262 90" stroke="#4A4858" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M1268 85 Q1274 78 1280 85" stroke="#4A4858" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M1258 95 Q1263 90 1268 95" stroke="#4A4858" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* Solo bird - high, slow drift */}
        <g opacity="0.2">
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;250,5;0,0" dur="50s" repeatCount="indefinite" />
            <path d="M550 65 Q559 55 568 65" stroke="#505868" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      {/* Fade mask - scenery fades out downward */}
      <div
        className="absolute inset-0 z-10"
        style={{
          maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
        }}
      >
        <svg
          viewBox="0 10 1600 490"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 h-full w-full"
          preserveAspectRatio="xMidYMin slice"
        >
          {/* ═══════ VOLCANO BIOME (far left) ═══════ */}
          {/* Volcanic terrain base */}
          <path
            d="M-30 500 L-30 380 Q30 370 80 360 L80 500Z"
            fill="#4A3832"
            opacity="0.25"
          />
          {/* Main volcano cone */}
          <path
            d="M-10 500 L60 180 L80 200 L95 170 L110 195 L130 175 L170 500Z"
            fill="url(#volcanoBody)"
            opacity="0.35"
          />
          {/* Volcano crater rim detail */}
          <path
            d="M80 200 L95 170 L110 195"
            fill="#5C3D30"
            opacity="0.4"
          />
          {/* Lava glow at crater */}
          <ellipse cx="95" cy="175" rx="14" ry="7" fill="#D4553A" opacity="0.35" />
          <ellipse cx="95" cy="178" rx="8" ry="4" fill="#E8734A" opacity="0.25" />
          {/* Lava streams down the side */}
          <path
            d="M98 190 Q102 220 100 260 Q104 280 101 310"
            stroke="#C4442E"
            strokeWidth="3"
            fill="none"
            opacity="0.2"
          />
          <path
            d="M92 195 Q88 230 90 270"
            stroke="#D4553A"
            strokeWidth="2"
            fill="none"
            opacity="0.15"
          />
          {/* Smoke wisps */}
          <ellipse cx="90" cy="155" rx="18" ry="10" fill="#7D8390" opacity="0.08" />
          <ellipse cx="100" cy="145" rx="14" ry="8" fill="#7D8390" opacity="0.06" />
          {/* Rocky outcrops at base */}
          <path d="M30 420 L40 395 L55 400 L65 385 L80 400 L90 420Z" fill="#5C4A42" opacity="0.2" />

          {/* ═══════ DESERT / CANYON BIOME ═══════ */}
          {/* Sand dunes background */}
          <path
            d="M150 500 Q200 430 250 450 Q300 420 350 440 Q380 430 400 500Z"
            fill="#D4B896"
            opacity="0.15"
          />
          {/* Main mesa */}
          <path
            d="M200 500 L230 280 L260 275 L300 270 L330 275 L360 280 L380 500Z"
            fill="url(#mesaBody)"
            opacity="0.3"
          />
          {/* Mesa striations / layers */}
          <path d="M235 310 L355 310" stroke="#B8916E" strokeWidth="1" opacity="0.2" />
          <path d="M232 330 L358 330" stroke="#C9A080" strokeWidth="1.5" opacity="0.15" />
          <path d="M228 360 L362 360" stroke="#B8916E" strokeWidth="1" opacity="0.18" />
          {/* Mesa top detail */}
          <path
            d="M260 275 L270 268 L285 272 L300 265 L315 270 L330 275"
            fill="#C4A57A"
            opacity="0.25"
          />
          {/* Smaller butte */}
          <path
            d="M370 500 L390 340 L410 335 L430 340 L440 500Z"
            fill="#C9A080"
            opacity="0.22"
          />
          {/* Arch formation */}
          <path
            d="M340 400 Q355 370 370 400"
            stroke="#B89878"
            strokeWidth="4"
            fill="none"
            opacity="0.18"
          />
          {/* Cacti */}
          <path d="M190 440 L190 420 M186 428 L183 422 M194 425 L198 420" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
          <path d="M420 450 L420 435 M417 442 L414 438" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round" opacity="0.12" />

          {/* ═══════ DENSE FOREST BIOME ═══════ */}
          {/* Background forest layer */}
          <path
            d="M420 500 Q440 420 460 430 Q480 410 510 425 Q530 405 560 420 Q580 400 600 500Z"
            fill="#3D6B3D"
            opacity="0.12"
          />
          {/* Tall conifer 1 */}
          <path d="M445 500 L445 390 L435 390 L450 350 L440 350 L455 310 L445 310 L460 270 L475 310 L465 310 L480 350 L470 350 L485 390 L475 390 L475 500Z" fill="url(#forestPine)" opacity="0.28" />
          {/* Tall conifer 2 */}
          <path d="M490 500 L490 380 L482 380 L495 345 L487 345 L500 305 L492 305 L505 260 L518 305 L510 305 L523 345 L515 345 L528 380 L520 380 L520 500Z" fill="url(#forestCanopy)" opacity="0.3" />
          {/* Broad deciduous tree */}
          <line x1="545" y1="500" x2="545" y2="350" stroke="#4A3828" strokeWidth="4" opacity="0.18" />
          <ellipse cx="545" cy="320" rx="28" ry="35" fill="#2D5A2D" opacity="0.25" />
          <ellipse cx="535" cy="310" rx="18" ry="22" fill="#3D6B3D" opacity="0.18" />
          <ellipse cx="558" cy="315" rx="16" ry="20" fill="#346834" opacity="0.15" />
          {/* Shorter pine */}
          <path d="M575 500 L575 400 L568 400 L580 370 L572 370 L585 335 L598 370 L590 370 L602 400 L595 400 L595 500Z" fill="#2D5A2D" opacity="0.22" />
          {/* Undergrowth */}
          <path
            d="M430 500 Q445 470 465 475 Q480 465 500 472 Q515 460 535 468 Q555 458 575 465 Q590 455 610 500Z"
            fill="#4A7A4A"
            opacity="0.14"
          />
          {/* Ferns */}
          <path d="M455 480 Q460 470 465 475 Q470 468 475 472" stroke="#3D6B3D" strokeWidth="1.5" fill="none" opacity="0.12" />
          <path d="M530 475 Q536 465 542 470 Q548 462 554 467" stroke="#3D6B3D" strokeWidth="1.5" fill="none" opacity="0.1" />
          {/* Mist */}
          <ellipse cx="510" cy="420" rx="60" ry="15" fill="white" opacity="0.05" />
          <ellipse cx="480" cy="380" rx="35" ry="8" fill="white" opacity="0.04" />

          {/* ═══════ SNOW MOUNTAIN RANGE BIOME (center) ═══════ */}
          {/* Distant range backdrop */}
          <path
            d="M560 500 Q620 380 680 400 Q720 370 760 390 Q800 360 840 500Z"
            fill="#8B9DC3"
            opacity="0.12"
          />
          {/* Main peak 1 */}
          <path
            d="M600 500 L700 180 L730 220 L760 190 L800 500Z"
            fill="url(#mountainMain)"
            opacity="0.3"
          />
          {/* Main peak 2 - tallest */}
          <path
            d="M720 500 L820 140 L850 180 L870 155 L900 500Z"
            fill="url(#mountainTall)"
            opacity="0.32"
          />
          {/* Main peak 3 */}
          <path
            d="M850 500 L930 200 L960 230 L980 210 L1020 500Z"
            fill="url(#mountainRight)"
            opacity="0.28"
          />
          {/* Snow caps */}
          <path d="M700 180 L715 210 L685 210Z" fill="white" opacity="0.45" />
          <path d="M760 190 L772 215 L748 215Z" fill="white" opacity="0.4" />
          <path d="M820 140 L838 175 L802 175Z" fill="white" opacity="0.5" />
          <path d="M870 155 L882 180 L858 180Z" fill="white" opacity="0.45" />
          {/* Snow streaks */}
          <path d="M815 175 L808 220 L818 210 L812 250" stroke="white" strokeWidth="2" fill="none" opacity="0.15" />
          <path d="M830 175 L840 230" stroke="white" strokeWidth="1.5" fill="none" opacity="0.12" />
          <path d="M930 200 L942 225 L918 225Z" fill="white" opacity="0.4" />
          {/* Ridge lines */}
          <path d="M700 180 L730 220 L760 190" stroke="#6E7FA0" strokeWidth="1" fill="none" opacity="0.15" />
          <path d="M820 140 L850 180 L870 155" stroke="#6E7FA0" strokeWidth="1" fill="none" opacity="0.15" />

          {/* ═══════ ACTIVE VOLCANO BIOME ═══════ */}
          {/* Main cone */}
          <path
            d="M1020 500 L1075 220 L1090 240 L1100 210 L1110 235 L1125 225 L1170 500Z"
            fill="url(#volcano2Body)"
            opacity="0.32"
          />
          {/* Crater rim */}
          <path d="M1090 240 L1100 210 L1110 235" fill="#5C3528" opacity="0.38" />
          {/* Lava glow at crater */}
          <ellipse cx="1100" cy="215" rx="12" ry="6" fill="#E85030" opacity="0.4" />
          <ellipse cx="1100" cy="218" rx="7" ry="3.5" fill="#F08040" opacity="0.3" />
          {/* Eruption plume */}
          <ellipse cx="1098" cy="195" rx="16" ry="10" fill="#7D8390" opacity="0.1" />
          <ellipse cx="1104" cy="182" rx="12" ry="8" fill="#7D8390" opacity="0.08" />
          <ellipse cx="1096" cy="170" rx="10" ry="6" fill="#7D8390" opacity="0.06" />
          {/* Lava flows down the slopes */}
          <path d="M1098 230 Q1092 270 1095 310 Q1090 350 1088 400" stroke="#D44030" strokeWidth="3.5" fill="none" opacity="0.25" strokeLinecap="round" />
          <path d="M1105 235 Q1110 275 1108 320 Q1112 365 1115 420" stroke="#E85030" strokeWidth="2.5" fill="none" opacity="0.2" strokeLinecap="round" />
          <path d="M1095 250 Q1088 290 1082 340" stroke="#C43828" strokeWidth="2" fill="none" opacity="0.18" strokeLinecap="round" />
          {/* Lava glow on flows */}
          <path d="M1096 270 L1094 295" stroke="#F08040" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round" />
          <path d="M1108 280 L1110 310" stroke="#F08040" strokeWidth="1.2" fill="none" opacity="0.12" strokeLinecap="round" />
          {/* Rocky terrain at base */}
          <path d="M1040 430 L1050 410 L1062 418 L1070 400 L1080 415 L1085 430Z" fill="#5C4238" opacity="0.18" />
          <path d="M1120 420 L1130 405 L1140 415 L1148 400 L1155 418 L1155 430Z" fill="#5C4238" opacity="0.15" />
          {/* Scattered embers / sparks near top */}
          <circle cx="1090" cy="200" r="1.5" fill="#F08040" opacity="0.2" />
          <circle cx="1112" cy="195" r="1" fill="#E85030" opacity="0.18" />
          <circle cx="1085" cy="190" r="1" fill="#F0A050" opacity="0.15" />

          {/* ═══════ CASTLE / MEDIEVAL BIOME ═══════ */}
          {/* Castle hill */}
          <path
            d="M1200 500 Q1240 400 1290 410 Q1330 395 1370 500Z"
            fill="#6B6878"
            opacity="0.12"
          />
          {/* Castle structure */}
          <path
            d="M1220 500 L1220 310 L1232 310 L1232 290 L1240 290 L1240 300 L1260 300 L1260 280 L1272 280 L1272 300 L1290 300 L1290 290 L1298 290 L1298 310 L1310 310 L1310 500Z"
            fill="url(#castleBody)"
            opacity="0.28"
          />
          {/* Crenellations */}
          <rect x="1228" y="285" width="4" height="5" fill="#6B6878" opacity="0.22" />
          <rect x="1236" y="285" width="4" height="5" fill="#6B6878" opacity="0.22" />
          <rect x="1258" y="275" width="4" height="5" fill="#6B6878" opacity="0.22" />
          <rect x="1268" y="275" width="4" height="5" fill="#6B6878" opacity="0.22" />
          <rect x="1288" y="285" width="4" height="5" fill="#6B6878" opacity="0.22" />
          <rect x="1296" y="285" width="4" height="5" fill="#6B6878" opacity="0.22" />
          {/* Windows */}
          <rect x="1240" y="330" width="6" height="10" rx="3" fill="#3A3845" opacity="0.2" />
          <rect x="1262" y="320" width="6" height="10" rx="3" fill="#3A3845" opacity="0.2" />
          <rect x="1285" y="330" width="6" height="10" rx="3" fill="#3A3845" opacity="0.2" />
          {/* Gate */}
          <path d="M1255 500 L1255 440 Q1265 430 1275 440 L1275 500Z" fill="#3A3845" opacity="0.15" />
          {/* Flag */}
          <line x1="1266" y1="280" x2="1266" y2="265" stroke="#6B6878" strokeWidth="1" opacity="0.25" />
          <path d="M1266 265 L1278 269 L1266 273Z" fill="#8B5E5E" opacity="0.2" />

          {/* ═══════ OCEAN / COASTAL BIOME (far right) ═══════ */}
          {/* Coastal cliffs */}
          <path
            d="M1350 500 L1380 360 Q1400 350 1420 360 L1440 500Z"
            fill="#6B7D6B"
            opacity="0.18"
          />
          {/* Lighthouse */}
          <path d="M1400 360 L1405 310 L1410 310 L1415 360Z" fill="#9A98A8" opacity="0.2" />
          <ellipse cx="1410" cy="308" rx="6" ry="4" fill="#D4B060" opacity="0.15" />
          {/* Ocean waves */}
          <path
            d="M1400 480 Q1430 470 1460 478 Q1490 468 1520 475 Q1550 465 1580 472 Q1610 465 1640 500 L1400 500Z"
            fill="#7BAED0"
            opacity="0.12"
          />
          <path
            d="M1420 490 Q1450 482 1480 488 Q1510 480 1540 486 Q1570 478 1600 484 L1640 500 L1420 500Z"
            fill="#6A9EC0"
            opacity="0.1"
          />
          {/* Wave foam */}
          <path d="M1440 478 Q1460 474 1480 477" stroke="white" strokeWidth="1" fill="none" opacity="0.08" />
          <path d="M1500 472 Q1520 468 1540 471" stroke="white" strokeWidth="1" fill="none" opacity="0.06" />
          {/* Sailboat */}
          <path d="M1520 455 L1522 440 L1530 452Z" fill="white" opacity="0.1" />
          <line x1="1522" y1="440" x2="1522" y2="458" stroke="#7D8390" strokeWidth="0.8" opacity="0.1" />

          {/* ═══════ GRADIENTS ═══════ */}
          <defs>
            <linearGradient id="volcanoBody" x1="95" y1="170" x2="95" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6B4038" />
              <stop offset="40%" stopColor="#7A5548" />
              <stop offset="100%" stopColor="#8B7068" />
            </linearGradient>
            <linearGradient id="mesaBody" x1="300" y1="270" x2="300" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C4A57A" />
              <stop offset="30%" stopColor="#B8956A" />
              <stop offset="60%" stopColor="#C9A878" />
              <stop offset="100%" stopColor="#D4BC96" />
            </linearGradient>
            <linearGradient id="forestPine" x1="470" y1="330" x2="470" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2D5A2D" />
              <stop offset="100%" stopColor="#4A7A4A" />
            </linearGradient>
            <linearGradient id="forestCanopy" x1="525" y1="340" x2="525" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3D6B3D" />
              <stop offset="100%" stopColor="#5A8A5A" />
            </linearGradient>
            <linearGradient id="mountainMain" x1="730" y1="180" x2="730" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5A6A8A" />
              <stop offset="50%" stopColor="#7080A0" />
              <stop offset="100%" stopColor="#8B9DC3" />
            </linearGradient>
            <linearGradient id="mountainTall" x1="840" y1="140" x2="840" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#556888" />
              <stop offset="50%" stopColor="#6B7FA0" />
              <stop offset="100%" stopColor="#8090B8" />
            </linearGradient>
            <linearGradient id="mountainRight" x1="960" y1="200" x2="960" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5E7090" />
              <stop offset="50%" stopColor="#7585A5" />
              <stop offset="100%" stopColor="#8B9DC3" />
            </linearGradient>
            <linearGradient id="volcano2Body" x1="1100" y1="210" x2="1100" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5C3528" />
              <stop offset="40%" stopColor="#6B4538" />
              <stop offset="100%" stopColor="#7A5A4A" />
            </linearGradient>
            <linearGradient id="castleBody" x1="1265" y1="280" x2="1265" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6B6878" />
              <stop offset="50%" stopColor="#7D7B8C" />
              <stop offset="100%" stopColor="#908EA0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
