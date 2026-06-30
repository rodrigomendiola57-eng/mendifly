"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
}

export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: TextRevealProps) {
  const words = text.split(" ");

  return (
    <Tag className={cn(className)}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 1, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.55,
            delay: delay + index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mr-[0.28em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
