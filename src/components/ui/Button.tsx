"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { goldHoverGlow, springTransition } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-is-mounted";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-gradient text-dark-900 font-semibold shadow-gold-soft hover:shadow-gold-lg hover:brightness-105",
  secondary:
    "bg-dark-700/80 text-gold-400 border border-gold-500/30 backdrop-blur-sm hover:bg-gold-500/10 hover:border-gold-500/50 hover:shadow-gold-soft",
  outline:
    "border border-white/20 text-white backdrop-blur-sm hover:border-gold-500/50 hover:text-gold-400 hover:bg-white/[0.03]",
  ghost: "text-white/70 hover:text-gold-400 hover:bg-white/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg min-h-[36px]",
  md: "px-6 py-3 text-base rounded-xl min-h-[44px]",
  lg: "px-8 py-4 text-base sm:text-lg rounded-xl min-h-[52px]",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  disabled,
  type = "button",
  onClick,
  onSubmit,
  name,
  value,
  id,
  form,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.button
      type={type}
      onClick={onClick}
      onSubmit={onSubmit}
      name={name}
      value={value}
      id={id}
      form={form}
      aria-label={ariaLabel}
      // Keep tabIndex stable across SSR/client — Framer only emits it when
      // whileTap is set; reduced-motion must not change that during hydrate.
      tabIndex={0}
      whileHover={
        isDisabled || reduceMotion
          ? undefined
          : {
              scale: 1.02,
              y: -1,
              boxShadow:
                variant === "primary" || variant === "secondary"
                  ? goldHoverGlow
                  : undefined,
            }
      }
      whileTap={isDisabled || reduceMotion ? undefined : { scale: 0.98 }}
      transition={springTransition}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group",
        variants[variant],
        sizes[size],
        variant === "primary" && "btn-shine",
        className
      )}
      disabled={isDisabled}
      aria-busy={isLoading}
    >
      {variant === "primary" && !isDisabled && (
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
          }}
        />
      )}
      {isLoading ? (
        <span className="relative z-10 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Wird gesendet...
        </span>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      )}
    </motion.button>
  );
}
