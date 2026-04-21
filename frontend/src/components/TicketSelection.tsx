// components/tickets/TicketSelection.tsx
import { useState } from "react";

interface EventData {
  id: string;
  titulo: string;
  srcImg: string;
  lugar: string;
  categoria: string;
  descripcion: string;
  duracion: string;
  clasificacion: string;
}

interface TicketType {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  disponible: boolean;
  maxPorPersona?: number;
}

interface DateSlot {
  id: string;
  fecha: string;
  hora: string;
  disponible: boolean;
}

interface TicketSelectionProps {
  evento: EventData;
  tiposTicket: TicketType[];
  fechasDisponibles: DateSlot[];
  onConfirmarCompra: (data: TicketOrder) => void;
}

export interface TicketOrder {
  eventoId: string;
  fechaId: string;
  ticketTypeId: string;
  cantidad: number;
  precioTotal: number;
}

export function TicketSelection({
  evento,
  tiposTicket,
  fechasDisponibles,
  onConfirmarCompra,
}: TicketSelectionProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
  const [ticketSeleccionado, setTicketSeleccionado] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);

  const ticketActual = tiposTicket.find((t) => t.id === ticketSeleccionado);
  const fechaActual = fechasDisponibles.find((f) => f.id === fechaSeleccionada);

  const precioTotal = ticketActual ? ticketActual.precio * cantidad : 0;

  const puedeContinuar = fechaSeleccionada && ticketSeleccionado && cantidad > 0;

  const handleConfirmar = () => {
    if (!puedeContinuar) return;
    
    const order: TicketOrder = {
      eventoId: evento.id,
      fechaId: fechaSeleccionada,
      ticketTypeId: ticketSeleccionado,
      cantidad,
      precioTotal,
    };
    onConfirmarCompra(order);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
      
      {/* === Columna Izquierda: Detalles del Evento === */}
      <div className="flex-1 space-y-6">
        
        {/* Hero del Evento */}
        <div className="relative rounded-3xl overflow-hidden editorial-shadow">
          <img
            src={evento.srcImg}
            alt={evento.titulo}
            className="w-full h-56 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-sm text-sm font-medium mb-3">
              <span className="material-symbols-outlined text-base">category</span>
              {evento.categoria}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              {evento.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">location_on</span>
                {evento.lugar}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">schedule</span>
                {evento.duracion}
              </span>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-surface-container-low rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            Sobre la obra
          </h3>
          <p className="text-on-surface-variant leading-relaxed">
            {evento.descripcion}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-tertiary">shield</span>
            Clasificación: {evento.clasificacion}
          </div>
        </div>

        {/* Selector de Fecha y Hora */}
        <div className="bg-surface-container-low rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            Selecciona fecha y hora
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fechasDisponibles.map((fecha) => (
              <button
                key={fecha.id}
                onClick={() => fecha.disponible && setFechaSeleccionada(fecha.id)}
                disabled={!fecha.disponible}
                className={`
                  relative p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${fechaSeleccionada === fecha.id
                    ? "border-primary bg-primary-container/20 shadow-lg"
                    : "border-outline-variant hover:border-primary/50 hover:bg-surface-container"
                  }
                  ${!fecha.disponible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {fechaSeleccionada === fecha.id && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  </span>
                )}
                <div className="text-sm font-semibold text-on-surface">
                  {fecha.fecha}
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  {fecha.hora}
                </div>
                {!fecha.disponible && (
                  <span className="absolute inset-0 flex items-center justify-center bg-surface-container-lowest/80 rounded-xl text-xs font-medium text-on-surface-variant">
                    Agotado
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tipos de Entrada */}
        <div className="bg-surface-container-low rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">confirmation_number</span>
            Tipo de entrada
          </h3>
          <div className="space-y-3">
            {tiposTicket.map((ticket) => (
              <label
                key={ticket.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${ticketSeleccionado === ticket.id
                    ? "border-primary bg-primary-container/15 shadow-md"
                    : "border-outline-variant hover:border-primary/40 hover:bg-surface-container"
                  }
                  ${!ticket.disponible ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="ticket"
                    value={ticket.id}
                    checked={ticketSeleccionado === ticket.id}
                    onChange={() => ticket.disponible && setTicketSeleccionado(ticket.id)}
                    disabled={!ticket.disponible}
                    className="w-5 h-5 text-primary border-outline-variant focus:ring-primary"
                  />
                  <div>
                    <div className="font-semibold text-on-surface">{ticket.nombre}</div>
                    <div className="text-sm text-on-surface-variant">{ticket.descripcion}</div>
                    {ticket.maxPorPersona && (
                      <div className="text-xs text-tertiary mt-1">
                        Máx. {ticket.maxPorPersona} por persona
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-primary">
                    ${ticket.precio.toFixed(2)}
                  </div>
                  {!ticket.disponible && (
                    <span className="text-xs text-on-surface-variant line-through">
                      Sin disponibilidad
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Selector de Asientos (Opcional - Visual) */}
        {ticketSeleccionado && (
          <div className="bg-surface-container-low rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">seat</span>
              Selecciona tus asientos
            </h3>
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-3">
                map
              </span>
              <p className="font-medium">Mapa de asientos interactivo</p>
              <p className="text-sm mt-1">Próximamente: selección visual de butacas</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors">
                Ver mapa de sala
              </button>
            </div>
          </div>
        )}
      </div>

      {/* === Columna Derecha: Resumen de Orden (Sticky) === */}
      <div className="lg:w-96">
        <div className="sticky top-6 space-y-6">
          
          {/* Card de Resumen */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 editorial-shadow ticket-shadow">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              Tu orden
            </h3>

            {/* Detalles seleccionados */}
            <div className="space-y-4 mb-6 pb-6 border-b border-outline-variant/30">
              {fechaActual && (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">calendar_today</span>
                  <div>
                    <div className="text-sm text-on-surface-variant">Fecha</div>
                    <div className="font-medium">{fechaActual.fecha} • {fechaActual.hora}</div>
                  </div>
                </div>
              )}
              
              {ticketActual && (
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">confirmation_number</span>
                  <div>
                    <div className="text-sm text-on-surface-variant">Entrada</div>
                    <div className="font-medium">{ticketActual.nombre}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">person</span>
                <div className="flex-1">
                  <div className="text-sm text-on-surface-variant mb-2">Cantidad</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                      disabled={cantidad <= 1}
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span className="w-8 text-center font-bold text-lg">{cantidad}</span>
                    <button
                      onClick={() => setCantidad((c) => Math.min(ticketActual?.maxPorPersona || 10, c + 1))}
                      className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                      disabled={cantidad >= (ticketActual?.maxPorPersona || 10)}
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-on-surface-variant font-medium">Total</span>
              <span className="text-3xl font-black text-primary">
                ${precioTotal.toFixed(2)}
              </span>
            </div>

            {/* Desglose */}
            {precioTotal > 0 && (
              <div className="text-xs text-on-surface-variant space-y-1 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${precioTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Servicio</span>
                  <span>${(precioTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-on-surface pt-2 border-t border-outline-variant/30">
                  <span>Total con impuestos</span>
                  <span>${(precioTotal * 1.08).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Botón de Confirmar */}
            <button
              onClick={handleConfirmar}
              disabled={!puedeContinuar}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${puedeContinuar
                  ? "bg-primary text-on-primary hover:bg-primary-dim shadow-lg hover:shadow-xl active:scale-[0.99]"
                  : "bg-outline-variant/30 text-on-surface-variant cursor-not-allowed"
                }
              `}
            >
              <span className="material-symbols-outlined">
                {puedeContinuar ? "payments" : "info"}
              </span>
              {puedeContinuar ? "Continuar al pago" : "Selecciona fecha y entrada"}
            </button>

            {/* Notas de seguridad */}
            <div className="mt-6 pt-4 border-t border-outline-variant/20">
              <div className="flex items-start gap-2 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-tertiary flex-shrink-0">shield</span>
                <p>Compra 100% segura. Tus datos están protegidos con encriptación SSL.</p>
              </div>
              <div className="flex items-start gap-2 text-xs text-on-surface-variant mt-2">
                <span className="material-symbols-outlined text-tertiary flex-shrink-0">policy</span>
                <p>Política de reembolso: Cancela hasta 24h antes del evento.</p>
              </div>
            </div>
          </div>

          {/* Card de Soporte */}
          <div className="bg-tertiary-container/20 rounded-2xl p-5 border border-tertiary-container/40">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-tertiary text-2xl">help</span>
              <div>
                <h4 className="font-semibold text-on-tertiary-container">¿Necesitas ayuda?</h4>
                <p className="text-sm text-on-tertiary-container/80 mt-1">
                  Nuestro equipo está disponible para resolver tus dudas.
                </p>
                <button className="mt-3 text-sm font-medium text-tertiary hover:underline">
                  Contactar soporte →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}