"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

type Tone = "neutral" | "muted" | "resisted" | "aligned" | "procras" | "relapsed" | "present";
type Size = "xs" | "sm";

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
  interactive?: boolean;
}

const toneMap: Record<Tone, string> = {
  neutral:  "border-line text-ink-3 bg-transparent",
  muted:    "border-line text-ink-2 bg-surface-2",
  resisted: "border-resisted/30 text-resisted-deep bg-resisted-soft",
  aligned:  "border-aligned/30 text-aligned bg-aligned-soft",
  procras:  "border-procras/30 text-procras bg-procras-soft",
  relapsed: "border-relapsed/30 text-relapsed bg-relapsed-soft",
  present:  "border-present/30 text-present bg-present-soft",
};

const sizeMap: Record<Size, string> = {
  xs: "text-[10.5px] px-2 py-[3px]",
  sm: "text-[12.5px] px-3 py-[7px]",
};

export const Pill = forwardRef<HTMLSpanElement, PillProps>(function Pill(
  { tone = "neutral", size = "xs", interactive, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-pill border leading-none",
        toneMap[tone],
        sizeMap[size],
        interactive && "cursor-pointer hover:bg-surface-2 transition-colors",
        className,
      )}
      {...rest}
    />
  );
});
