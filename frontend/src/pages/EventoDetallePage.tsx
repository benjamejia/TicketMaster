// pages/EventoDetalle.tsx
import { TicketSelection, type TicketOrder } from "../components/TicketSelection.tsx";

export function EventoDetallePage() {
  
  const evento = {
    id: "evt_001",
    titulo: "El Rey León: Soundtrack en Vivo",
    srcImg: "https://images.unsplash.com/photo-1503095396549-807759285036?w=800&auto=format&fit=crop",
    lugar: "Auditorio Nacional",
    categoria: "Teatro Musical",
    descripcion: "Una experiencia única donde la orquesta sinfónica interpreta en vivo la banda sonora completa de El Rey León, acompañada de proyecciones visuales inmersivas.",
    duracion: "2h 30min con intermedio",
    clasificacion: "Apta para todo público",
  };

  const tiposTicket = [
    { id: "t1", nombre: "General", precio: 45.00, descripcion: "Acceso a zona general, asiento numerado", disponible: true, maxPorPersona: 6 },
    { id: "t2", nombre: "Preferente", precio: 75.00, descripcion: "Zona frontal con mejor visibilidad", disponible: true, maxPorPersona: 4 },
    { id: "t3", nombre: "VIP Experience", precio: 120.00, descripcion: "Butacas premium + meet & greet exclusivo", disponible: false, maxPorPersona: 2 },
  ];

  const fechasDisponibles = [
    { id: "f1", fecha: "Vie 15 Mar", hora: "20:00 hrs", disponible: true },
    { id: "f2", fecha: "Sáb 16 Mar", hora: "18:00 hrs", disponible: true },
    { id: "f3", fecha: "Sáb 16 Mar", hora: "21:30 hrs", disponible: false },
    { id: "f4", fecha: "Dom 17 Mar", hora: "17:00 hrs", disponible: true },
  ];

  const handleConfirmarCompra = (order: TicketOrder) => {
    console.log("Orden confirmada:", order);
    // Aquí rediriges al checkout o guardas en contexto
    // navigate('/checkout', { state: { order } });
  };

  return (
    <main className="min-h-screen py-8">
      <TicketSelection
        evento={evento}
        tiposTicket={tiposTicket}
        fechasDisponibles={fechasDisponibles}
        onConfirmarCompra={handleConfirmarCompra}
      />
    </main>
  );
}