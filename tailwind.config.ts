import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Abismo Focado
        slate: {
          800: '#1E293B', // Superfícies e Editor
          900: '#0F172A', // Fundo Principal
        },
        indigo: {
          600: '#4F46E5', // Cor de Interação e Foco
        },
        emerald: {
          600: '#059669', // Feedbacks Discretos
        }
      },
      fontFamily: {
        // Mapeando as variáveis CSS do layout.tsx para classes do Tailwind
        sans: ['var(--font-lora)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        script: ['var(--font-caveat)', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;