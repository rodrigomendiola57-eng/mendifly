"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useHydrated } from "@/hooks/use-hydrated";
import type { ProjectGalleryImage } from "@/lib/projects-data";
import { cn } from "@/lib/utils";

interface ProjectImageLightboxProps {
  images: ProjectGalleryImage[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  projectTitle: string;
}

export function ProjectImageLightbox({
  images,
  initialIndex,
  open,
  onClose,
  projectTitle,
}: ProjectImageLightboxProps) {
  const hydrated = useHydrated();
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const count = images.length;
  const current = images[index];

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, prev, next]);

  if (!hydrated) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada: ${projectTitle}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-md md:flex md:flex-col"
          onClick={onClose}
        >
          <div
            className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent px-4 py-3 sm:px-6 md:relative md:z-auto md:bg-transparent md:from-transparent md:via-transparent"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="min-w-0 pr-4">
              <p className="truncate font-display text-sm font-medium text-white sm:text-base">
                {projectTitle}
              </p>
              {current.label && (
                <p className="mt-0.5 text-xs uppercase tracking-wider text-zinc-400">
                  {current.label}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-white"
              aria-label="Cerrar vista ampliada"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div
            className="flex h-full w-full items-center justify-center px-4 py-16 md:relative md:flex-1 md:py-0 md:pb-8 md:pt-0 sm:px-8"
            onClick={(event) => event.stopPropagation()}
          >
            {count > 1 && (
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 z-10 p-2 text-white/60 transition-colors hover:text-white sm:left-4"
                aria-label="Captura anterior"
              >
                <ChevronLeft className="h-8 w-8 stroke-[1.5]" />
              </button>
            )}

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex max-h-[min(72dvh,calc(100dvh-9rem))] w-full max-w-[min(100%,72rem)] items-center justify-center md:max-h-[calc(100dvh-8rem)]"
            >
              {/* img nativo: sin reescalado por encima del tamaño real del archivo (~1024px) */}
              <img
                src={current.src}
                alt={current.alt}
                decoding="sync"
                fetchPriority="high"
                className="h-auto max-h-[min(72dvh,calc(100dvh-9rem))] w-auto max-w-full object-contain md:max-h-[calc(100dvh-8rem)]"
                style={{
                  maxWidth: "min(100%, 1024px)",
                  imageRendering: "auto",
                }}
              />
            </motion.div>

            {count > 1 && (
              <button
                type="button"
                onClick={next}
                className="absolute right-2 z-10 p-2 text-white/60 transition-colors hover:text-white sm:right-4"
                aria-label="Captura siguiente"
              >
                <ChevronRight className="h-8 w-8 stroke-[1.5]" />
              </button>
            )}
          </div>

          {count > 1 && (
            <div
              className="absolute inset-x-0 bottom-0 z-20 flex justify-center gap-2 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent px-4 pb-6 pt-8 md:relative md:z-auto md:bg-transparent md:from-transparent md:via-transparent md:pt-0"
              onClick={(event) => event.stopPropagation()}
            >
              {images.map((image, dotIndex) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => goTo(dotIndex)}
                  className="flex h-8 min-w-8 items-center justify-center"
                  aria-label={`Ir a captura: ${image.label ?? image.alt}`}
                  aria-current={dotIndex === index ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-300",
                      dotIndex === index
                        ? "h-2 w-6 bg-cyan-400"
                        : "h-2 w-2 bg-zinc-600",
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
