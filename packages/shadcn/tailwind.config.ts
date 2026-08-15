import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// This config only scans this package's own source. The compiled CSS is
// shipped in dist/styles.css — consuming apps never need their own Tailwind
// setup or a content path pointing into this package.
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--nc-border) / <alpha-value>)",
        input: "hsl(var(--nc-input) / <alpha-value>)",
        ring: "hsl(var(--nc-ring) / <alpha-value>)",
        background: "hsl(var(--nc-background) / <alpha-value>)",
        foreground: "hsl(var(--nc-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--nc-primary) / <alpha-value>)",
          foreground: "hsl(var(--nc-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--nc-secondary) / <alpha-value>)",
          foreground: "hsl(var(--nc-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--nc-destructive) / <alpha-value>)",
          foreground: "hsl(var(--nc-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--nc-muted) / <alpha-value>)",
          foreground: "hsl(var(--nc-muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--nc-accent) / <alpha-value>)",
          foreground: "hsl(var(--nc-accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--nc-popover) / <alpha-value>)",
          foreground: "hsl(var(--nc-popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--nc-card) / <alpha-value>)",
          foreground: "hsl(var(--nc-card-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--nc-success) / <alpha-value>)",
          foreground: "hsl(var(--nc-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--nc-warning) / <alpha-value>)",
          foreground: "hsl(var(--nc-warning-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--nc-info) / <alpha-value>)",
          foreground: "hsl(var(--nc-info-foreground) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--nc-sidebar) / <alpha-value>)",
          foreground: "hsl(var(--nc-sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--nc-sidebar-border) / <alpha-value>)",
          accent: "hsl(var(--nc-sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--nc-sidebar-accent-foreground) / <alpha-value>)",
          primary: "hsl(var(--nc-sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--nc-sidebar-primary-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--nc-radius)",
        md: "calc(var(--nc-radius) - 2px)",
        sm: "calc(var(--nc-radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
