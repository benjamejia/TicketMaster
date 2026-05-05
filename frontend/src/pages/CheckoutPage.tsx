import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  processPurchase, 
  type CheckoutRequest, 
  type PurchaseResponse,
  getFuncionById,
  type Funcion
} from '../services/api-service';
import { SeatSelection } from '../components/SeatSelection';

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();

  const [funcion, setFuncion] = useState<Funcion | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    const cargarFuncion = async () => {
      try {
        const eventId = searchParams.get('eventId');
        
        if (eventId) {
          const funcionData = await getFuncionById(parseInt(eventId));
          if (funcionData) {
            setFuncion(funcionData);
          } else {
            setError('Evento no encontrado');
          }
        } else {
          setError('No se especificó un evento para la compra');
        }
      } catch {
        setError('Error al cargar los detalles del evento');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      cargarFuncion();
    } else {
      setError('Debes iniciar sesión para hacer una compra');
      setLoading(false);
    }
  }, [token, searchParams]);

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

  const precioPorBoleto = funcion?.idSala?.precio || 0;

  const calcularTotal = (): number => {
    return precioPorBoleto * formData.cantidadBoletos;
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

    if (!validarFormulario() || !funcion) return;

    setProcessing(true);

    try {
      const checkoutData: CheckoutRequest = {
        funcion: { id: funcion.id },
        ubicacion: funcion.idSala?.idEstablecimiento?.nombreSucursal || '',
        fecha: `${funcion.fecha}T${funcion.horario}`,
        cantidadBoletos: formData.cantidadBoletos,
        asientos: formData.asientos.length > 0 ? formData.asientos : undefined,
        monto: calcularTotal(),
        metodoPago: formData.metodoPago,
        phoneNumber: formData.phoneNumber,
        eventId: String(funcion.id),
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

  const tituloEvento = funcion?.nombreFuncion || 'Evento';
  const lugarEvento = funcion?.idSala?.idEstablecimiento?.nombreSucursal || 'Por definir';
  const fechaEvento = funcion?.fecha ? new Date(`${funcion.fecha}T${funcion.horario}`).toLocaleDateString('es-MX') : 'Fecha por confirmar';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-background text-xl">Cargando...</div>
      </div>
    );
  }

  if (!funcion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-on-background text-xl">Evento no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-on-background mb-2">
            Finalizar Compra
          </h1>
          <p className="text-on-background/70">
            Completa tu información para reservar tus boletos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
                <h2 className="text-lg font-semibold text-on-background mb-4">
                  Detalles del Evento
                </h2>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">{tituloEvento}</h3>
                  <p className="text-on-surface/70">{lugarEvento}</p>
                  <p className="text-on-surface/70">{fechaEvento}</p>
                  <p className="text-primary font-bold text-lg mt-2">
                    ${precioPorBoleto.toFixed(2)}
                  </p>
                </div>
              </div>

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

               {funcion && (
                 <SeatSelection
                   funcionId={funcion.id}
                   tipoEstablecimiento={funcion.idSala?.idEstablecimiento?.tipoEstablecimiento?.tipo || ''}
                   cantidadBoletos={formData.cantidadBoletos}
                   asientosSeleccionados={formData.asientos}
                   onAsientosChange={(asientos: string[]) => setFormData(prev => ({ ...prev, asientos }))}
                 />
               )}

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

              {error && (
                <div className="bg-error/10 border border-error rounded-lg p-4">
                  <p className="text-error">{error}</p>
                </div>
              )}

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

          <div className="lg:col-span-1">
            <div className="bg-surface p-6 rounded-lg border border-outline-variant/20 sticky top-4">
              <h2 className="text-xl font-bold text-on-background mb-6">Resumen</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-outline-variant/20">
                <div className="flex justify-between text-on-background">
                  <span>Boletos: {formData.cantidadBoletos}</span>
                  <span>${(precioPorBoleto * formData.cantidadBoletos).toFixed(2)}</span>
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
