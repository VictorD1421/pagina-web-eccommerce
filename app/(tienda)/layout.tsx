'use client'

import { Navbar } from "@/src/components/layout/Navbar";
import { Footer } from "@/src/components/layout/Footer";
import { ScrollToTop } from "@/src/components/layout/ScrollToTop";

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navegación superior */}
      <Navbar />
      
      {/* Contenido principal de la tienda/catálogo */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* Botón flotante para subir (aparecerá al hacer scroll) */}
      <ScrollToTop />
      
      {/* Pie de página */}
      <Footer />
    </div>
  );
}