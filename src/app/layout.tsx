import type { Metadata } from "next";
import { Lora, Cormorant_Garamond, Caveat } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";

// Configuração das fontes otimizadas
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apokryphos",
  description: "O que está oculto, reservado para si.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="pt-PT" 
      // A classe "dark" força os componentes do shadcn a usarem as cores noturnas
      className={`dark ${lora.variable} ${cormorant.variable} ${caveat.variable}`}
    >
      {/* Aqui garantimos que o fundo e o texto serão SEMPRE da nossa paleta */}
      <body className="font-sans min-h-screen bg-slate-900 text-slate-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}