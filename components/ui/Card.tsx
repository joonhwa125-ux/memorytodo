"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

type Padding = "none" | "sm" | "md" | "lg";
type Tone = "paper" | "surface";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: Padding;
  tone?: Tone;
  /** 그림자 강조 (default: soft) */
  elevated?: boolean;
}

const padMap: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

const toneMap: Record<Tone, string> = {
  paper: "bg-paper border border-line",
  surface: "bg-surface border border-line",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = "md", tone = "paper", elevated, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[18px]",
        toneMap[tone],
        padMap[padding],
        elevated ? "shadow-card" : "shadow-soft",
        className,
      )}
      {...rest}
    />
  );
});
