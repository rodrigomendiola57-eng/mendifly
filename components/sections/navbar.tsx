"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { AnimatedLogo } from "@/components/ui/animated-logo";
import { Button } from "@/components/ui/button";
import { GooeyNav } from "@/components/ui/gooey-nav";
import { StaggeredMenu } from "@/components/ui/staggered-menu";
import { useMobileNavScrollBg } from "@/hooks/use-mobile-nav-scroll-bg";
import { navLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const staggeredItems = navLinks.map((link) => ({
  label: link.label,
  ariaLabel: `Ir a ${link.label}`,
  link: link.href,
}));

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { opacity: mobileHeaderBg, instant: mobileHeaderBgInstant } =
    useMobileNavScrollBg();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Barra desktop (pill) */}
      <header className="fixed inset-x-0 top-0 z-50 hidden px-6 pt-3 md:block">
        <motion.div
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav
            className={cn(
              "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border px-6 transition-all duration-500",
              scrolled
                ? "border-cyan-500/15 bg-[#050505]/80 shadow-[0_0_20px_rgba(6,182,212,0.06),0_0_30px_rgba(139,92,246,0.08)] backdrop-blur-xl"
                : "border-white/[0.06] bg-[#050505]/40 backdrop-blur-md",
            )}
          >
            <AnimatedLogo />

            <GooeyNav
              items={navLinks.map((link) => ({
                label: link.label,
                href: link.href,
              }))}
              pathname={pathname}
              variant="navbar"
              particleCount={10}
              animationTime={350}
              timeVariance={120}
            />

            <Button asChild size="sm">
              <Link href="/contacto">Agendar consulta</Link>
            </Button>
          </nav>
        </motion.div>
      </header>

      {/* Menú móvil (StaggeredMenu — el CSS lo oculta en desktop) */}
      <StaggeredMenu
        isFixed
        position="right"
        items={staggeredItems}
        displaySocials={false}
        displayItemNumbering
        colors={["#8b5cf6", "#06b6d4"]}
        accentColor="#22d3ee"
        logo={
          <AnimatedLogo imageClassName="h-[34px] w-auto max-w-[150px] sm:max-w-[170px]" />
        }
        headerBgOpacity={mobileHeaderBg}
        headerBgInstant={mobileHeaderBgInstant}
      />
    </>
  );
}
