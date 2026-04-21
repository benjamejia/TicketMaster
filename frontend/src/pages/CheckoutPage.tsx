import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  processPurchase, 
  type CheckoutRequest, 
  type PurchaseResponse,
  getEventoById,
  type Evento
} from '../services/api-service';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // State para el evento seleccionado
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State del formulario
  const [formData, setFormData] = useState({
    cantidadBoletos: 1,
    asientos: [] as string[],
    metodoPago: 'TARJETA_CREDITO' as 'TARJETA_DEBITO' | 'TARJETA_CREDITO' | 'PAYPAL',
    phoneNumber: '',
    cardInfo: {
      numero: '',
      mes: '',
      year: '',
      cvv: '',
    },
    paypalEmail: '',
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseResponse | null>(null);

  // Cargar evento al montar el componente
  useEffect(() => {
    const cargarEvento = async () => {
      try {
        // Obtener ID del evento de la URL o del estado de navegación
        const eventId = new URLSearchParams(window.location.search).get('eventId') || 'default';
        
        // Si no hay eventId válido, usar datos demo
        const datosDemo: Evento = {
          id: 'demo-1',
          titulo: 'Concierto Estrella de Verano',
          srcImg: 'https://images.unsplash.com/photo-1501612780353-7e5432707802?w=500&auto=format&fit=crop&q=60',
          precio: 85.00,
          lugar: 'Auditorio Metropolitano',
          categoria: 'Concierto',
          descripcion: 'Un espectacular concierto con artistas internacionales',
          fecha: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          duracion: '3 horas',
        };

        // Intentar cargar desde el backend
        if (eventId && eventId !== 'default') {
          const eventoData = await getEventoById(eventId);
          setEvento(eventoData || datosDemo);
        } else {
          setEvento(datosDemo);
        }
      } catch (err) {
        console.error('Error cargando evento:', err);
        setError('Error al cargar los detalles del evento');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      cargarEvento();
    } else {
      setError('Debes iniciar sesión para hacer una compra');
      setLoading(false);
    }
  }, [token]);

  // Validar autenticación
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('cardInfo.')) {
      const field = name.replace('cardInfo.', '');
      setFormData(prev => ({
        ...prev,
        cardInfo: { ...prev.cardInfo, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'cantidadBoletos' ? parseInt(value) : value
      }));
    }
  };

  const calcularTotal = (): number => {
    return evento ? evento.precio * formData.cantidadBoletos : 0;
  };

  const validarFormulario = (): boolean => {
    if (!formData.phoneNumber || !formData.phoneNumber.startsWith('+')) {
      setError('Ingresa un número de WhatsApp válido con código de país (ej: +521234567890)');
      return false;
    }

    if (formData.metodoPago === 'TARJETA_CREDITO' || formData.metodoPago === 'TARJETA_DEBITO') {
      if (!formData.cardInfo.numero || formData.cardInfo.numero.length < 13) {
        setError('Ingresa un número de tarjeta válido');
        return false;
      }
      if (!formData.cardInfo.cvv || formData.cardInfo.cvv.length < 3) {
        setError('Ingresa un CVV válido');
        return false;
      }
    }

    if (formData.metodoPago === 'PAYPAL' && !formData.paypalEmail) {
      setError('Ingresa tu correo de PayPal');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validarFormulario() || !evento) return;

    setProcessing(true);

    try {
      const checkoutData: CheckoutRequest = {
        tipoEvento: evento.categoria,
        ubicacion: evento.lugar,
        fecha: evento.fecha || new Date().toISOString(),
        cantidadBoletos: formData.cantidadBoletos,
        asientos: formData.asientos.length > 0 ? formData.asientos : undefined,
        monto: calcularTotal(),
        metodoPago: formData.metodoPago,
        phoneNumber: formData.phoneNumber,
        eventId: evento.id,
      };

      const response = await processPurchase(checkoutData);
      
      if (response.success) {
        setPurchaseData(response);
        setSuccess(true);
        setFormData({
          cantidadBoletos: 1,
          asientos: [],
          metodoPago: 'TARJETA_CREDITO',
          phoneNumber: '',
          cardInfo: { numero: '', mes: '', year: '', cvv: '' },
          paypalEmail: '',
        });

        // Redirigir a página de confirmación después de 3 segundos
        setTimeout(() => {
          navigate(`/confirmation/${response.ticketId}`, { state: response });
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando la compra');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-background text-xl">Cargando...</div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-background text-xl">Evento no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-on-background mb-2">
            Finalizar Compra
          </h1>
          <p className="text-on-background/70">
            Completa tu información para reservar tus boletos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resumen del Evento */}
              <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
                <h2 className="text-lg font-semibold text-on-background mb-4">
                  Detalles del Evento
                </h2>
                <div className="flex gap-4">
                  <img
                    src={evento.srcImg}
                    alt={evento.titulo}
                    className="w-32 h-32 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-on-surface">{evento.titulo}</h3>
                    <p className="text-on-surface/70">{evento.lugar}</p>
                    <p className="text-on-surface/70">
                      {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-MX') : 'Fecha por confirmar'}
                    </p>
                    <p className="text-primary font-bold text-lg mt-2">
                      ${evento.precio.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cantidad de Boletos */}
              <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
                <h2 className="text-lg font-semibold text-on-background mb-4">
                  Cantidad de Boletos
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      cantidadBoletos: Math.max(1, prev.cantidadBoletos - 1)
                    }))}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    name="cantidadBoletos"
                    value={formData.cantidadBoletos}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="border border-outline rounded px-4 py-2 w-20 text-center"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      cantidadBoletos: Math.min(10, prev.cantidadBoletos + 1)
                    }))}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
                <h2 className="text-lg font-semibold text-on-background mb-4">
                  Método de Pago
                </h2>
                <div className="space-y-4">
                  {['TARJETA_CREDITO', 'TARJETA_DEBITO', 'PAYPAL'].map(metodo => (
                    <label key={metodo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="metodoPago"
                        value={metodo}
                        checked={formData.metodoPago === metodo}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <span className="text-on-background">
                        {metodo === 'TARJETA_CREDITO' ? 'Tarjeta de Crédito' : 
                         metodo === 'TARJETA_DEBITO' ? 'Tarjeta de Débito' : 'PayPal'}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Datos de Tarjeta */}
                {(formData.metodoPago === 'TARJETA_CREDITO' || formData.metodoPago === 'TARJETA_DEBITO') && (
                  <div className="mt-4 space-y-4 border-t border-outline-variant/20 pt-4">
                    <div>
                      <label className="block text-on-background text-sm mb-2">
                        Número de Tarjeta
                      </label>
                      <input
                        type="text"
                        name="cardInfo.numero"
                        value={formData.cardInfo.numero}
                        onChange={handleInputChange}
                        placeholder="4532 1234 5678 9123"
                        className="w-full border border-outline rounded px-4 py-2"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-on-background text-sm mb-2">Mes</label>
                        <input
                          type="text"
                          name="cardInfo.mes"
                          value={formData.cardInfo.mes}
                          onChange={handleInputChange}
                          placeholder="MM"
                          className="w-full border border-outline rounded px-4 py-2"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-on-background text-sm mb-2">Año</label>
                        <input
                          type="text"
                          name="cardInfo.year"
                          value={formData.cardInfo.year}
                          onChange={handleInputChange}
                          placeholder="YY"
                          className="w-full border border-outline rounded px-4 py-2"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-on-background text-sm mb-2">CVV</label>
                        <input
                          type="password"
                          name="cardInfo.cvv"
                          value={formData.cardInfo.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full border border-outline rounded px-4 py-2"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email PayPal */}
                {formData.metodoPago === 'PAYPAL' && (
                  <div className="mt-4 border-t border-outline-variant/20 pt-4">
                    <label className="block text-on-background text-sm mb-2">
                      Correo de PayPal
                    </label>
                    <input
                      type="email"
                      name="paypalEmail"
                      value={formData.paypalEmail}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className="w-full border border-outline rounded px-4 py-2"
                    />
                  </div>
                )}
              </div>

              {/* Contacto WhatsApp */}
              <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
                <h2 className="text-lg font-semibold text-on-background mb-4">
                  Confirmación por WhatsApp
                </h2>
                <p className="text-on-background/70 text-sm mb-4">
                  Recibirás tu confirmación y código QR en WhatsApp
                </p>
                <label className="block text-on-background text-sm mb-2">
                  Número de WhatsApp (con código de país)
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+521234567890"
                  className="w-full border border-outline rounded px-4 py-2"
                />
              </div>

              {/* Mensajes de Error */}
              {error && (
                <div className="bg-error/10 border border-error rounded-lg p-4">
                  <p className="text-error">{error}</p>
                </div>
              )}

              {/* Botón de Compra */}
              <button
                type="submit"
                disabled={processing}
                className={`w-full py-3 rounded-lg font-bold text-lg ${
                  processing
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {processing ? 'Procesando...' : `Comprar ${formData.cantidadBoletos} Boleto(s)`}
              </button>
            </form>
          </div>

          {/* Resumen de Compra */}
          <div className="lg:col-span-1">
            <div className="bg-surface p-6 rounded-lg border border-outline-variant/20 sticky top-4">
              <h2 className="text-xl font-bold text-on-background mb-6">Resumen</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-outline-variant/20">
                <div className="flex justify-between text-on-background">
                  <span>Boletos: {formData.cantidadBoletos}</span>
                  <span>${(evento.precio * formData.cantidadBoletos).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-on-background/70 text-sm">
                  <span>Tarifa de servicio</span>
                  <span>${(calcularTotal() * 0.05).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-on-background mb-6">
                <span>Total</span>
                <span className="text-primary">
                  ${(calcularTotal() * 1.05).toFixed(2)}
                </span>
              </div>

              {/* Mensaje de Éxito */}
              {success && purchaseData && (
                <div className="bg-success/10 border border-success rounded-lg p-4">
                  <p className="text-success font-bold mb-2">¡Compra Exitosa!</p>
                  <p className="text-on-background text-sm">
                    Confirmación: {purchaseData.confirmationNumber}
                  </p>
                  {purchaseData.whatsAppSent && (
                    <p className="text-on-background text-sm mt-2">
                      ✓ Confirmación enviada a WhatsApp
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}