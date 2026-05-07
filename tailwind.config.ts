import type { Config } from "tailwindcss";

/**
 * Tailwind v4 는 CSS-first(@theme in app/globals.css) 가 1차 진실이지만,
 * 이 파일은 같은 컬러 팔레트를 TS 객체로 미러링해두어
 * (a) IDE 자동완성/문서화, (b) 향후 v3 호환 환경 이전 시 그대로 사용 가능하도록 한다.
 *
 * 디자인 레퍼런스: mockup/index.html  (워밋 라이트 — "아침 부엌 햇살")
 */

export const palette = {
  // surfaces
  canvas:    "#faf6ed",
  paper:     "#ffffff",
  surface:   "rgba(60, 45, 25, 0.025)",
  "surface-2": "rgba(60, 45, 25, 0.045)",

  // lines
  line:        "rgba(60, 45, 25, 0.08)",
  "line-strong": "rgba(60, 45, 25, 0.14)",

  // ink (text)
  ink:    "#2a2620",
  "ink-2": "#6b6359",
  "ink-3": "#a89f93",

  // resisted — 참았어
  resisted:        "#b8923f",
  "resisted-soft": "rgba(184, 146, 63, 0.10)",
  "resisted-glow": "rgba(184, 146, 63, 0.22)",
  "resisted-deep": "#856721",

  // aligned — 해냈어
  aligned:        "#5a8d6e",
  "aligned-soft": "rgba(90, 141, 110, 0.12)",

  // procrastinated — 미뤘어
  procras:        "#7e8a9b",
  "procras-soft": "rgba(126, 138, 155, 0.12)",

  // relapsed — 또 했어
  relapsed:        "#b56b58",
  "relapsed-soft": "rgba(181, 107, 88, 0.12)",

  // accent — present / 회고
  present:        "#8975c8",
  "present-soft": "rgba(137, 117, 200, 0.12)",
} as const;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: palette,
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft:  "0 1px 2px rgba(60, 45, 25, 0.06)",
        card:  "0 4px 14px rgba(60, 45, 25, 0.08)",
        float: "0 24px 60px rgba(60, 45, 25, 0.18)",
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
};

export default config;
