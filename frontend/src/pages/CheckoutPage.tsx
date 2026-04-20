import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarBanner from '../assets/avatarBanner.jpg';

export function CheckoutPage() {
    const navigate = useNavigate();

    // 1. Estados para los campos del formulario
    const [name, setName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    
    // 2. Estado para manejar el mensaje de error
    const [error, setError] = useState<string | null>(null);

    // 3. Función que se ejecuta al presionar "Pagar Ahora"
    const handlePayment = () => {
        // Limpiamos errores previos
        setError(null);

        // Validaciones básicas de front-end (Caja Negra)
        if (!name.trim()) {
            setError('El nombre en la tarjeta es obligatorio.');
            return;
        }
        if (!cardNumber.trim() || cardNumber.length < 16) {
            setError('Ingresa un número de tarjeta válido (mínimo 16 dígitos).');
            return;
        }
        if (!expiry.trim() || !expiry.includes('/')) {
            setError('Ingresa una fecha de vencimiento válida (Formato MM/YY).');
            return;
        }
        if (!cvv.trim() || cvv.length < 3) {
            setError('Ingresa un CVV válido (3 o 4 dígitos).');
            return;
        }

        // Si pasa todas las validaciones, simulamos el pago y redirigimos al ticket
        navigate('/ticket');
    };

    return (
        <div className="py-12 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            {/* Left Column: Checkout Form */}
            <div className="lg:col-span-7 space-y-8">
                <header>
                    <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Finalizar Compra</h1>
                    <p className="text-on-surface-variant font-body">Confirma tus datos para asegurar tu lugar en la experiencia.</p>
                </header>

                {/* Payment Methods */}
                <section className="space-y-6">
                    <div className="flex gap-4">
                        <button className="flex-1 p-4 rounded-xl bg-surface-container-highest border-2 border-primary flex items-center justify-center gap-3 transition-all">
                            <span className="material-symbols-outlined text-primary">credit_card</span>
                            <span className="font-bold text-on-surface font-body">Tarjeta</span>
                        </button>
                        <button className="flex-1 p-4 rounded-xl bg-surface-container-low border-2 border-transparent hover:border-outline-variant transition-colors flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-on-surface-variant">account_balance_wallet</span>
                            <span className="font-bold text-on-surface-variant font-body">PayPal</span>
                        </button>
                    </div>

                    <form className="bg-surface-container-lowest p-8 rounded-2xl space-y-6 editorial-shadow" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-body">Nombre en la tarjeta</label>
                                <input 
                                    className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-xl p-4 text-on-surface placeholder:text-outline/50 transition-all font-body" 
                                    placeholder="Ej. MARÍA PÉREZ" 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (error) setError(null);
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-body">Número de tarjeta</label>
                                <div className="relative">
                                    <input 
                                        className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-xl p-4 text-on-surface placeholder:text-outline/50 transition-all font-body [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                        placeholder="0000 0000 0000 0000" 
                                        type="number" 
                                        value={cardNumber}
                                        onChange={(e) => {
                                            setCardNumber(e.target.value);
                                            if (error) setError(null);
                                        }}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-body">Vencimiento</label>
                                    <input 
                                        className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-xl p-4 text-on-surface placeholder:text-outline/50 transition-all font-body" 
                                        placeholder="MM/YY" 
                                        type="text"
                                        maxLength={5}
                                        value={expiry}
                                        onChange={(e) => {
                                            setExpiry(e.target.value);
                                            if (error) setError(null);
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant ml-1 font-body">CVV</label>
                                    <input 
                                        className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none rounded-xl p-4 text-on-surface placeholder:text-outline/50 transition-all font-body" 
                                        placeholder="123" 
                                        type="number" 
                                        maxLength={4}
                                        value={cvv}
                                        onChange={(e) => {
                                            setCvv(e.target.value);
                                            if (error) setError(null);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Validation Hint Dinámico (Cambia de color y texto si hay error) */}
                        <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${error ? 'bg-error-container/10 border-error' : 'bg-primary/5 border-primary/20'}`}>
                            <span className={`material-symbols-outlined text-sm mt-0.5 ${error ? 'text-error' : 'text-primary'}`}>
                                {error ? 'error' : 'info'}
                            </span>
                            <p className={`text-sm font-body font-medium ${error ? 'text-error' : 'text-on-surface-variant'}`}>
                                {error ? error : 'Por favor, verifica que los datos de tu tarjeta coincidan con los de tu banco emisor.'}
                            </p>
                        </div>
                    </form>
                </section>

                {/* Restrictions */}
                <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/15">
                    <h3 className="font-bold text-on-surface mb-4 flex items-center gap-2 font-headline">
                        <span className="material-symbols-outlined text-tertiary">gavel</span>
                        Restricciones del Evento
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-3 text-center gap-2 grayscale opacity-60">
                            <span className="material-symbols-outlined text-2xl">no_food</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter font-body">Sin Alimentos</span>
                        </div>
                        <div className="flex flex-col items-center p-3 text-center gap-2 grayscale opacity-60">
                            <span className="material-symbols-outlined text-2xl">pets</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter font-body">No Mascotas</span>
                        </div>
                        <div className="flex flex-col items-center p-3 text-center gap-2 grayscale opacity-60">
                            <span className="material-symbols-outlined text-2xl">military_tech</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter font-body">Sin Armas</span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Right Column: Order Summary */}
            <aside className="lg:col-span-5">
                <div className="sticky top-28 space-y-6">
                    {/* Event Identity Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-inverse-surface text-on-primary p-6 shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-20 -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                                    <img className="w-full h-full object-cover" alt="Evento" src={avatarBanner} />
                                </div>
                                <div>
                                    <span className="px-2 py-1 bg-tertiary rounded text-[10px] font-bold uppercase tracking-widest mb-1 inline-block font-body">Cine IMAX</span>
                                    <h2 className="text-xl font-bold leading-none tracking-tight font-headline">Avatar: The Way of Water</h2>
                                </div>
                            </div>
                            <div className="space-y-4 text-sm text-on-primary/70 font-body">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary-container">location_city</span>
                                    <span>Cinépolis VIP, Galerías</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary-container">calendar_today</span>
                                    <span>24 de Noviembre, 2024 — 20:30hs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Breakdown */}
                    <div className="bg-surface-container-high p-6 rounded-3xl space-y-4">
                        <div className="flex justify-between items-end">
                            <h3 className="font-bold text-on-surface font-headline">Tus Asientos</h3>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded font-body">Límite: 10 tickets</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl font-body">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary">F12</span>
                                    </div>
                                    <span className="text-sm font-medium">Asiento VIP</span>
                                </div>
                                <span className="font-bold text-on-surface">$12.00</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-surface-container-lowest rounded-xl font-body">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary">F13</span>
                                    </div>
                                    <span className="text-sm font-medium">Asiento VIP</span>
                                </div>
                                <span className="font-bold text-on-surface">$12.00</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-outline-variant/30 space-y-2 font-body">
                            <div className="flex justify-between text-sm text-on-surface-variant">
                                <span>Subtotal (2 tickets)</span>
                                <span>$24.00</span>
                            </div>
                            <div className="flex justify-between text-sm text-on-surface-variant">
                                <span>Service Charge (Curator Tech)</span>
                                <span>$2.50</span>
                            </div>
                            <div className="flex justify-between pt-4">
                                <span className="text-xl font-extrabold text-on-surface">Total</span>
                                <span className="text-xl font-extrabold text-primary">$26.50</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. Vinculamos el botón a la función handlePayment */}
                    <button 
                        onClick={handlePayment}
                        className="w-full bg-primary hover:bg-primary-dim text-on-primary font-black text-lg py-5 rounded-2xl shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 uppercase tracking-widest font-headline"
                    >
                        Pagar Ahora
                    </button>
                    <p className="text-center text-[10px] text-on-surface-variant uppercase tracking-widest font-bold font-body">
                        Transacción segura cifrada con 256-bit SSL
                    </p>
                </div>
            </aside>
        </div>
    );
}