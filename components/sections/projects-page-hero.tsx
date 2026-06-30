"use client";

import { FadeUp } from "@/components/ui/fade-up";
import { projectsPageCopy } from "@/lib/projects-data";

export function ProjectsPageHero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 md:pb-20 md:pt-16">
        <FadeUp delay={0.1}>
          <p className="text-xs font-medium uppercase tracking-widest text-cyan-500/80 sm:text-sm">
            {projectsPageCopy.moduleLabel}
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-[1.75rem] font-semibold leading-[1.1] tracking-tight text-white sm:mt-4 sm:text-4xl sm:leading-[1.08] md:text-5xl lg:text-6xl">
            {projectsPageCopy.title}{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              {projectsPageCopy.titleAccent}
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:mt-6 sm:text-base md:text-lg md:text-zinc-400">
            {projectsPageCopy.subtitle}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
