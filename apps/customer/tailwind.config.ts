import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        ink: "hsl(var(--ink))",
        "ink-soft": "hsl(var(--ink-soft))",
        paper: "hsl(var(--paper))",
        "bg-2": "hsl(var(--bg-2))",
        lime: "hsl(var(--lime))",
        coral: "hsl(var(--coral))",
        grape: "hsl(var(--grape))",
        sky: "hsl(var(--sky))",
        leaf: "hsl(var(--leaf))",
        rose: "hsl(var(--rose))"
      },
      fontFamily: {
        display: ["var(--font-display)", "Bricolage Grotesque", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "Be Vietnam Pro", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        brutal: "4px 4px 0 0 hsl(var(--foreground))",
        "brutal-sm": "2px 2px 0 0 hsl(var(--foreground))",
        "brutal-lg": "6px 6px 0 0 hsl(var(--foreground))"
      },
      backgroundImage: {
        "body-bloom":
          "radial-gradient(circle at 8% 12%, hsl(var(--rose) / 0.32) 0, transparent 28%), radial-gradient(circle at 92% 78%, hsl(var(--sky) / 0.28) 0, transparent 32%), radial-gradient(circle at 50% 100%, hsl(var(--lime) / 0.22) 0, transparent 38%)"
      }
    }
  },
  plugins: []
};

export default config;
