import type { IconType } from "react-icons";
import {
  SiDocker,
  SiGo,
  SiKubernetes,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbBrandAws, TbBrandAzure } from "react-icons/tb";
import { Database } from "lucide-react";

import { cn } from "@/lib/utils";

const techLogoMap: Record<string, IconType> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  Python: SiPython,
  "Node.js": SiNodedotjs,
  Java: SiOpenjdk,
  Go: SiGo,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Docker: SiDocker,
  AWS: TbBrandAws,
  Azure: TbBrandAzure,
  Kubernetes: SiKubernetes,
};

interface TechLogoProps {
  name: string;
  className?: string;
}

export function TechLogo({ name, className }: TechLogoProps) {
  if (name === "SQL") {
    return (
      <Database
        className={cn("text-current", className)}
        aria-hidden
      />
    );
  }

  const Icon = techLogoMap[name];

  if (!Icon) {
    return (
      <span className={cn("font-mono text-xs font-semibold", className)}>
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <Icon
      className={cn("text-current", className)}
      aria-hidden
    />
  );
}
