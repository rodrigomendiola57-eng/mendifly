"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, useSyncExternalStore } from "react";

import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

import "./animated-logo.css";

const snap = [0.16, 1, 0.3, 1] as [number, number, number, number];
const hit = [0.7, 0, 0.15, 1] as [number, number, number, number];

const D_DESKTOP = {
  scan: 1.15,
  mobileCaret: 0,
  mobileCaretDelay: 0,
  iconClip: 0.58,
  iconClipDelay: 0.08,
  iconGlitch: 0.72,
  triangleDelay: 0.38,
  glow: 1.15,
  glowDelay: 0.48,
  textClip: 0.62,
  textClipDelay: 0.72,
  textReveal: 0.58,
  textRevealDelay: 0.88,
  textBlueSweepDelay: 1.05,
  textBlueSweepStep: 0.09,
  textBlueSweepDuration: 0.72,
} as const;

/** Móvil: más corta, sin scan, menos carga en GPU */
const D_MOBILE = {
  scan: 0,
  mobileCaret: 0.86,
  mobileCaretDelay: 0.24,
  iconClip: 0.36,
  iconClipDelay: 0.05,
  iconGlitch: 0.42,
  triangleDelay: 0.2,
  glow: 0.55,
  glowDelay: 0.26,
  textClip: 0.4,
  textClipDelay: 0.4,
  textReveal: 0.36,
  textRevealDelay: 0.5,
  textBlueSweepDelay: 0.58,
  textBlueSweepStep: 0.07,
  textBlueSweepDuration: 0.54,
} as const;

const WORDMARK_PATH =
  "M577.364 94.7953H703.814V134.095H622.064V174.445H703.064V212.545H622.064V253.495H703.814V292.795H577.364V94.7953ZM779.168 135.895L782.468 136.495V292.795H737.618V94.7953H798.818L879.068 250.795L875.768 251.395V94.7953H920.618V292.795H859.118L779.168 135.895ZM954.865 94.7953H1014.41C1035.51 94.7953 1052.96 99.0453 1066.76 107.545C1080.66 115.945 1091.06 127.595 1097.96 142.495C1104.86 157.395 1108.31 174.445 1108.31 193.645C1108.31 212.945 1104.86 230.045 1097.96 244.945C1091.06 259.845 1080.66 271.545 1066.76 280.045C1052.96 288.545 1035.51 292.795 1014.41 292.795H954.865V94.7953ZM999.565 134.545V253.045H1010.36C1021.66 253.045 1031.01 250.495 1038.41 245.395C1045.81 240.195 1051.36 233.145 1055.06 224.245C1058.86 215.245 1060.76 205.145 1060.76 193.945C1060.76 182.645 1058.91 172.545 1055.21 163.645C1051.61 154.645 1046.06 147.545 1038.56 142.345C1031.06 137.145 1021.66 134.545 1010.36 134.545H999.565ZM1136.24 94.7953H1181.09V292.795H1136.24V94.7953ZM1216.94 94.7953H1331.39V134.095H1261.79V173.995H1326.14V213.145H1261.79V292.795H1216.94V94.7953ZM1361.08 94.7953H1405.93V253.495H1477.78V292.795H1361.08V94.7953ZM1531.72 221.545L1463.47 94.7953H1517.92L1554.07 170.245L1590.37 94.7953H1644.52L1576.57 221.545V292.795H1531.72V221.545Z";

const WORDMARK_LETTER_CLIPS = [
  { x: 570, width: 145 },
  { x: 724, width: 210 },
  { x: 942, width: 178 },
  { x: 1126, width: 66 },
  { x: 1204, width: 140 },
  { x: 1350, width: 138 },
  { x: 1454, width: 205 },
] as const;

