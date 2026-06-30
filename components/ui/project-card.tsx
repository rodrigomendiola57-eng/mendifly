"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Lock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ProjectImageLightbox } from "@/components/ui/project-image-lightbox";
import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import {
  getProjectKindLabel,
  projectCategoryLabels,
  projectsPageCopy,
  type ProjectGalleryImage,
  type ProjectItem,
} from "@/lib/projects-data";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
}

const categoryAccent: Record<
  ProjectItem["category"],
  { badge: string; dot: string; placeholder: string }
> = {
  web: {
    badge: "border-cyan-500/25 bg-cyan-500/10 text-cyan-300",
    dot: "bg-cyan-400",
    placeholder: "from-cyan-950/80 via-zinc-900 to-zinc-950",
  },
  sistemas: {
    badge: "border-violet-500/25 bg-violet-500/10 text-violet-300",
    dot: "bg-violet-400",
    placeholder: "from-violet-950/80 via-zinc-900 to-zinc-950",
  },
  ecommerce: {
    badge: "border-sky-500/25 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
    placeholder: "from-sky-950/80 via-zinc-900 to-zinc-950",
  },
  automatizacion: {
    badge: "border-blue-500/25 bg-blue-500/10 text-blue-300",
    dot: "bg-blue-400",
    placeholder: "from-blue-950/80 via-zinc-900 to-zinc-950",
  },
};

const GALLERY_INTERVAL_MS = 5500;
const SWIPE_OFFSET = 40;
const SWIPE_VELOCITY = 260;

