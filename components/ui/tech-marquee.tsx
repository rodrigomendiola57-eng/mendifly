"use client";

import { TechLogo } from "@/components/ui/tech-logo";
import { technologies } from "@/lib/technologies-data";
import { techUrls } from "@/lib/tech-urls";
import { cn } from "@/lib/utils";

interface TechMarqueeProps {
  className?: string;
}

export function TechMarquee({ className }: TechMarqueeProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden py-2",
        // fade edges
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        "max-md:w-screen max-md:max-w-[100vw] max-md:relative max-md:left-1/2 max-md:-translate-x-1/2",
        className,
      )}
      role="region"
      aria-label="Tecnologías del stack Menditech"
    >
      {/* Two identical strips so the loop is seamless */}
      <div className="flex w-max animate-tech-marquee [animation-play-state:running] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center gap-12 px-6"
            aria-hidden={copy > 0}
          >
            {technologies.map((tech) => (
              <li key={tech.name} className="flex-none">
                <a
                  href={techUrls[tech.name]}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={tech.name}
                  title={tech.name}
                  className="group block"
                >
                  <TechLogo
                    name={tech.name}
                    className="h-9 w-9 text-zinc-500 transition-colors duration-300 group-hover:text-white"
                  />
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