function subscribeCanHover(callback: () => void) {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getCanHoverSnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function useCanHover() {
  const hydrated = useHydrated();
  const canHover = useSyncExternalStore(
    subscribeCanHover,
    getCanHoverSnapshot,
    () => false,
  );
  return hydrated && canHover;
}

interface AnimatedLogoProps {
  className?: string;
  imageClassName?: string;
}

interface AnimatedLogoGraphicProps {
  imageClassName?: string;
  reduceMotion: boolean;
  compact: boolean;
  textHovered: boolean;
}

function AnimatedLogoGraphic({
  imageClassName,
  reduceMotion,
  compact,
  textHovered,
}: AnimatedLogoGraphicProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `logo-shadow-${uid}`;
  const glowId = `logo-glow-${uid}`;
  const mobileCaretGlowId = `logo-mobile-caret-glow-${uid}`;
  const textClipId = `logo-text-clip-${uid}`;
  const iconClipId = `logo-icon-clip-${uid}`;
  const textGradId = `logo-text-grad-${uid}`;
  const textGlowId = `logo-text-glow-${uid}`;

  const D = compact ? D_MOBILE : D_DESKTOP;
  const state = reduceMotion ? "visible" : "hidden";
  const showScan = !reduceMotion && !compact && D.scan > 0;
  const showMobileCaret = !reduceMotion && compact;

  return (
    <motion.svg
      viewBox="0 0 1645 297"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mendifly"
      className={cn(
        "h-9 w-auto max-w-[180px] bg-transparent object-contain object-left sm:h-11 sm:max-w-[220px]",
        imageClassName,
      )}
      initial={false}
    >
      <defs>
        <linearGradient id={`scan-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="45%" stopColor="#22d3ee" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#00ACFB" stopOpacity="1" />
          <stop offset="100%" stopColor="#00ACFB" stopOpacity="0" />
        </linearGradient>

        <filter
          id={mobileCaretGlowId}
          x="-250%"
          y="-30%"
          width="600%"
          height="160%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.05  0 0 0 0 0.8  0 0 0 0 1  0 0 0 0.95 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient
          id={textGradId}
          x1="577"
          y1="190"
          x2="1645"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ff8a7a" />
          <stop offset="42%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <filter
          id={textGlowId}
          x="-8%"
          y="-20%"
          width="116%"
          height="140%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.75  0 0 0 0 0.35  0 0 0 0 0.98  0 0 0 0.55 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter
          id={glowId}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.13  0 0 0 0 0.83  0 0 0 0 0.93  0 0 0 0.9 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <clipPath id={iconClipId}>
          <motion.rect
            x={0}
            y={0}
            height={297}
            initial={{ width: 0 }}
            animate={{ width: 560 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: D.iconClip,
                    ease: hit,
                    delay: D.iconClipDelay,
                  }
            }
          />
        </clipPath>

        <clipPath id={textClipId}>
          <motion.rect
            x={560}
            y={0}
            height={297}
            initial={{ width: 0 }}
            animate={{ width: 1085 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: D.textClip,
                    ease: hit,
                    delay: D.textClipDelay,
                  }
            }
          />
        </clipPath>

        {WORDMARK_LETTER_CLIPS.map((letter, index) => (
          <clipPath key={`letter-clip-${index}`} id={`logo-letter-clip-${uid}-${index}`}>
            <rect x={letter.x} y={84} width={letter.width} height={216} />
          </clipPath>
        ))}

        <filter
          id={filterId}
          x="283.704"
          y="5.01385"
          width="267.051"
          height="291.281"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>

      {showScan && (
        <motion.rect
          className="animated-logo__scan"
          y={0}
          width={120}
          height={297}
          fill={`url(#scan-${uid})`}
          initial={{ x: -140, opacity: 0 }}
          animate={{ x: [-140, 1720], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: D.scan,
            ease: hit,
            times: [0, 0.08, 0.78, 1],
          }}
        />
      )}

      {showMobileCaret && (
        <motion.rect
          className="animated-logo__mobile-caret"
          x={554}
          y={62}
          width={28}
          height={232}
          rx={14}
          fill="#22d3ee"
          filter={`url(#${mobileCaretGlowId})`}
          initial={{ x: 0, opacity: 0, scaleY: 0.75 }}
          animate={{
            x: [0, 0, 1072, 1072],
            opacity: [0, 1, 1, 0],
            scaleY: [0.75, 1, 1, 0.85],
          }}
          transition={{
            duration: D.mobileCaret,
            delay: D.mobileCaretDelay,
            ease: hit,
            times: [0, 0.12, 0.82, 1],
          }}
        />
      )}

      <g clipPath={`url(#${iconClipId})`}>
        <motion.path
          d="M378.914 282.795H338.414L197.414 65.7953L69.4139 248.295H188.914L245.414 167.295L264.914 197.795L206.414 282.795H1.91394L197.414 1.79532L378.914 282.795Z"
          fill="#008AC9"
          stroke="#1E1E1E"
          strokeWidth={2}
          initial={state}
          animate={
            reduceMotion
              ? "visible"
              : compact
                ? { opacity: [0, 1], x: [0, 0] }
                : {
                    opacity: [0, 1, 0.35, 1],
                    x: [0, -5, 3, 0],
                    filter: [
                      "brightness(3) saturate(0)",
                      "brightness(1.4) saturate(1.2)",
                      "brightness(1) saturate(1)",
                    ],
                  }
          }
          variants={{
            visible: { opacity: 1, x: 0, filter: "brightness(1)" },
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: D.iconGlitch,
                  ease: snap,
                  times: compact ? [0, 1] : [0, 0.45, 0.72, 1],
                }
          }
        />

        <motion.g
          filter={`url(#${filterId})`}
          initial={state}
          animate="visible"
          variants={{
            hidden: {
              opacity: 0,
              scale: compact ? 0.65 : 0.2,
              rotate: compact ? -8 : -18,
              x: compact ? -10 : -22,
              filter: "brightness(2)",
            },
            visible: {
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: 0,
              filter: "brightness(1)",
              transition: {
                type: "spring",
                stiffness: compact ? 420 : 340,
                damping: compact ? 28 : 24,
                mass: compact ? 0.65 : 0.85,
                delay: D.triangleDelay,
              },
            },
          }}
          style={{ transformOrigin: "362px 148px" }}
        >
          {!compact && (
            <motion.g
              filter={`url(#${glowId})`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: [0, 1, 0.55, 0] }}
              transition={{
                duration: D.glow,
                delay: D.glowDelay,
                times: [0, 0.2, 0.5, 1],
              }}
            >
              <path
                d="M362.914 6.79532L288.914 111.295L310.914 144.795L362.914 68.2953L499.914 287.295H544.914L362.914 6.79532Z"
                fill="#00ACFB"
                shapeRendering="crispEdges"
              />
            </motion.g>
          )}
          <path
            d="M362.914 6.79532L288.914 111.295L310.914 144.795L362.914 68.2953L499.914 287.295H544.914L362.914 6.79532Z"
            fill="#00ACFB"
            shapeRendering="crispEdges"
          />
          <path
            d="M362.914 6.79532L288.914 111.295L310.914 144.795L362.914 68.2953L499.914 287.295H544.914L362.914 6.79532Z"
            fill="black"
            fillOpacity={0.2}
            shapeRendering="crispEdges"
          />
          <path
            d="M362.914 6.79532L288.914 111.295L310.914 144.795L362.914 68.2953L499.914 287.295H544.914L362.914 6.79532Z"
            stroke="black"
            strokeOpacity={0.2}
            strokeWidth={2}
            shapeRendering="crispEdges"
          />
        </motion.g>
      </g>

      <g clipPath={`url(#${textClipId})`}>
        <motion.path
          className="animated-logo__wordmark"
          d={WORDMARK_PATH}
          initial={
            reduceMotion
              ? { opacity: 1, x: 0, fill: "#ffffff" }
              : { opacity: 0, x: compact ? 14 : 28, fill: "#ffffff" }
          }
          animate={{
            opacity: 1,
            x: 0,
            fill: textHovered ? `url(#${textGradId})` : "#ffffff",
            filter: textHovered ? `url(#${textGlowId})` : "none",
          }}
          transition={{
            opacity: {
              duration: reduceMotion ? 0 : D.textReveal,
              delay: reduceMotion ? 0 : D.textRevealDelay,
              ease: hit,
            },
            x: {
              duration: reduceMotion ? 0 : D.textReveal,
              delay: reduceMotion ? 0 : D.textRevealDelay,
              ease: hit,
            },
            fill: { duration: 0.35, ease: snap },
            filter: { duration: 0.35, ease: snap },
          }}
        />
        {!reduceMotion &&
          WORDMARK_LETTER_CLIPS.map((_, index) => (
            <motion.path
              key={`blue-letter-${index}`}
              className="animated-logo__letter-sweep"
              d={WORDMARK_PATH}
              fill="#00ACFB"
              clipPath={`url(#logo-letter-clip-${uid}-${index})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: D.textBlueSweepDuration,
                delay: D.textBlueSweepDelay + index * D.textBlueSweepStep,
                ease: snap,
                times: [0, 0.18, 0.62, 1],
              }}
            />
          ))}
      </g>
    </motion.svg>
  );
}

export function AnimatedLogo({ className, imageClassName }: AnimatedLogoProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isCoarse = useCoarsePointer();
  const canHover = useCanHover();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const textHovered = hoveredPath === pathname;

  const handlePointerEnter = () => {
    if (canHover) setHoveredPath(pathname);
  };

  const handlePointerLeave = () => {
    setHoveredPath(null);
  };

  const handleNavigate = () => {
    setHoveredPath(null);
  };

  return (
    <Link
      href="/"
      aria-label="Mendifly — Inicio"
      className={cn(
        "animated-logo-link inline-flex shrink-0 items-center",
        className,
      )}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onFocus={handlePointerEnter}
      onBlur={handlePointerLeave}
      onClick={handleNavigate}
    >
      <AnimatedLogoGraphic
        key={pathname}
        imageClassName={imageClassName}
        reduceMotion={!!reduceMotion}
        compact={isCoarse}
        textHovered={textHovered}
      />
    </Link>
  );
}