function ProjectCoverGallery({
  images,
  projectTitle,
  enableLightbox = false,
}: {
  images: ProjectGalleryImage[];
  projectTitle: string;
  enableLightbox?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const isCoarse = useCoarsePointer();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);

  const count = images.length;

  const goTo = useCallback(
    (next: number, dir: number) => {
      setHasInteracted(true);
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > 8) didDrag.current = true;
    if (offset.x < -SWIPE_OFFSET || velocity.x < -SWIPE_VELOCITY) {
      next();
      return;
    }
    if (offset.x > SWIPE_OFFSET || velocity.x > SWIPE_VELOCITY) {
      prev();
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    didDrag.current = false;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!enableLightbox || !isCoarse || didDrag.current) return;
    const dx = Math.abs(event.clientX - pointerStart.current.x);
    const dy = Math.abs(event.clientY - pointerStart.current.y);
    if (dx < 10 && dy < 10) {
      setLightboxOpen(true);
    }
  };

  const stopNavEvent = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (reduceMotion || count <= 1 || paused || hasInteracted || isCoarse) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % count);
    }, GALLERY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [count, paused, reduceMotion, hasInteracted, isCoarse]);

  const slideOffset = direction * (isCoarse ? 56 : 48);
  const current = images[index];

  const navButtonClass = cn(
    "absolute top-1/2 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center p-1 text-black transition-opacity",
    "drop-shadow-[0_0_4px_rgba(255,255,255,0.9)]",
    "hover:opacity-75 active:opacity-55",
    "md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
    "opacity-100 focus-visible:outline-none",
  );

  return (
    <div className="shrink-0">
      <div
        className="relative aspect-[2/1] w-full overflow-hidden bg-zinc-950"
        role="region"
        aria-roledescription="carrusel"
        aria-label={`Capturas de ${projectTitle}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false);
          }
        }}
      >
        <motion.div
          drag={isCoarse && count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => {
            didDrag.current = false;
          }}
          onDrag={(_, info) => {
            if (Math.abs(info.offset.x) > 8) didDrag.current = true;
          }}
          onDragEnd={handleDragEnd}
          onPointerDown={enableLightbox && isCoarse ? handlePointerDown : undefined}
          onPointerUp={enableLightbox && isCoarse ? handlePointerUp : undefined}
          className={cn("absolute inset-0", isCoarse && count > 1 && "touch-pan-y")}
        >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: slideOffset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slideOffset }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {!imageErrors[index] ? (
              <Image
                src={current.src}
                alt={current.alt}
                fill
                unoptimized
                quality={95}
                className={cn(
                  "transition-transform duration-500 md:group-hover:scale-[1.02]",
                  current.objectFit === "contain"
                    ? "object-contain object-center p-1.5 sm:p-3"
                    : "object-cover object-top",
                )}
                sizes="100vw"
                onError={() =>
                  setImageErrors((prev) => ({ ...prev, [index]: true }))
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-950/80 via-zinc-900 to-zinc-950 p-6 text-center text-sm text-zinc-500">
                Vista no disponible
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-zinc-950/20"
      />

      {enableLightbox && !isCoarse && (
        <button
          type="button"
          className="absolute inset-0 z-[5] cursor-pointer border-0 bg-transparent p-0"
          aria-label={`Ampliar captura: ${current.label ?? current.alt}`}
          onClick={() => setLightboxOpen(true)}
        />
      )}

      {current.label && (
        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10 sm:left-3 sm:top-3">
          <span className="rounded-full border border-white/10 bg-zinc-950/70 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm sm:px-2.5 sm:py-1 sm:text-xs">
            {current.label}
          </span>
        </div>
      )}

        {count > 1 && (
          <>
            <button
              type="button"
              onPointerDown={stopNavEvent}
              onPointerUp={stopNavEvent}
              onClick={(event) => {
                event.stopPropagation();
                prev();
              }}
              className={cn(navButtonClass, "left-1 sm:left-2")}
              aria-label="Captura anterior"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2] md:h-5 md:w-5" />
            </button>
            <button
              type="button"
              onPointerDown={stopNavEvent}
              onPointerUp={stopNavEvent}
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              className={cn(navButtonClass, "right-1 sm:right-2")}
              aria-label="Captura siguiente"
            >
              <ChevronRight className="h-6 w-6 stroke-[2] md:h-5 md:w-5" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex flex-col items-center gap-1 border-b border-zinc-800/60 bg-zinc-950/50 px-3 py-2.5">
          <div className="flex justify-center gap-2">
            {images.map((image, dotIndex) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goTo(dotIndex, dotIndex > index ? 1 : -1)}
                className="flex h-8 min-w-8 items-center justify-center"
                aria-label={`Ir a captura: ${image.label ?? image.alt}`}
                aria-current={dotIndex === index ? "true" : undefined}
              >
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    dotIndex === index
                      ? "h-2 w-6 bg-cyan-400"
                      : "h-2 w-2 bg-zinc-500",
                  )}
                />
              </button>
            ))}
          </div>
          {isCoarse && (
            <p className="text-[0.65rem] font-medium uppercase tracking-widest text-zinc-500">
              {enableLightbox ? "Desliza o toca para ampliar" : "Desliza para ver capturas"}
            </p>
          )}
        </div>
      )}

      {enableLightbox && (
        <ProjectImageLightbox
          images={images}
          initialIndex={index}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          projectTitle={projectTitle}
        />
      )}
    </div>
  );
}

function ProjectCover({
  project,
  accent,
}: {
  project: ProjectItem;
  accent: (typeof categoryAccent)[ProjectItem["category"]];
}) {
  const [imageError, setImageError] = useState(false);
  const isLive = project.kind === "live-site";
  const hasGallery = (project.gallery?.length ?? 0) > 0;

  if (hasGallery) {
    return (
      <ProjectCoverGallery
        images={project.gallery!}
        projectTitle={project.title}
        enableLightbox={!isLive}
      />
    );
  }

  const showImage = project.coverImage && !imageError;
  const isSvg = project.coverImage?.endsWith(".svg") ?? false;
  const isRaster = /\.(png|jpe?g|webp|avif)$/i.test(project.coverImage ?? "");

  const placeholder = (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br p-6 text-center",
        accent.placeholder,
      )}
    >
      {isLive ? (
        <>
          <span className="font-display text-lg font-semibold text-white/90 sm:text-xl">
            {project.clientName}
          </span>
          {project.externalUrl && (
            <span className="mt-2 font-mono text-xs text-zinc-500">
              {project.externalUrl.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </span>
          )}
        </>
      ) : (
        <>
          <Lock className="mb-3 h-8 w-8 text-violet-400/70" strokeWidth={1.5} />
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Sistema interno
          </span>
          <span className="mt-2 max-w-[220px] text-sm text-zinc-400">
            Vista representativa del sistema desarrollado
          </span>
        </>
      )}
    </div>
  );

  const coverContent = showImage ? (
    <Image
      src={project.coverImage!}
      alt={project.coverAlt ?? project.title}
      fill
      unoptimized={isSvg || isRaster}
      quality={95}
      className="object-cover object-top transition-transform duration-500 md:group-hover:scale-[1.02]"
      sizes="100vw"
      onError={() => setImageError(true)}
    />
  ) : (
    placeholder
  );

  const coverShell = (
    <div className="relative aspect-[2/1] w-full overflow-hidden bg-zinc-950">
      {coverContent}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"
      />
      {isLive && project.externalUrl && showImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-zinc-950/80 px-4 py-2 text-sm font-medium text-cyan-300">
            <ExternalLink className="h-4 w-4" />
            {projectsPageCopy.visitSite}
          </span>
        </div>
      )}
    </div>
  );

  if (isLive && project.externalUrl) {
    return (
      <a
        href={project.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block shrink-0"
        aria-label={`${projectsPageCopy.visitSite}: ${project.title}`}
      >
        {coverShell}
      </a>
    );
  }

  return coverShell;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const accent = categoryAccent[project.category];
  const isLive = project.kind === "live-site";
  const isComingSoon = project.status === "coming-soon";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md transition-all duration-300 sm:rounded-2xl sm:bg-zinc-900/40",
        "hover:border-cyan-500/25 hover:shadow-[0_0_28px_rgba(6,182,212,0.08)]",
        className,
      )}
    >
      <ProjectCover project={project} accent={accent} />

      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider sm:px-2.5 sm:text-xs",
              accent.badge,
            )}
          >
            {projectCategoryLabels[project.category]}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider sm:text-[0.65rem]",
              isLive
                ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-400/80"
                : "border-violet-500/20 bg-violet-500/5 text-violet-400/80",
            )}
          >
            {getProjectKindLabel(project)}
          </span>
          <span className="font-mono text-xs text-white/75 sm:text-sm">{project.year}</span>
          {isComingSoon && (
            <span className="rounded-full border border-zinc-700/80 bg-zinc-800/50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-white/80">
              Próximamente
            </span>
          )}
        </div>

        <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-white sm:mt-4 sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-1 text-sm leading-snug text-white/85 sm:mt-1.5 sm:text-base">
          {project.clientName}
        </p>

        <p className="mt-2.5 text-sm leading-relaxed text-white/95 sm:mt-3 sm:text-base sm:leading-relaxed md:text-[1.05rem]">
          {project.summary}
        </p>

        <ul className="mt-4 space-y-2 border-t border-zinc-800/80 pt-4 sm:mt-5 sm:space-y-2.5 sm:pt-5">
          {project.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-sm leading-snug text-white sm:gap-2.5 sm:text-base"
            >
              <span
                className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full sm:mt-2 sm:h-1 sm:w-1", accent.dot)}
              />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="-mx-1 mt-4 overflow-x-auto px-1 pb-0.5 sm:mx-0 sm:mt-5 sm:overflow-visible sm:pb-0">
          <div className="flex w-max flex-wrap gap-1.5 sm:w-auto">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="shrink-0 rounded-md border border-zinc-700/80 bg-zinc-950/50 px-2 py-0.5 font-mono text-[0.7rem] text-white sm:px-2.5 sm:py-1 sm:text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {isLive && project.externalUrl && (
          <Button asChild size="sm" variant="secondary" className="mt-5 h-11 w-full sm:mt-6">
            <Link
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {projectsPageCopy.visitSite}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {!isLive && (
          <p className="mt-5 text-center text-xs font-medium uppercase tracking-widest text-white/75 sm:mt-6 sm:text-sm">
            {projectsPageCopy.confidentialNote}
          </p>
        )}
      </div>
    </article>
  );
}
