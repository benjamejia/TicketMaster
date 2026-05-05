import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getTicketDetails, type TransactionDetail } from '../services/api-service';

interface PurchaseData {
  confirmationNumber: string;
  ticketId: number;
  transactionId: number;
  qrCode: string;
  whatsAppSent: boolean;
}

export function TicketConfirmationPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [ticketDetails, setTicketDetails] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (location.state) {
          setPurchaseData(location.state);
        }

        if (ticketId) {
          const details = await getTicketDetails(parseInt(ticketId));
          if (details) {
            setTicketDetails(details);
          }
        }
      } catch {
        setMessage({
          type: 'error',
          text: 'Error al cargar los detalles de tu compra',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ticketId, location.state]);

  const handleResendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      setMessage({
        type: 'error',
        text: 'Ingresa un número de WhatsApp válido con código de país',
      });
      return;
    }

    setResending(true);

    try {
      if (ticketId) {
        const { resendWhatsAppConfirmation } = await import('../services/api-service');
        await resendWhatsAppConfirmation(parseInt(ticketId), phoneNumber);
        setMessage({
          type: 'success',
          text: 'Confirmación reenviada a WhatsApp',
        });
        setPhoneNumber('');
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Error al reenviar la confirmación',
      });
    } finally {
      setResending(false);
    }
  };

  const downloadQR = () => {
    const qrCode = ticketDetails?.qrCode || purchaseData?.qrCode;
    if (qrCode) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${qrCode}`;
      link.download = `qr-${ticketDetails?.confirmationNumber || purchaseData?.confirmationNumber}.png`;
      link.click();
    }
  };

  const printConfirmation = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-background text-xl">Cargando confirmación...</div>
      </div>
    );
  }

  const confirmationNumber = ticketDetails?.confirmationNumber || purchaseData?.confirmationNumber;

  return (
    <div className="min-h-screen bg-linear-to-b from-success/5 to-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-on-background mb-2">
            ¡Compra Exitosa!
          </h1>
          <p className="text-on-background/70 text-lg">
            Tu reserva ha sido confirmada
          </p>
        </div>

        {confirmationNumber && (
          <div className="bg-surface border-2 border-success rounded-lg p-6 mb-8 text-center">
            <p className="text-on-background/70 text-sm mb-2">Número de Confirmación</p>
            <p className="text-3xl font-bold text-success font-mono">
              {confirmationNumber}
            </p>
            <p className="text-on-background/50 text-xs mt-2">
              Guarda este número, lo necesitarás en la entrada
            </p>
          </div>
        )}

        {ticketDetails?.ticket && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
              <h2 className="text-lg font-bold text-on-background mb-4">
                Evento
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-on-background/70 text-sm">Tipo de Evento</p>
                  <p className="text-on-background font-semibold">
                    {ticketDetails.ticket.tipoEvento}
                  </p>
                </div>
                <div>
                  <p className="text-on-background/70 text-sm">Ubicación</p>
                  <p className="text-on-background font-semibold">
                    {ticketDetails.ticket.ubicacion}
                  </p>
                </div>
                <div>
                  <p className="text-on-background/70 text-sm">Fecha</p>
                  <p className="text-on-background font-semibold">
                    {new Date(ticketDetails.ticket.fecha).toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
              <h2 className="text-lg font-bold text-on-background mb-4">
                Boletos
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-on-background/70 text-sm">Cantidad</p>
                  <p className="text-on-background font-semibold">
                    {ticketDetails.ticket.cantidadBoletos} Boleto{ticketDetails.ticket.cantidadBoletos !== 1 ? 's' : ''}
                  </p>
                </div>
                {ticketDetails.ticket.asientos && ticketDetails.ticket.asientos.length > 0 && (
                  <div>
                    <p className="text-on-background/70 text-sm">Asientos</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ticketDetails.ticket.asientos.map((asiento, idx) => (
                        <span
                          key={idx}
                          className="bg-primary/20 text-primary px-3 py-1 rounded text-sm font-semibold"
                        >
                          {asiento}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {ticketDetails?.qrCode && (
          <div className="bg-surface p-6 rounded-lg border border-outline-variant/20 mb-8 text-center">
            <h2 className="text-lg font-bold text-on-background mb-4">
              Código QR
            </h2>
            <p className="text-on-background/70 text-sm mb-4">
              Presenta este código en la entrada del evento
            </p>
            <img
              src={`data:image/png;base64,${ticketDetails.qrCode}`}
              alt="QR Code"
              className="w-48 h-48 mx-auto mb-4"
            />
            <button
              onClick={downloadQR}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Descargar QR
            </button>
          </div>
        )}

        {purchaseData && (
          <div className="bg-surface p-6 rounded-lg border border-outline-variant/20 mb-8">
            <h2 className="text-lg font-bold text-on-background mb-4">
              WhatsApp
            </h2>
            {purchaseData.whatsAppSent ? (
              <div className="flex items-center gap-3 text-success mb-4">
                <span className="text-2xl">✓</span>
                <p>Confirmación enviada a tu WhatsApp</p>
              </div>
            ) : (
              <p className="text-on-background/70 mb-4">
                ¿No recibiste el mensaje? Proporciona tu número para reenviar
              </p>
            )}

            <form onSubmit={handleResendWhatsApp} className="flex gap-2">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+521234567890"
                className="flex-1 border border-outline rounded-lg px-4 py-2"
                disabled={resending}
              />
              <button
                type="submit"
                disabled={resending || !phoneNumber}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  resending || !phoneNumber
                    ? 'bg-primary/50 text-white cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {resending ? 'Enviando...' : 'Reenviar'}
              </button>
            </form>
          </div>
        )}

        {message && (
          <div
            className={`p-4 rounded-lg mb-8 ${
              message.type === 'success'
                ? 'bg-success/10 border border-success text-success'
                : 'bg-error/10 border border-error text-error'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-warning/10 border border-warning rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-on-background mb-4">
            Instrucciones Importantes
          </h2>
          <ul className="space-y-2 text-on-background">
            <li>✓ Guarda tu número de confirmación</li>
            <li>✓ Presenta este código QR en la entrada</li>
            <li>✓ Llega 15 minutos antes del evento</li>
            <li>✓ Trae un documento de identificación</li>
            <li>✓ Revisa la confirmación en tu WhatsApp</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={printConfirmation}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition font-semibold"
          >
            Imprimir Confirmación
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-outline px-6 py-3 rounded-lg hover:bg-outline/90 transition font-semibold text-on-background"
          >
            Volver al Inicio
          </button>
        </div>

        <div className="text-center text-on-background/70">
          <p>¿Tienes dudas?</p>
          <p>
            Contáctanos a{' '}
            <a href="mailto:soporte@ticketmaster.com" className="text-primary hover:underline">
              soporte@ticketmaster.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
