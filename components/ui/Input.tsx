"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./cn";

type Variant = "underline" | "boxed";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
  /** underline 변형에서만 의미 있음 — 큰 타이포 */
  display?: boolean;
}

const variantMap: Record<Variant, string> = {
  underline:
    "bg-transparent border-0 border-b-[1.5px] border-ink rounded-none px-0 py-2 " +
    "placeholder:text-ink-3 focus:outline-none",
  boxed:
    "bg-paper border border-line rounded-xl px-3 py-2.5 text-[14px] " +
    "placeholder:text-ink-3 focus:outline-none focus:border-line-strong",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = "boxed", display, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full text-ink font-sans",
        variantMap[variant],
        variant === "underline" && display && "text-2xl font-normal",
        className,
      )}
      {...rest}
    />
  );
});
