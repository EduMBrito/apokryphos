import type { Metadata } from "next";
import { Lora, Cormorant_Garamond, Caveat } from "next/font/google";
import "./globals.css";

// Configuração das fontes otimizadas
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Pesos necessários para títulos
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
      lang="pt-BR" 
      className={`${lora.variable} ${cormorant.variable} ${caveat.variable}`}
    >
      <body className="font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}