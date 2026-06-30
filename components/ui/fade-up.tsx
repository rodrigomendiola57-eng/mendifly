"use client";

import type { ReactNode } from "react";
import { motion, type Transition } from "framer-motion";

import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
}

const transition = (delay: number): Transition => ({
  duration: 0.7,
  delay,
  ease: [0.22, 1, 0.36, 1],
});

export function FadeUp({
  children,
  className,
  delay = 0,
  inView = false,
}: FadeUpProps) {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className={cn(className)}>{children}</div>;
  }

  if (inView) {
    return (
      <motion.div
        initial={{ opacity: 1, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={transition(delay)}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition(delay)}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
