"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/fade-up";
import { buildContactHref } from "@/lib/contact-data";
import { projectsPageCopy } from "@/lib/projects-data";

export function ProjectsCta() {
  return (
    <section className="relative border-t border-zinc-900/50">
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 md:py-16 lg:px-8">
        <FadeUp inView delay={0.05} className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
            {projectsPageCopy.ctaTitle}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-300 sm:mt-3 sm:text-base sm:text-zinc-400">
            {projectsPageCopy.ctaDescription}
          </p>
          <Button asChild size="lg" className="mt-6 h-12 w-full sm:mt-8 sm:w-auto">
            <Link href={buildContactHref("general")}>
              {projectsPageCopy.ctaButton}
            </Link>
          </Button>
        </FadeUp>
      </div>
    </section>
  );
}
