"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center font-medium select-none " +
  "transition-[transform,opacity,background-color,box-shadow] duration-150 " +
  "active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-resisted/40";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper border border-ink shadow-[0_8px_22px_rgba(42,38,32,0.18)] hover:opacity-95",
  secondary:
    "bg-paper text-ink border border-line shadow-soft hover:bg-surface",
  ghost:
    "bg-transparent text-ink-2 border border-line hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px] rounded-xl",
  md: "h-12 px-5 text-[14px] rounded-2xl",
  lg: "h-14 px-5 text-[15px] rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", fullWidth, className, type, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      />
    );
  },
);
