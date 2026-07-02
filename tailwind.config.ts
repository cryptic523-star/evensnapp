import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        bg: "#0c0c0e",
        s1: "#111113",
        s2: "#17171a",
        s3: "#1e1e22",
        b1: "#252529",
        b2: "#32323a",
        b3: "#454550",
        t1: "#f0f0f2",
        t2: "#9898aa",
        t3: "#55555f",
        t4: "#2e2e35",
        accent: { DEFAULT: "#2563eb", dark: "#1d4ed8" },
        green: "#22c55e",
        amber: "#f59e0b",
        red: "#ef4444",
        border: "#252529",
        input: "#17171a",
        ring: "#2563eb",
        background: "#0c0c0e",
        foreground: "#f0f0f2",
        primary: { DEFAULT: "#2563eb", foreground: "#ffffff" },
        secondary: { DEFAULT: "#17171a", foreground: "#f0f0f2" },
        muted: { DEFAULT: "#17171a", foreground: "#9898aa" },
        card: { DEFAULT: "#111113", foreground: "#f0f0f2" },
        destructive: { DEFAULT: "#ef4444", foreground: "#ffffff" },
      },
      borderRadius: { lg: "13px", md: "9px", sm: "6px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
