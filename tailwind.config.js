import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#5FC8DA',
        'primary-dark': '#4BA3B2',
        'primary-light': '#7DD4E3',
        dark: '#121212',
        'dark-light': '#1A1A1A',
        'light-accent': '#E0F7FA',
        'light-secondary': '#B2EBF2',
        brand: "hsl(var(--brand))",
        "brand-foreground": "hsl(var(--brand-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      maxWidth: {
        container: "80rem",
      },
      boxShadow: {
        glow: "0 0 80px 20px rgba(95, 200, 218, 0.3), 0 0 160px 60px rgba(95, 200, 218, 0.15)",
        "glow-lg": "0 0 120px 40px rgba(95, 200, 218, 0.4), 0 0 200px 80px rgba(95, 200, 218, 0.2)",
      },
      keyframes: {
        appear: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "appear-zoom": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glitch-1": {
          "0%": { clipPath: "inset(20% 0 80% 0)", transform: "translate(-2px, 1px)" },
          "20%": { clipPath: "inset(60% 0 10% 0)", transform: "translate(2px, -1px)" },
          "40%": { clipPath: "inset(40% 0 50% 0)", transform: "translate(-2px, 2px)" },
          "60%": { clipPath: "inset(80% 0 5% 0)", transform: "translate(2px, -2px)" },
          "80%": { clipPath: "inset(10% 0 70% 0)", transform: "translate(-1px, 1px)" },
          "100%": { clipPath: "inset(30% 0 50% 0)", transform: "translate(1px, -1px)" },
        },
        "glitch-2": {
          "0%": { clipPath: "inset(10% 0 60% 0)", transform: "translate(2px, -1px)" },
          "20%": { clipPath: "inset(80% 0 5% 0)", transform: "translate(-2px, 2px)" },
          "40%": { clipPath: "inset(30% 0 20% 0)", transform: "translate(2px, 1px)" },
          "60%": { clipPath: "inset(10% 0 80% 0)", transform: "translate(-1px, -2px)" },
          "80%": { clipPath: "inset(50% 0 30% 0)", transform: "translate(1px, 2px)" },
          "100%": { clipPath: "inset(70% 0 10% 0)", transform: "translate(-2px, -1px)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "aurora-slow": {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0.25" },
        },
        "aurora-slow-reverse": {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.2" },
        },
        "fade-in-up": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "0.6",
            transform: "scale(1)"
          },
          "50%": { 
            opacity: "1",
            transform: "scale(1.05)"
          }
        },
      },
      animation: {
        appear: "appear 0.5s ease-out forwards",
        "appear-zoom": "appear-zoom 0.5s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glitch-1": "glitch-1 2.5s infinite linear alternate-reverse",
        "glitch-2": "glitch-2 3s infinite linear alternate-reverse",
        "marquee": "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "aurora-slow": "aurora-slow 20s ease-in-out infinite",
        "aurora-slow-reverse": "aurora-slow-reverse 25s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.6s ease-out forwards",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      }
    },
  },
  plugins: [
    typography,
  ],
};