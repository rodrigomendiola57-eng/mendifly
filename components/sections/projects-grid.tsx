"use client";

import { FadeUp } from "@/components/ui/fade-up";
import { ProjectCard } from "@/components/ui/project-card";
import { cn } from "@/lib/utils";
import {
  getInternalProjects,
  getLiveSiteProjects,
  projectsPageCopy,
} from "@/lib/projects-data";

function ProjectSection({
  eyebrow,
  title,
  description,
  projects,
  delayOffset = 0,
  columns = 2,
}: {
  eyebrow: string;
  title: string;
  description: string;
  projects: ReturnType<typeof getLiveSiteProjects>;
  delayOffset?: number;
  columns?: 2 | 3;
}) {
  if (projects.length === 0) return null;

  return (
    <div className={delayOffset > 0 ? "mt-12 sm:mt-16 md:mt-20" : undefined}>
      <FadeUp inView delay={0.05 + delayOffset} className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
        <p className="text-xs font-medium uppercase tracking-widest text-violet-400/90 sm:text-sm">
          {eyebrow}
        </p>
        <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight text-white sm:mt-3 sm:text-3xl md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-zinc-300 sm:mt-3 sm:text-base sm:text-zinc-400">
          {description}
        </p>
      </FadeUp>

      <div
        className={cn(
          "grid grid-cols-1 gap-5 sm:gap-6",
          columns === 3
            ? "md:grid-cols-2 lg:grid-cols-3"
            : "md:grid-cols-2",
        )}
      >
        {projects.map((project, index) => (
          <FadeUp
            key={project.id}
            inView
            delay={0.08 + delayOffset + index * 0.08}
            className={cn(
              "h-full",
              project.layout === "wide" && "md:col-span-2",
            )}
          >
            <ProjectCard project={project} />
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

export function ProjectsGrid() {
  const liveSites = getLiveSiteProjects();
  const internalSystems = getInternalProjects();

  return (
    <section className="relative border-t border-zinc-900/50">
      <div className="mx-auto w-full max-w-screen-2xl px-2.5 py-10 sm:px-4 sm:py-14 md:px-5 md:py-20 lg:px-6 lg:py-24 xl:max-w-[100rem]">
        <ProjectSection
          eyebrow={projectsPageCopy.liveSitesEyebrow}
          title={projectsPageCopy.liveSitesTitle}
          description={projectsPageCopy.liveSitesDescription}
          projects={liveSites}
          columns={3}
        />

        <ProjectSection
          eyebrow={projectsPageCopy.internalEyebrow}
          title={projectsPageCopy.internalTitle}
          description={projectsPageCopy.internalDescription}
          projects={internalSystems}
          delayOffset={0.1}
        />

        {liveSites.length === 0 && internalSystems.length === 0 && (
          <p className="text-center text-sm text-zinc-500">
            {projectsPageCopy.emptyState}
          </p>
        )}
      </div>
    </section>
  );
}
