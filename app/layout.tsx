import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"] 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "Inversiones Durí | Útiles Escolares y Oficina en Maracay",
  description: "Tu tienda integral en Maracay. Artículos escolares, de oficina, ferretería y hogar. ¡Donde imaginar... es crear!",
  icons: {
    // Se actualiza la ruta al archivo en /public y se define el tipo SVG
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}