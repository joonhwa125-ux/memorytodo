"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

type Size = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** 표시 이름. 첫 글자가 아바타에 보인다. */
  name: string;
  size?: Size;
}

const sizeMap: Record<Size, string> = {
  sm: "w-9 h-9 text-sm rounded-xl",
  md: "w-11 h-11 text-base rounded-[14px]",
  lg: "w-14 h-14 text-lg rounded-2xl",
};

function firstGlyph(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "·";
  // 한글/영문 무관하게 첫 글자 1자
  return Array.from(trimmed)[0]!;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { name, size = "md", className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-label={name}
      className={cn(
        "grid place-items-center font-semibold text-resisted-deep shadow-soft",
        "bg-[linear-gradient(135deg,#f0e6cf,#d8c79a)]",
        sizeMap[size],
        className,
      )}
      {...rest}
    >
      <span className="leading-none">{firstGlyph(name)}</span>
    </div>
  );
});
