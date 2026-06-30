"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

import { useCoarsePointer } from "@/hooks/use-coarse-pointer";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({
  children,
  className,
  strength = 0.2,
}: MagneticProps) {
  const isCoarse = useCoarsePointer();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
    });
  };

  const handleLeave = () => setPosition({ x: 0, y: 0 });

  if (isCoarse) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.4 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
