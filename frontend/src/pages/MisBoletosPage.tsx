import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyTickets, type MyTicket } from '../services/api-service';

export function MisBoletosPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [tickets, setTickets] = useState<MyTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadTickets = async () => {
      try {
        const data = await getMyTickets();
        setTickets(data || []);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [isAuthenticated, token, navigate]);

  const formatFecha = (fechaStr: string): string => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-MX', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return fechaStr;
    }
  };

  const metodoPagoLabel = (metodo: string): string => {
    const labels: Record<string, string> = {
      'TARJETA_CREDITO': 'Tarjeta de Crédito',
      'TARJETA_DEBITO': 'Tarjeta de Débito',
      'PAYPAL': 'PayPal',
    };
    return labels[metodo] || metodo;
  };

  const handleVerDetalle = (ticket: MyTicket) => {
    navigate(`/confirmation/${ticket.idTicket}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-on-background text-xl">Cargando tus boletos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-on-background mb-2">
            Mis Boletos
          </h1>
          <p className="text-on-background/70">
            {tickets.length === 0 
              ? 'Aún no tienes boletos comprados' 
              : `Tienes ${tickets.length} boleto(s)`}
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-surface p-12 rounded-lg border border-outline-variant/20 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-xl font-semibold text-on-background mb-2">
              Sin boletos aún
            </h2>
            <p className="text-on-background/70 mb-6">
              Explora nuestros eventos y compra tu primer boleto
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
            >
              Explorar Eventos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .map((ticket) => (
                <div
                  key={ticket.idTicket}
                  className="bg-surface rounded-lg border border-outline-variant/20 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-40 h-32 md:h-auto bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center flex-shrink-0">
                      {ticket.codigoQR ? (
                        <img
                          src={`data:image/png;base64,${ticket.codigoQR}`}
                          alt="QR"
                          className="w-24 h-24"
                        />
                      ) : (
                        <span className="text-5xl">🎟️</span>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-on-background mb-1">
                            {ticket.nombreFuncion || 'Evento'}
                          </h3>
                          <p className="text-on-background/70 text-sm mb-2">
                            {ticket.ubicacion || 'Ubicación no disponible'}
                          </p>
                          
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-on-background/70">
                            <span>📅 {formatFecha(ticket.fecha)}</span>
                            <span>💺 Asiento(s): {ticket.asientos?.join(', ') || 'N/A'}</span>
                            {ticket.clasificacion && (
                              <span className="bg-outline/30 px-2 py-0.5 rounded text-xs">
                                {ticket.clasificacion}
                              </span>
                            )}
                          </div>

                          {ticket.numeroConfirmacion && (
                            <div className="mt-3 inline-block bg-primary/10 text-primary px-3 py-1.5 rounded-md">
                              <span className="font-mono font-bold text-sm">
                                {ticket.numeroConfirmacion}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="md:text-right">
                          {ticket.monto && (
                            <p className="text-2xl font-bold text-primary mb-1">
                              ${ticket.monto.toFixed(2)}
                            </p>
                          )}
                          {ticket.metodoPago && (
                            <p className="text-sm text-on-background/70">
                              {metodoPagoLabel(ticket.metodoPago)}
                            </p>
                          )}
                          <p className={`text-sm font-semibold mt-2 ${
                            ticket.estado === 'COMPLETADA' ? 'text-success' : 'text-on-background/70'
                          }`}>
                            {ticket.estado === 'COMPLETADA' ? '✓ Completada' : ticket.estado}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-variant/50 px-6 py-3 flex justify-end border-t border-outline-variant/10">
                    <button
                      onClick={() => handleVerDetalle(ticket)}
                      className="text-primary font-semibold text-sm hover:text-primary/80 flex items-center gap-1"
                    >
                      Ver detalles
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
