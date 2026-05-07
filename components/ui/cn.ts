/**
 * 클래스명 결합 헬퍼.
 * clsx 의존성을 추가하지 않기 위한 최소 구현.
 */
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
      return;
    }
    if (Array.isArray(v)) v.forEach(walk);
  };
  inputs.forEach(walk);
  return out.join(" ");
}
