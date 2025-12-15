import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["'Noto Serif TC'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-60px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(60px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "page-flip-in-left": {
          "0%": { opacity: "0", transform: "translateX(-80px) scale(0.95)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)", filter: "blur(0)" },
        },
        "page-flip-in-right": {
          "0%": { opacity: "0", transform: "translateX(80px) scale(0.95)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)", filter: "blur(0)" },
        },
        "page-flip-out-left": {
          "0%": { opacity: "1", transform: "translateX(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateX(-80px) scale(0.95)" },
        },
        "page-flip-out-right": {
          "0%": { opacity: "1", transform: "translateX(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateX(80px) scale(0.95)" },
        },
        "cover-reveal": {
          "0%": { opacity: "0", transform: "scale(0.6) rotateY(-15deg)", filter: "blur(10px)" },
          "50%": { opacity: "0.8", transform: "scale(1.05) rotateY(5deg)", filter: "blur(0px)" },
          "100%": { opacity: "1", transform: "scale(1) rotateY(0deg)", filter: "blur(0px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 30px hsl(var(--primary) / 0.3), 0 0 60px hsl(var(--primary) / 0.15)" },
          "50%": { boxShadow: "0 0 50px hsl(var(--primary) / 0.5), 0 0 100px hsl(var(--primary) / 0.25)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "breathe": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.02)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "text-glow": {
          "0%, 100%": { textShadow: "0 0 20px rgba(251, 191, 36, 0.3)" },
          "50%": { textShadow: "0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.3)" },
        },
        "card-hover": {
          "0%": { transform: "translateY(0) scale(1)" },
          "100%": { transform: "translateY(-8px) scale(1.02)" },
        },
        "dialog-enter": {
          "0%": { opacity: "0", transform: "translate(-50%, -48%) scale(0.9)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)", filter: "blur(0)" },
        },
        "dialog-exit": {
          "0%": { opacity: "1", transform: "translate(-50%, -50%) scale(1)", filter: "blur(0)" },
          "100%": { opacity: "0", transform: "translate(-50%, -48%) scale(0.95)", filter: "blur(4px)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "page-flip-in-left": "page-flip-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "page-flip-in-right": "page-flip-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "page-flip-out-left": "page-flip-out-left 0.3s ease-in forwards",
        "page-flip-out-right": "page-flip-out-right 0.3s ease-in forwards",
        "cover-reveal": "cover-reveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "float": "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "breathe": "breathe 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "orbit": "orbit 15s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        "text-glow": "text-glow 3s ease-in-out infinite",
        "card-hover": "card-hover 0.3s ease-out forwards",
        "dialog-enter": "dialog-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "dialog-exit": "dialog-exit 0.25s ease-in forwards",
        "slide-down": "slide-down 0.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
