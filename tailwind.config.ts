import type { Config } from "tailwindcss";

const config: Config = {
    // Ativa o modo dark por padrão para manter o "Abismo Focado"
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapeamento obrigatório para os componentes Shadcn
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Nossa paleta personalizada "Abismo Focado"
        slate: {
          800: '#1E293B',
          900: '#0F172A',
        },
        indigo: {
          600: '#4F46E5',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-lora)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        script: ['var(--font-caveat)', 'cursive'],
      },
    },
  },
  plugins: [require("tailwindcss-animate"),
            require("@tailwindcss/typography"),
  ],
};
export default config;