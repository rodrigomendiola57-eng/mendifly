import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-50 shadow-[0_0_15px_rgba(6,182,212,0.2),0_0_30px_rgba(139,92,246,0.08)] hover:border-violet-400/40 hover:from-cyan-500/15 hover:to-violet-500/15 hover:text-white hover:shadow-[0_0_25px_rgba(6,182,212,0.35),0_0_35px_rgba(139,92,246,0.2)] active:scale-[0.98]",
        secondary:
          "border border-white/10 bg-white/[0.03] text-zinc-300 backdrop-blur-sm hover:border-violet-500/25 hover:bg-violet-500/[0.04] hover:text-white active:scale-[0.98]",
        ghost:
          "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
        link: "text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
