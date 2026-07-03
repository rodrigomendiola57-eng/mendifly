import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function Logo({
  className,
  imageClassName,
  priority = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Mendifly — Inicio"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src="/logo-mendifly.png"
        alt="Mendifly"
        width={955}
        height={190}
        quality={100}
        unoptimized
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "h-9 w-auto max-w-[180px] bg-transparent object-contain object-left sm:h-11 sm:max-w-[220px]",
          imageClassName,
        )}
      />
    </Link>
  );
}
